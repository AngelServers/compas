import React from "react";
import { FormEditorFieldContext } from ".";

import { ListInput } from "framework7-react";

const InputDate = (props: FormEditorFieldContext) => {
  const { ctx, size } = props;

  return (
    <ul>
      <ListInput outline floatingLabel={true} type="date" {...ctx} />
    </ul>
  );
};
export default InputDate;
