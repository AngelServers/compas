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
  type: "text" | "textarea" | "number" | "date";
  placeholder?: string;
  parseValue?: (value: any) => any;
  onChange?: (
    val: any,
    values: RecordEditorValues,
    setValues: (values: RecordEditorValues) => void
  ) => void;
  defaultValue?: any;
  required?: boolean;
  rightButton?: {
    icon: string;
    onClick: (
      value: any,
      values: RecordEditorValues,
      setValue: (values: RecordEditorValues) => void
    ) => void;
    isDisabled: (values: RecordEditorValues) => boolean;
  };
};

type IFieldSmartSelect = IFieldBase & {
  type: "smartselect";
  options: string[]; // Si el type es "smartselect", options no puede ser opcional
};

export type IField = IFieldBase | IFieldSmartSelect;