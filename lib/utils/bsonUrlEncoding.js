"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const base64url = __importStar(require("base64-url"));
const bson_1 = require("bson"); // Changed from `EJSON`
/**
 * Encode a BSON object to a URL-safe string format
 * @param obj The BSON object to encode
 */
function encode(obj) {
    return base64url.encode(bson_1.BSON.EJSON.stringify(obj)); // Use BSON.EJSON
}
exports.encode = encode;
/**
 * Decode a BSON object from a URL-safe string format
 * @param str The URL-safe string to decode
 */
function decode(str) {
    return bson_1.BSON.EJSON.parse(base64url.decode(str)); // Use BSON.EJSON
}
exports.decode = decode;
//# sourceMappingURL=bsonUrlEncoding.js.map