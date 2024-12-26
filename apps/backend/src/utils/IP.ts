import { Request } from "express";

const getClientIP = (req: Request) => {
    const xForwardedForHeader = req.headers["x-forwarded-for"];
    if (xForwardedForHeader) {
        if (typeof xForwardedForHeader === "string") {
            return xForwardedForHeader.split(",")[0].trim();
        } else {
            return xForwardedForHeader[0].trim();
        }
    } else {
        return req.connection.remoteAddress;
    }
};

export default getClientIP;
