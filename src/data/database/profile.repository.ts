import { ProfileModel, ProfileDocument, Profile } from "../../dataobjects/models/profile.model";

export async function getOneById(id: string): Promise<ProfileDocument | null> {
    const document = await ProfileModel.findById(id);
    
    return document;
}

export async function getOneByUserId(userId: string): Promise<ProfileDocument | null> {
    const document = await ProfileModel.findOne({
        userId: userId
    });
    
    return document;
}

export async function save(profile: Profile): Promise<ProfileDocument> {
    const newProfile = new ProfileModel(profile);

    const savedProfile = await newProfile.save();

    return savedProfile;
}

export async function update(id: string, profle: Profile): Promise<void> {
    await ProfileModel.findByIdAndUpdate(id, profle);
}

export async function deleteOneById(id: string): Promise<void> {
    await ProfileModel.findByIdAndDelete(id);
}