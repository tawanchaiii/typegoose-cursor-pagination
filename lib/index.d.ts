import { Schema } from "mongoose";
export interface IPluginOptions {
    dontReturnTotalDocs?: boolean;
    dontAllowUnlimitedResults?: boolean;
    defaultLimit?: number;
}
/**
 * A mongoose plugin to perform paginated find() requests.
 * @param schema the schema for the plugin
 */
export default function (schema: Schema, pluginOptions?: IPluginOptions): void;
export * from "./types";
