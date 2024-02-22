import React, { useEffect, useState } from "react";

// function ApplyFilters(key: any, val: any, arr?: Array<filterObect>): void {
//   const newFilters = { ...searchFilters };
//   if (val !== "") {
//     newFilters[key] = val;
//   } else {
//     delete newFilters[key];
//   }
//   if (Array.isArray(arr)) {
//     arr.forEach(({ key: k, val: v }) => {
//       if (v !== "") {
//         newFilters[k] = v;
//       } else {
//         delete newFilters[k];
//       }
//     });
//   }
//   getFunction(() => {}, newFilters);
//   setSearchFilters(newFilters);
// }

export default (getFunction) => {
  const [searchFilters, setSearchFilters] = useState({});

  function ApplyFilters(
    key: string | Array<{ key: string; val: any }>,
    val?: any
  ): void {
    if (key === "*[ALL]*") {
      // Used to remove all current filters
      setSearchFilters({});
      return;
    }

    const newFilters = { ...searchFilters };
    if (Array.isArray(key)) {
      key.forEach(({ key, val }) => {
        if (val !== "") {
          newFilters[key] = val;
        } else {
          delete newFilters[key];
        }
      });
    } else {
      if (val !== "") {
        newFilters[key] = val;
      } else {
        delete newFilters[key];
      }
    }
    setSearchFilters(newFilters);
  }

  useEffect(() => {
    getFunction(() => {}, searchFilters);
  }, [searchFilters]);

  return { ApplyFilters, searchFilters };
};
