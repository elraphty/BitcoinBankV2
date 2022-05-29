import { createLnRpc, createRouterRpc } from '@radar/lnrpc';
import 'dotenv/config';

const lnRpcClient = createLnRpc({
    server: process.env.LND_RPC_URL,
    tls: process.env.LND_TLS_PATH,
    macaroonPath: process.env.LND_MACROON_PATH,
});

export const routerClient = createRouterRpc({
    server: process.env.LND_RPC_URL,
    tls: process.env.LND_TLS_PATH,
    macaroonPath: process.env.LND_MACROON_PATH,
});

export default lnRpcClient;
