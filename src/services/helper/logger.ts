import { EnvironmentConfig } from "../../configs/environment.config";
import { LoggerConfig } from "../../configs/logger.config";

export function trace(...args: unknown[]): void {
    log("TRACE", args);
}

export function debug(...args: unknown[]): void {
    log("DEBUG", args);
}

export function warn(...args: unknown[]): void {
    log("WARN", args);
}

export function info(...args: unknown[]): void {
    log("INFO", args);
}

export function error(...args: unknown[]): void {
    log("ERROR", args);
}

export function critical(...args: unknown[]): void {
    log("CRITICAL", args);
}

function log(level: "TRACE" | "DEBUG" | "WARN" | "INFO" | "ERROR" | "CRITICAL", ...args: unknown[]) {
    if (EnvironmentConfig.FLAG_LOGGING_ENABLED) {
        const logger = LoggerConfig.Logger;

        switch (level) {
            case "TRACE":
                logger.trace(args);
                break;
            case "DEBUG":
                logger.debug(args);
                break;
            case "WARN":
                logger.warn(args);
                break;
            case "INFO":
                logger.info(args);
                break;
            case "ERROR":
                logger.error(args);
                break;
            case "CRITICAL":
                logger.fatal(args);
                break;
            default:
                logger.info(args);
                break;
        }
    }
}