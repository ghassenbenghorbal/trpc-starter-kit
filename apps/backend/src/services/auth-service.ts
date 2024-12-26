import z from "zod";
import { authValidators } from "../validators/auth-validators";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { Context } from "../config/context";
import { generateToken } from "../utils/auth-utils";
import { eq, or } from "drizzle-orm";
import { db } from "../db/database";
import { admins } from "../schemas/admin";
import { adminValidators } from "../validators/admin-validators";

const validateUserEmail = async (email: string) => {
    const admin = await db.query.admins.findFirst({
        where: eq(admins.email, email),
        with: {
            roles: {
                with: {
                    role: true,
                },
            },
        },
    });

    if (!admin) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid credentials",
        });
    }

    return admin;
};

const adminIsUnique = async (username: string, email: string) => {
    const admin = await db.query.admins.findFirst({
        where: or(eq(admins.username, username), eq(admins.email, email)),
        columns: {
            username: true,
            email: true,
        },
    });

    if (admin?.username === username) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already in use",
        });
    }

    if (admin?.email === email) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email already in use",
        });
    }
};

const validateUserPassword = async (password: string, validPassword: string): Promise<void> => {
    const isValid = await bcrypt.compare(password, validPassword);
    if (!isValid) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid credentials",
        });
    }
};

const login = async (
    credentials: z.infer<typeof authValidators.login>,
    ctx: Context
): Promise<z.infer<typeof authValidators.me>> => {
    const admin = await validateUserEmail(credentials.email);

    await validateUserPassword(credentials.password, admin.password);

    const tokenBody = {
        userId: admin.id,
        userEmail: admin.email,
        roles: admin.roles.map((role) => role.role?.name),
    };

    const token = generateToken(tokenBody);

    ctx.res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        domain: process.env.ORIGIN,
    });

    return {
        message: "User logged in successfully",
        token: token,
        user: adminValidators.authenticatedAdmin.parse(admin),
    };
};

// const signup = async (
//     admin: z.infer<typeof authValidators.signup>,
//     ctx: Context
// ): Promise<z.infer<typeof authValidators.me>> => {
//     await adminIsUnique(admin.username, admin.email);

//     const adminRole = await db.query.roles.findFirst({
//         where: eq(roles.name, "admin"),
//         with: {
//             permissions: true,
//             resources: true,
//         },
//         columns: {
//             id: true,
//         },
//     });
//     if (!adminRole)
//         throw new TRPCError({
//             code: "INTERNAL_SERVER_ERROR",
//             message: "Admin role not found",
//         });

//     const [newUser] = await db.insert(admins).values(admin).returning({
//         id: admins.id,
//     });

//     const _admin = await db.query.admins.findFirst({
//         where: eq(admins.id, newUser.id),
//         with: {
//             roles: {
//                 with: {
//                     role: {
//                         with: {
//                             permissions: {
//                                 with: {
//                                     permission: true,
//                                 },
//                             },
//                             resources: {
//                                 with: {
//                                     resource: true,
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     if (!_admin) {
//         throw new TRPCError({
//             code: "BAD_REQUEST",
//             message: "Invalid admin",
//         });
//     }

//     const tokenBody = {
//         adminId: _admin.id,
//         adminEmail: _admin.email,
//         roles: [adminRole.id],
//     };

//     const token = generateToken(tokenBody);

//     ctx.res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
//         domain: process.env.ORIGIN,
//     });

//     return {
//         message: "User created successfully",
//         token,
//         admin: adminValidators.authenticatedUser.parse({
//             ..._admin,
//             roles: _admin.roles.map((role) => {
//                 return {
//                     ...role.role,
//                     permissions: role.role?.permissions.map((perm) => perm.permission),
//                     resources: role.role?.resources.map((res) => res.resource),
//                 };
//             }),
//         }),
//     };
// };

const logout = async (ctx: Context) => {
    ctx.res.clearCookie("token");
    return {
        message: "User logged out successfully",
    };
};

const me = async (ctx: Context): Promise<z.infer<typeof authValidators.me>> => {
    const admin = await db.query.admins.findFirst({
        where: eq(admins.id, ctx.user?.userId!),
        with: {
            roles: {
                with: {
                    role: true,
                },
            },
        },
    });

    if (!admin) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid admin",
        });
    }

    return {
        token: ctx.req.cookies?.token,
        message: "User retrieved successfully",
        user: adminValidators.authenticatedAdmin.parse(admin),
    };
};

export const authService = {
    login,
    logout,
    me,
};
