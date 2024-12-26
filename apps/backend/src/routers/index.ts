import { router } from "../config/trpc";
import { authRouter } from "./auth-router";
import { adminRouter } from "./admin-router";

export const appRouter = router({
    auth: authRouter,
    admins: adminRouter,
});

export type AppRouter = typeof appRouter;
