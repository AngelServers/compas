/// <reference types="react" />
import { ICustomButton, ITable } from "../Table/types";
type ITablePage = {
    title: string;
    allowBack?: boolean;
    topContent?: JSX.Element;
    tableData: Partial<ITable>;
    bottomContent?: JSX.Element;
    actions?: Array<ICustomButton>;
    context: any;
};
export declare const TablePage: ({ title, allowBack, topContent, tableData, bottomContent, actions, context, }: ITablePage) => JSX.Element;
export {};
