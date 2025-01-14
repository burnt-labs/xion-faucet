//export async function onRequest(_context: any) {
export default defineEventHandler((event) => {
    const env = event.context.cloudflare.env
    return new Response(
        "ok",
        { status: 200 }
    );
});

