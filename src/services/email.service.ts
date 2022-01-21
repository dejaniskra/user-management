import { EnvironmentConfig } from "../configs/environment.config";
import { MessageBodyAttributeMap } from "aws-sdk/clients/sqs";
import * as sqsClient from "../clients/sqs.client";

export function requestAccountVerification(messageBody: EmailMessageBody) {
    send(messageBody, "account-verification-request");
}

export function accountVerificationCompleted(messageBody: EmailMessageBody) {
    send(messageBody, "account-verification-completed");
}

export function passwordReset(messageBody: EmailMessageBody) {
    send(messageBody, "password-reset");
}

export function passwordChanged(messageBody: EmailMessageBody) {
    send(messageBody, "password-changed");
}

export function usernameChange(messageBody: EmailMessageBody) {
    send(messageBody, "username-change");
}

function send(messageBody: EmailMessageBody, type: string) {
    if (EnvironmentConfig.FLAG_EMAILS_ENABLED) {
        const now = new Date();
        const messageBodyAttributes: MessageBodyAttributeMap = {
            "timestamp": {
                DataType: "String",
                StringValue: now.getTime().toString()
            }
        }

        if (EnvironmentConfig.AWS_SQS_QUEUE_EMAILS_TYPE.toLowerCase() === "fifo") {
            const deduplicationId: string = messageBody.userId;
            const messageGroupId: string = `email::${type}`;

            sqsClient.sendToFifoQueue(messageBody, messageBodyAttributes, deduplicationId, messageGroupId);
        } else {
            sqsClient.sendToStandardQueue(messageBody, messageBodyAttributes);
        }
    }
}