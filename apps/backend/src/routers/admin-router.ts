import { protectedProcedure, loggerMiddleware, router } from "../config/trpc";
import { authValidators } from "../validators/auth-validators";
import { adminValidators } from "../validators/admin-validators";
import { adminService } from "../services/admin-service";

export const adminRouter = router({
    findMany: protectedProcedure(["admin"])
        .use(loggerMiddleware("Fetch admins"))
        .input(adminValidators.paginatedAdminFilters)
        .output(adminValidators.displayPaginatedAdmins)
        .query(({ input, ctx }) => adminService.getAdmins(input, ctx)),
    findOne: protectedProcedure(["admin"])
        .use(loggerMiddleware("Fetch admin"))
        .input(adminValidators.admin.pick({ id: true }))
        .output(adminValidators.displayAdmin)
        .query(({ input, ctx }) => adminService.getAdmin(input, ctx)),
});
