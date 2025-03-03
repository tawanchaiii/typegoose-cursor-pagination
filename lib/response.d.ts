import { IPaginateResult, IPaginateOptions } from "./types";
/**
 * Prepare a response to send back to the client
 * @param _docs The documents that are returned by the find() query
 * @param options The pagination options
 * @param totalDocs The total amount of documents (without limit)
 */
export declare function prepareResponse<T>(_docs: T[], options: IPaginateOptions, totalDocs?: number): IPaginateResult<T>;
