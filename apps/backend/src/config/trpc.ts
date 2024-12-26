import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import logger from "./logger";
import superjson from "superjson";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
    // errorFormatter: ({ shape, error }) => {
    //     error.code == "INTERNAL_SERVER_ERROR" && logger.error(error.message);
    //     return shape;
    // },
    transformer: superjson,
    isDev: process.env.NODE_ENV === "development",
});
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = (requiredRoles?: string[]) =>
    publicProcedure.use(async (opts) => {
        const { ctx } = opts;

        if (!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        if (requiredRoles) {
            const hasPermission = ctx.user.roles.some(
                (role) => requiredRoles.includes(role)
            );

            if (!hasPermission) {
                throw new TRPCError({ code: "FORBIDDEN", message: "User does not have the required permissions" });
            }
        }

        return opts.next({
            ctx: {
                user: ctx.user,
            },
        });
    });

type Meta = {
    logType?: "system" | "user_interaction";
    ip?: string;
    agent?: string;
    user?: {
        id: string;
        email: string;
    };
    path: string;
    type: string;
    durationMs: number;
    error?: {
        code: string;
        message: string;
        stackTrace?: string;
    };
    resourceType?: string;
    resourceId?: string;


}

export const loggerMiddleware = (description?: string) =>
    t.middleware(async (opts) => {
        const start = Date.now();

        const result = await opts.next();

        const durationMs = Date.now() - start;

        let meta: Meta = {
            logType: "system",
            ip: opts.ctx.req.ip,
            agent: opts.ctx.req.headers["user-agent"],
            user: opts.ctx.user ? { id: opts.ctx.user.userId, email: opts.ctx.user.userEmail } : undefined,
            path: opts.path,
            type: opts.type,
            durationMs,
            error: !result.ok ? {
                code: result.error.code,
                message: result.error.message,
                stackTrace: result.error.code === "INTERNAL_SERVER_ERROR" ? result.error.stack : undefined,
            } : undefined,
        };

        // if (isUserInteraction(opts.path)) {
        //     meta = {
        //         ...meta,
        //         logType: "user_interaction",
        //         resourceType: opts.path.split(".")[0],
        //         resourceId: (opts.rawInput as any).id,
        //     };
        // }

        const logMessage = `${meta.user?.email ?? "anonymous"} @${meta.ip} ${description ? `${description}` : ""} [${meta.type}] [${meta.path}] [${meta.error ? meta.error.code : "OK"}] [${durationMs}ms] ${meta.error ? `[Error: ${meta.error.message}]` : ""}`;
        
        
        if (result.ok) {
            logger.info(logMessage, meta);
        } else if (result.error.code === "INTERNAL_SERVER_ERROR") {
            logger.error(logMessage, meta);
            console.error(meta.error?.stackTrace);
        } else {
            logger.warn(logMessage, meta);
        }

        return result;
    });
