import React from "react";

import api from "../../../../general/api";
import { IField, IRecordLayout } from "./types";

export const loadValues = (editingId: number, collection: string) => {
  // Cargar valores
  return api({
    method: "GET",
    url: `api/${collection}/${editingId}`,
  })
    .then((res: any) => {
      const newValues: { [key: string]: any } = {};
      const data = res.data.data.attributes;
      Object.keys(data).forEach((key) => {
        newValues[key] = data[key];
      });
      return newValues;
    })
    .catch((err: any) => {
      console.log(err);
    });
};

export const loadInitialReferences = (content: (IRecordLayout | IField)[]) => {
  return content.reduce((acc: any, field) => {
    if (field?.type !== "row") {
      acc[field.key] = React.createRef();
    } else {
      field.content.forEach((field) => {
        acc[field.key] = React.createRef();
      });
    }
    return acc;
  }, {});
};

export const getInputType = (type: string) => {
  switch (type) {
    case "string":
      return "text";
    case "number":
      return "number";
    case "date":
      return "date";
    default:
      return "text";
  }
};

export const parseValueTypeOnInput = (value: string, field: IField) => {
  if (field.type === "number") {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value).toString();
  } else if (field.type === "date") {
    return new Date(value);
  } else {
    return value;
  }
};

export const getInputParsedValue: any = (values: any, field: IField) => {
  const value = values?.[field.key];
  const defaultValue = field.defaultValue;

  let returnVal = value || "";
  if (field.type === "number") returnVal = value || 0;

  if (!value && defaultValue) returnVal = defaultValue;

  return field.parseValue ? field.parseValue(returnVal) : returnVal;
};

export const HandleOnSave = (
  values: any,
  collection: string,
  editingId: number | undefined
) => {
  if (editingId) {
    return api({
      method: "PUT",
      url: `api/${collection}/${editingId}`,
      data: {
        data: values,
      },
    })
      .then((res: any) => {
        console.log(res);
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  } else {
    return api({
      method: "POST",
      url: `api/${collection}`,
      data: {
        data: values,
      },
    })
      .then((res: any) => {
        console.log(res);
        return res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
};
