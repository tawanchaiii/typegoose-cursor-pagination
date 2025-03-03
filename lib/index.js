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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./query");
const response_1 = require("./response");
/**
 * A mongoose plugin to perform paginated find() requests.
 * @param schema the schema for the plugin
 */
function default_1(schema, pluginOptions) {
    function createFindPromise(mongoObject, options, _query, _projection) {
        // Determine sort
        const sort = (0, query_1.generateSort)(options);
        // Determine limit
        const defaultLimit = (pluginOptions && pluginOptions.defaultLimit ? pluginOptions.defaultLimit : 10);
        const useDefaultLimit = isNaN(options.limit) || options.limit < 0 || options.limit === 0 && pluginOptions && pluginOptions.dontAllowUnlimitedResults;
        const unlimited = options.limit === 0 && (!pluginOptions || !pluginOptions.dontAllowUnlimitedResults);
        options.limit = useDefaultLimit ? defaultLimit : options.limit;
        // Query documents
        const query = { $and: [(0, query_1.generateCursorQuery)(options), _query || {}] };
        // Request one extra result to check for a next/previous
        const promise = mongoObject.find(query, _projection).sort(sort).limit(unlimited ? 0 : options.limit + 1);
        return promise;
    }
    /**
     * Peform a paginated find() request
     * @param {IPaginateOptions} options the pagination options
     * @param {Object} [_query] the mongo query
     * @param {Object} [_projection] the mongo projection
     * @param {string | PopulateOptions | (string | PopulateOptions)[]} [_populate] the mongo populate
     */
    function findPaged(options, _query, _projection, _populate) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find and populate docs
            const docs = yield createFindPromise(this, options, _query, _projection).populate(_populate || []);
            if (pluginOptions && pluginOptions.dontReturnTotalDocs) {
                return (0, response_1.prepareResponse)(docs, options);
            }
            else {
                const totalDocs = yield this.countDocuments(_query).exec();
                return (0, response_1.prepareResponse)(docs, options, totalDocs);
            }
        });
    }
    /**
     * Explains a paginated find() request
     * @param {IPaginateOptions} options the pagination options
     * @param {VerboseMode} verbose the verbosity mode for explain()
     * @param {Object} [_query] the mongo query
     * @param {Object} [_projection] the mongo projection
     */
    function findPagedExplain(options, verbose, _query, _projection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield createFindPromise(this, options, _query, _projection).explain(verbose);
        });
    }
    function createAggregatePromise(mongoCollection, options, pipeline) {
        // Determine sort and limit for pagination
        const sort = (0, query_1.generateSort)(options);
        const defaultLimit = (pluginOptions && pluginOptions.defaultLimit ? pluginOptions.defaultLimit : 10);
        const useDefaultLimit = isNaN(options.limit) || options.limit < 0 || options.limit === 0 && pluginOptions && pluginOptions.dontAllowUnlimitedResults;
        const unlimited = options.limit === 0 && (!pluginOptions || !pluginOptions.dontAllowUnlimitedResults);
        options.limit = useDefaultLimit ? defaultLimit : options.limit;
        // Apply pagination to the pipeline
        const paginatedPipeline = [...pipeline, ...(0, query_1.generateAggregatePipeline)(options), { $sort: sort }];
        if (!unlimited) {
            paginatedPipeline.push({ $limit: options.limit + 1 });
        }
        // Execute the aggregate query
        const cursor = mongoCollection.aggregate(paginatedPipeline);
        return cursor;
    }
    function aggregatePaged(options, pipeline) {
        return __awaiter(this, void 0, void 0, function* () {
            // Execute the aggregate query
            const cursor = createAggregatePromise(this, options, pipeline);
            // Fetch documents
            const docs = yield cursor.exec();
            // Count total documents (if needed)
            let totalDocs = 0;
            if (pluginOptions && pluginOptions.dontReturnTotalDocs) {
                return (0, response_1.prepareResponse)(docs, options);
            }
            else {
                const countPipeline = [...pipeline, { $group: { _id: null, count: { $sum: 1 } } }];
                const countCursor = this.aggregate(countPipeline);
                const countResult = yield countCursor.exec();
                totalDocs = countResult.length > 0 ? countResult[0].count : 0;
                return (0, response_1.prepareResponse)(docs, options, totalDocs);
            }
        });
    }
    schema.statics.findPaged = findPaged;
    schema.statics.findPagedExplain = findPagedExplain;
    schema.statics.aggregatePaged = aggregatePaged;
}
exports.default = default_1;
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map