import { IApplyFilter, ICustomButton, IField, ISearchFilters } from "./types";
export declare const parseData: (data: any) => any;
export declare const parseRawData: (data: any) => any;
export declare const parseSubKeys: (subKeys: string[], rawValue: any) => string;
export declare const parsePagination: (data: any) => {
    currentPage: number | null;
    lastPage: number | null;
};
export declare const getSortIcon: (field: IField, searchFilters: ISearchFilters) => "" | "▲" | "▼";
export declare const getSortLabelColor: (field: IField, searchFilters: ISearchFilters) => {
    color: string;
} | {
    color?: undefined;
};
export declare const handleSort: (key: string, searchFilters: ISearchFilters, applyFilter: IApplyFilter) => void;
export declare const parseFilterOperator: (field: IField) => "$containsi" | "$eq";
export declare const getColsSize: (fields: IField[], allowEdit?: string, allowDelete?: (id: number | string) => void, renderCustomRowButtons?: ICustomButton[]) => number;
