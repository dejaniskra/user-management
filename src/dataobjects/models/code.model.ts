import { model, Schema } from "mongoose";

export interface Code {
    userId: string;
    value: string;
    type: string;
    expiration: Date;
    createDate?: Date;
    updateDate?: Date;
}

export interface CodeDocument extends Code, Document {
    _id: string;
 }

const CodeSchema = new Schema<CodeDocument>({
    userId: {
        type: String,
        unique: false,
        required: true
    },
    value: {
        type: String,
        unique: false,
        required: true
    },
    type: {
        type: String,
        unique: false,
        required: true
    },
    expiration: {
        type: Date,
        default: new Date(),
        required: true
    },
    createDate: {
        type: Date,
        default: new Date(),
        required: false
    },
    updateDate: {
        type: Date,
        default: new Date(),
        required: false
    }
});

export const CodeModel = model<CodeDocument>('codes', CodeSchema);
