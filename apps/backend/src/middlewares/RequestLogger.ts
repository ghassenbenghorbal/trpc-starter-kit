import { Request, Response, NextFunction } from "express";
import getClientIP from "../utils/IP";
import logger from "../config/logger";

const requestLogger = (description?: string, excludeQueryAndPathParams?: boolean) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const start = Date.now();
            const userId = req.body?.token?.userId;
            const username = req.body?.token?.user;
            const storeId = req.body?.token?.store;
            // const path = excludeQueryAndPathParams ? req.baseUrl + req.path : req.originalUrl;
            const path = req.baseUrl + req.path;
            const userAgent = req.headers["user-agent"] || "unknown";
            const ip = getClientIP(req);
            const method = req.method;

            res.on("finish", () => {
                const durationMs = Date.now() - start;
                const statusCode = res.statusCode;
                let error;
                if (statusCode >= 400) {
                    error = {
                        message: res.locals.error?.message || "An error occurred",
                        stack: res.locals.error?.stack || null,
                        name: res.locals.error?.name || null,
                    };
                }
                const message = `${username ?? "anonymous"}@${ip} - "${method} ${path}" [${statusCode}] [${durationMs}ms] ${description ? `"${description}"` : ""} ${error ? `[Error: ${error.message}]` : ""}`;

                const metaData = {
                    description,
                    userId,
                    username,
                    storeId,
                    path: req.originalUrl,
                    basePath: req.baseUrl + req.path,
                    userAgent,
                    ip,
                    method,
                    statusCode,
                    duration: durationMs,
                    error,
                };
                const _statusCode = statusCode + "";
                if (_statusCode.startsWith("2")) {
                    logger.info(message, metaData);
                } else if (_statusCode.startsWith("4")) {
                    logger.warn(message, metaData);
                } else if (_statusCode.startsWith("5")) {
                    logger.error(message, metaData);
                } else {
                    logger.info(message, metaData);
                }
            });

            next();
        } catch (error: any) {
            logger.error(`Logging middleware failed: [Error: ${error.message}]`, { error });
            next();
        }
    };
};

export default requestLogger;
