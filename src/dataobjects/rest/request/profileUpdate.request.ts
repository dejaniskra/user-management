interface Persona {
    preferred_name?: string;
    suffix?: string;
    prefix?: string;
    dob?: string;
    gender?: string;
    languages?: string[];
    race?: string;
    ethnicity?: string;
    nationality?: string;
    pronouns?: string[];
}

interface Location {
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
}

interface Job {
    occupation?: string;
    company?: string;
    location?: Location;
}

interface Work {
    jobs?: Job[];
    looking?: boolean;
}

interface Address {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    primary?: boolean;
}

interface PersonalSocial {
    portfolio?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
}

interface ProfessionalSocial {
    github?: string;
    linked_in?: string;
}

interface GamingSocial {
    steam?: string;
    riot?: string;
    origin?: string;
    playstation?: string;
    xbox?: string;
    nintendo?: string;
}

interface Social {
    personal?: PersonalSocial;
    professional?: ProfessionalSocial;
    gaming?: GamingSocial;
}

export interface ProfileUpdateRequest {
    persona?: Persona;
    work?: Work;
    addresses?: Address[];
    social?: Social;
}