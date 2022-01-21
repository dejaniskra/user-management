import SQS, { MessageBodyAttributeMap } from 'aws-sdk/clients/sqs';

import { AWSConfig } from '../configs/aws.config';
import { EnvironmentConfig } from '../configs/environment.config';
import * as logger from "../services/helper/logger";

export function sendToStandardQueue(
    messageBody: EmailMessageBody,
    messageBodyAttributes: MessageBodyAttributeMap
): void {
    const params: SQS.Types.SendMessageRequest = {
        DelaySeconds: 10,
        MessageAttributes: messageBodyAttributes,
        MessageBody: JSON.stringify(messageBody),
        QueueUrl: EnvironmentConfig.AWS_SQS_QUEUE_EMAILS_URL
    };

    AWSConfig.sqs.sendMessage(params, (err, data) => {
        if (err) {
            logger.error("SQS(Standard) Error", err);
        } else {
            logger.info("SQS(Standard) Success", data.MessageId);
        }
    });
}

export function sendToFifoQueue(
    messageBody: EmailMessageBody,
    messageBodyAttributes: MessageBodyAttributeMap,
    deduplicationId: string,
    messageGroupId: string
): void {
    // TODO: come backto MessageGroupId: messageGroupId,
    const params: SQS.Types.SendMessageRequest = {
        MessageAttributes: messageBodyAttributes,
        MessageBody: JSON.stringify(messageBody),
        MessageDeduplicationId: deduplicationId.toString(),
        // MessageGroupId: messageGroupId,
        QueueUrl: EnvironmentConfig.AWS_SQS_QUEUE_EMAILS_URL
    };

    AWSConfig.sqs.sendMessage(params, (err, data) => {
        if (err) {
            logger.error("SQS(FIFO) Error", err);
        } else {
            logger.info("SQS(FIFO) Success", data.MessageId);
        }
    });
}