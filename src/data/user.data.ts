import { UserEntity } from "../dataobjects/entities/user.entity";
import { NotFoundError } from "../dataobjects/helper/errors";
import { User, UserDocument } from '../dataobjects/models/user.model';
import * as userRepository from "./database/user.repository";

export async function getOneById(id: string): Promise<UserEntity> {
    const user = await userRepository.getOneById(id);

    if (user) {
        return UserEntity.build(user);
    }

    throw new NotFoundError(`User id: ${id} not found`);
}

export async function getOneByUsername(username: string): Promise<UserEntity> {
    const user = await userRepository.getOneByUsername(username);

    if (user) {
        return UserEntity.build(user);
    }

    throw new NotFoundError(`${username} not found`);
}

export async function search(searchParameters: UserSearchParameters): Promise<UserEntity[]> {
    let users: UserEntity[] = [];

    const results: UserDocument[] = await userRepository.search(searchParameters);

    if (results && results.length > 0) {
        results.forEach((result: UserDocument) => {
            users.push(UserEntity.build(result));
        })
    }

    return users;
}

export async function save(entity: UserEntity): Promise<UserEntity> {
    const user: User = convertEntityToUser(entity);

    const savedDocument = await userRepository.save(user);

    return UserEntity.build(savedDocument);
}

export async function update(id: string, entity: UserEntity): Promise<void> {
    const user: User = convertEntityToUser(entity);
    user.updateDate = new Date();
    
    await userRepository.update(id, user);
}

export async function deleteOneById(id: string): Promise<void> {
    await userRepository.deleteOneById(id);
}

function convertEntityToUser(entity: UserEntity): User {
    const user: User = {
        username: entity.username,
        password: entity.password,
        firstName: entity.firstName,
        lastName: entity.lastName,
        verified: entity.verified
    };

    return user;
}