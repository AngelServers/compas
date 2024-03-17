import React from "react";
import { IField, RecordEditorValues } from "./types";

import { List, ListItem, ListInput, Button, Icon } from "framework7-react";
import { useScreenSize } from "../../../hooks/useScreenSize";

import {
  getInputType,
  parseValueTypeOnInput,
  getInputParsedValue,
} from "./helpers";

import SmartSelect from "../SmartSelect";

export const RenderField = ({
  field,
  values,
  setValues,
  indexIdentifier,
  fieldRefs,
  loading,
  error,
}: {
  field: IField;
  values: RecordEditorValues;
  setValues: (values: RecordEditorValues) => void;
  indexIdentifier: number;
  fieldRefs: { [key: string]: any };
  loading: boolean;
  error?: string;
}) => {
  const keyIdentifier = `record-editor-field-${field.key}-${indexIdentifier}`;
  const { size } = useScreenSize();

  if (field.type === "smartselect") {
    if (field.options) {
      return (
        <SmartSelect
          title={field.label}
          options={field.options}
          listProps={{ style: { margin: 0 } }}
          inputRef={fieldRefs.current[field.key]}
          value={getInputParsedValue(values, field)}
          onChange={(value) => {
            if (field.onChange) field.onChange(value, values, setValues);
            else {
              setValues({ ...values, [field.key]: value });
            }
          }}
        />
      );
    }
  }

  return (
    <List
      inset
      style={{ margin: 0 }}
      key={keyIdentifier}
      className="record-editor-list-container"
    >
      <ListInput
        label={field.label}
        outline
        inputId={field.key}
        input={false}
        disabled={field.readonly || loading}
        floatingLabel={
          true || size === "small" || size === "xsmall" ? true : false
        }
        readonly={field.readonly || loading}
        value={getInputParsedValue(values, field)}
        errorMessage={error}
        errorMessageForce={error ? true : false}
      >
        <input
          slot="input"
          ref={fieldRefs.current[field.key]}
          id={field.key}
          placeholder={field?.placeholder || ""}
          type={getInputType(field.type)}
          readOnly={field.readonly || loading}
          disabled={field.readonly || loading}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            let value = parseValueTypeOnInput(e.target.value, field);

            if (field.onChange) field.onChange(value, values, setValues);
            else {
              setValues({ ...values, [field.key]: value });
            }
          }}
          value={getInputParsedValue(values, field)}
        />
        {field.rightButton && (
          <Button
            fill
            slot="content-end"
            onClick={() => {
              field.rightButton?.onClick(
                values?.[field.key],
                values,
                setValues
              );
            }}
            style={{
              marginTop: "var(--f7-list-item-padding-vertical)",
              marginLeft: "0.5rem",
              // marginRight:
              //   "calc(var(--f7-list-item-padding-horizontal) + var(--f7-safe-area-right) - var(--menu-list-offset))",
            }}
            disabled={field.rightButton?.isDisabled(values)}
          >
            <Icon material={field.rightButton.icon} />
          </Button>
        )}
      </ListInput>
    </List>
  );
};
