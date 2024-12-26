import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./config/context";
import { appRouter } from "./routers";
import logger from "./config/logger";
import cookieParser from 'cookie-parser';
import "./db/database";
import { appLimiter } from "./middlewares/RateLimiter";
import origins from "./config/origin";

dotenv.config();

const port = parseInt(process.env.PORT || "3000");

const app: Express = express();

// clear();

// seeds();

appLimiter(app);

app.use(cors(origins));

app.use(express.json());

app.use(cookieParser());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Listen on all network interfaces
app.listen(port, "0.0.0.0", () => {
  logger.info(`Express is running in ${process.env.NODE_ENV} on port ${port}!`);
});