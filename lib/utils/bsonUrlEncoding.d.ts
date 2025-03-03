/**
 * Encode a BSON object to a URL-safe string format
 * @param obj The BSON object to encode
 */
export declare function encode(obj: any): string;
/**
 * Decode a BSON object from a URL-safe string format
 * @param str The URL-safe string to decode
 */
export declare function decode(str: string): any;
