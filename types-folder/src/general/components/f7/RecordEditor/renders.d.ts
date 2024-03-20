/// <reference types="react" />
import { IField, RecordEditorValues } from "./types";
export declare const RenderField: ({ field, values, setValues, indexIdentifier, fieldRefs, loading, error, }: {
    field: IField;
    values: RecordEditorValues;
    setValues: (values: RecordEditorValues) => void;
    indexIdentifier: number;
    fieldRefs: {
        [key: string]: any;
    };
    loading: boolean;
    error?: string;
}) => JSX.Element;
