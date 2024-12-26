import z from "zod";
import { Context } from "../config/context";
import { responseValidator } from "../validators/response-validator";
import { TRPCError } from "@trpc/server";
import { db } from "../db/database";
import { eq, count } from "drizzle-orm";
import { admins } from "../schemas/admin";
import { adminValidators } from "../validators/admin-validators";

const getAdmins = async (
    { page, per_page, email }: z.infer<typeof adminValidators.paginatedAdminFilters>,
    _: Context
): Promise<z.infer<typeof adminValidators.displayPaginatedAdmins>> => {
    const result = await db.query.admins.findMany({
        where: email ? eq(admins.email, email) : undefined,
        limit: per_page,
        offset: (page - 1) * per_page,
        columns: {
            password: false,
        },
        with: {
            roles: {
                with: {
                    role: true
                },
            }
        },
    });
    const [{count: countResult}] = await db.select({ count: count() }).from(admins).where(email ? eq(admins.email, email) : undefined);

    return {
        data: adminValidators.displayAdmins.parse(result),
        count: countResult
    };
};

const getAdmin = async (
    { id }: { id: string },
    _: Context
): Promise<z.infer<typeof adminValidators.displayAdmin>> => {
    const result = await db.query.admins.findFirst({
        where: eq(admins.id, id),
        columns: {
            password: false,
        },
        with: {
            roles: {
                with: {
                    role: true
                },
            }
        },
    });

    if (!result) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Admin not found",
        });
    }

    return adminValidators.displayAdmin.parse(result);
}

export const adminService = { getAdmins, getAdmin };
