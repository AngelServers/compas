/// <reference types="react" />
export interface ICustomButton {
    text?: string;
    icon: string;
    color: string;
    onClick: (...args: any[]) => void;
}
export interface TableData {
    data: any;
}
export interface ITable {
    data: TableData;
    loading?: boolean;
    allowOpen?: string | ((id: number | string) => void) | null;
    allowAdd?: string;
    allowEdit?: string;
    allowDelete?: ((id: number | string) => void) | null | boolean;
    fields: IField[];
    applyFilter?: (key: string | {
        key: string;
        val: any;
    }[], val?: any) => void;
    searchFilters?: any;
    renderCustomRowButtons?: ICustomButton[];
    onChangePage?: (page: number) => void;
    skeletonRows?: number;
}
export interface ISearchFilters {
    [key: string]: any;
    sort?: string;
}
export interface IField {
    type?: "id" | "text" | "number" | "tax_id" | "select" | "date" | "image" | "time";
    key: string;
    name: string;
    placeholder?: string;
    width: number | string;
    onChange?: (applyFilter: IApplyFilter, value: any) => void;
    parser?: (cell: string | JSX.Element | null, row: object) => string | JSX.Element;
    values?: Array<{
        name: string;
        key: string;
    }> | Array<string>;
    align?: "center" | "left" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}
export interface IApplyFilter {
    (key: string | Array<{
        key: string;
        val: any;
    }>, val?: any): void;
}
