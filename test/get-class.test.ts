import * as keepTrackApi from '../src/js/keepTrackApi';
import { getClass } from './../src/js/lib/get-class';

// Generated by CodiumAI

/*
Code Analysis

Objective:
The objective of the `getClass` function is to retrieve all the elements in the DOM that have a specific class name and return them as an array of HTMLElements. If no elements are found, it will return an empty array. If the function is being executed in a Jest environment, it will create an empty DIV element with the specified class name and return it as an array.

Inputs:
- `id`: a string representing the class name of the elements to be retrieved.

Flow:
1. Retrieve all the elements in the DOM that have the specified class name using `document.getElementsByClassName`.
2. If elements are found, return them as an array of HTMLElements.
3. If no elements are found, check if the function is being executed in a Jest environment using `isThisNode`.
4. If it is, create an empty DIV element with the specified class name, append it to the document body, and return it as an array of HTMLElements.
5. If it is not, return an empty array.
6. If an error is thrown, it will be caught by the caller of the function.

Outputs:
- An array of HTMLElements that have the specified class name.
- An empty array if no elements are found or if the function is not being executed in a Jest environment.

Additional aspects:
- If the function is being executed in a Jest environment, it will create an empty DIV element with the specified class name and append it to the document body. This is a hack and tests should provide the right environment instead.
- The function uses `Array.from` to convert the result of `document.getElementsByClassName` to an array of HTMLElements.
*/

describe('getClass', () => {

    // Tests that the function returns an array of HTMLElements when given a valid id
    it('test_returns_array_of_elements', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const result = getClass('test');
        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(HTMLElement);
    });

    // Tests that the function returns an empty array when no elements with the given id are found
    it('test_returns_empty_array_when_no_elements_found', () => {
        jest.spyOn(keepTrackApi, 'isThisNode').mockReturnValueOnce(false);
        document.body.innerHTML = '';
        const result = getClass('test');
        expect(result).toHaveLength(0);
    });

    // Tests that the function returns an empty array when given an empty string as id
    it('test_returns_empty_array_when_given_empty_string', () => {
        jest.spyOn(keepTrackApi, 'isThisNode').mockReturnValueOnce(false);
        document.body.innerHTML = '';
        const result = getClass('');
        expect(result).toHaveLength(0);
    });

    // Tests that the function returns an empty array when no elements with the given id are found and not running in Jest environment
    it('test_returns_empty_array_when_no_elements_found_and_not_running_in_jest', () => {
        jest.spyOn(keepTrackApi, 'isThisNode').mockReturnValueOnce(false);
        document.body.innerHTML = '';
        const result = getClass('test');
        expect(result).toHaveLength(0);
    });

    // Tests that the function returns a single-element array containing an empty div when no elements with the given id are found and running in Jest environment
    it('test_returns_single_element_array_containing_empty_div_when_no_elements_found_and_running_in_jest', () => {
        jest.spyOn(keepTrackApi, 'isThisNode').mockReturnValueOnce(true);
        document.body.innerHTML = '';
        const result = getClass('test');
        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(HTMLDivElement);
        expect(result[0].id).toBe('test');
    });

    // Tests that the function returns an empty array when given a bad value
    it('test_returns_empty_array_when_given_bad_value', () => {
        jest.spyOn(keepTrackApi, 'isThisNode').mockReturnValueOnce(false);
        const result = getClass(<any>1);
        expect(result).toStrictEqual([]);
    });
});
