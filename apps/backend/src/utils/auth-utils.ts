import jwt from "jsonwebtoken";
import { cache } from "../services/cache-service";
import { TRPCError } from "@trpc/server";
import { Request, Response } from "express";
import logger from "../config/logger";

export const getUserFromToken = async (req: Request, res: Response) => {
    if (req.cookies?.token) {
        const user = await decodeAndVerifyJwtToken(req.cookies.token, res);
        return user;
    }
    return null;
};

export const generateToken = (tokenBody: any, expiresIn: string = "3d") => {
    if (process.env.SECRET_KEY === undefined) {
        logger.error("SECRET_KEY is not defined");
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error, please try again later",
        });
    }

    const token = jwt.sign(tokenBody, process.env.SECRET_KEY, {
        expiresIn,
    });

    return token;
};

export const decodeAndVerifyJwtToken = async (token: string, res: Response) => {
    try {
        if (process.env.SECRET_KEY === undefined) {
            logger.error("SECRET_KEY is not defined");
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error, please try again later",
            });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY) as jwt.JwtPayload;
        // check if token:invalidation:decoded.userId exists, if it exists, check the value, if it's more than decoded.iat, then token is invalid
        const invalidation = await cache.get("token:invalidation:" + decoded.userId);
        if (!decoded || !decoded.iat) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid token",
            });
        }
        if (invalidation && invalidation > decoded.iat) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid token",
            });
        }

        await refreshToken(decoded, res);

        return {
            userId: decoded.userId as string,
            userEmail: decoded.userEmail as string,
            roles: decoded.roles as string[],
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.error(`Error decoding and verifying token: ${error.message}`);
            res.clearCookie("token");
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid token",
            });
        }
    }
};

export const refreshToken = async (decoded: jwt.JwtPayload, res: Response) => {
    try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const expirationThreshold = 6 * 60 * 60;
        if (decoded.exp && (decoded.exp < currentTimestamp || decoded.exp - currentTimestamp <= expirationThreshold)) {
            const tokenBody = {
                userId: decoded.userId as string,
                userEmail: decoded.userEmail as string,
                roles: decoded.roles as string[],
            };
            logger.info(
                "Refreshing token:",
                tokenBody,
                new Date(decoded.exp * 1000),
                new Date(currentTimestamp * 1000)
            );
            const newToken = generateToken(tokenBody);
            res.cookie("token", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                domain: process.env.ORIGIN,
            });
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.error("Error refreshing token:", error.message);
        }
    }
};

export const issueNewToken = async (user: any, res: Response) => {
    try {
        const tokenBody = {
            userId: user.id as string,
            userEmail: user.email as string,
            roles: user.roles as string[],
        };
        logger.info("Issuing new token:", tokenBody);
        const newToken = generateToken(tokenBody);
        res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            domain: process.env.ORIGIN,
        });
    } catch (error: any) {
        logger.error("Error issuing new token:", error.message);
    }
};

// export const getUserPermissions = async (_roles: string[]): Promise<string[]> => {
//     const userPermissions = new Set<string>();

//     for (const role of _roles) {
//         let permissions = await cache.getHashmapValue("permissions", role);

//         if (!permissions) {
//             const roleWithPermissions = await db.query.roles.findFirst({
//                 where: eq(roles.name, role),
//                 with: {
//                     permissions: {
//                         with: {
//                             permission: true,
//                         },
//                     },
//                 },
//             });

//             if (!roleWithPermissions) {
//                 throw new TRPCError({
//                     code: "INTERNAL_SERVER_ERROR",
//                     message: "Role not found",
//                 });
//             }

//             permissions = roleWithPermissions.permissions.map((permission) => permission.permission?.name);
//             await cache.setHashmapValue("permissions", role, permissions);
//         }

//         permissions.forEach((permission) => userPermissions.add(permission));
//     }

//     return Array.from(userPermissions);
// };

// export const getUserResources = async (_roles: string[]): Promise<string[]> => {
//     const userResources = new Set<string>();

//     for (const role of _roles) {
//         let resources = await cache.getHashmapValue("resources", role);

//         if (!resources) {
//             const roleWithPermissions = await db.query.roles.findFirst({
//                 where: eq(roles.name, role),
//                 with: {
//                     resources: {
//                         with: {
//                             resource: true,
//                         },
//                     },
//                 },
//             });

//             if (!roleWithPermissions) {
//                 throw new TRPCError({
//                     code: "INTERNAL_SERVER_ERROR",
//                     message: "Role not found",
//                 });
//             }

//             resources = roleWithPermissions.resources.map((resource: any) => resource.resource?.name);
//             await cache.setHashmapValue("resources", role, resources);
//         }

//         resources.forEach((resource: any) => userResources.add(resource));
//     }

//     return Array.from(userResources);
// };
