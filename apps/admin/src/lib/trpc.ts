import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '../../../backend/src/routers';
import superjson from 'superjson';
 
export const trpc = createTRPCReact<AppRouter>({
    abortOnUnmount: true,
});

const TRPC_SERVER_URL = import.meta.env.TRPC_SERVER_URL || "http://localhost:3000";

const TRPC_ENDPOINT_URL = `${TRPC_SERVER_URL}/trpc`;
export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: TRPC_ENDPOINT_URL,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                });
            },
            transformer: superjson
        }),
    ],
});
