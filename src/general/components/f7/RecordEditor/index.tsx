import React, { useEffect, useState, useRef } from "react";
import { ICustomSaveParser, IField, IRecordLayout } from "./types";

import { Block, Button } from "framework7-react";
import { Row } from "../Row";

import { RenderField } from "./renders";
import {
  HandleOnSave,
  loadInitialReferences,
  loadValues,
  parseErrors,
} from "./helpers";

import "./styles.scss";
import { CompasProvider } from "../../../../CompasProvider";

export const RecordEditor = ({
  editingId,
  content,
  collection,
  refreshData,
  customSaveParser,
}: {
  editingId?: number;
  content: (IRecordLayout | IField)[];
  collection: string;
  refreshData?: () => void;
  customSaveParser: ICustomSaveParser;
}) => {
  const [values, setValues] = useState<{ [key: string]: any }>();
  const loading = !values && !!editingId;

  // For keyboard navigation
  const fieldRefs = useRef<{ [key: string]: any }>(
    loadInitialReferences(content)
  );
  const saveButtonRef = useRef<any>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Start
  useEffect(() => {
    if (editingId) {
      // Cargar valores
      loadValues(editingId, collection)
        .then((res: any) => {
          setValues({ ...res });
          return res;
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      // Cargar valores por defecto
      const newValues: { [key: string]: any } = {};
      content.forEach((field) => {
        // if (field?.type !== "row") {
        //   newValues[field.key] = field.defaultValue || "";
        // } else {
        //   field.content.forEach((field) => {
        //     newValues[field.key] = field.defaultValue || "";
        //   });
        // }
      });
      setValues(newValues);
    }
  }, [editingId, setValues]);

  // Keyboard navigation
  useEffect(() => {
    // Focus first field
    const keys = Object.values(fieldRefs.current);
    if (keys.length > 0) {
      setTimeout(() => {
        keys[0].current.focus({
          preventScroll: true,
        });
      }, 100);
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      const keys = Object.keys(fieldRefs.current);
      const index = keys.findIndex((key) => key === document.activeElement?.id);

      // TODO: Se debe mejorar la navegación por teclado
      // Se debe detectar si el campo es el último y si es así, enfocar el botón de guardar
      // Se debe detectar si el campo siguiente o anterior esta desactivado y saltar
      // al siguiente o anterior activo
      // Se debe detectar si el campo es un select y abrir el select al presionar enter
      // Se debe detectar si el campo es un textarea y permitir el salto de línea si se apreta 2 veces enter

      // if (e.key === "Enter") {
      //   const nextIndex = index + 1;
      //   if (nextIndex < keys.length) {
      //     fieldRefs.current[keys[nextIndex]].current.focus();
      //   } else {
      //     console.log(saveButtonRef.current);
      //     saveButtonRef.current.el.focus();
      //   }
      // } else if (e.key === "Escape") {
      //   const nextIndex = index - 1;
      //   if (nextIndex >= 0) {
      //     fieldRefs.current[keys[nextIndex]].current.focus();
      //   }
      // }
    };

    window.addEventListener("keyup", handleKeyPress, false);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  return (
    <Block inset strong>
      {
        // If is IField[] render single rows, each with on field
        // IF is IRecordLayout[] render the layout with his content
        content.map((content, index: number) => {
          const keyIdentifier = `record-editor-${collection}-row-${index}`;
          if (content?.type === "row") {
            // Es layout
            return (
              <React.Fragment key={keyIdentifier}>
                <Row cols={content.cols || 2} small={1}>
                  {content.content.map((field, index) => (
                    <React.Fragment
                      key={`record-editor-item-${collection}-row-${index}`}
                    >
                      <RenderField
                        field={field}
                        values={values}
                        setValues={setValues}
                        indexIdentifier={index}
                        fieldRefs={fieldRefs}
                        loading={loading}
                        error={errors[field.key]}
                      />
                    </React.Fragment>
                  ))}
                </Row>
              </React.Fragment>
            );
          } else {
            // Es field
            return (
              <React.Fragment key={keyIdentifier}>
                <RenderField
                  field={content}
                  values={values}
                  setValues={setValues}
                  indexIdentifier={index}
                  fieldRefs={fieldRefs}
                  loading={loading}
                  error={errors[content.key]}
                />
              </React.Fragment>
            );
          }
        })
      }

      <Button
        ref={saveButtonRef}
        style={{ marginTop: "1rem" }}
        outline
        onClick={async () => {
          await HandleOnSave(
            values,
            collection,
            editingId,
            content,
            customSaveParser
          )
            .then(() => {
              refreshData && refreshData();
              CompasProvider.compasF7.views.main.router.back();
            })
            .catch((err: any) => {
              parseErrors(err, setErrors);
              console.log(err);
            });
        }}
      >
        {editingId ? "Guardar cambios" : "Crear registro"}
      </Button>
    </Block>
  );
};
