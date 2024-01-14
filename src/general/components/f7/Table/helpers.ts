import { ICustomButton, IField, ISearchFilters } from "./types";

import { compas } from "../../../../../index";

export const parseData = (data: any) => {
  if (!data) return null;

  if (data?.attributes) {
    return data.attributes;
  } else if (data?.data?.attribtes) {
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
  } else if (data?.data?.attribtes) {
    return {
      ...data.data.attributes,
      id: data.data.id,
    };
  } else {
    return data;
  }
};

export const parsePagination = (
  data: any
): {
  currentPage: number | null;
  lastPage: number | null;
} => {
  const dummy = { currentPage: null, lastPage: null };

  if (!data) return dummy;

  if (data?.meta) {
    return {
      currentPage: data.meta.current_page,
      lastPage: data.meta.last_page,
    };
  } else if (data?.data?.meta) {
    return {
      currentPage: data.data.meta.current_page,
      lastPage: data.data.meta.last_page,
    };
  } else {
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

export const getSortLabelColor = (field: IField, searchFilters) => {
  if (getSortIcon(field, searchFilters) !== "")
    return {
      color: compas.colors.blue,
    };
  return {};
};

export const handleSort = (key, searchFilters, applyFilter) => {
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
