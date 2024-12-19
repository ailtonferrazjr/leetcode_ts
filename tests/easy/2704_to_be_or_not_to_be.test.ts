import { toBeOrNotToBe } from "@easy/2704_to_be_or_not_to_be.js";

describe('2704 - toBeOrNotToBe', () => {
    
    describe('toBeMethod', () => {
        test('should return true when values are equal', () => {
            expect(toBeOrNotToBe(5).toBe(5)).toBe(true);
        });

        test('should throw erro when values are not equal', () => {
            expect( () => toBeOrNotToBe(5).toBe(6)).toThrow("Not Equal");
        });
    })

    describe('notToBeMethod', () => {
        test('should return true when values are not equal', () => {
            expect(toBeOrNotToBe(5).notToBe(6)).toBe(true);
        });

        test('should throw the error "Equal" when the values are equal', () => {
            expect( () => toBeOrNotToBe(5).notToBe(5)).toThrow("Equal");
        })
    })



})