/// <reference types="react" />
import { ICustomButton, IField } from "../Table/types";
type propTypes = {
    title: string;
    allowBack?: boolean;
    topContent?: JSX.Element;
    tableData: {
        context: any;
        allowAdd: string;
        allowEdit: string;
        allowOpen: string;
        allowDelete: boolean;
        fields: Array<IField>;
    };
    bottomContent?: JSX.Element;
    actions?: Array<ICustomButton>;
    options?: {};
};
export declare const TablePage: ({ title, allowBack, topContent, tableData, bottomContent, actions, }: propTypes) => JSX.Element;
export {};
