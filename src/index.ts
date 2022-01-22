const dotenv = require('dotenv').config();
import { EnvironmentConfig } from "./configs/environment.config";
const environmentConfig = EnvironmentConfig.getInstance();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { usersRouterV1 } from "./routes/v1/users.route";
import { profilesRouterV1 } from "./routes/v1/profiles.route";
import { systemRouterV1 } from "./routes/v1/system.route";
import { passwordsRouterV1 } from "./routes/v1/passwords.route";
import { LoggerConfig } from "./configs/logger.config";
import { DatabaseConfig } from "./configs/database.config";
import { AWSConfig } from "./configs/aws.config";
import * as logger from "./services/helper/logger";

const fileUpload = require('express-fileupload');
console.log("da");

const loggerConfig = LoggerConfig.getInstance();
const databaseConfig = DatabaseConfig.getInstance();
const awsConfig = AWSConfig.getInstance();

if (!process.env.PORT) {
   logger.error("PORT not specified");
   
   process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
// bytes : default 2MB
app.use(fileUpload({
   limits: {
      fileSize: process.env.FILE_SIZE_MAX ? Number(process.env.FILE_SIZE_MAX) : 2097152
   },
}));
app.all("/*", function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
   next();
});

app.use("/api/v1/users/:userId", profilesRouterV1);
app.use("/api/v1/users", usersRouterV1);
app.use("/api/v1/users/password", passwordsRouterV1);
app.use("/api/v1/system", systemRouterV1);

process.on("unhandledRejection", function (reason: any, p: any) {
   logger.info("Unhandled Rejection:", reason.stack);
   process.exit(1);
});

process.on("uncaughtException", function (err) {
   logger.info("Uncaught Exception", err);

   setTimeout(function () {
      process.exit(1);
   }, 3000);
});

DatabaseConfig.connect();

app.listen(PORT, () => {
   logger.info(`${process.env.NODE_ENV} server listening on port ${PORT}`);
});