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

type IFieldBase = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "smartselect" | "custom";
  customRenderer?: (props: {
    field: IField;
    ref: any;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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

export type IField = IFieldBase;
