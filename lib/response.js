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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareResponse = void 0;
const bsonUrlEncoding = __importStar(require("./utils/bsonUrlEncoding"));
const object_path_1 = __importDefault(require("object-path"));
const objectPathWithInheritedProps = object_path_1.default.create({ includeInheritedProps: true });
/**
 * Prepare a response to send back to the client
 * @param _docs The documents that are returned by the find() query
 * @param options The pagination options
 * @param totalDocs The total amount of documents (without limit)
 */
function prepareResponse(_docs, options, totalDocs) {
    // Check if there is a next/previous page
    const hasMore = options.limit && _docs.length > options.limit;
    if (hasMore) {
        _docs.pop(); // Remove extra doc used to check for a next/previous page
    }
    // Reverse docs in case of previous page
    const docs = options.previous ? _docs.reverse() : _docs;
    // Next/previous page data
    const hasPrevious = options.next || (options.previous && hasMore) ? true : false;
    const hasNext = options.previous || hasMore ? true : false;
    const next = hasNext ? prepareCursor(docs[docs.length - 1], options.sortField) : undefined;
    const previous = hasPrevious ? prepareCursor(docs[0], options.sortField) : undefined;
    // Build result
    const result = Object.assign({ docs,
        hasPrevious,
        hasNext,
        next,
        previous }, (totalDocs !== undefined && { totalDocs }));
    return result;
}
exports.prepareResponse = prepareResponse;
/**
 * Generate an encoded next/previous cursor string
 * @param doc The document from which to start the next/previous page
 * @param sortField The field on which was sorted
 */
function prepareCursor(doc, sortField) {
    // Always save _id for secondary sorting.
    if (sortField && sortField !== "_id") {
        return bsonUrlEncoding.encode([objectPathWithInheritedProps.get(doc, sortField), doc._id]);
    }
    else {
        return bsonUrlEncoding.encode([doc._id]);
    }
}
//# sourceMappingURL=response.js.map