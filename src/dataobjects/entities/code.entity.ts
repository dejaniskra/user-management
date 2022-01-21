import { NotFoundError } from "../helper/errors";
import { CodeDocument } from "../models/code.model";

export class CodeEntity {
    public static EMAIL_VERIFICATION = "emailVerification";
    public static PASSWORD_RESET = "passwordReset";
    public static USERNAME_CHANGE = "usernameChange";

    id: string = "";
    userId: string = "";
    value: string = "";
    type: string = "";
    expiration: Date = new Date();
    createDate: Date | null = null;
    updateDate: Date | null = null;

    constructor() {}

    // build(document?: UserDocument, cachedData?: CachedDataClass) {
    static build(document?: CodeDocument): CodeEntity {
        if(document) {
            const code = new CodeEntity();
            code.id = document._id;
            code.userId = document.userId;
            code.type = document.type;
            code.value = document.value;
            code.expiration = document.expiration;

            if (document.createDate) {
                code.createDate = document.createDate;
            }
            
            if (document.updateDate) {
                code.updateDate = document.updateDate;
            }

            return code;
        }

        throw new NotFoundError("CodeDocument missing");
    }
}
