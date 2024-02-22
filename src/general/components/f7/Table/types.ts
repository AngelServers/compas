export interface ICustomButton {
  text?: string;
  icon: string;
  color: string;
  onClick: (...args: any[]) => void;
}

export interface ITable {
  data: any;
  loading: boolean;
  allowOpen?: string;
  allowAdd?: string;
  allowEdit?: string;
  allowDelete?: ((id: number | string) => void) | null;
  fields: IField[];

  applyFilter: (key: string | { key: string; val: any }[], val?: any) => void;
  searchFilters?: any;

  renderCustomRowButtons?: ICustomButton[];
  onChangePage?: (page: number) => void;
}

export interface ISearchFilters {
  [key: string]: any;
  sort?: string;
}

export interface IField {
  type:
    | "id"
    | "text"
    | "number"
    | "tax_id"
    | "select"
    | "date"
    | "image"
    | "time";
  key: string;
  name: string;
  placeholder?: string;
  width: number | string;
  onChange?: (applyFilter: IApplyFilter, value: any) => void;
  parser?: (cell: string, row: object) => string;
  values?:
    | Array<{
        name: string;
        key: string;
      }>
    | Array<string>;
}

export interface IApplyFilter {
  (key: string | Array<{ key: string; val: any }>, val?: any): void;
}
