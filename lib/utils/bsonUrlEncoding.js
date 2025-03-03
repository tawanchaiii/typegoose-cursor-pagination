"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const base64url_1 = __importDefault(require("base64url"));
const bson_1 = require("bson"); // Changed from `EJSON`
/**
 * Encode a BSON object to a URL-safe string format
 * @param obj The BSON object to encode
 */
function encode(obj) {
    return base64url_1.default.encode(bson_1.BSON.EJSON.stringify(obj)); // Use BSON.EJSON
}
exports.encode = encode;
/**
 * Decode a BSON object from a URL-safe string format
 * @param str The URL-safe string to decode
 */
function decode(str) {
    return bson_1.BSON.EJSON.parse(base64url_1.default.decode(str)); // Use BSON.EJSON
}
exports.decode = decode;
//# sourceMappingURL=bsonUrlEncoding.js.map