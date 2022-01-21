import { UserModel, UserDocument, User } from "../../dataobjects/models/user.model";

export async function getOneById(id: string): Promise<UserDocument | null> {
    const document = await UserModel.findById(id);
    
    return document;
}

export async function getOneByUsername(username: string): Promise<UserDocument | null> {
    const document = await UserModel.findOne({
        username: username
    });
    
    return document;
}

export async function search(searchParameters: UserSearchParameters): Promise<UserDocument[]> {
    let users: UserDocument[] = [];
    
    if (searchParameters.username) {
        const documents: UserDocument[] = await UserModel.find({
            username: searchParameters.username
        });

        users = documents;
    } else if (searchParameters.firstName && searchParameters.lastName) {
        const documents: UserDocument[] = await UserModel.find({
            firstName: searchParameters.firstName,
            lastName: searchParameters.lastName
        });

        users = documents;
    } else if (searchParameters.firstName) {
        const documents: UserDocument[] = await UserModel.find({
            firstName: searchParameters.firstName,
        });

        users = documents;
    } else if (searchParameters.lastName) {
        const documents: UserDocument[] = await UserModel.find({
            lastName: searchParameters.lastName,
        });

        users = documents;
    }

    return users;
}

export async function save(user: User): Promise<UserDocument> {
    const newUser = new UserModel(user);

    const savedUser = await newUser.save();

    return savedUser;
}

export async function update(id: string, user: User): Promise<void> {
    await UserModel.findByIdAndUpdate(id, user);
}

export async function deleteOneById(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
}