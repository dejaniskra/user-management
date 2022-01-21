import { Logger } from "tslog";

export class LoggerConfig {
    private static instance: LoggerConfig;

    public static Logger: Logger;

    private constructor() { }

    public static getInstance(): LoggerConfig {
        if (!LoggerConfig.instance) {
            LoggerConfig.Logger = new Logger();
        }

        return LoggerConfig.instance;
    }
}