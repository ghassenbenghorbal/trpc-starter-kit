import z from "zod";
import { responseValidator } from "./response-validator";
import { adminValidators } from "./admin-validators";

const login = z.object({
    email: z.string().email("invalid Email"),
    password: z.string().min(8, "invalid password").regex(/\d/, "invalid password"),
});

const me = z
    .object({
        token: z.string(),
        user: adminValidators.authenticatedAdmin,
    })
    .merge(responseValidator);

const signup = adminValidators.admin
    .omit({ id: true, roles: true, createdAt: true, updatedAt: true, deletedAt: true })
    .merge(z.object({ confirmPassword: z.string() }))
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const authValidators = {
    login,
    me,
    signup,
};
