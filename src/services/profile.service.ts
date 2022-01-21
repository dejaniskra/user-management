import path from "path";
import { AlreadyExistsError, FeatureUnavailableError, ImageNotValidError, NotFoundError } from "../dataobjects/helper/errors";
import { ProfileEntity } from "../dataobjects/entities/profile.entity";
import { Address, ProfileResource, Social } from "../dataobjects/resources/profile.resource";
import { ProfileGetResponse } from "../dataobjects/rest/response/profileGet.response";
import { ProfileUpdateRequest } from "../dataobjects/rest/request/profileUpdate.request";
import { EnvironmentConfig } from "../configs/environment.config";
import * as profileData from "../data/profile.data";
import * as userData from "../data/user.data";
import * as fileService from "./file.service";

export async function getOneByUserId(userId: string): Promise<ProfileGetResponse> {
    const profile: ProfileEntity = await profileData.getOneByUserId(userId);

    return convertEntityToResource(profile);
}

export async function create(userId: string): Promise<void> {
    try {
        await profileData.getOneByUserId(userId);

        throw new AlreadyExistsError(`Profile for userId: ${userId} already exists`);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            try {
                await userData.getOneById(userId);

                const profile = new ProfileEntity();
                profile.userId = userId;
                
                await profileData.save(profile);
            } catch (error: any) {

                throw error;
            }
        } else {
            throw error;
        }
    }
}

export async function updateByUserId(userId: string, requestBody: ProfileUpdateRequest) {
    const existingProfile: ProfileEntity = await profileData.getOneByUserId(userId);
    
    if (requestBody.addresses && requestBody.addresses.length > 0) {
        requestBody.addresses.forEach((address) => {
            existingProfile.addresses.push({
                city: address.city ? address.city : null,
                country: address.country ? address.country : null,
                primary: address.primary ? address.primary : null,
                state: address.state ? address.state : null,
                street: address.street ? address.street : null,
                zip: address.zip ? address.zip : null
            });
        })
    }

    if (requestBody.persona) {
        existingProfile.persona = {
            dob: requestBody.persona.dob ? requestBody.persona.dob : null,
            ethnicity: requestBody.persona.ethnicity ? requestBody.persona.ethnicity : null,
            languages: requestBody.persona.languages ? requestBody.persona.languages : [],
            nationality: requestBody.persona.nationality ? requestBody.persona.nationality : null,
            preferredName: requestBody.persona.preferred_name ? requestBody.persona.preferred_name : null,
            prefix: requestBody.persona.prefix ? requestBody.persona.prefix : null,
            pronouns: requestBody.persona.pronouns ? requestBody.persona.pronouns : [],
            race: requestBody.persona.race ? requestBody.persona.race : null,
            gender: requestBody.persona.gender ? requestBody.persona.gender : null,
            suffix: requestBody.persona.suffix ? requestBody.persona.suffix : null
        }
    }

    if (requestBody.social) {
        existingProfile.social = {
            gaming: requestBody.social.gaming ? {
                nintendo: requestBody.social.gaming.nintendo ? requestBody.social.gaming.nintendo : null,
                origin: requestBody.social.gaming.origin ? requestBody.social.gaming.origin : null,
                playstation: requestBody.social.gaming.playstation ? requestBody.social.gaming.playstation : null,
                riot: requestBody.social.gaming.riot ? requestBody.social.gaming.riot : null,
                steam: requestBody.social.gaming.steam ? requestBody.social.gaming.steam : null,
                xbox: requestBody.social.gaming.xbox ? requestBody.social.gaming.xbox : null
            } : null,
            personal: requestBody.social.personal ? {
                facebook: requestBody.social.personal.facebook ? requestBody.social.personal.facebook : null,
                instagram: requestBody.social.personal.instagram ? requestBody.social.personal.instagram : null,
                portfolio: requestBody.social.personal.portfolio ? requestBody.social.personal.portfolio : null,
                tiktok: requestBody.social.personal.tiktok ? requestBody.social.personal.tiktok : null,
                twitter: requestBody.social.personal.twitter ? requestBody.social.personal.twitter : null
            } : null,
            professional: requestBody.social.professional ? {
                github: requestBody.social.professional.github ? requestBody.social.professional.github : null,
                linkedIn: requestBody.social.professional.linked_in ? requestBody.social.professional.linked_in : null
            } : null
        }
    }

    if (requestBody.work) {
        const jobs: any[] = [];

        if (requestBody.work.jobs && requestBody.work.jobs.length > 0) {
            requestBody.work.jobs.forEach((job) => {
                jobs.push({
                    occupation: job.occupation ? job.occupation : null,
                    company: job.company ? job.company : null,
                    location: job.location ? {
                        city: job.location.city ? job.location.city : null,
                        state: job.location.state ? job.location.state : null,
                        country: job.location.country ? job.location.country : null,
                        zip: job.location.zip ? job.location.zip : null
                    } : null
                });
            });
        }

        existingProfile.work = {
            looking: requestBody.work.looking ? requestBody.work.looking : null,
            jobs: jobs
        }
    }

    await profileData.update(existingProfile.id, existingProfile);
}

export async function updateAvatarByUserId(userId: string, file: any): Promise<void> {
    if (EnvironmentConfig.FLAG_AVATAR_ENABLED) {
        const avatar: Buffer = file.data;

        const extension = path.extname(file.name);
        const allowedExtension = ['.png', '.jpg', '.jpeg'];

        if (!allowedExtension.includes(extension)) {
            throw new ImageNotValidError(`Invalid image extension: ${extension}`);
        }

        const existingProfile: ProfileEntity = await profileData.getOneByUserId(userId);

        if (existingProfile.pictureUrl) {
            const picKeys = await fileService.search(EnvironmentConfig.PROFILE_BUCKET, `${existingProfile.id}-avatar-`);

            if (picKeys && picKeys.length > 0) {
                picKeys.forEach(async (item: fileService.S3Key) => {
                    await fileService.remove(EnvironmentConfig.PROFILE_BUCKET, item.key);
                });
            }
        }

        let date = new Date();
        const d = date.toISOString().trim().replace(/-/g, "").replace(/:/g, "");;
        const fileName = `${existingProfile.id}-avatar-${d}${extension}`;

        const avatarUrl = await fileService.save(EnvironmentConfig.PROFILE_BUCKET, avatar, fileName.trim());

        existingProfile.pictureUrl = avatarUrl;

        await profileData.update(existingProfile.id, existingProfile);
    } else {
        throw new FeatureUnavailableError("Feature currently turned off");
    }
}

export async function deleteAvatarByUserId(userId: string): Promise<void> {
    const existingProfile: ProfileEntity = await profileData.getOneByUserId(userId);

    if (existingProfile.pictureUrl) {
        const picKeys = await fileService.search(EnvironmentConfig.PROFILE_BUCKET, `${existingProfile.id}-avatar-`);
        
        if (picKeys && picKeys.length > 0) {
            picKeys.forEach(async (item: fileService.S3Key) => {
                await fileService.remove(EnvironmentConfig.PROFILE_BUCKET, item.key);
            });
        }
    }

    existingProfile.pictureUrl = null;

    await profileData.update(existingProfile.id, existingProfile);
}

export async function deleteByUserId(userId: string): Promise<void> {
    const existingProfile = await profileData.getOneByUserId(userId);

    await profileData.deleteOneById(existingProfile.id);
}

function convertEntityToResource(entity: ProfileEntity): ProfileResource {
    function convertPersona() {
        if (entity.persona) {
            return {
                preferred_name: entity.persona.preferredName,
                suffix: entity.persona.suffix,
                prefix: entity.persona.prefix,
                dob: entity.persona.dob,
                gender: entity.persona.gender,
                languages: entity.persona.languages,
                race: entity.persona.race,
                ethnicity: entity.persona.ethnicity,
                nationality: entity.persona.nationality,
                pronouns: entity.persona.pronouns
            }
        }

        return null;
    }

    function convertWork() {
        if (entity.work) {
            return {
                jobs: entity.work.jobs,
                looking: entity.work.looking
            }
        }

        return null;
    }

    function convertAddresses() {
        const convertedAddresses: Address[] = [];

        if (entity.addresses) {
        
            entity.addresses.forEach(address => {
                convertedAddresses.push({
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zip: address.zip,
                    country: address.country,
                    primary: address.primary
                });
            })
        }

        return convertedAddresses;
    }

    function convertSocial() {
        if (entity.social) {
            const social: Social = {
                personal: (entity.social.personal) ? {
                    facebook: entity.social.personal.facebook,
                    instagram: entity.social.personal.instagram,
                    portfolio: entity.social.personal.portfolio,
                    tiktok: entity.social.personal.tiktok,
                    twitter: entity.social.personal.twitter
                } : null,
                professional: (entity.social.professional) ? {
                    github: entity.social.professional.github,
                    linked_in: entity.social.professional.linkedIn
                } : null,
                gaming: (entity.social.gaming) ? {
                    nintendo: entity.social.gaming.nintendo,
                    origin: entity.social.gaming.origin,
                    playstation: entity.social.gaming.playstation,
                    riot: entity.social.gaming.riot,
                    steam: entity.social.gaming.steam,
                    xbox: entity.social.gaming.xbox
                } : null
            }

            return social;
        }

        return null;
    }

    let pictureUrl: string | null = entity.pictureUrl;
    if (process.env.NODE_ENV === "local" && pictureUrl) {
        pictureUrl = pictureUrl.replace("localstack", "localhost");
    }

    const resource: ProfileResource = {
        id: entity.id,
        user_id: entity.userId,
        picture_url: pictureUrl,
        persona: convertPersona(),
        work: convertWork(),
        addresses: convertAddresses(),
        social: convertSocial(),
        create_date: entity.createDate,
        update_date: entity.updateDate
    }

    return resource;
}