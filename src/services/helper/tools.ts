import { v4 as uuidv4 } from "uuid";
const bcrypt = require('bcrypt');

export function generateUUID(): string {
    return uuidv4();
}

export async function hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(6);
    const hashedValue = await bcrypt.hash(value, salt);

    return hashedValue;
}

export async function compareHash(value: string, hashedValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue);
}

export function generateCodeValue(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 6;
    let randomValue = "";

    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * characters.length);
        randomValue += characters[randomNum];
    }
    
    return randomValue;
}