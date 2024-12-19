// Problem - 2704 - To Be or Not To Be

// Write a function expect that helps developers test their code. 
// It should take in any value val and return an object with the following two functions.
// toBe(val) accepts another value and returns true if the two values === each other. 
// If they are not equal, it should throw an error "Not Equal".
// notToBe(val) accepts another value and returns true if the two values !== each other. 
// If they are equal, it should throw an error "Equal".

// Link: https://leetcode.com/problems/to-be-or-not-to-be

export const toBeOrNotToBe = (val: unknown) => {

    // Throw Error constant
    const throwError = (errorStr: string) => {
        throw new Error(errorStr);
    }

    // Return the functions
    return {
        toBe: (val2: unknown) => val2 === val || throwError("Not Equal"),
        notToBe: (val2: unknown) => val2 !== val || throwError("Equal")
    };
};


