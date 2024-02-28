import React, { useEffect } from "react";
import { FormEditorFieldContext } from ".";

import { ListInput } from "framework7-react";

const InputBool = (props: FormEditorFieldContext) => {
  const { ctx } = { ...props };

  return (
    <ul>
      <ListInput type="select" {...ctx} outline>
        <option value="true">
          {ctx.field.boolTrueText ? ctx.field.boolTrueText : "Si"}
        </option>
        <option value="false">
          {ctx.field.boolFalseText ? ctx.field.boolFalseText : "No"}
        </option>
      </ListInput>
    </ul>
  );
};
export default InputBool;
