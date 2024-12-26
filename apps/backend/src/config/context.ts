import * as trpcExpress from "@trpc/server/adapters/express";
import { getUserFromToken } from "../utils/auth-utils";
export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
    const user = await getUserFromToken(req, res);

    return {
        user,
        req,
        res,
    };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
