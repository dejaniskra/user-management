import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import * as s3 from "../clients/s3.client";
import SendData = ManagedUpload.SendData;

export interface S3Key {
    key: string;
    etag: string;
}

export async function search(bucket: string, prefix: string): Promise<S3Key[]> {
    let keysList: S3Key[] = [];

    const objects = await s3.search(bucket, prefix);

    if (objects.Contents) {
        objects.Contents.forEach((item : any)=> {
            if (item.Key && item.ETag) {
                keysList.push({ etag: item.ETag, key: item.Key });
            }
        });
    }

    return keysList;
}

export async function save(bucket: string, file: Buffer, fileName: string): Promise<string> {
    const avatar = await s3.upload(bucket, fileName, file) as SendData;
    
    return avatar.Location;
}

export async function remove(bucket: string, fileName: string): Promise <void> {
    await s3.remove(bucket, fileName);
}