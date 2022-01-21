import { ExpiredError, NotFoundError } from "../dataobjects/helper/errors";
import { PasswordChangeRequest } from "../dataobjects/rest/request/passwordChange.request";
import { CodeEntity } from "../dataobjects/entities/code.entity";
import * as userData from "../data/user.data";
import * as codeData from "../data/code.data";
import * as tools from "./helper/tools";
import * as emailService from "./email.service";
import * as logger from "./helper/logger";
import { EnvironmentConfig } from "../configs/environment.config";

export async function passwordReset(username: string): Promise<void> {
    await userData.getOneByUsername(username)
        .then(async user => {
            await codeData.getOneByUserIdAndType(user.id!!, CodeEntity.PASSWORD_RESET)
                .then(existingCode => {
                    // we found an existing code, do nothing
                })
                .catch(async error => {
                    const codeEntity = new CodeEntity();
                    codeEntity.userId = user.id!!;
                    codeEntity.type = CodeEntity.PASSWORD_RESET;
                    codeEntity.expiration = tools.addMinutesToDate(new Date(), EnvironmentConfig.CODE_EXPIRATION);
                    
                    const savedCode = await codeData.save(codeEntity);

                    if (savedCode) {
                        emailService.passwordReset({
                            userId: user.id!!,
                            username: username,
                            code: savedCode.value,
                            expiration: savedCode.expiration
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

    if (code.expiration < new Date()) {
        // expired
        await codeData.deleteOneById(code.id);

        throw new ExpiredError("Code has expired")
    } else if (code.value === requestBody.code.toUpperCase()) {
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