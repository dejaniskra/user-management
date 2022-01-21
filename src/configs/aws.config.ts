import { SES, SQS, S3, config } from "aws-sdk";
import { EnvironmentConfig } from "./environment.config";
// const AWS = require("aws-sdk");

export class AWSConfig {
    private static instance: AWSConfig;
    public static ses: SES;
    public static sqs: SQS;
    public static s3: S3
    private constructor() { }

    public static instantiate(): AWSConfig {

        if (!AWSConfig.instance) {
            AWSConfig.instance = new AWSConfig();

            if (process.env.NODE_ENV === "local") {
                config.update({
                    accessKeyId: "foo",
                    secretAccessKey: "bar",
                    region: "us-east-1"
                });
            } else {
                config.update({
                    region: EnvironmentConfig.AWS_REGION
                });
            }
        }

        if (!AWSConfig.ses) {
            if (process.env.NODE_ENV === "local") {
                this.ses = new SES({
                    region: "us-east-1"
                });
            } else {
                this.ses = new SES();
            }
        }

        if (!AWSConfig.sqs) {
            if (process.env.NODE_ENV === "local") {
                this.sqs = new SQS({
                    endpoint: "http://localstack:4566",
                    region: "us-east-1"
                });
            } else {
                this.sqs = new SQS();
            }
        }

        if (!AWSConfig.s3) {
            if (process.env.NODE_ENV === "local") {
                this.s3 = new S3({
                    endpoint: "http://localstack:4566",
                    region: "us-east-1",
                    s3ForcePathStyle: true
                });
            } else {
                this.s3 = new S3();
            }
        }

        return AWSConfig.instance;
    }
}
