/// <reference types="react" />
import { ICustomSaveParser, IField, IRecordLayout } from "./types";
import "./styles.scss";
export declare const RecordEditor: ({ editingId, content, collection, refreshData, customSaveParser, }: {
    editingId?: number;
    content: (IRecordLayout | IField)[];
    collection: string;
    refreshData?: () => void;
    customSaveParser: ICustomSaveParser;
}) => JSX.Element;
