import { IApplyFilter, ICustomButton, IField, ISearchFilters } from "./types";

import { CompasProvider } from "../../../../../index";

export const parseData = (data: any) => {
  if (!data) return null;

  if (data?.attributes) {
    return data.attributes;
  } else if (data?.data?.attributes) {
    return data.data.attributes;
  } else {
    return data;
  }
};

export const parseRawData = (data: any) => {
  if (!data) return null;

  if (data?.attributes) {
    return {
      ...data.attributes,
      id: data.id,
    };
  } else if (data?.data?.attributes) {
    return {
      ...data.data.attributes,
      id: data.data.id,
    };
  } else {
    return data;
  }
};

export const parseSubKeys = (subKeys: string[], rawValue: any) => {
  const parseSubKeyLevel = (
    subKeys: string[],
    rawValue: any,
    level: number
  ): string => {
    if (typeof rawValue != "object") return rawValue;

    if (
      rawValue[subKeys[level]] !== null &&
      rawValue[subKeys[level]] !== undefined
    ) {
      return parseSubKeyLevel(subKeys, rawValue[subKeys[level]], level + 1);
    } else if (rawValue.data) {
      return parseSubKeyLevel(subKeys, rawValue.data, level);
    } else if (rawValue.attributes) {
      return parseSubKeyLevel(subKeys, rawValue.attributes, level);
    } else if (Array.isArray(rawValue)) {
      return parseSubKeyLevel(
        subKeys,
        rawValue[parseInt(subKeys[level])],
        level + 1
      );
    } else {
      return rawValue;
    }
  };

  return parseSubKeyLevel(subKeys, rawValue, 0);
};

export const parsePagination = (
  data: any
): {
  currentPage: number | null;
  lastPage: number | null;
} => {
  const dummy = { currentPage: null, lastPage: null };

  if (!data || Array.isArray(data)) return dummy;

  if (data?.meta) {
    return {
      currentPage: data?.meta?.current_page || data?.meta?.pagination?.page,
      lastPage: data?.meta?.last_page || data?.meta?.pagination?.pageCount,
    };
  } else if (data?.data?.meta) {
    return {
      currentPage:
        data?.data?.meta?.current_page || data?.data?.meta?.pagination?.page,
      lastPage:
        data?.data?.meta?.last_page || data?.data?.meta?.pagination?.pageCount,
    };
  } else {
    console.warn(
      "Table Generator: Pagination not found in data. ['data.meta.current_page' and 'data.meta.last_page needed']",
      data
    );
    return dummy;
  }
};

export const getSortIcon = (field: IField, searchFilters: ISearchFilters) => {
  const trDesc = "▲";
  const trAsc = "▼";

  const desc = `${field.key}:desc`;
  const asc = `${field.key}:asc`;

  if (
    !searchFilters ||
    !searchFilters.sort ||
    (searchFilters.sort !== desc && searchFilters.sort !== asc)
  )
    return "";
  if (searchFilters.sort === desc) return trDesc;
  else return trAsc;
};

export const getSortLabelColor = (
  field: IField,
  searchFilters: ISearchFilters
) => {
  if (getSortIcon(field, searchFilters) !== "")
    return {
      color: CompasProvider.colors.blue,
    };
  return {};
};

export const handleSort = (
  key: string,
  searchFilters: ISearchFilters,
  applyFilter: IApplyFilter
) => {
  var sortVal = `${key}:desc`;
  if (searchFilters.sort === sortVal) sortVal = `${key}:asc`;

  applyFilter("sort", sortVal);
};

export const parseFilterOperator = (field: IField): "$containsi" | "$eq" => {
  if (field.type === "number") {
    return "$eq";
  } else if (field.type === "date") {
    return "$eq";
  } else {
    return "$containsi";
  }
};

export const getColsSize = (
  fields: IField[],
  allowEdit?: string,
  allowDelete?: ((id: number | string) => void) | null,
  renderCustomRowButtons?: ICustomButton[]
) => {
  let cols = fields.length;

  if (allowEdit) cols++;
  if (allowDelete) cols++;

  if (renderCustomRowButtons) cols += renderCustomRowButtons.length;

  return cols;
};
