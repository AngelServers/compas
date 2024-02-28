import React from "react";

import { useState, useEffect } from "react";
import { f7, ListButton, List, Block } from "framework7-react";

import { Rut } from "../../../rut";
import api from "../../../api";

import InputText from "./InputText";
import InputBool from "./InputBool";
import InputSmartSelect from "./InputSmartSelect";

import { useScreenSize } from "../../../hooks/useScreenSize";
import { SkeletonInputs } from "./skeleton";
import InputDate from "./InputDate";

import { Row } from "../Row";

const UploadFile = (file: any) => {
  var formData = new FormData();
  formData.append("files", file, file.name);

  const request = api({
    method: "POST",
    url: `/api/upload`,
    data: formData,
  });

  return request;
};

export type FormEditorField = {
  key: string;
  label: string;
  type?:
    | "row"
    | "text"
    | "bool"
    | "date"
    | "smartselect"
    | "file"
    | "tax_id"
    | "color"
    | "custom";

  // Opts
  defaultValue?: any;
  onChange?: (
    key: string,
    val: any,
    callback: (key: string, val: any) => void,
    allValues: any
  ) => void;
  placeholder?: string;
  requiered?: boolean;
  parserOnGet?: (data: any) => void;

  // For rows
  content: FormEditorField[];

  // For select | smartselect | smartselect-multiple
  options?: (() => { id: any; name: string }[]) | (() => any) | string[];

  // For bool
  boolTrueText?: string;
  boolFalseText?: string;

  onSave?: (
    collectionId: number,
    values: any,
    collectionSaveResult: any // Es el result del request para guardar el formulario
  ) => void; // Se usa solo si el campo es custom
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

  // Popup options
  finishButtonCallback?: () => void;
  cancelButtonCallback?: () => void;

  // Options
  resourceIdParser?: (resource: any) => void;
  dontWrapPayloadInData?: Boolean;
};

export const RenderField = ({
  field,
  inputValues,
  hasError,
  updateValues,
  loadingValues,
  i,
  size,
}: {
  field: FormEditorField;
  inputValues: any;
  hasError: any;
  updateValues: (key: any, val: any) => void;
  loadingValues: boolean;
  i: number;
  size: string;
}) => {
  const currValue = inputValues[field.key];

  const key = `form-input-field-${field.key}`;

  const { errorMessage, errorMessageForce } = hasError(field);

  const onChange = (val: any) => {
    if (field.type === "color" && val === undefined) return;
    if (field.onChange) {
      field.onChange(field.key, val, updateValues, inputValues);
    } else updateValues(field.key, val);
  };

  const context = {
    field: field,
    key: key,
    label: field.requiered ? `${field.label}*` : field.label,
    placeholder: field.placeholder || "",
    loading: loadingValues,
    value: currValue,
    required: field.requiered ? true : false,
    errorMessage: errorMessage,
    errorMessageForce: errorMessageForce,
    onChange: onChange,
  };

  return (
    <List key={`form-item-${i}`} inset dividers={false} style={{ margin: 0 }}>
      {(() => {
        switch (field.type) {
          case "date":
            return <InputDate key={key} ctx={context} size={size} />;
            break;
          case "bool":
            return <InputBool key={key} ctx={context} size={size} />;
            break;
          case "smartselect":
            return <InputSmartSelect key={key} ctx={context} size={size} />;
            break;
          default:
            return <InputText key={key} ctx={context} size={size} />;
            break;
        }
      })()}
    </List>
  );
};

export const FormEditor = (props: FormEditorProps) => {
  const { size } = useScreenSize();

  // Se hace para cargar al inicio, hasta que los valores iniciales se asignan
  const [init, setInit] = useState(true);

  // Estados varios
  const [inputValues, setInputValues] = useState<any>({});
  const [customInputValues, setCustomInputValues] = useState<any>({});
  const [loadingValues, setLoadingValues] = useState<Boolean>(false); // Loading for getting
  const [savingValues, setSavingValues] = useState<Boolean>(false); // Loading for uploading

  const [errorFields, setErrorFields] = useState<any>({}); // Keep the errors for each field

  const { fields: FEFields, collection: FECollection } = props;
  const findField = (key: string) => {
    // Busca el campo por su Key como si fuera un Objeto
    return FEFields.find((field) => {
      if (field?.type && field.type === "row")
        return field.content.find((f) => f.key === key);
      else return field.key === key;
    });
  };

  // Carga inicial
  useEffect(() => {
    const loadData = async () => {
      if (props.editingId) {
        await getData();
      } else {
        const keys: string[] = [];
        const values: any = [];
        FEFields.forEach((field) => {
          if (field.type === "row") {
            field.content.forEach((f) => {
              keys.push(f.key);
              values.push(f.defaultValue || null);
            });
          } else {
            keys.push(field.key);
            values.push(field.defaultValue || null);
          }
        });
        console.log(keys, values);
        updateValues(keys, values);
      }
      setInit(false);
    };
    loadData();
  }, []);

  // Parsea los valores con formato Strapi
  const ParseValues = () => {
    const values: any = { ...inputValues };

    const data: any = {};
    const files: any = {};

    // WAS: Iteraba por cada valor
    // NOW: Itera por cada campo y asigna valores
    FEFields.map((field, i) => {
      let currentValue = values[field.key];

      // STRAPI PARSER
      switch (field.type) {
        case "bool":
          files[field.key] = currentValue;
          break;
        case "file":
          files[field.key] = currentValue;
          break;
        case "tax_id":
          data[field.key] = Rut(currentValue).clean();
          break;
        default:
          // En modo de edición se ignoran los campos en blanco
          if (
            props.editingId !== null &&
            (!currentValue || currentValue === "")
          ) {
            // No hace nada porque no hay valor (Ignorado en edición)
          } else {
            data[field.key] = currentValue;
          }
          break;
      }
    });

    return { files, data };
  };

  // Parsea los valores para el editor y los aplica
  const updateValues = (key: any, val: any) => {
    const newValues: any = { ...inputValues };
    console.log(key);
    console.log(val);

    const parseValue = (field: any, val: any) => {
      if (val && val.target && val.target.value) val = val.target.value;
      if (typeof val != "string") val = "";

      // EDITOR PARSER
      if (field?.type) {
        if (field.type === "text") {
          val = !val || typeof val !== "string" ? "" : val;
          val = val.trimStart();
        }
        if (field.type === "bool") {
          val = !val || val === "false" ? "false" : "true";
        }
        if (field.type === "tax_id") {
          val = Rut(val).format();
        }
      }

      if (val === null || val === undefined) return "";
      return val;
    };

    if (Array.isArray(key)) {
      key.forEach((k, i) => {
        const field = findField(k);
        console.log(field, val[i]);
        newValues[k] = parseValue(field, val[i]);
      });
    } else {
      const field = findField(key);
      newValues[key] = parseValue(field, val);
    }
    console.log(newValues);
    setInputValues(newValues);
  };

  // For edition mode
  const getData = async () => {
    setLoadingValues(true);
    const request = api({
      method: "GET",
      url: `/api/${props.collection}/${props.editingId}?populate=*`,
    });
    request.then((res: any) => {
      if (!res.data) return;
      let gettedData: any;

      if (res?.data?.attributes) gettedData = res.data.attributes;
      else if (res?.data?.data?.attributes)
        gettedData = res.data.data.attributes;
      else gettedData = res.data;

      const keys: String[] = [];
      const vals: any = [];

      const asignValue = (field: FormEditorField) => {
        keys.push(field.key);
        if (typeof field.parserOnGet === "function") {
          vals.push(field.parserOnGet(gettedData[field.key]));
        } else {
          vals.push(gettedData[field.key]);
        }
      };

      FEFields.forEach((field: FormEditorField) => {
        if (field.type === "row") {
          field.content.forEach((f: FormEditorField) => {
            asignValue(f);
          });
        } else {
          asignValue(field);
        }
      });
      updateValues(keys, vals);

      setLoadingValues(false);
    });
    return request;
  };
  const uploadData = async (editingId?: number) => {
    const { files, data } = ParseValues();

    setSavingValues(true);
    const payload = props.dontWrapPayloadInData
      ? data
      : {
          data: data,
        };

    const request =
      editingId == null
        ? api({
            method: "POST",
            url: `/api/${FECollection}`,
            data: payload,
          })
        : api({
            method: "PUT",
            url: `/api/${FECollection}/${editingId}`,
            data: payload,
          });

    request.then(async (response: any) => {
      setSavingValues(false);
      setError(null);

      // Upload images
      await Promise.all(
        Object.keys(files).map(async (key) => {
          if (files[key] instanceof Blob) {
            // Sube los archivos
            const uploadRes = await UploadFile(files[key]);

            // Asigna los IDs a el objeto que se esta guardando
            const newData: any = {};
            newData[key] = uploadRes.data[0].id;

            const id = props.resourceIdParser
              ? props.resourceIdParser(response)
              : response.data.data.id;
            const thisPayload = props.dontWrapPayloadInData
              ? newData
              : {
                  data: newData,
                };

            return api({
              method: "PUT",
              url: `/api/${FECollection}`,
              data: thisPayload,
            });
          }
        })
      );

      // Hace GET para actualizar la información modificada
      props.refreshData();
    });
    request.catch((error: any) => {
      setSavingValues(false);
      setError(error);
    });

    return request;
  };

  // Funciones auxiliares
  const setError = (thisError: { response: any } | null) => {
    const list: any = {};
    var text = "";

    if (thisError) {
      if (thisError.response.data.error.details) {
        console.log(thisError.response.data.error.details.errors);
        thisError.response.data.error.details.errors.forEach(
          (childError: any) => {
            list[childError.path[0]] = childError.message;
          }
        );
      } else if (thisError.response.data.error) {
        text += `${thisError.response.data.error.message} `;
      }
    }

    if (text !== "") alert(text);
    setErrorFields(list);
  };

  // Parsea los errores del servidor para mostrarlos en español y aclararlos
  const hasError = (field: FormEditorField) => {
    const key = field.key;
    var errMsg = errorFields[key] ? errorFields[key] : "";
    errMsg = true ? `El cámpo ${errMsg}` : errMsg;

    errMsg = errMsg.replace(key, field.label);
    errMsg = errMsg.replace("must be defined.", "no puede quedar vacío.");
    errMsg = errMsg.replace("cannot be empty.", "no puede quedar vacío.");
    errMsg = errMsg.replace(
      "must be a valid email",
      "tiene que ser un Email valido."
    );
    errMsg = errMsg.replace(
      "This attribute must be unique",
      "ya fue ingresado anteriormente."
    );

    return {
      errorMessage: errMsg,
      errorMessageForce: errorFields[key] ? true : false,
    };
  };

  // Para los campos custom
  useEffect(() => {
    const currentValues: any = { ...customInputValues };
    FEFields.map((field, i) => {
      if (field.type === "custom") {
        currentValues[field.key] = {};
      }
    });
    setCustomInputValues(currentValues);
  }, []);
  const CallCustomInputsSave = async (results: any) => {
    return await Promise.all(
      FEFields.map(async (field, i) => {
        if (field.type === "custom") {
          if (field.onSave) {
            await field.onSave(
              props.editingId,
              customInputValues[field.key],
              results
            );
          }
        }
      })
    );
  };

  return (
    <>
      <Block
        strong
        outline
        style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
        inset
      >
        {FEFields && !loadingValues && !init ? (
          FEFields.map((field: FormEditorField, i: number) => {
            if (field.type === "row") {
              return (
                <React.Fragment key={`form-input-render-field-row-${i}`}>
                  <Row cols={2}>
                    {field.content.map((field: FormEditorField, i: number) => {
                      return (
                        <React.Fragment
                          key={`form-input-render-field-${field.key}`}
                        >
                          <RenderField
                            hasError={hasError}
                            i={i}
                            inputValues={inputValues}
                            loadingValues={loadingValues}
                            size={size}
                            updateValues={updateValues}
                            field={field}
                          />
                        </React.Fragment>
                      );
                    })}
                  </Row>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={`form-input-render-field-${field.key}`}>
                <RenderField
                  hasError={hasError}
                  i={i}
                  inputValues={inputValues}
                  loadingValues={loadingValues}
                  size={size}
                  updateValues={updateValues}
                  field={field}
                />
              </React.Fragment>
            );
          })
        ) : (
          <SkeletonInputs fields={props.fields} />
        )}
      </Block>
      <List inset>
        <ListButton
          title={props.editingId == null ? "Guardar" : "Actualizar"}
          color={savingValues && !loadingValues ? "grey" : "blue"}
          onClick={() => {
            if (!savingValues && !loadingValues) {
              uploadData(props.editingId).then(async (res) => {
                if (res) {
                  CallCustomInputsSave(res)
                    .then(() => {
                      if (props.finishButtonCallback)
                        props.finishButtonCallback();
                      else f7.views.main.router.back();
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }
              });
            }
          }}
        />
        {props.editingId == null && (
          <ListButton
            title="Guardar y crear nuevo"
            color={savingValues && !loadingValues ? "grey" : "lightBlue"}
            onClick={async () => {
              if (!savingValues && !loadingValues) {
                uploadData().then(async (res) => {
                  if (res) {
                    CallCustomInputsSave(res)
                      .then(() => {
                        var notification = f7.notification.create({
                          title: "Registro guardado con exito",
                          titleRightText: "",
                          subtitle: "El registro se guardo con exito.",
                          text: "Haz click aqui para cerrar y seguir agregando registros",
                          closeOnClick: true,
                          on: {
                            close: function () {
                              f7.views.main.router.refreshPage();
                            },
                          },
                        });

                        if (res) {
                          console.log(res);
                          notification.open();
                        }
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  }
                });
              }
            }}
          />
        )}
      </List>

      <List inset>
        <ListButton
          title="Cancelar"
          color={savingValues && !loadingValues ? "grey" : "red"}
          onClick={() => {
            if (props.cancelButtonCallback) {
              props.cancelButtonCallback();
            } else {
              if (!savingValues && !loadingValues) {
                f7.views.main.router.back();
              }
            }
          }}
        />
      </List>
    </>
  );
};
