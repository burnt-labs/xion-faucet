import { StargateClient } from '@cosmjs/stargate';
import { getAvailableTokens, getWallet } from '../utils/utils';
import { parseBankTokens } from '@cosmjs/faucet/build/tokens';

export interface StatusResponse {
	status: string;
	chainId: string;
	nodeUrl: string;
	chainTokens: string[];
	availableTokens: string[];
	address: string;
	balance: string[];
}

export default defineEventHandler(async (event) => {
	try {
		const runtimeConfig = useRuntimeConfig(event);
		const faucetConfig = runtimeConfig.public.faucet;

		const url = new URL(event.context.cloudflare.request.url);
		const chainIdParam = url.searchParams.get("chainId");
		if (!chainIdParam) {
			return new Response(JSON.stringify({ status: 'error', message: 'Missing chainId parameter' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const configChainIds = faucetConfig.chainId.split(",");
		const index = configChainIds.indexOf(chainIdParam);
		if (index === -1) {
			return new Response(JSON.stringify({ status: 'error', message: 'Invalid chainId parameter' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Any of these can be a comma-separated list if multichain
		const faucetConfigRpcUrl = faucetConfig.rpcUrl.split(",").at(index) || faucetConfig.rpcUrl;
		const addressPrefix = faucetConfig.addressPrefix.split(",").at(index) || faucetConfig.addressPrefix;
		const configTokens = faucetConfig.tokens.split("|").at(index) || faucetConfig.tokens;
		const pathPattern = runtimeConfig.faucet.pathPattern.split(",").at(index) || runtimeConfig.faucet.pathPattern;
		const mnemonic = runtimeConfig.faucet.mnemonic.split(",").at(index) || runtimeConfig.faucet.mnemonic;

		const chainTokens = parseBankTokens(configTokens);
		const [client, wallet] = await Promise.all([
			StargateClient.connect(faucetConfigRpcUrl),
			getWallet(mnemonic, pathPattern, addressPrefix, 0)
		]);

		//console.log(`Fetching faucet account information`);
		const [faucetAccount] = await wallet.getAccounts();
		const address = faucetAccount.address;

		// Fetch available tokens, chain ID, and balance concurrently
		//console.log(`Fetching tokens, chain ID, and balance`);
		const [availableTokens, chainId, rawBalance] = await Promise.all([
			getAvailableTokens(client, address, chainTokens),
			client.getChainId(),
			client.getAllBalances(address)
		]);

		const balance = rawBalance.map(({ amount, denom }) => `${amount} ${denom}`);

		const responseBody: StatusResponse = {
			status: 'ok',
			chainId: chainId,
			nodeUrl: faucetConfigRpcUrl,
			chainTokens: chainTokens,
			availableTokens: availableTokens,
			address: address,
			balance: balance,
		};
		return new Response(JSON.stringify(responseBody), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ status: 'error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
});

