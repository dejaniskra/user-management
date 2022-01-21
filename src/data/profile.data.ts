import { ProfileEntity } from "../dataobjects/entities/profile.entity";
import { NotFoundError } from "../dataobjects/helper/errors";
import { Profile } from "../dataobjects/models/profile.model";
import * as profileRepository from "./database/profile.repository";

export async function getOneById(id: string): Promise<ProfileEntity> {
    const profile = await profileRepository.getOneById(id);

    if (profile) {
        return ProfileEntity.build(profile);
    }

    throw new NotFoundError(`Profile id: ${id} not found`);
}

export async function getOneByUserId(userId: string): Promise<ProfileEntity> {
    const profile = await profileRepository.getOneByUserId(userId);

    if (profile) {
        return ProfileEntity.build(profile);
    }

    throw new NotFoundError(`Profile by userId: ${userId} not found`);
}

export async function save(entity: ProfileEntity): Promise<ProfileEntity> {
    const profile = convertEntityToProfile(entity);
    
    const savedProfile = await profileRepository.save(profile);

    return ProfileEntity.build(savedProfile);
}

export async function update(id: string, entity: ProfileEntity): Promise<void> {
    const profile = convertEntityToProfile(entity);
    profile.updateDate = new Date();

    await profileRepository.update(id, profile);
}

export async function deleteOneById(id: string): Promise<void> {
    await profileRepository.deleteOneById(id);
}

function convertEntityToProfile(entity: ProfileEntity): Profile {
    const addresses: any[] = [];
    if (entity.addresses && entity.addresses.length > 0) {
        entity.addresses.forEach((address) => {
            addresses.push({
                city: address.city ? address.city : undefined,
                country: address.country ? address.country : undefined,
                primary: address.primary ? address.primary : undefined,
                state: address.state ? address.state : undefined,
                street: address.street ? address.street : undefined,
                zip: address.zip ? address.zip : undefined
            });
        })
    }

    const jobs: any[] = [];

    if (entity.work) {
        if (entity.work.jobs && entity.work.jobs.length > 0) {
            entity.work.jobs.forEach((job) => {
                jobs.push({
                    occupation: job.occupation ? job.occupation : undefined,
                    company: job.company ? job.company : undefined,
                    location: job.location ? {
                        city: job.location.city ? job.location.city : undefined,
                        state: job.location.state ? job.location.state : undefined,
                        country: job.location.country ? job.location.country : undefined,
                        zip: job.location.zip ? job.location.zip : undefined
                    } : undefined
                });
            });
        }
    }

    const profile: Profile = {
        userId: entity.userId,
        addresses: addresses,
        persona: entity.persona ? {
            preferredName: entity.persona.preferredName ? entity.persona.preferredName : undefined,
            dob: entity.persona.dob ? entity.persona.dob : undefined,
            ethnicity: entity.persona.ethnicity ? entity.persona.ethnicity : undefined,
            languages: entity.persona.languages ? entity.persona.languages : [],
            nationality: entity.persona.nationality ? entity.persona.nationality : undefined,
            prefix: entity.persona.prefix ? entity.persona.prefix : undefined,
            pronouns: entity.persona.pronouns ? entity.persona.pronouns : undefined,
            race: entity.persona.race ? entity.persona.race : undefined,
            gender: entity.persona.gender ? entity.persona.gender : undefined,
            suffix: entity.persona.suffix ? entity.persona.suffix : undefined
        } : undefined,
        pictureUrl: entity.pictureUrl ? entity.pictureUrl : null,
        social: entity.social ? {
            personal: entity.social.personal ? {
                facebook: entity.social.personal.facebook ? entity.social.personal.facebook : undefined,
                instagram: entity.social.personal.instagram ? entity.social.personal.instagram : undefined,
                portfolio: entity.social.personal.portfolio ? entity.social.personal.portfolio : undefined,
                tiktok: entity.social.personal.tiktok ? entity.social.personal.tiktok : undefined,
                twitter: entity.social.personal.twitter ? entity.social.personal.twitter : undefined
            } : undefined,
            professional: entity.social.professional ? {
                github: entity.social.professional.github ? entity.social.professional.github : undefined,
                linkedIn: entity.social.professional.linkedIn ? entity.social.professional.linkedIn : undefined
            } : undefined,
            gaming: entity.social.gaming ? {
                nintendo: entity.social.gaming.nintendo ? entity.social.gaming.nintendo : undefined,
                origin: entity.social.gaming.origin ? entity.social.gaming.origin : undefined,
                playstation: entity.social.gaming.playstation ? entity.social.gaming.playstation : undefined,
                riot: entity.social.gaming.riot ? entity.social.gaming.riot : undefined,
                steam: entity.social.gaming.steam ? entity.social.gaming.steam : undefined,
                xbox: entity.social.gaming.xbox ? entity.social.gaming.xbox : undefined
            } : undefined
        } : undefined,
        work: entity.work ? {
            looking: entity.work.looking ? entity.work.looking : undefined,
            jobs: jobs
        } : undefined
    }

    return profile;
}