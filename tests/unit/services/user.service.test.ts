jest.mock("../../../src/data/user.data");
jest.mock("../../../src/data/code.data");
jest.mock("../../../src/services/profile.service");
jest.mock("../../../src/services/profile.service");
jest.mock("../../../src/services/email.service");

import * as userService from "../../../src/services/user.service";
import * as profileService from "../../../src/services/profile.service";
import * as emailService from "../../../src/services/email.service";
import * as tools from "../../../src/services/helper/tools";
import * as userData from "../../../src/data/user.data";
import * as codeData from "../../../src/data/code.data";
import { UserEntity } from "../../../src/dataobjects/entities/user.entity";
import { NotFoundError } from "../../../src/dataobjects/helper/errors";
import { EnvironmentConfig } from "../../../src/configs/environment.config";
import { CodeEntity } from "../../../src/dataobjects/entities/code.entity";

const userEntity = new UserEntity();
const codeEntity = new CodeEntity();

beforeEach(() => {
    jest.resetAllMocks();

    userEntity.id = "id";
    userEntity.firstName = "firstName";
    userEntity.lastName = "lastName";
    userEntity.password = "password";
    userEntity.username = "username";
    userEntity.verified = false;
    userEntity.createDate = new Date("2022-01-01");
    userEntity.updateDate = userEntity.createDate;

    codeEntity.id = "id";
    codeEntity.userId = "id";
    codeEntity.type = CodeEntity.EMAIL_VERIFICATION;
    codeEntity.value = "DW3QQE";
    codeEntity.expiration = tools.addMinutesToDate(new Date(), 15);
    codeEntity.createDate = new Date("2022-01-01");
    codeEntity.updateDate = codeEntity.createDate;
});

describe('user.service.getOneById', () => {
    test('success', async () => {
        const userGetOneByIdSpy = jest
            .spyOn(userData, "getOneById")
            .mockReturnValue(Promise.resolve(userEntity));

        const user = await userService.getOneById("id");
        
        expect(user).toEqual({
            id: userEntity.id,
            username: userEntity.username,
            first_name: userEntity.firstName,
            last_name: userEntity.lastName,
            verified: userEntity.verified,
            create_date: userEntity.createDate,
            update_date: userEntity.updateDate
        });

        expect(userGetOneByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const userGetOneByIdSpy = jest
            .spyOn(userData, "getOneById")
            .mockRejectedValueOnce(new NotFoundError("User id: id not found"));
        
        await expect(userService.getOneById("id")).rejects.toMatchObject({
            message: "User id: id not found",
            name: "NotFoundError"
        });

        expect(userGetOneByIdSpy).toHaveBeenCalledTimes(1);
    });
});

describe('user.service.getOneByUsername', () => {
    test('success', async () => {
        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockReturnValue(Promise.resolve(userEntity));

        const user = await userService.getOneByUsername("username");

        expect(user).toEqual({
            id: userEntity.id,
            username: userEntity.username,
            first_name: userEntity.firstName,
            last_name: userEntity.lastName,
            verified: userEntity.verified,
            create_date: userEntity.createDate,
            update_date: userEntity.updateDate
        });

        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockRejectedValueOnce(new NotFoundError("username not found"));

        await expect(userService.getOneByUsername("id")).rejects.toMatchObject({
            message: "username not found",
            name: "NotFoundError"
        });

        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
    });
});

describe('user.service.search', () => {
    test('success - with results', async () => {
        const userSearchSpy = jest
            .spyOn(userData, "search")
            .mockReturnValue(Promise.resolve([userEntity]));

        const users = await userService.search({
            firstName: "firstName",
            lastName: "lastName"
        });

        expect(users).toEqual([{
            id: userEntity.id,
            username: userEntity.username,
            first_name: userEntity.firstName,
            last_name: userEntity.lastName,
            verified: userEntity.verified,
            create_date: userEntity.createDate,
            update_date: userEntity.updateDate
        }]);

        expect(userSearchSpy).toHaveBeenCalledTimes(1);
    });

    test('success - with no results', async () => {
        const userSearchSpy = jest
            .spyOn(userData, "search")
            .mockReturnValue(Promise.resolve([]));

        const users = await userService.search({
            firstName: "firstName",
            lastName: "lastName"
        });

        expect(users).toEqual([]);
        expect(userSearchSpy).toHaveBeenCalledTimes(1);
    });
});

describe('user.service.create', () => {
    test('success - with email verification and profile initialization turned off', async () => {
        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockRejectedValueOnce(new NotFoundError("username not found"));
        
        const userSaveSpy = jest
            .spyOn(userData, "save")
            .mockReturnValue(Promise.resolve(userEntity));

        const user = await userService.create({
            first_name: userEntity.firstName,
            last_name: userEntity.lastName,
            password: userEntity.password,
            username: userEntity.username
        });

        expect(user).toEqual({ id: userEntity.id });
        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
        expect(userSaveSpy).toHaveBeenCalledTimes(1);
    });

    test('success - with email verification and profile initialization turned on', async () => {
        EnvironmentConfig.FLAG_EMAIL_VERIFICATION_ENABLED = true;
        EnvironmentConfig.AUTO_INITIALIZE_PROFILE = true;

        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockRejectedValueOnce(new NotFoundError("username not found"));

        const userSaveSpy = jest
            .spyOn(userData, "save")
            .mockReturnValue(Promise.resolve(userEntity));
        
        const codeSaveSpy = jest
            .spyOn(codeData, "save")
            .mockReturnValue(Promise.resolve(codeEntity));
        
        const profileCreateSpy = jest
            .spyOn(profileService, "create")
            .mockReturnValue(Promise.resolve());
                
        const user = await userService.create({
            first_name: userEntity.firstName,
            last_name: userEntity.lastName,
            password: userEntity.password,
            username: userEntity.username
        });

        expect(user).toEqual({ id: userEntity.id });
        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
        expect(userSaveSpy).toHaveBeenCalledTimes(1);
        expect(codeSaveSpy).toHaveBeenCalledTimes(1);
        expect(profileCreateSpy).toHaveBeenCalledTimes(1);
    });

    test('already exists', async () => {
        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockReturnValue(Promise.resolve(userEntity));

        await expect(userService.create({
            first_name: userEntity.firstName,
            last_name: userEntity.lastName,
            password: userEntity.password,
            username: userEntity.username
        })).rejects.toThrow({
            message: "Username username already exists",
            name: "AlreadyExistsError"
        });

        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
    });
});

describe('user.service.updateById', () => {
    test('success - full update', async () => {
        const userGetOneByIdSpy = jest
            .spyOn(userData, "getOneById")
            .mockReturnValue(Promise.resolve(userEntity));
        
        const userUpdateSpy = jest
            .spyOn(userData, "update")
            .mockReturnValue(Promise.resolve());

        const codeGetOneByUserIdAndTypeSpy = jest
            .spyOn(codeData, "getOneByUserIdAndType")
            .mockReturnValue(Promise.resolve(codeEntity));

        const codeDeleteOneByIdSpy = jest
            .spyOn(codeData, "deleteOneById")
            .mockReturnValue(Promise.resolve());
        
        
        await userService.updateById("id", {
            first_name: "Bob",
            last_name: "Smith",
            verified: true
        });

        expect(userGetOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(userUpdateSpy).toHaveBeenCalledTimes(1);
        expect(codeGetOneByUserIdAndTypeSpy).toHaveBeenCalledTimes(1);
        expect(codeDeleteOneByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('success - partial update', async () => {
        const userGetOneByIdSpy = jest
            .spyOn(userData, "getOneById")
            .mockReturnValue(Promise.resolve(userEntity));

        const userUpdateSpy = jest
            .spyOn(userData, "update")
            .mockReturnValue(Promise.resolve());

        const codeGetOneByUserIdAndTypeSpy = jest
            .spyOn(codeData, "getOneByUserIdAndType")
            .mockReturnValue(Promise.resolve(codeEntity));

        const codeDeleteOneByIdSpy = jest
            .spyOn(codeData, "deleteOneById")
            .mockReturnValue(Promise.resolve());


        await userService.updateById("id", {
            first_name: "Bob",
            last_name: "Smith",
            verified: false
        });

        expect(userGetOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(userUpdateSpy).toHaveBeenCalledTimes(1);
        expect(codeGetOneByUserIdAndTypeSpy).toHaveBeenCalledTimes(0);
        expect(codeDeleteOneByIdSpy).toHaveBeenCalledTimes(0);
    });

    test('not found', async () => {
        const userGetOneByIdSpy = jest
            .spyOn(userData, "getOneById")
            .mockRejectedValueOnce(new NotFoundError("User id: id not found"));

        await expect(userService.updateById("id", {
            first_name: "Bob",
            last_name: "Smith",
            verified: false
        })).rejects.toMatchObject({
            message: "User id: id not found",
            name: "NotFoundError"
        }); 

        expect(userGetOneByIdSpy).toHaveBeenCalledTimes(1);
    });
});

describe('user.service.deleteById', () => {
    test('success - full', async () => {
        const userGetOneByIdSpy = jest
            .spyOn(userData, "getOneById")
            .mockReturnValue(Promise.resolve(userEntity));

        const profileDeleteByUserIdSpy = jest
            .spyOn(profileService, "deleteByUserId")
            .mockReturnValue(Promise.resolve());
        
        const codeFindByUserIdSpy = jest
            .spyOn(codeData, "findByUserId")
            .mockReturnValue(Promise.resolve([codeEntity]));
        
        const codeDeleteOneByIdSpy = jest
            .spyOn(codeData, "deleteOneById")
            .mockReturnValue(Promise.resolve());
        
        const userDeleteOneByIdSpy = jest
            .spyOn(userData, "deleteOneById")
            .mockReturnValue(Promise.resolve());

        await userService.deleteById("id");

        expect(userGetOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(profileDeleteByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(codeFindByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(codeDeleteOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(userDeleteOneByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('success - lite', async () => {
        const userGetOneByIdSpy = jest
            .spyOn(userData, "getOneById")
            .mockReturnValue(Promise.resolve(userEntity));

        const profileDeleteByUserIdSpy = jest
            .spyOn(profileService, "deleteByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: id not found"));

        const codeFindByUserIdSpy = jest
            .spyOn(codeData, "findByUserId")
            .mockReturnValue(Promise.resolve([]));

        const userDeleteOneByIdSpy = jest
            .spyOn(userData, "deleteOneById")
            .mockReturnValue(Promise.resolve());

        await userService.deleteById("id");

        expect(userGetOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(profileDeleteByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(codeFindByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(userDeleteOneByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const userGetOneByIdSpy = jest
            .spyOn(userData, "getOneById")
            .mockRejectedValueOnce(new NotFoundError("User id: id not found"));

        await expect(userService.deleteById("id")).rejects.toMatchObject({
            message: "User id: id not found",
            name: "NotFoundError"
        });

        expect(userGetOneByIdSpy).toHaveBeenCalledTimes(1);
    });
});

describe('user.service.requestEmailVerification', () => {
    test('success - not verified', async () => {
        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockReturnValue(Promise.resolve(userEntity));

        const codeGetOneByUserIdAndTypeSpy = jest
            .spyOn(codeData, "getOneByUserIdAndType")
            .mockReturnValue(Promise.resolve(codeEntity));
        
        const emailRequestAccountVerificationSpy = jest
            .spyOn(emailService, "requestAccountVerification")
            .mockReturnValue();

        await userService.requestEmailVerification("username");

        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
        expect(codeGetOneByUserIdAndTypeSpy).toHaveBeenCalledTimes(1);
        expect(emailRequestAccountVerificationSpy).toHaveBeenCalledTimes(1);
    });

    test('success - verified', async () => {
        userEntity.verified = true;

        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockReturnValue(Promise.resolve(userEntity));

        const codeGetOneByUserIdAndTypeSPy = jest
            .spyOn(codeData, "getOneByUserIdAndType")
            .mockReturnValue(Promise.resolve(codeEntity));

        const emailRequestAccountVerificationSpy = jest
            .spyOn(emailService, "requestAccountVerification")
            .mockReturnValue();

        await userService.requestEmailVerification("username");

        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
        expect(codeGetOneByUserIdAndTypeSPy).toHaveBeenCalledTimes(0);
        expect(emailRequestAccountVerificationSpy).toHaveBeenCalledTimes(0);
    });

    test('not found', async () => {
        const userGetOneByUsername = jest
            .spyOn(userData, "getOneByUsername")
            .mockRejectedValueOnce(new NotFoundError("username not found"));

        await userService.requestEmailVerification("username");

        expect(userGetOneByUsername).toHaveBeenCalledTimes(1);
    });
});

describe('user.service.submitEmailVerification', () => {
    test('success - not verified', async () => {
        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockReturnValue(Promise.resolve(userEntity));

        const codeGetOneByUserIdAndTypeSpy = jest
            .spyOn(codeData, "getOneByUserIdAndType")
            .mockReturnValue(Promise.resolve(codeEntity));

        const userUpdateSpy = jest
            .spyOn(userData, "update")
            .mockReturnValue(Promise.resolve());
        
        const codeDeleteOneByIdSpy = jest
            .spyOn(codeData, "deleteOneById")
            .mockReturnValue(Promise.resolve());
        
        const emailAccountVerificationCompletedSpy = jest
            .spyOn(emailService, "accountVerificationCompleted")
            .mockReturnValue();

        await userService.submitEmailVerification({
            username: "username",
            code: codeEntity.value
        });

        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
        expect(codeGetOneByUserIdAndTypeSpy).toHaveBeenCalledTimes(1);
        expect(userUpdateSpy).toHaveBeenCalledTimes(1);
        expect(codeDeleteOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(emailAccountVerificationCompletedSpy).toHaveBeenCalledTimes(1);
    });

    test('success - verified', async () => {
        userEntity.verified = true;

        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockReturnValue(Promise.resolve(userEntity));

        const codeGetOneByUserIdAndTypeSpy = jest
            .spyOn(codeData, "getOneByUserIdAndType")
            .mockReturnValue(Promise.resolve(codeEntity));

        const userUpdateSpy = jest
            .spyOn(userData, "update")
            .mockReturnValue(Promise.resolve());

        const codeDeleteOneByIdSpy = jest
            .spyOn(codeData, "deleteOneById")
            .mockReturnValue(Promise.resolve());

        const emailAccountVerificationCompletedSpy = jest
            .spyOn(emailService, "accountVerificationCompleted")
            .mockReturnValue();

        await userService.submitEmailVerification({
            username: "username",
            code: codeEntity.value
        });

        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
        expect(codeGetOneByUserIdAndTypeSpy).toHaveBeenCalledTimes(0);
        expect(userUpdateSpy).toHaveBeenCalledTimes(0);
        expect(codeDeleteOneByIdSpy).toHaveBeenCalledTimes(0);
        expect(emailAccountVerificationCompletedSpy).toHaveBeenCalledTimes(0);
    });

    test('not found', async () => {
        const userGetOneByUsernameSpy = jest
            .spyOn(userData, "getOneByUsername")
            .mockRejectedValueOnce(new NotFoundError("username not found"));

        await expect(userService.submitEmailVerification({
            username: "username",
            code: codeEntity.value
        })).rejects.toMatchObject({
            message: "username not found",
            name: "NotFoundError"
        });

        expect(userGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
    });
});