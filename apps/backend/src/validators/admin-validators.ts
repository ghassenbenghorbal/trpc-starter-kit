import z from "zod";

export const resource = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const permission = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const baseResourcePermission = z.object({
    resourceId: z.string(),
    permissionId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const resourcePermission = baseResourcePermission.extend({
    resource,
    permission,
});

export const baseRole = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const role = baseRole.extend({
    resourcePermissions: z.array(resourcePermission),
});

export const adminRole = z.object({
    adminId: z.string(),
    roleId: z.string(),
    role,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

// export const baseAdmin = z.object({
//     id: z.string().min(1, { message: "Invalid ID" }),
//     email: z.string().email("invalid Email"),
//     password: z
//         .string()
//         .min(8, { message: "Password must be at least 8 characters long" })
//         .regex(/\d/, { message: "Password must contain at least one number" }),
//     firstname: z.string().min(3),
//     lastname: z.string().min(3),
//     username: z.string().min(3),
//     birthdate: z.coerce.date(),
//     cin: z
//         .string()
//         .regex(/^\d{8}$/, "This CIN is invalid")
//         .nullish(),
//     phone: z
//         .string()
//         .regex(/^(\+\d{1,3}[- ]?)?(\(?\d{1,4}\)?[- ]?)?[\d- ]{3,15}$/, "This Phone number is invalid")
//         .nullish(),
//     position: z.string().nullish(),
//     createdAt: z.coerce.date(),
//     updatedAt: z.coerce.date(),
//     deletedAt: z.coerce.date().nullish(),
// });

export const baseAdmin = z.object({
    id: z.string().min(1, { message: "Invalid ID" }),
    email: z.string().email("invalid Email"),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/\d/, { message: "Password must contain at least one number" }),
    firstname: z.string().min(3),
    lastname: z.string().min(3),
    username: z.string().min(3),
    phone: z
        .string()
        .regex(/^(\+\d{1,3}[- ]?)?(\(?\d{1,4}\)?[- ]?)?[\d- ]{3,15}$/, "This Phone number is invalid")
        .nullish(),
    position: z.string().nullish(),
    image: z.string().url().nullish(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullish(),
});

export const admin = baseAdmin.extend({
    roles: z.array(adminRole),
});

export const authenticatedAdmin = admin
    .extend({
        roles: z.array(adminRole.extend({ role: baseRole })),
    })
    .omit({
        password: true,
    });

export const displayAdmin = admin
    .extend({
        roles: z.array(adminRole.extend({ role: baseRole })),
    })
    .omit({
        password: true,
    });

export const displayAdmins = z.array(displayAdmin);

export const displayPaginatedAdmins = z.object({
    data: displayAdmins,
    count: z.number(),
});

export const paginatedAdminFilters = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    email: z.string().nullish(),
});

export const adminValidators = {
    displayAdmin,
    displayAdmins,
    displayPaginatedAdmins,
    paginatedAdminFilters,
    admin,
    authenticatedAdmin,
    baseAdmin,
    adminRole,
    role,
    baseRole,
    permission,
    resource,
};
