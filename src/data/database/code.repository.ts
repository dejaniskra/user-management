import { CodeModel, CodeDocument, Code } from "../../dataobjects/models/code.model";

export async function getOneById(id: string): Promise<CodeDocument | null> {
    const document = await CodeModel.findById(id);
    
    return document;
}

export async function findByUserId(userId: string): Promise<CodeDocument[]> {
    const documents: CodeDocument[] = await CodeModel.find({
        userId: userId
    });

    return documents;
}

export async function getOneByUserIdAndType(userId: string, type: string): Promise<CodeDocument | null> {
    const document: CodeDocument | null = await CodeModel.findOne({
        userId: userId,
        type: type
    });

    return document;
}

export async function save(code: Code): Promise<CodeDocument> {
    const newCode = new CodeModel(code);

    const savedCode = await newCode.save();

    return savedCode;
}

export async function update(id: string, code: Code): Promise<void> {
    await CodeModel.findByIdAndUpdate(id, code);
}

export async function deleteOneById(id: string): Promise<void> {
    await CodeModel.findByIdAndDelete(id);
}