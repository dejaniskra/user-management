import { model, Schema } from "mongoose";

export interface Profile {
    userId: string;
    pictureUrl?: string | null;
    persona?: {
        preferredName?: string;
        suffix?: string;
        prefix?: string;
        dob?: string;
        sex?: string;
        languages?: string[];
        race?: string;
        ethnicity?: string;
        nationality?: string;
        pronouns?: string[];
    };
    work?: {
        jobs: {
            occupation?: string;
            company?: string;
            location?: {
                city?: string;
                state?: string;
                country?: string;
                zip?: string;
            };
        }[];
        looking?: boolean;
    };
    addresses?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zip?: string;
        primary?: boolean;
    }[];
    social?: {
        personal?: {
            portfolio?: string;
            facebook?: string;
            twitter?: string;
            instagram?: string;
            tiktok?: string;
        };
        professional?: {
            github?: string;
            linkedIn?: string;
        };
        gaming?: {
            steam?: string;
            riot?: string;
            origin?: string;
            playstation?: string;
            xbox?: string;
            nintendo?: string;
        }
    };
    createDate?: Date;
    updateDate?: Date;
}

export interface ProfileDocument extends Profile, Document {
    _id: string;
 }

const ProfileSchema = new Schema<ProfileDocument>({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    pictureUrl: {
        type: String,
        unique: false,
        required: false,
    },
    persona: {
        type: {
            preferredName: {
                type: String,
                unique: false,
                required: false
            },
            suffix: {
                type: String,
                unique: false,
                required: false
            },
            prefix: {
                type: String,
                unique: false,
                required: false
            },
            dob: {
                type: String,
                unique: false,
                required: false
            },
            sex: {
                type: String,
                unique: false,
                required: false
            },
            languages: {
                type: Array,
                unique: false,
                required: false
            },
            race: {
                type: String,
                unique: false,
                required: false
            },
            ethnicity: {
                type: String,
                unique: false,
                required: false
            },
            nationality: {
                type: String,
                unique: false,
                required: false
            },
            pronouns: {
                type: Array,
                unique: false,
                required: false
            }
        },
        unique: false,
        required: false
    },
    work: {
        type: {
            jobs: {
                type: Array,
                unique: false,
                required: false
            },
            looking: {
                type: Boolean,
                unique: false,
                required: false
            }
        },
        unique: false,
        required: false
    },
    addresses: {
        type: Array,
        unique: false,
        required: false
    },
    social: {
        type: {
            personal: {
                type: {
                    portfolio: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    facebook: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    twitter: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    instagram: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    tiktok: {
                        type: String,
                        unique: false,
                        required: false
                    }
                },
                unique: false,
                required: false
            },
            professional: {
                type: {
                    github: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    linkedIn: {
                        type: String,
                        unique: false,
                        required: false
                    }
                },
                unique: false,
                required: false
            },
            gaming: {
                type: {
                    steam: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    riot: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    origin: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    playstation: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    xbox: {
                        type: String,
                        unique: false,
                        required: false
                    },
                    nintendo: {
                        type: String,
                        unique: false,
                        required: false
                    }
                },
                unique: false,
                required: false
            }
        },
        unique: false,
        required: false
    },
    createDate: {
        type: Date,
        default: new Date(),
        required: false
    },
    updateDate: {
        type: Date,
        default: new Date(),
        required: false
    }
});

export const ProfileModel = model<ProfileDocument>('profiles', ProfileSchema);
