//export const onRequest: PagesFunction<Env> = async (context): Promise<Response> => {
export default defineEventHandler((event) => {
    const env = event.context.cloudflare.env
    return new Response(
        "Welcome to the faucet!\n\nCheck the full status via the /status endpoint.\nYou can get tokens from here by POSTing to /credit.\nSee https://github.com/cosmos/cosmjs/tree/main/packages/faucet for all further information.\n",
        { status: 200 }
    );
});
