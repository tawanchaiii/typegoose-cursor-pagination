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
exports.generateSort = exports.generateAggregatePipeline = exports.generateCursorQuery = void 0;
const bsonUrlEncoding = __importStar(require("./utils/bsonUrlEncoding"));
/**
 * Generate a query object for the next/previous page
 * @param options The pagination options
 */
function generateCursorQuery(options) {
    // Return an empty query upon no cursor string
    const query = {};
    if (!options.next && !options.previous) {
        return query;
    }
    // Decode cursor string
    const decoded = bsonUrlEncoding.decode(options.previous || options.next);
    // Determine sort direction (reversed for previous page)
    const sortAscending = (!options.sortAscending && options.previous) || (options.sortAscending && !options.previous);
    const sortComparer = sortAscending ? "$gt" : "$lt";
    // Secondary sort on _id
    if (options.sortField && options.sortField !== "_id") {
        query.$or = [
            { [options.sortField]: { [sortComparer]: decoded[0] } },
            { [options.sortField]: decoded[0], _id: { [sortComparer]: decoded[1] } }
        ];
    }
    else {
        query._id = { [sortComparer]: decoded[0] };
    }
    return query;
}
exports.generateCursorQuery = generateCursorQuery;
/**
 * Generate aggregation pipeline stages for cursor-based pagination
 * @param options The pagination options
 */
function generateAggregatePipeline(options) {
    const pipeline = [];
    if (!options.next && !options.previous) {
        return pipeline;
    }
    // Determine the cursor value
    const cursorValue = options.next ? options.next : options.previous;
    // Decode cursor string
    const decoded = bsonUrlEncoding.decode(cursorValue);
    const sortAscending = (!options.sortAscending && options.previous) || (options.sortAscending && !options.previous);
    const sortComparer = sortAscending ? "$gt" : "$lt";
    // Add match stage based on cursor
    if (options.sortField && options.sortField !== "_id") {
        pipeline.push({
            $match: {
                $or: [
                    { [options.sortField]: { [sortComparer]: decoded[0] } },
                    { [options.sortField]: decoded[0], _id: { [sortComparer]: decoded[1] } }
                ]
            }
        });
    }
    else {
        pipeline.push({
            $match: {
                _id: { [sortComparer]: decoded[0] }
            }
        });
    }
    return pipeline;
}
exports.generateAggregatePipeline = generateAggregatePipeline;
/**
 * Generate a sort object to sort the find() in the correct order
 * @param options The pagination options
 */
function generateSort(options) {
    // Determine sort direction (reversed for previous page)
    const sortAscending = (!options.sortAscending && options.previous) || (options.sortAscending && !options.previous);
    const sortDirection = sortAscending ? 1 : -1;
    // Secondary sort on _id
    if (options.sortField) {
        return {
            [options.sortField]: sortDirection,
            _id: sortDirection
        };
    }
    else {
        return {
            _id: sortDirection
        };
    }
}
exports.generateSort = generateSort;
//# sourceMappingURL=query.js.map