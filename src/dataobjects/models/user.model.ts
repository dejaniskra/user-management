import { model, Schema } from "mongoose";

export interface User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    verified: boolean;
    createDate?: Date;
    updateDate?: Date;
}

export interface UserDocument extends User, Document {
    _id: string;
 }

const UserSchema = new Schema<UserDocument>({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: false,
        required: true
    },
    firstName: {
        type: String,
        unique: false,
        required: true
    },
    lastName: {
        type: String,
        unique: false,
        required: true
    },
    verified: {
        type: Boolean,
        unique: false,
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

export const UserModel = model<UserDocument>('users', UserSchema);
