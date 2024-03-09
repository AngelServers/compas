/// <reference types="react" />
export type FormEditorField = {
    key: string;
    label: string;
    type?: "row" | "text" | "bool" | "date" | "smartselect" | "file" | "tax_id" | "color" | "custom";
    defaultValue?: any;
    onChange?: (key: string, val: any, callback: (key: string, val: any) => void, allValues: any) => void;
    placeholder?: string;
    requiered?: boolean;
    parserOnGet?: (data: any) => void;
    content: FormEditorField[];
    options?: (() => {
        id: any;
        name: string;
    }[]) | (() => any) | string[];
    boolTrueText?: string;
    boolFalseText?: string;
    onSave?: (collectionId: number, values: any, collectionSaveResult: any) => void;
};
export type FormEditorFieldContext = {
    key: any;
    ctx: {
        field: FormEditorField;
        key: string;
        label: string;
        placeholder: string;
        loading: boolean;
        value: any;
        required: boolean;
        errorMessage: string;
        errorMessageForce: any;
        onChange: (val: any) => void;
    };
    size?: string;
};
export type FormEditorProps = {
    editingId: number;
    collection: string;
    refreshData: () => void;
    fields: FormEditorField[];
    finishButtonCallback?: () => void;
    cancelButtonCallback?: () => void;
    resourceIdParser?: (resource: any) => void;
    dontWrapPayloadInData?: Boolean;
};
export declare const RenderField: ({ field, inputValues, hasError, updateValues, loadingValues, i, size, }: {
    field: FormEditorField;
    inputValues: any;
    hasError: any;
    updateValues: (key: any, val: any) => void;
    loadingValues: boolean;
    i: number;
    size: string;
}) => JSX.Element;
export declare const FormEditor: (props: FormEditorProps) => JSX.Element;
