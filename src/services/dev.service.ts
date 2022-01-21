import { CodeEntity } from "../dataobjects/entities/code.entity";
import * as userData from "../data/user.data";
import * as codeData from "../data/code.data";

export async function getCodesByUserId(userId: string): Promise<CodeEntity[]> {
    await userData.getOneById(userId);

    const codes: CodeEntity[] = await codeData.findByUserId(userId);

    return codes;
}

export async function deleteCodeById(codeId: string): Promise<void> {
    const code = await codeData.getOneById(codeId);
    
    await codeData.deleteOneById(codeId);
}