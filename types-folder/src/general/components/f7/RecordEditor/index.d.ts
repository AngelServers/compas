/// <reference types="react" />
import { IField, IRecordLayout } from "./types";
import "./styles.scss";
export declare const RecordEditor: ({ editingId, content, collection, refreshData, }: {
    editingId?: number;
    content: (IRecordLayout | IField)[];
    collection: string;
    refreshData?: () => void;
}) => JSX.Element;
