import { authService } from "../services/auth-service";
import { protectedProcedure, publicProcedure, loggerMiddleware, router } from "../config/trpc";
import { authValidators } from "../validators/auth-validators";

export const authRouter = router({
    login: publicProcedure
        .use(loggerMiddleware("Login"))
        .input(authValidators.login)
        .output(authValidators.me)
        .mutation(({ input, ctx }) => authService.login(input, ctx)),

    // signup: publicProcedure
    //     .use(loggerMiddleware("Signup"))
    //     .input(authValidators.signup)
    //     .output(authValidators.me)
    //     .mutation(({ input, ctx }) => authService.signup(input, ctx)),

    logout: publicProcedure.use(loggerMiddleware("Logout")).mutation(({ ctx }) => authService.logout(ctx)),

    me: protectedProcedure()
        .use(loggerMiddleware("Get Authenticated User"))
        .output(authValidators.me)
        .query(({ ctx }) => authService.me(ctx)),
});
