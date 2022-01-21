import { UserCreateRequest } from "../dataobjects/rest/request/userCreate.request";
import { UserVerifyRequest } from "../dataobjects/rest/request/userVerify.request";
import { UserEntity } from '../dataobjects/entities/user.entity';
import { CodeEntity } from "../dataobjects/entities/code.entity";
import { UserResource } from "../dataobjects/resources/user.resource";
import { AlreadyExistsError, NotFoundError } from "../dataobjects/helper/errors";
import { UserCreateResponse } from "../dataobjects/rest/response/userCreate.response";
import { UserGetResponse } from "../dataobjects/rest/response/userGet.response";
import { UserUpdateRequest } from "../dataobjects/rest/request/userUpdate.request";
import { EnvironmentConfig } from "../configs/environment.config";
import * as userData from "../data/user.data";
import * as codeData from "../data/code.data";
import * as tools from "./helper/tools";
import * as emailService from "./email.service";
import * as profileService from "./profile.service";
import * as logger from "./helper/logger";

export async function getOneById(id: string): Promise<UserGetResponse> {
    const user: UserEntity = await userData.getOneById(id);

    return convertEntityToResource(user);
}

export async function getOneByUsername(username: string): Promise<UserGetResponse> {
    const user: UserEntity = await userData.getOneByUsername(username);

    return convertEntityToResource(user);
}

export async function search(searchParameters: UserSearchParameters): Promise<UserGetResponse[]> {
    let users: UserGetResponse[] = [];

    const results = await userData.search(searchParameters);

    results.forEach((result: UserEntity) => {
        users.push(convertEntityToResource(result));
    });

    return users;
}

export async function create(requestBody: UserCreateRequest): Promise<UserCreateResponse> {
    try {
        await userData.getOneByUsername(requestBody.username);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            const userEntity = new UserEntity();
            userEntity.firstName = requestBody.first_name;
            userEntity.lastName = requestBody.last_name;
            userEntity.username = requestBody.username;
            userEntity.password = await tools.hash(requestBody.password);
            userEntity.verified = false;

            const savedUser = await userData.save(userEntity);

            if (EnvironmentConfig.FLAG_EMAIL_VERIFICATION_ENABLED) {
                const codeEntity = new CodeEntity();
                codeEntity.type = CodeEntity.EMAIL_VERIFICATION;
                codeEntity.userId = savedUser.id!!;
                
                const savedCode = await codeData.save(codeEntity);

                if (savedCode) {
                    emailService.requestAccountVerification({
                        userId: savedUser.id!!,
                        username: requestBody.username,
                        code: savedCode.value
                    });   
                }
            }

            if (EnvironmentConfig.AUTO_INITIALIZE_PROFILE) {
                await profileService.create(savedUser.id!!);
            }

            return { id: savedUser.id!!};
        }

        throw error;
    }

    throw new AlreadyExistsError(`Username ${requestBody.username} already exists`);
}

export async function updateById(id: string, requestBody: UserUpdateRequest): Promise<void> {
    const user = await userData.getOneById(id);

    if (requestBody.verified != undefined && requestBody.verified === true && user.verified === false) {
        codeData.getOneByUserIdAndType(user.id!!, CodeEntity.EMAIL_VERIFICATION)
            .then(code => {
                codeData.deleteOneById(code.id);
            })
            .catch(error => { });
    }
    user.firstName = requestBody.first_name ? requestBody.first_name : user.firstName;
    user.lastName = requestBody.last_name ? requestBody.last_name : user.lastName;
    user.verified = requestBody.verified ? requestBody.verified : user.verified;

    await userData.update(id, user);
}

export async function deleteById(id: string): Promise<void> {
    const user = await userData.getOneById(id);

    await profileService.deleteByUserId(user.id!!).catch(error => {});
    
    await codeData.findByUserId(user.id!!)
        .then(async codes => {
            if (codes && codes.length > 0) {
                codes.forEach(async code => {
                    await codeData.deleteOneById(code.id);
                })
            }
        })
        .catch(error => { });
    
    await userData.deleteOneById(id)
        .then(() => {
            logger.info(`Deleted user: ${user.username}`)
        })
        .catch(error => {
            logger.error(`Failed to delete user: ${user.username}`);
        });
}

export async function requestEmailVerification(username: string): Promise<void> {
    await userData.getOneByUsername(username)
        .then(async user => {
            if (!user.verified) {
                await codeData.getOneByUserIdAndType(user.id!!, CodeEntity.EMAIL_VERIFICATION)
                    .then(existingCode => {
                        emailService.requestAccountVerification({
                            userId: user.id!!,
                            username: username
                        });
                    })
                    .catch(async error => {
                        logger.error(`No Email Verification Code found for username: ${username}`, error);
                    })   
            }
        })
        .catch(error => {
            logger.error(`Email Verification Request error for username: ${username}`, error);
        });
}

export async function submitEmailVerification(requestBody: UserVerifyRequest): Promise<void> {
    const user = await userData.getOneByUsername(requestBody.username);

    if (!user.verified) {
        const code = await codeData.getOneByUserIdAndType(user.id!!, CodeEntity.EMAIL_VERIFICATION);

        if (code.value === requestBody.code.toUpperCase()) {
            user.verified = true;

            await userData.update(user.id!!, user);

            await codeData.deleteOneById(code.id);

            emailService.accountVerificationCompleted({
                userId: user.id!!,
                username: user.username
            })
        }   
    }
}

function convertEntityToResource(entity: UserEntity) {
    const resource: UserResource = {
        id: entity.id!!,
        username: entity.username,
        first_name: entity.firstName,
        last_name: entity.lastName,
        verified: entity.verified,
        create_date: entity.createDate,
        update_date: entity.updateDate
    }

    return resource;
}