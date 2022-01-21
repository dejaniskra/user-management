import mongoose from "mongoose";
import { EnvironmentConfig } from "./environment.config";

export class DatabaseConfig {
    private static instance: DatabaseConfig;
    public static database: mongoose.Connection;

    public static getInstance(): DatabaseConfig {
        if (!DatabaseConfig.instance) {
            DatabaseConfig.instance = new DatabaseConfig();
        }

        return DatabaseConfig.instance;
    }

    public static connect = () => {
        const uri = `mongodb://${EnvironmentConfig.DATABASE_USERNAME}:${EnvironmentConfig.DATABASE_PASSWORD}@${EnvironmentConfig.DATABASE_HOST}:${EnvironmentConfig.DATABASE_PORT}/${EnvironmentConfig.DATABASE_NAME}?authSource=admin`;
        if (DatabaseConfig.database) {
            return;
        }

        mongoose.connect(uri);
        DatabaseConfig.database = mongoose.connection;
        DatabaseConfig.database.once("open", async () => {
            console.log("Connected to database");
        });
        DatabaseConfig.database.on("error", () => {
            console.log("Error connecting to database");
        });
    };

    public static disconnect = () => {
        if (!DatabaseConfig.database) {
            return;
        }
        mongoose.disconnect();
    };
}