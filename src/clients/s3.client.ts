import { DeleteObjectOutput, ListObjectsV2Output } from "aws-sdk/clients/s3";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import { AWSConfig } from "../configs/aws.config";
import SendData = ManagedUpload.SendData;

export function search(bucket: string, prefix: string): Promise<any> {
    const params = {
        Bucket: bucket,
        Prefix: prefix
    };

    return new Promise((resolve, reject) => {
        AWSConfig.s3.listObjectsV2(params, function (err: Error, data: ListObjectsV2Output) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

export function upload(bucket: string, fileName: string, fileBuffer: Buffer): Promise<any> {
    const params = {
        Bucket: bucket,
        Key: fileName,
        Body: fileBuffer
    };

    return new Promise((resolve, reject) => {
        AWSConfig.s3.upload(params, function (err: Error, data: SendData) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

export function remove(bucket: string, fileName: string): Promise<any> {
    const params = {
        Bucket: bucket,
        Key: fileName
    };

    return new Promise((resolve, reject) => {
        AWSConfig.s3.deleteObject(params, function (err: Error, data: DeleteObjectOutput) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}