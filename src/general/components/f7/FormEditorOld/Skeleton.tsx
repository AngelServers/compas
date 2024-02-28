import React from "react";

import { List, ListInput, SkeletonBlock } from "framework7-react";
import { useScreenSize } from "../../../hooks/useScreenSize";

export const SkeletonInput = () => {
  return (
    <ul className="skeleton-text skeleton-effect-wave">
      <ListInput outline label="Loading" input={false}>
        <SkeletonBlock
          tag="span"
          slot="input"
          width="100%"
          height="20px"
          borderRadius="0px"
          effect="wave"
          style={{ marginTop: "5px" }}
        />
      </ListInput>
    </ul>
  );
};

export const SkeletonInputs = ({ fields }: any) => {
  const { size } = useScreenSize();
  const arr = new Array(fields.length).fill(0);
  return (
    <List style={{ margin: 0 }}>
      {arr.map((e, i) => (
        <SkeletonInput key={`skeleton-input-${i}`} />
      ))}
    </List>
  );
};
