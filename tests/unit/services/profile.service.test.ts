jest.mock("../../../src/data/user.data");
jest.mock("../../../src/data/profile.data");
jest.mock("../../../src/services/file.service");
jest.mock("path");
import path from "path";
import * as userData from "../../../src/data/user.data";
import * as profileData from "../../../src/data/profile.data";
import * as profileService from "../../../src/services/profile.service";
import * as fileService from "../../../src/services/file.service";
import { ProfileEntity } from "../../../src/dataobjects/entities/profile.entity";
import { NotFoundError } from "../../../src/dataobjects/helper/errors";
import { UserEntity } from "../../../src/dataobjects/entities/user.entity";
import { EnvironmentConfig } from "../../../src/configs/environment.config";

const profileEntity = new ProfileEntity();
const userEntity = new UserEntity();

beforeEach(() => {
    jest.resetAllMocks();

    EnvironmentConfig.FLAG_AVATAR_ENABLED = true;

    userEntity.id = "id";
    userEntity.firstName = "firstName";
    userEntity.lastName = "lastName";
    userEntity.password = "password";
    userEntity.username = "username";
    userEntity.verified = false;
    userEntity.createDate = new Date("2022-01-01");
    userEntity.updateDate = userEntity.createDate;

    profileEntity.id = "id";
    profileEntity.userId = "userId";
    profileEntity.pictureUrl = "url";
    profileEntity.addresses = [
        {
            street: "313 Eminem St.",
            city: "Detroit",
            state: "MI",
            country: "USA",
            zip: "48222",
            primary: true
        }
    ];
    profileEntity.persona = {
        dob: "12/16/1990",
        ethnicity: "Macedonian",
        gender: "gender",
        languages: ["English", "Macedonian"],
        nationality: "Merican",
        preferredName: "Alex",
        prefix: "prefix",
        pronouns: ["he/his/goat"],
        race: "white",
        suffix: "suffix"
    };
    profileEntity.work = {
        looking: true,
        jobs: [{
            company: "Self LLC",
            location: {
                city: "Clawson",
                state: "MI",
                zip: "48017",
                country: "USA"
            },
            occupation: "Reeses`s farmer"
        }]
    };
    profileEntity.social = {
        gaming: {
            nintendo: "nintendo",
            origin: "origin",
            playstation: "playstation",
            riot: "riot",
            steam: "steam",
            xbox: "xbox"
        },
        personal: {
            facebook: "facebook",
            instagram: "instagram",
            portfolio: "portfolio",
            tiktok: "tiktok",
            twitter: "twitter"
        },
        professional: {
            github: "github",
            linkedIn: "linkedin"
        }
    };
    profileEntity.createDate = new Date("2022-01-01");
    profileEntity.updateDate = profileEntity.createDate;
});

describe('profile.service.getOneByUserId', () => {
    test('success', async () => {
        const profileGetOneByIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockReturnValue(Promise.resolve(profileEntity));
        
        const profile = await profileService.getOneByUserId("userId");
        
        expect(profile).toEqual({
            id: profileEntity.id,
            user_id: profileEntity.userId,
            addresses: [{
                city: profileEntity.addresses[0].city,
                country: profileEntity.addresses[0].country,
                primary: profileEntity.addresses[0].primary,
                state: profileEntity.addresses[0].state,
                street: profileEntity.addresses[0].street,
                zip: profileEntity.addresses[0].zip
            }],
            create_date: profileEntity.createDate,
            update_date: profileEntity.updateDate,
            persona: {
                dob: profileEntity.persona?.dob,
                ethnicity: profileEntity.persona?.ethnicity,
                gender: profileEntity.persona?.gender,
                languages: profileEntity.persona?.languages,
                nationality: profileEntity.persona?.nationality,
                preferred_name: profileEntity.persona?.preferredName,
                prefix: profileEntity.persona?.prefix,
                pronouns: profileEntity.persona?.pronouns,
                race: profileEntity.persona?.race,
                suffix: profileEntity.persona?.suffix
            },
            picture_url: profileEntity.pictureUrl,
            social: {
                gaming: {
                    nintendo: profileEntity.social?.gaming?.nintendo,
                    origin: profileEntity.social?.gaming?.origin,
                    playstation: profileEntity.social?.gaming?.playstation,
                    riot: profileEntity.social?.gaming?.riot,
                    steam: profileEntity.social?.gaming?.steam,
                    xbox: profileEntity.social?.gaming?.xbox
                },
                personal: {
                    facebook: profileEntity.social?.personal?.facebook,
                    instagram: profileEntity.social?.personal?.instagram,
                    portfolio: profileEntity.social?.personal?.portfolio,
                    tiktok: profileEntity.social?.personal?.tiktok,
                    twitter: profileEntity.social?.personal?.twitter
                },
                professional: {
                    github: profileEntity.social?.professional?.github,
                    linked_in: profileEntity.social?.professional?.linkedIn
                }
            },
            work: {
                looking: profileEntity.work?.looking,
                jobs: [{
                    company: profileEntity.work?.jobs[0]?.company,
                    location: {
                        city: profileEntity.work?.jobs[0]?.location?.city,
                        country: profileEntity.work?.jobs[0]?.location?.country,
                        state: profileEntity.work?.jobs[0]?.location?.state,
                        zip: profileEntity.work?.jobs[0]?.location?.zip
                    },
                    occupation: profileEntity.work?.jobs[0]?.occupation
                }]
            }
        });

        expect(profileGetOneByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const profileGetOneByIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));
        
        await expect(profileService.getOneByUserId("userId")).rejects.toMatchObject({
            message: "Profile by userId: userId not found",
            name: "NotFoundError"
        });

        expect(profileGetOneByIdSpy).toHaveBeenCalledTimes(1);
    });
});

describe('profile.service.create', () => {
    test('success', async () => {
        const profileGetOneByUsernameSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));

        const userSaveSpy = jest
            .spyOn(userData, "getOneById")
            .mockReturnValue(Promise.resolve(userEntity));
        
        const profileSaveSpy = jest
            .spyOn(profileData, "save")
            .mockReturnValue(Promise.resolve(profileEntity));

        await profileService.create("userId");

        expect(profileGetOneByUsernameSpy).toHaveBeenCalledTimes(1);
        expect(userSaveSpy).toHaveBeenCalledTimes(1);
        expect(profileSaveSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const profileGetOneByIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));

        const userSaveSpy = jest
            .spyOn(userData, "getOneById")
            .mockRejectedValueOnce(new NotFoundError("User id: userId not found"));

        await expect(profileService.create("userId")).rejects.toMatchObject({
            message: "User id: userId not found",
            name: "NotFoundError"
        });
        
        expect(profileGetOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(userSaveSpy).toHaveBeenCalledTimes(1);
    });

    test('already exists', async () => {
        const profileGetOneByIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockReturnValue(Promise.resolve(profileEntity));

        await expect(profileService.create("userId")).rejects.toMatchObject({
            message: "Profile for userId: userId already exists",
            name: "AlreadyExistsError"
        });

        expect(profileGetOneByIdSpy).toHaveBeenCalledTimes(1);
    });
});

describe('profile.service.updateByUserId', () => {
    test('success', async () => {
        const profileGetOneByUserIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockReturnValue(Promise.resolve(profileEntity));

        const profileUpdateSpy = jest
            .spyOn(profileData, "update")
            .mockReturnValue(Promise.resolve());

        await profileService.updateByUserId("userId", {
            addresses: [{
                street: "58/32 Partizanska",
                city: "Bitola",
                state: "LA",
                country: "USA",
                zip: "70000",
                primary: false,
            }],
            persona: {
                dob: "12/13/1990",
                ethnicity: "bruv",
                gender: "goat",
                languages: ["Serbian"],
                nationality: "Macedonian",
                preferred_name: "Bob",
                prefix: "preeefix",
                pronouns: ["bruv/bro/broski"],
                race: "hwite",
                suffix: "suffffix"
            },
            social: {
                gaming: {
                    nintendo: "nintendox",
                    origin: "originx",
                    playstation: "playstationx",
                    riot: "riotx",
                    steam: "steamx",
                    xbox: "xboxx"
                },
                personal: {
                    facebook: "facebookx",
                    instagram: "instagramx",
                    portfolio: "portfoliox",
                    tiktok: "tiktok",
                    twitter: "twitter"
                },
                professional: {
                    github: "githubx",
                    linked_in: "linkedin"
                }
            },
            work: {
                jobs: [{
                    company: "CookieLLC",
                    location: {
                        city: "Home",
                        country: "USA",
                        state: "MI",
                        zip: "48017"
                    },
                    occupation: "Taster"
                }],
                looking: false
            }
        });

        expect(profileGetOneByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(profileUpdateSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const profileGetOneByIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));
        
        const profileUpdateSpy = jest
            .spyOn(profileData, "update")
            .mockReturnValue(Promise.resolve());

        await expect(profileService.updateByUserId("userId", {})).rejects.toMatchObject({
            message: "Profile by userId: userId not found",
            name: "NotFoundError"
        });

        expect(profileGetOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(profileUpdateSpy).toHaveBeenCalledTimes(0);
    });
});

describe('profile.service.deleteByUserId', () => {
    test('success', async () => {
        const profileGetOneByUserIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockReturnValue(Promise.resolve(profileEntity));

        const profileDeleteOneByIdSpy = jest
            .spyOn(profileData, "deleteOneById")
            .mockReturnValue(Promise.resolve());
        
        await profileService.deleteByUserId("userId");

        expect(profileGetOneByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(profileDeleteOneByIdSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const profileGetOneByIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));

        const profileDeleteOneByIdSpy = jest
            .spyOn(profileData, "deleteOneById")
            .mockReturnValue(Promise.resolve());

        await expect(profileService.deleteByUserId("userId")).rejects.toMatchObject({
            message: "Profile by userId: userId not found",
            name: "NotFoundError"
        });

        expect(profileGetOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(profileDeleteOneByIdSpy).toHaveBeenCalledTimes(0);
    });
});

describe('profile.service.updateAvatarByUserId', () => {
    test('success', async () => {
        const pathSpy = jest
            .spyOn(path, "extname")
            .mockReturnValue(".png");
        
        const profileGetOneByUserIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockReturnValue(Promise.resolve(profileEntity));
        
        const fileSearchSpy = jest
            .spyOn(fileService, "search")
            .mockReturnValue(Promise.resolve([{ key: "key", etag: "etag" }]));

        const fileRemoveSpy = jest
            .spyOn(fileService, "remove")
            .mockReturnValue(Promise.resolve());
        
        const fileSaveSpy = jest
            .spyOn(fileService, "save")
            .mockReturnValue(Promise.resolve("newUrl"));
        
        const profileUpdateSpy = jest.
            spyOn(profileData, "update")
            .mockReturnValue(Promise.resolve());
        
        const file: any = {
            data: "pixels"
        };

        await profileService.updateAvatarByUserId("userId", file);

        expect(pathSpy).toHaveBeenCalledTimes(1);
        expect(profileGetOneByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(fileSearchSpy).toHaveBeenCalledTimes(1);
        expect(fileRemoveSpy).toHaveBeenCalledTimes(1);
        expect(fileSaveSpy).toHaveBeenCalledTimes(1);
        expect(profileUpdateSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const pathSpy = jest
            .spyOn(path, "extname")
            .mockReturnValue(".png");
        
        const profileGetOneByUserIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));

        const fileSearchSpy = jest
            .spyOn(fileService, "search")
            .mockReturnValue(Promise.resolve([{ key: "key", etag: "etag" }]));

        const fileRemoveSpy = jest
            .spyOn(fileService, "remove")
            .mockReturnValue(Promise.resolve());

        const fileSaveSpy = jest
            .spyOn(fileService, "save")
            .mockReturnValue(Promise.resolve("newUrl"));

        const profileUpdateSpy = jest.
            spyOn(profileData, "update")
            .mockReturnValue(Promise.resolve());

        const file: any = {
            data: "pixels"
        };

        await expect(profileService.updateAvatarByUserId("userId", file)).rejects.toMatchObject({
            message: "Profile by userId: userId not found",
            name: "NotFoundError"
        });

        expect(pathSpy).toHaveBeenCalledTimes(1);
        expect(profileGetOneByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(fileSearchSpy).toHaveBeenCalledTimes(0);
        expect(fileRemoveSpy).toHaveBeenCalledTimes(0);
        expect(fileSaveSpy).toHaveBeenCalledTimes(0);
        expect(profileUpdateSpy).toHaveBeenCalledTimes(0);
        
    });

    test('image not valid', async () => {
        const pathSpy = jest
            .spyOn(path, "extname")
            .mockReturnValue(".svg");

        const profileGetOneByUserIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));

        const fileSearchSpy = jest
            .spyOn(fileService, "search")
            .mockReturnValue(Promise.resolve([{ key: "key", etag: "etag" }]));

        const fileRemoveSpy = jest
            .spyOn(fileService, "remove")
            .mockReturnValue(Promise.resolve());

        const fileSaveSpy = jest
            .spyOn(fileService, "save")
            .mockReturnValue(Promise.resolve("newUrl"));

        const profileUpdateSpy = jest.
            spyOn(profileData, "update")
            .mockReturnValue(Promise.resolve());

        const file: any = {
            data: "pixels"
        };

        await expect(profileService.updateAvatarByUserId("userId", file)).rejects.toMatchObject({
            message: "Invalid image extension: .svg",
            name: "ImageNotValidError"
        });

        expect(pathSpy).toHaveBeenCalledTimes(1);
        expect(profileGetOneByUserIdSpy).toHaveBeenCalledTimes(0);
        expect(fileSearchSpy).toHaveBeenCalledTimes(0);
        expect(fileRemoveSpy).toHaveBeenCalledTimes(0);
        expect(fileSaveSpy).toHaveBeenCalledTimes(0);
        expect(profileUpdateSpy).toHaveBeenCalledTimes(0);

    });

    test('feature unavailable', async () => {
        EnvironmentConfig.FLAG_AVATAR_ENABLED = false;

        const pathSpy = jest
            .spyOn(path, "extname")
            .mockReturnValue(".png");

        const profileGetOneByUserIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));

        const fileSearchSpy = jest
            .spyOn(fileService, "search")
            .mockReturnValue(Promise.resolve([{ key: "key", etag: "etag" }]));

        const fileRemoveSpy = jest
            .spyOn(fileService, "remove")
            .mockReturnValue(Promise.resolve());

        const fileSaveSpy = jest
            .spyOn(fileService, "save")
            .mockReturnValue(Promise.resolve("newUrl"));

        const profileUpdateSpy = jest.
            spyOn(profileData, "update")
            .mockReturnValue(Promise.resolve());

        const file: any = {
            data: "pixels"
        };

        await expect(profileService.updateAvatarByUserId("userId", file)).rejects.toMatchObject({
            message: "Feature currently turned off",
            name: "FeatureUnavailableError"
        });

        expect(pathSpy).toHaveBeenCalledTimes(0);
        expect(profileGetOneByUserIdSpy).toHaveBeenCalledTimes(0);
        expect(fileSearchSpy).toHaveBeenCalledTimes(0);
        expect(fileRemoveSpy).toHaveBeenCalledTimes(0);
        expect(fileSaveSpy).toHaveBeenCalledTimes(0);
        expect(profileUpdateSpy).toHaveBeenCalledTimes(0);

    });
});

describe('profile.service.deleteAvatarByUserId', () => {
    test('success', async () => {
        const profileGetOneByUserIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockReturnValue(Promise.resolve(profileEntity));

        const fileSearchSpy = jest
            .spyOn(fileService, "search")
            .mockReturnValue(Promise.resolve([{ key: "key", etag: "etag" }]));
        
        const fileRemoveSpy = jest
            .spyOn(fileService, "remove")
            .mockReturnValue(Promise.resolve());
        
        const profileUpdateSpy = jest
            .spyOn(profileData, "update")
            .mockReturnValue(Promise.resolve());
        
        await profileService.deleteAvatarByUserId("userId");
        
        expect(profileGetOneByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(fileSearchSpy).toHaveBeenCalledTimes(1);
        expect(fileRemoveSpy).toHaveBeenCalledTimes(1);
        expect(profileUpdateSpy).toHaveBeenCalledTimes(1);
    });

    test('not found', async () => {
        const profileGetOneByUserIdSpy = jest
            .spyOn(profileData, "getOneByUserId")
            .mockRejectedValueOnce(new NotFoundError("Profile by userId: userId not found"));

        const fileSearchSpy = jest
            .spyOn(fileService, "search")
            .mockReturnValue(Promise.resolve([{ key: "key", etag: "etag" }]));

        const fileRemoveSpy = jest
            .spyOn(fileService, "remove")
            .mockReturnValue(Promise.resolve());

        const profileUpdateSpy = jest
            .spyOn(profileData, "update")
            .mockReturnValue(Promise.resolve());

        await expect(profileService.deleteAvatarByUserId("userId")).rejects.toMatchObject({
            message: "Profile by userId: userId not found",
            name: "NotFoundError"
        });

        expect(profileGetOneByUserIdSpy).toHaveBeenCalledTimes(1);
        expect(fileSearchSpy).toHaveBeenCalledTimes(0);
        expect(fileRemoveSpy).toHaveBeenCalledTimes(0);
        expect(profileUpdateSpy).toHaveBeenCalledTimes(0);
    });
});