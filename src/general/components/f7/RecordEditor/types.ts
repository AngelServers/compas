export type IRecordLayout = {
  type: "row";
  cols?: number;
  content: IField[];
};

export type RecordEditorValues =
  | {
      [key: string]: any;
    }
  | undefined;

export type IField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "smartselect" | "custom";
  customRenderer?: (props: {
    field: IField;
    ref: any;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setValues: (values: RecordEditorValues) => void;
    errorMessage?: string;
  }) => void;
  placeholder?: string;
  parseValue?: (value: any) => any;
  onChange?: (
    val: any,
    values: RecordEditorValues,
    setValues: (values: RecordEditorValues) => void
  ) => void;
  readonly?: boolean;
  defaultValue?: any;
  required?: boolean;
  rightButton?: {
    icon: string;
    onClick: (
      value: any,
      values: RecordEditorValues,
      setValue: (values: RecordEditorValues) => void
    ) => void;
    isDisabled?: (values: RecordEditorValues) => boolean;
  };
  multiple?: boolean;
  options?:
    | string[]
    | {
        name: string;
        options: string[];
      }[]; // Si el type es "smartselect", options no puede ser opcional
};

export type ICustomSaveParser = (
  values: any,
  content: (IRecordLayout | IField)[],
  {
    editingId,
    collection,
  }: {
    editingId: number | undefined;
    collection: string;
  }
) => any;
