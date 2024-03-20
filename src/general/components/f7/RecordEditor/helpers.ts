import React from "react";

import api from "../../../../general/api";
import { ICustomSaveParser, IField, IRecordLayout } from "./types";

import { strapiErrorTranslator } from "../../../strapiErrorTranslator";
import { CompasProvider } from "../../../../CompasProvider";

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
  editingId: number | undefined,
  content: (IRecordLayout | IField)[],
  customSaveParser?: ICustomSaveParser
) => {
  let saveValues = { ...values };

  if (!customSaveParser) {
    // TODO: No se debería crear el valor al inicio con "" para que cuando se quiera dejar un campo en "" si se pueda hacer
    // Convertir valores vacíos a null para que no se guarden como ""
    Object.keys(saveValues).forEach((key) => {
      console.log(saveValues[key]);
      if (saveValues[key] == "") {
        saveValues[key] = null;
      }
    });

    // Convertir campos smartselect a su valor real
    content.forEach((field) => {
      if (field?.type === "row") {
        field.content.forEach((field) => {
          if (field?.type === "smartselect") {
            saveValues[field.key] = saveValues[field.key]?.value;
          }
        });
      } else {
        if (field?.type === "smartselect") {
          saveValues[field.key] = saveValues[field.key]?.value;
        }
      }
    });
  } else {
    saveValues = customSaveParser(saveValues, content, {
      editingId,
      collection,
    });
  }

  if (editingId) {
    return api({
      method: "PUT",
      url: `${
        CompasProvider.apiCustomRootPath || "api"
      }/${collection}/${editingId}`,
      data: {
        data: saveValues,
      },
    }).then((res: any) => {
      console.log(res);
      return res;
    });
  } else {
    return api({
      method: "POST",
      url: `${CompasProvider.apiCustomRootPath || "api"}/${collection}`,
      data: {
        data: saveValues,
      },
    }).then((res: any) => {
      console.log(res);
      return res;
    });
  }
};

export const parseErrors = (errors: any, setErrors: (errors: any) => void) => {
  const newErrors: any = {};

  const errorObj = errors?.response?.data?.error;
  if (errorObj) {
    const errors = errorObj?.details?.errors;
    Object.values(errors).forEach((error: any) => {
      newErrors[error.path[0]] = strapiErrorTranslator(
        error.message,
        errorObj.status
      ).msg;
    });
  }

  setErrors(newErrors);
};
