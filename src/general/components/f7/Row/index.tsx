import React from "react";

import "./styles.scss";

export const Row = ({
  cols,
  small,
  medium,
  large,
  children,
}: {
  cols: number;
  children: React.ReactNode | React.ReactNode[];
  small?: number;
  medium?: number;
  large?: number;
}) => {
  const smallCols = small ? small : cols;
  const mediumCols = medium ? medium : cols;
  const largeCols = large ? large : mediumCols;
  return (
    <div
      className={`grid grid-cols-${cols} small-grid-cols-${smallCols} medium-grid-cols-${mediumCols} large-grid-cols-${largeCols} grid-gap`}
    >
      {Array.isArray(children) ? children : [children]}
    </div>
  );
};
