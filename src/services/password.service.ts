import { NotFoundError } from "../dataobjects/helper/errors";
import { PasswordChangeRequest } from "../dataobjects/rest/request/passwordChange.request";
import { CodeEntity } from "../dataobjects/entities/code.entity";
import * as userData from "../data/user.data";
import * as codeData from "../data/code.data";
import * as tools from "./helper/tools";
import * as emailService from "./email.service";
import * as logger from "./helper/logger";

export async function passwordReset(username: string): Promise<void> {
    await userData.getOneByUsername(username)
        .then(async user => {
            await codeData.getOneByUserIdAndType(user.id!!, CodeEntity.PASSWORD_RESET)
                .then(existingCode => {
                    // we found an existing code, do nothing
                })
                .catch(async error => {
                    const code = new CodeEntity();
                    code.userId = user.id!!;
                    code.type = CodeEntity.PASSWORD_RESET;
                    
                    const savedCode = await codeData.save(code);

                    if (savedCode) {
                        emailService.passwordReset({
                            userId: user.id!!,
                            username: username,
                            code: savedCode.value
                        });
                    }
                })
        })
        .catch(error => {
            logger.error(`Password Reset error for username: ${username}`, error);
        });
}

export async function passwordChange(requestBody: PasswordChangeRequest) {
    const user = await userData.getOneByUsername(requestBody.username);

    const code = await codeData.getOneByUserIdAndType(user.id!!, CodeEntity.PASSWORD_RESET);

    if (code.value === requestBody.code.toUpperCase()) {
        user.password = await tools.hash(requestBody.password);
        
        await userData.update(user.id!!, user);

        await codeData.deleteOneById(code.id);

        emailService.passwordChanged({
            userId: user.id!!,
            username: user.username
        });
    } else {
        throw new NotFoundError(`Code: ${requestBody.code} not found`);
    }
}