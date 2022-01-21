export class EnvironmentConfig {
    private static instance: EnvironmentConfig;

    public static VERSION: string;

    public static DATABASE_PORT: number | undefined;
    public static DATABASE_HOST: string | undefined;
    public static DATABASE_NAME: string | undefined;
    public static DATABASE_USERNAME: string | undefined;
    public static DATABASE_PASSWORD: string | undefined;

    public static AWS_REGION: string | undefined;
    public static AWS_SQS_QUEUE_EMAILS_TYPE: string;
    public static AWS_SQS_QUEUE_EMAILS_URL: string;

    public static PROFILE_BUCKET: string;

    public static REGEX_USERNAME: RegExp;
    public static REGEX_PASSWORD: RegExp;
    public static REGEX_FIRST_NAME: RegExp;
    public static REGEX_LAST_NAME: RegExp;

    public static FILE_SIZE_MAX: number;

    public static FLAG_LOGGING_ENABLED: boolean;
    public static FLAG_LOG_TRANSACTIONS: boolean;
    public static FLAG_EMAILS_ENABLED: boolean;
    public static FLAG_EMAIL_VERIFICATION_ENABLED: boolean;
    public static FLAG_AVATAR_ENABLED: boolean;

    public static AUTO_INITIALIZE_PROFILE: boolean;

    private constructor() {}
    
    public static getInstance(): EnvironmentConfig {
        if (!EnvironmentConfig.instance) {
            EnvironmentConfig.instance = new EnvironmentConfig();
    
            EnvironmentConfig.VERSION = process.env.VERSION ? process.env.VERSION : "17.38";

            EnvironmentConfig.DATABASE_PORT = process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 80;
            EnvironmentConfig.DATABASE_HOST = process.env.DATABASE_HOST;
            EnvironmentConfig.DATABASE_NAME = process.env.DATABASE_NAME;
            EnvironmentConfig.DATABASE_USERNAME = process.env.DATABASE_USERNAME;
            EnvironmentConfig.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
            EnvironmentConfig.AWS_REGION = process.env.AWS_REGION;
            EnvironmentConfig.AWS_SQS_QUEUE_EMAILS_TYPE = process.env.AWS_SQS_QUEUE_EMAILS_TYPE ? process.env.AWS_SQS_QUEUE_EMAILS_TYPE : "standard"
            EnvironmentConfig.AWS_SQS_QUEUE_EMAILS_URL = process.env.AWS_SQS_QUEUE_EMAILS_URL ? process.env.AWS_SQS_QUEUE_EMAILS_URL : "http://localstack:4566/000000000000/user-management-emails";
            EnvironmentConfig.PROFILE_BUCKET = process.env.PROFILE_BUCKET ? process.env.PROFILE_BUCKET : "user-management-profiles";

            EnvironmentConfig.REGEX_USERNAME = process.env.REGEX_USERNAME ? new RegExp(process.env.REGEX_USERNAME) : /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
            EnvironmentConfig.REGEX_PASSWORD = process.env.REGEX_PASSWORD ? new RegExp(process.env.REGEX_PASSWORD) : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            EnvironmentConfig.REGEX_FIRST_NAME = process.env.REGEX_FIRST_NAME ? new RegExp(process.env.REGEX_FIRST_NAME) : /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
            EnvironmentConfig.REGEX_LAST_NAME = process.env.REGEX_LAST_NAME ? new RegExp(process.env.REGEX_LAST_NAME) : /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;

            EnvironmentConfig.FLAG_LOGGING_ENABLED = process.env.FLAG_LOG_ENABLED ? Boolean(process.env.FLAG_LOGGING_ENABLED) : true;
            EnvironmentConfig.FLAG_LOG_TRANSACTIONS = process.env.FLAG_LOG_TRANSACTIONS ? Boolean(process.env.FLAG_LOG_TRANSACTIONS) : true;
            EnvironmentConfig.FLAG_EMAILS_ENABLED = process.env.FLAG_EMAILS_ENABLED ? Boolean(process.env.FLAG_EMAILS_ENABLED) : true;
            EnvironmentConfig.FLAG_EMAIL_VERIFICATION_ENABLED = process.env.FLAG_EMAIL_VERIFICATION_ENABLED ? Boolean(process.env.FLAG_EMAIL_VERIFICATION_ENABLED) : true;
            EnvironmentConfig.FLAG_AVATAR_ENABLED = process.env.FLAG_AVATAR_ENABLED ? Boolean(process.env.FLAG_AVATAR_ENABLED) : true;

            EnvironmentConfig.AUTO_INITIALIZE_PROFILE = process.env.AUTO_INITIALIZE_PROFILE ? Boolean(process.env.AUTO_INITIALIZE_PROFILE) : true;
        }

        return EnvironmentConfig.instance;
    }
}