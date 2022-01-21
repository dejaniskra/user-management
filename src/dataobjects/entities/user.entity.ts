import { NotFoundError } from "../helper/errors";
import { UserDocument } from "../models/user.model";

export class UserEntity {
    id?: string;
    username: string = "";
    password: string = "";
    firstName: string = "";
    lastName: string = "";
    verified: boolean = false;
    createDate: Date | null = null;
    updateDate: Date | null = null;

    constructor() {}

    // build(document?: UserDocument, cachedData?: CachedDataClass) {
    static build(document?: UserDocument): UserEntity {
        if(document) {
            const user = new UserEntity();
            user.id = document._id;
            user.username = document.username;
            user.password = document.password;
            user.firstName = document.firstName;
            user.lastName = document.lastName;
            user.verified = document.verified;

            if (document.createDate) {
                user.createDate = document.createDate;
            }
            
            if (document.updateDate) {
                user.updateDate = document.updateDate;
            }

            return user;
        }

        throw new NotFoundError("UserDocument missing");
    }
}
