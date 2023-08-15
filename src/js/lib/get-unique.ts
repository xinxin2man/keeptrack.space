
/**
 * Returns a new array with unique elements from the input array.
 * @param arr The input array to get unique elements from.
 * @returns A new array with unique elements from the input array.
 */
export const getUnique = (arr: Array<any>): Array<any> => [...new Set(arr)];
