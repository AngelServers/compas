/// <reference types="react" />
import { IApplyFilter, ICustomButton, IField, ISearchFilters } from "./types";
export declare const TableCellValue: ({ value, field, }: {
    value: any;
    field: IField;
}) => JSX.Element;
export declare const Filters: ({ fields, applyFilter, searchFilters, }: {
    fields: IField[];
    applyFilter: IApplyFilter;
    searchFilters: ISearchFilters;
}) => JSX.Element;
export declare const FilterRemover: ({ applyFilter, searchFilters, }: {
    applyFilter: IApplyFilter;
    searchFilters: ISearchFilters;
}) => JSX.Element;
export declare const Loader: ({ fields, loading, data, skeletonRows, }: {
    fields: IField[];
    loading: boolean;
    data: any;
    skeletonRows?: number;
}) => any;
export declare const TableRow: ({ row, rowId, fields, allowOpen, allowEdit, allowDelete, renderCustomRowButtons, }: {
    row: any;
    rowId: number;
    fields: IField[];
    allowOpen?: string | ((id: number | string) => void);
    allowEdit?: string;
    allowDelete?: (id: number | string) => void;
    renderCustomRowButtons?: ICustomButton[];
}) => JSX.Element;
export declare const Pagination: ({ currentPage, lastPage, onChangePage, pageInfoString, }: {
    currentPage: number | null;
    lastPage: number | null;
    onChangePage?: (page: number) => void;
    pageInfoString?: string;
}) => JSX.Element;
export declare const AddRecordRowButton: ({ allowAdd, colSpan, }: {
    allowAdd?: string;
    colSpan: number;
}) => JSX.Element;
