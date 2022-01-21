export interface Persona {
    preferred_name: string | null;
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

export interface Location {
    city: string | null;
    state: string | null;
    country: string | null;
    zip: string | null;
}

export interface Job {
    occupation: string | null;
    company: string | null;
    location: Location | null;
}

export interface Work {
    jobs: Job[];
    looking: boolean | null;
}

export interface Address {
    street: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zip: string | null;
    primary: boolean | null;
}

export interface Personal {
    portfolio: string | null;
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    tiktok: string | null;
}

export interface Professional {
    github: string | null;
    linked_in: string | null;
}

export interface Gaming {
    steam: string | null;
    riot: string | null;
    origin: string | null;
    playstation: string | null;
    xbox: string | null;
    nintendo: string | null;
}

export interface Social {
    personal: Personal | null;
    professional: Professional | null;
    gaming: Gaming | null;
}

export interface ProfileResource {
    id: string;
    user_id: string;
    picture_url: string | null;
    persona: Persona | null;
    work: Work | null;
    addresses: Address[];
    social: Social | null;
    create_date: Date | null;
    update_date: Date | null;
}