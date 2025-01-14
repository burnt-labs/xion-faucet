import {
  isDeliverTxFailure,
  assertIsDeliverTxSuccess,
  calculateFee,
  DeliverTxResponse,
  SigningStargateClient,
  StargateClient,
} from "@cosmjs/stargate";
import { isDefined } from "@cosmjs/utils";
import { logSendJob } from "@cosmjs/faucet/build/debugging";
import { makePathBuilder } from "@cosmjs/faucet/build/pathbuilder";
import { type TokenConfiguration, TokenManager } from "@cosmjs/faucet/build/tokenmanager";
import type { SendJob } from "@cosmjs/faucet/build/types";
import { parseBankTokens } from "@cosmjs/faucet/build/tokens";
import { Coin, Secp256k1HdWallet } from "@cosmjs/amino";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { FaucetConfig } from "nuxt/schema";

export interface CreditResponse {
  sender: string;
  recipient: string;
  amount: Coin;
  code: number;
  height: number;
  transactionHash: string;
}

export const getFaucet = async (config: FaucetConfig, mnemonic: string, pathPattern: string, addressPrefix: string, accountId: number): Promise<Faucet> => {
  const { rpcUrl } = config;
  const wallet = await getWallet(mnemonic, pathPattern, addressPrefix, accountId);
  const [faucetAccount] = await wallet.getAccounts();
  const faucetAddress = faucetAccount.address;
  const client = await SigningStargateClient.connectWithSigner(rpcUrl, wallet);
  return new Faucet(config, client, faucetAddress)
}

export async function getWallet(mnemonic: string, pathPattern: string, addressPrefix: string, accountId: number): Promise<OfflineSigner> {
  // Construct the derivation path for the given account ID
  const pathBuilder = makePathBuilder(pathPattern);
  const derivationPath = pathBuilder(accountId)

  // Create a wallet instance using the Secp256k1HdWallet or other appropriate class
  const account = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [derivationPath],
    prefix: addressPrefix,
  });

  // Return the address of the specified account
  return account
}

export const getAvailableTokens = async (client: StargateClient, address: string, bankTokens: string[]): Promise<string[]> => {
  const balance = await client.getAllBalances(address);
  return balance
    .filter((b) => b.amount !== "0")
    .map((b) => bankTokens.find((token) => token === b.denom))
    .filter(isDefined);
}

export class Faucet {
  public readonly addressPrefix: string;
  public readonly address: string;
  private readonly gasLimitSend: number;
  private readonly gasPrice: string;
  private readonly client: SigningStargateClient;
  private tokenConfig: TokenConfiguration;
  private readonly tokenManager: TokenManager;

  public constructor(
    config: FaucetConfig,
    client: SigningStargateClient,
    address: string,
  ) {
    this.addressPrefix = config.addressPrefix;
    this.tokenConfig = {
      bankTokens: parseBankTokens(config.tokens),
    },
      this.tokenManager = new TokenManager(this.tokenConfig);

    this.gasLimitSend = parseInt(config.gasLimit, 10);
    this.gasPrice = config.gasPrice;
    this.address = address;
    this.client = client;
  }

  public async availableTokens(): Promise<string[]> {
    const bankTokens = this.configuredTokens();
    return getAvailableTokens(this.client, this.address, bankTokens);
  }


  public async getChainId(): Promise<string> {
    return this.client.getChainId();
  }

  public async send(job: SendJob): Promise<DeliverTxResponse> {
    const client = this.client
    const { sender, recipient, amount } = job;
    const fee = calculateFee(this.gasLimitSend, this.gasPrice);
    const result = await client.sendTokens(sender, recipient, [amount], fee, "Faucet send");
    return result;
  }

  public async credit(recipient: string, denom: string): Promise<CreditResponse> {
    const sender = this.address;
    const amount = this.tokenManager.creditAmount(denom);
    const job: SendJob = {
      sender,
      recipient,
      amount,
    };
    logSendJob(job);
    const result = await this.send(job);
    // Throw an error if the transaction fails
    if (isDeliverTxFailure(result)) {
      assertIsDeliverTxSuccess(result);
    }
    const { code, height, transactionHash } = result;
    return { sender, recipient, amount, code, height, transactionHash };

  }

  public configuredTokens(): string[] {
    return [...this.tokenConfig.bankTokens];
  }
}
