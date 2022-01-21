import * as tools from "../../../../src/services/helper/tools";

function isAlphaNumeric(value: string) {
    return value.match(/^[0-9A-Z]+$/) !== null;
}

describe('tools.generateUUID', () => {
    test('success', () => {
        const uuid = tools.generateUUID();

        expect(typeof uuid).toEqual("string");
        expect(uuid.length).toBe(36);
    });
});

describe('tools.generateCodeValue', () => {
    test('success', () => {
        const code = tools.generateCodeValue();

        expect(typeof code).toEqual("string");
        expect(code.length).toBe(6);
        expect(isAlphaNumeric(code)).toBe(true);
    });
});