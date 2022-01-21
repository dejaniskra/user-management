import { NotFoundError } from "../helper/errors";
import { ProfileDocument } from "../models/profile.model";

interface Persona {
    preferredName: string | null;
    suffix: string | null;
    prefix: string | null;
    dob: string | null;
    gender: string | null;
    languages: string[];
    race: string | null;
    ethnicity: string | null;
    nationality: string | null;
    pronouns: string[];
}

interface Location {
    city: string | null;
    state: string | null;
    country: string | null;
    zip: string | null;
}

interface Job {
    occupation: string | null;
    company: string | null;
    location: Location | null;
}

interface Work {
    jobs: Job[];
    looking: boolean | null;
}

interface Address {
    street: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zip: string | null;
    primary: boolean | null;
}

interface PersonalSocial {
    portfolio: string | null;
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    tiktok: string | null;
}

interface ProfessionalSocial {
    github: string | null;
    linkedIn: string | null;
}

interface GamingSocial {
    steam: string | null;
    riot: string | null;
    origin: string | null;
    playstation: string | null;
    xbox: string | null;
    nintendo: string | null;
}

interface Social {
    personal: PersonalSocial | null;
    professional: ProfessionalSocial | null;
    gaming: GamingSocial | null;
}

export class ProfileEntity {
    id: string = "";
    userId: string = "";
    pictureUrl: string | null = null;
    persona: Persona | null = null;
    work: Work | null = null;
    addresses: Address[] = [];
    social: Social | null = null;
    createDate: Date | null = null;
    updateDate: Date | null = null;

    static build(document?: ProfileDocument): ProfileEntity {
        if(document) {
            const profile = new ProfileEntity();
            profile.id = document._id;
            profile.userId = document.userId;
            if (document.pictureUrl) {
                profile.pictureUrl = document.pictureUrl;
            }

            if (document.persona) {
                const persona: Persona = {
                    dob: document.persona.dob ? document.persona.dob : null,
                    ethnicity: document.persona.ethnicity ? document.persona.ethnicity : null,
                    nationality: document.persona.nationality ? document.persona.nationality : null,
                    preferredName: document.persona.preferredName ? document.persona.preferredName : null,
                    race: document.persona.race ? document.persona.race : null,
                    gender: document.persona.gender ? document.persona.gender : null,
                    suffix: document.persona.suffix ? document.persona.suffix : null,
                    prefix: document.persona.prefix ? document.persona.prefix : null,
                    languages: document.persona.languages ? document.persona.languages : [],
                    pronouns: document.persona.pronouns ? document.persona.pronouns : []
                }

                profile.persona = persona;
            }
            
            if (document.work) {
                const jobs: Job[] = [];

                if (document.work.jobs) {
                    document.work.jobs.forEach((job) => {
                        const newJob: Job = {
                            company: job.company ? job.company : null,
                            occupation: job.occupation ? job.occupation : null,
                            location: null
                        }

                        if (job.location) {
                            newJob.location = {
                                city: job.location.city ? job.location.city : null,
                                state: job.location.state ? job.location.state : null,
                                country: job.location.country ? job.location.country : null,
                                zip: job.location.zip ? job.location.zip : null
                            }
                        }

                        jobs.push(newJob);
                    })
                }

                const work: Work = {
                    looking: document.work.looking ? document.work.looking : null,
                    jobs: document.work.jobs ? jobs : []
                }

                profile.work = work;
            }
            
            if (document.addresses) {
                const addresses: Address[] = [];

                document.addresses.forEach((address) => {
                    addresses.push({
                        city: address.city ? address.city : null,
                        country: address.country ? address.country : null,
                        primary: address.primary ? address.primary : null,
                        state: address.state ? address.state : null,
                        street: address.street ? address.street : null,
                        zip: address.zip ? address.zip : null
                    });
                })

                profile.addresses = addresses;
            }
            
            if (document.social) {
                const social: Social = {
                    gaming: document.social.gaming ? {
                        nintendo: document.social.gaming.nintendo ? document.social.gaming.nintendo : null,
                        origin: document.social.gaming.origin ? document.social.gaming.origin : null,
                        playstation: document.social.gaming.playstation ? document.social.gaming.playstation : null,
                        riot: document.social.gaming.riot ? document.social.gaming.riot : null,
                        steam: document.social.gaming.steam ? document.social.gaming.steam : null,
                        xbox: document.social.gaming.xbox ? document.social.gaming.xbox : null,
                    } : null,
                    personal: document.social.personal ? {
                        facebook: document.social.personal.facebook ? document.social.personal.facebook : null,
                        instagram: document.social.personal.instagram ? document.social.personal.instagram : null,
                        portfolio: document.social.personal.portfolio ? document.social.personal.portfolio : null,
                        tiktok: document.social.personal.tiktok ? document.social.personal.tiktok : null,
                        twitter: document.social.personal.twitter ? document.social.personal.twitter : null,
                    } : null,
                    professional: document.social.professional ? {
                        github: document.social.professional.github ? document.social.professional.github : null,
                        linkedIn: document.social.professional.linkedIn ? document.social.professional.linkedIn : null
                    } : null
                }

                profile.social = social;
            }
            
            if (document.createDate) {
                profile.createDate = document.createDate;
            }

            if (document.updateDate) {
                profile.updateDate = document.updateDate;
            }

            return profile;
        }

        throw new NotFoundError("ProfileDocument missing");
    }
}
