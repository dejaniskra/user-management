import { CodeEntity } from "../dataobjects/entities/code.entity";
import { NotFoundError } from "../dataobjects/helper/errors";
import { Code, CodeDocument } from "../dataobjects/models/code.model";
import * as codeRepository from "../data/database/code.repository";
import * as tools from "../services/helper/tools";

export async function getOneById(id: string): Promise<CodeEntity> {
    const code = await codeRepository.getOneById(id);

    if (code) {
        return CodeEntity.build(code);
    }

    throw new NotFoundError(`Code id: ${id} not found`);
}

export async function findByUserId(userId: string): Promise<CodeEntity[]> {
    let codes: CodeEntity[] = [];

    const results: CodeDocument[] = await codeRepository.findByUserId(userId);

    if (results && results.length > 0) {
        results.forEach((result: CodeDocument) => {
            codes.push(CodeEntity.build(result));
        })
    }

    return codes;
}

export async function getOneByUserIdAndType(userId: string, type: string): Promise<CodeEntity> {
    const code = await codeRepository.getOneByUserIdAndType(userId, type);

    if (code) {
        return CodeEntity.build(code);
    }

    throw new NotFoundError(`Code by userId: ${userId} not found`);
}

export async function save(entity: CodeEntity): Promise<CodeEntity> {
    const code: Code = convertEntityToCode(entity);
    code.value = tools.generateCodeValue();

    const savedDocument = await codeRepository.save(code);

    return CodeEntity.build(savedDocument);
}

export async function update(id: string, entity: CodeEntity): Promise<void> {
    const code: Code = convertEntityToCode(entity);
    code.updateDate = new Date();

    await codeRepository.update(id, code);
}

export async function deleteOneById(id: string): Promise<void> {
    await codeRepository.deleteOneById(id);
}

function convertEntityToCode(entity: CodeEntity): Code {
    const code: Code = {
        userId: entity.userId,
        type: entity.type,
        value: entity.value,
        expiration: entity.expiration
    };

    return code;
}