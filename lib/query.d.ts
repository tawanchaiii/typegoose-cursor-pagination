/// <reference types="mongoose/types/pipelinestage" />
import { IPaginateOptions } from "./types";
import { PipelineStage } from "mongoose";
/**
 * Generate a query object for the next/previous page
 * @param options The pagination options
 */
export declare function generateCursorQuery(options: IPaginateOptions): any;
/**
 * Generate aggregation pipeline stages for cursor-based pagination
 * @param options The pagination options
 */
export declare function generateAggregatePipeline(options: IPaginateOptions): PipelineStage[];
/**
 * Generate a sort object to sort the find() in the correct order
 * @param options The pagination options
 */
export declare function generateSort(options: IPaginateOptions): {
    [x: string]: number;
    _id: number;
};
