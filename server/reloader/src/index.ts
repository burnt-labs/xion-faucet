import { StargateClient, calculateFee, assertIsDeliverTxSuccess, StdFee, SigningStargateClient } from "@cosmjs/stargate";
import { getAvailableTokens, getSigningClient, loadAccounts, createWallets } from "./utils"
import { debugAccount, logSendJob } from "@cosmjs/faucet/build/debugging";
import { makePathBuilder } from "@cosmjs/faucet/build/pathbuilder";
import { parseBankTokens } from "@cosmjs/faucet/build/tokens";
import { MinimalAccount } from "@cosmjs/faucet/build/types";
import { TokenManager } from "@cosmjs/faucet/build/tokenmanager";

export default {
	async scheduled(request: Request, env: Env): Promise<Response> {
		try {
			const rpcUrl = env.FAUCET_RPC_URL;
			const tokens = env.FAUCET_TOKENS;
			const mnemonic = env.FAUCET_MNEMONIC;
			const pathPattern = env.FAUCET_PATH_PATTERN;
			const addressPrefix = env.FAUCET_ADDRESS_PREFIX;
			const numAccounts = env.FAUCET_NUM_ACCOUNTS;
			const gasPrice = env.FAUCET_GAS_PRICE;
			const gasLimit = env.FAUCET_GAS_LIMIT;

			// Readonly Client
			const readOnlyClient = await StargateClient.connect(rpcUrl);
			const chainId = await readOnlyClient.getChainId();
			console.info(`Connected to network: ${chainId}`);

			// Cahin info
			const chainTokens = parseBankTokens(tokens);
			console.info("Chain tokens:", chainTokens);

			// Account info
			const pathBuilder = makePathBuilder(pathPattern);
			const wallets = await createWallets(mnemonic, pathBuilder, addressPrefix, numAccounts, true);
			const addresses = wallets.map(([address]) => address);
			const accounts = await loadAccounts(readOnlyClient, addresses);

			const availableTokens = await getAvailableTokens(readOnlyClient, addresses[0], chainTokens);

			const gasLimitSend = parseInt(gasLimit, 10);
			const fee = () => calculateFee(gasLimitSend, gasPrice);

			const signingClient = await getSigningClient(rpcUrl, mnemonic, pathPattern, addressPrefix, 0);
			await refill(signingClient, accounts, availableTokens, fee);
			console.info("Done refilling accounts.");

			return new Response("Refilled accounts", { status: 200 });

		} catch (error) {
			return handleError(error);
		}
	}
};

async function refill(signingClient: SigningStargateClient, accounts: readonly MinimalAccount[], availableTokens: string[], fee: () => StdFee): Promise<void> {
	const [holderAccount, ...distributorAccounts] = accounts;
	const tokenManager = new TokenManager({ bankTokens: availableTokens });
	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
	console.info(`${debugAccount(accounts[0])}: Prime Account`);

	for (const account of distributorAccounts) {
		for (const denom of availableTokens) {
			if (tokenManager.needsRefill(account, denom)) {
				const amount = tokenManager.refillAmount(denom);
				console.info(`${debugAccount(account)}: Refilling with ${amount}${denom}}`);

				const job = {
					sender: holderAccount.address,
					recipient: account.address,
					amount: amount,
				};

				logSendJob(job);

				try {
					const result = await signingClient.sendTokens(job.sender, job.recipient, [job.amount], fee(), "Faucet Refilled");
					assertIsDeliverTxSuccess(result);
				} catch (error) {
					console.error(`Failed to send tokens for ${denom} to ${account.address}:`, error);
				}

				// Avoid magic numbers by using named variables or constants
				await delay(12000);
			} else {
				console.info(`${debugAccount(account)}: No ${denom} refill needed`);
			}
		}
	}
}


function handleError(error: unknown): Response {
	if (error instanceof Error) {
		console.error(`Error: ${error.message}`);
		return new Response(`Error: ${error.message}`, { status: 500 });
	} else {
		console.error("An unknown error occurred");
		return new Response("An unknown error occurred", { status: 500 });
	}
}
