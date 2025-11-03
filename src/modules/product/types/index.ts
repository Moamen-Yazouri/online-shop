import { IPaginationQuery } from "src/@types";

export interface IProductPaginationQuery extends IPaginationQuery {
    name?: string;
}