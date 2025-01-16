import {
  isDeliverTxFailure,
  assertIsDeliverTxSuccess,
  calculateFee,
  DeliverTxResponse,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { logSendJob } from "@cosmjs/faucet/build/debugging";
import type { SendJob } from "@cosmjs/faucet/build/types";
import { parseBankTokens } from "@cosmjs/faucet/build/tokens";
import { Coin } from "@cosmjs/amino";
import { FaucetConfig } from "nuxt/schema";
import { Uint53 } from "@cosmjs/math";
import { getAvailableTokens } from "./utils";

export interface CreditResponse {
  sender: string;
  recipient: string;
  amount: Coin;
  code: number;
  height: number;
  transactionHash: string;
}

export const getFaucet = async (config: FaucetConfig, mnemonic: string, pathPattern: string, accountId: number): Promise<Faucet> => {
  const { rpcUrl, addressPrefix } = config;
  const wallet = await getWallet(mnemonic, pathPattern, addressPrefix, accountId);
  const [faucetAccount] = await wallet.getAccounts();
  const faucetAddress = faucetAccount.address;
  const client = await SigningStargateClient.connectWithSigner(rpcUrl, wallet);
  return new Faucet(config, client, faucetAddress)
}

export class Faucet {
  public readonly config: FaucetConfig;
  public readonly address: string;
  private readonly client: SigningStargateClient;
  private readonly bankTokens: string[];

  public constructor(
    config: FaucetConfig,
    client: SigningStargateClient,
    address: string,
  ) {
    this.config = config;
    this.bankTokens = parseBankTokens(config.tokens);
    this.address = address;
    this.client = client;
    if (config.logging === "true") {
      console.log("config:" + JSON.stringify(config))
      console.log("address:" + address)
      console.log("bankTokens:" + this.bankTokens)
    }
  }

  public async availableTokens(): Promise<string[]> {
    const bankTokens = this.configuredTokens();
    return getAvailableTokens(this.client, this.address, bankTokens);
  }

  public async getChainId(): Promise<string> {
    return this.client.getChainId();
  }

  // credit amount from token manager accesses environment variables
  private creditAmount(amount: number, denom: string, factor: number = 1): Coin {
    const value = new Uint53(amount * factor);
    return {
      amount: value.toString(),
      denom: denom,
    };
  }

  public async send(job: SendJob): Promise<DeliverTxResponse> {
    const client = this.client
    const { sender, recipient, amount } = job;
    const { gasPrice, gasLimit, memo } = this.config;
    const gasLimitSend = parseInt(gasLimit, 10);
    const fee = calculateFee(gasLimitSend, gasPrice);
    const result = await client.sendTokens(sender, recipient, [amount], fee, memo);
    return result;
  }

  public async credit(recipient: string, denom: string): Promise<CreditResponse> {
    const sender = this.address;
    const amountGiven = this.config.amountGiven;
    const amount = this.creditAmount(amountGiven, denom);
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
    return [...this.bankTokens];
  }
}
