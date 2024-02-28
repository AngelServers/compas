import React from "react";
import { FormEditorFieldContext } from ".";

import { ListInput } from "framework7-react";

const InputText = (props: FormEditorFieldContext) => {
  const { ctx, size } = props;

  return (
    <ul>
      <ListInput
        outline
        floatingLabel={size === "small" || size === "xsmall" ? true : false}
        type="text"
        {...ctx}
      />
    </ul>
  );
};
export default InputText;
