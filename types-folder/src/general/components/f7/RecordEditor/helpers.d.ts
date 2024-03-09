import { IField, IRecordLayout } from "./types";
export declare const loadValues: (editingId: number, collection: string) => any;
export declare const loadInitialReferences: (content: (IRecordLayout | IField)[]) => any;
export declare const getInputType: (type: string) => "text" | "date" | "number";
export declare const parseValueTypeOnInput: (value: string, field: IField) => string | Date | 0;
export declare const getInputParsedValue: any;
export declare const HandleOnSave: (values: any, collection: string, editingId: number | undefined, content: (IRecordLayout | IField)[]) => any;
export declare const parseErrors: (errors: any, setErrors: (errors: any) => void) => void;
