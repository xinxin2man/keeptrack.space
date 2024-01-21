import { SpaceObjectType, spaceObjType2Str } from 'ootk';

// Generated by CodiumAI

/*
Code Analysis

Objective:
The objective of the spaceObjType2Str function is to convert a SpaceObjectType enum value into its corresponding string representation.

Inputs:
- spaceObjType: a SpaceObjectType enum value representing the type of a space object.

Flow:
1. The function takes a SpaceObjectType enum value as input.
2. It looks up the corresponding string representation of the enum value in the spaceObjTypeToStr object.
3. If the lookup is successful, the function returns the string representation. Otherwise, it returns 'Unknown'.

Outputs:
- A string representing the input SpaceObjectType enum value.

Additional aspects:
- The function uses an object (spaceObjTypeToStr) to map SpaceObjectType enum values to their string representations.
- If the input SpaceObjectType enum value is not found in the spaceObjTypeToStr object, the function returns 'Unknown'.
- The function is exported and can be used by other modules.
*/

describe('spaceObjType2Str_function', () => {
  // Tests that spaceObjType2Str returns the expected string for SpaceObjectType.PAYLOAD
  it('test_happy_path_payload', () => {
    expect(spaceObjType2Str(SpaceObjectType.PAYLOAD)).toEqual('Payload');
  });

  // Tests that spaceObjType2Str returns the expected string for SpaceObjectType.LAUNCH_SITE
  it('test_happy_path_launch_site', () => {
    expect(spaceObjType2Str(SpaceObjectType.LAUNCH_SITE)).toEqual('Launch Site');
  });

  // Tests that spaceObjType2Str returns the expected string for SpaceObjectType.ENGINE_MANUFACTURER
  it('test_happy_path_engine_manufacturer', () => {
    expect(spaceObjType2Str(SpaceObjectType.ENGINE_MANUFACTURER)).toEqual('Engine Manufacturer');
  });

  // Tests that spaceObjType2Str returns the expected string for SpaceObjectType.NOTIONAL
  it('test_happy_path_notional', () => {
    expect(spaceObjType2Str(SpaceObjectType.NOTIONAL)).toEqual('Notional');
  });

  // Tests that spaceObjType2Str returns 'Unknown' for SpaceObjectType.UNKNOWN
  it('test_edge_case_unknown', () => {
    expect(spaceObjType2Str(SpaceObjectType.UNKNOWN)).toEqual('Unknown');
  });
});
