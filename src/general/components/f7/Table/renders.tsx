import React, { useEffect } from "react";

import { IApplyFilter, ICustomButton, IField, ISearchFilters } from "./types";
import { JoinUrl } from "../../../url";
import {
  getSortIcon,
  getSortLabelColor,
  handleSort,
  parseFilterOperator,
  parseRawData,
  parseSubKeys,
} from "./helpers";
import { Rut } from "../../../rut";
import { Button, Icon, SkeletonBlock, f7 } from "framework7-react";

export const TableCellValue = ({
  value,
  field,
}: {
  value: any;
  field: IField;
}) => {
  const cellKey = `table-row-cell-${field.name}`;

  const dummyImg = (
    <div
      style={{
        width: field?.width,
        height: field?.width,
        backgroundColor: "#ccc",
      }}
    />
  );

  const styles = {
    overflow: "hidden",
    minWidth: field.width || "100px",
    maxWidth: field.width || "100px",
  };

  if (field.type === "image") {
    if (value?.data?.[0]) {
      const attributes = value.data[0].attributes;
      const url = JoinUrl(attributes.url);
      return (
        <td
          key={cellKey}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: field?.align || "left",
            ...styles,
          }}
        >
          {url ? (
            <img width={field.width ? field.width : 40} src={url} />
          ) : (
            dummyImg
          )}
        </td>
      );
    } else {
      return <td key={cellKey} style={styles}></td>;
    }
  } else if (React.isValidElement(value)) {
    return (
      <td key={cellKey} style={styles}>
        {value}
      </td>
    );
  } else {
    if (!value) value = "";

    if (typeof value == "object" || typeof value == "function") {
      console.error(`Table Generator: value is ${typeof value}`, value);
      return <td key={cellKey}></td>;
    } else {
      return (
        <td
          key={cellKey}
          style={{ textAlign: field?.align || "left", ...styles }}
        >
          {value}
        </td>
      );
    }
  }
};

export const Filters = ({
  fields,
  applyFilter,
  searchFilters,
}: {
  fields: IField[];
  applyFilter: IApplyFilter;
  searchFilters: ISearchFilters;
}) => (
  <>
    {...fields.map((field) => {
      const filterOperator = parseFilterOperator(field);

      if (field.type === "id") {
        field.type = "number"; // Set number input field for id field
      }

      if (
        field.type === "text" ||
        field.type === "number" ||
        field.type === "date" ||
        field.type === "time" ||
        field.type === "tax_id"
      ) {
        return (
          <FilterFieldText
            key={field.name}
            field={field}
            applyFilter={applyFilter}
            searchFilters={searchFilters}
            operator={filterOperator}
          />
        );
      } else if (field.type === "select") {
        return (
          <FilterFieldSelect
            key={field.name}
            field={field}
            applyFilter={applyFilter}
            searchFilters={searchFilters}
          />
        );
      } else {
        return (
          <th
            style={{ width: field.width, textAlign: field?.align || "left" }}
            key={`custom-table-filter-${field.key}`}
            className="input-cell"
          >
            <span className="table-head-label">{field.name}</span>
          </th>
        );
      }
    })}
    {/* <th style={{ width: "100px" }}></th> */}
  </>
);

export const FilterRemover = ({
  applyFilter,
  searchFilters,
}: {
  applyFilter: IApplyFilter;
  searchFilters: ISearchFilters;
}) => {
  if (!searchFilters || Object.keys(searchFilters).length === 0) return <></>;
  return (
    <th
      style={{
        display: "flex",
        justifyContent: "end",
        width: "100px",
        marginLeft: "auto",
      }}
      className="input-cell"
    >
      <span className="table-head-label"></span>
      <span
        className="table-head-label sorteable-header"
        onClick={() => {
          applyFilter("*[ALL]*");
          // handleSort("updatedAt:desc", searchFilters, applyFilter);
        }}
      >
        <Icon material="backspace" />
      </span>
    </th>
  );
};

const FilterFieldText = ({
  field,
  applyFilter,
  searchFilters,
  operator,
}: {
  field: IField;
  applyFilter: IApplyFilter;
  searchFilters: ISearchFilters;
  operator: string;
}) => {
  const [value, setValue] = React.useState("");

  var inputType = field.type;
  if (field.type === "tax_id") inputType = "text";

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setValue(value);

    if (field.onChange) {
      field.onChange(applyFilter, value);
    } else {
      // Filter for tax_id (Search for formated & clean tax_ids)
      if (field.type === "tax_id") {
        applyFilter([
          {
            key: "[$or][0][tax_id][$containsi]",
            val: value ? Rut(value).clean() : "",
          },
          {
            key: "[$or][1][tax_id][$containsi]",
            val: value ? Rut(value).format() : "",
          },
        ]);
      } else {
        applyFilter(`[${field.key}][${operator}]`, value);
      }
    }
  };

  useEffect(() => {
    if (!searchFilters || Object.keys(searchFilters).length === 0) setValue("");
  }, [searchFilters]);

  return (
    <th
      key={`custom-table-filter-${field.key}`}
      className="input-cell"
      style={{ width: field.width, textAlign: field?.align || "left" }}
    >
      <span
        className="table-head-label sorteable-header"
        style={getSortLabelColor(field, searchFilters)}
        onClick={() => {
          handleSort(field.key, searchFilters, applyFilter);
        }}
      >{`${field.name} ${getSortIcon(field, searchFilters)}`}</span>
      <div className="input">
        <input
          value={value}
          onChange={onChange}
          type={inputType}
          placeholder={field.placeholder || field.name}
        />
      </div>
    </th>
  );
};

const FilterFieldSelect = ({
  field,
  applyFilter,
  searchFilters,
}: {
  field: IField;
  applyFilter: IApplyFilter;
  searchFilters: ISearchFilters;
}) => {
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if (!searchFilters || Object.keys(searchFilters).length === 0) setValue("");
  }, [searchFilters]);

  return (
    <th
      key={`custom-table-filter-${field.key}`}
      className="input-cell"
      style={{ width: field.width }}
    >
      <span
        className="table-head-label sorteable-header"
        style={getSortLabelColor(field, searchFilters)}
        onClick={() => {
          handleSort(field.key, searchFilters, applyFilter);
        }}
      >
        {`${field.name} ${getSortIcon(field, searchFilters)}`}
      </span>
      <div className="input input-dropdown">
        <select
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            field.onChange
              ? field.onChange(applyFilter, e.target.value)
              : applyFilter(`[${field.key}][${field}]`, e.target.value);
          }}
        >
          {field?.values?.map(
            (item: { name: string; key: string } | string, i: number) => {
              return (
                <option
                  key={`select-${field.name || item}-option-${
                    typeof item === "string" ? item : item.key
                  }`}
                  value={typeof item === "string" ? item : item.key}
                >
                  {typeof item === "string" ? item : item.name}
                </option>
              );
            }
          )}
        </select>
      </div>
    </th>
  );
};

export const Loader = ({
  fields,
  loading,
  data,
}: {
  fields: IField[];
  loading: boolean;
  data: any;
}) => {
  // Create array of 20
  if (loading || !data) {
    return Array(20)
      .fill(0)
      .map((_, i) => {
        return (
          <tr
            key={`skeleton-${i}`}
            className="skeleton-text skeleton-effect-wave"
          >
            <>
              {fields &&
                fields.map((field, i) => {
                  return (
                    <td
                      key={`skeleton-td-${i}`}
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        minWidth: field.width || "100px",
                        maxWidth: field.width || "100px",
                      }}
                    >
                      <SkeletonBlock
                        tag="div"
                        width={`${field.width}px`}
                        effect="wave"
                        height="1rem"
                        borderRadius="0.5rem"
                      />
                    </td>
                  );
                })}
              <td key={`skeleton-td-${i}`}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <SkeletonBlock
                    tag="div"
                    width="24px"
                    height="24px"
                    borderRadius="50%"
                    effect="wave"
                    style={{ margin: "0px 8px" }}
                  />
                  <SkeletonBlock
                    tag="div"
                    width="24px"
                    height="24px"
                    borderRadius="50%"
                    effect="wave"
                    style={{ margin: "0px 8px" }}
                  />
                </div>
              </td>
            </>
          </tr>
        );
      });
  } else {
    return <></>;
  }
};

export const TableRow = ({
  row,
  rowId,
  fields,
  allowOpen,
  allowEdit,
  allowDelete,
  renderCustomRowButtons,
}: {
  row: any;
  rowId: number;
  fields: IField[];
  allowOpen?: string;
  allowEdit?: string;
  allowDelete?: ((id: number | string) => void) | null;
  renderCustomRowButtons?: ICustomButton[];
}) => {
  return (
    <tr
      key={`table-row-${rowId}`}
      style={{ cursor: allowOpen ? "pointer" : "default" }}
      onClick={
        allowOpen
          ? () => {
              f7.views.main.router.navigate(`${allowOpen}${row.id}`, {
                transition: "f7-parallax",
                props: {
                  id: row.id,
                },
              });
            }
          : () => {}
      }
    >
      {fields &&
        fields.map((field, i) => {
          const fieldKey = field.key ? field.key : field.name;

          // if (fieldKey.toLowerCase() === "id") value = row[fieldKey.toLowerCase()];
          // else value = flatData ? row[fieldKey] : row.attributes[fieldKey];
          var rawValue = parseRawData(row);
          let value = null;

          const subKeys = fieldKey.split(".");
          if (subKeys.length > 1) {
            value = parseSubKeys(subKeys, rawValue);
          } else {
            value = rawValue[fieldKey];
          }

          if (field.type === "tax_id") {
            if (value === "" || Rut(value).clean() === "666666666")
              value = "No nominativo";
            else if (Rut(value).validate()) value = Rut(value).format();
            else value = "Rut invalido";
          }

          // Apply parser defined on field data
          if (field.parser) value = field.parser(value, row);

          return <TableCellValue key={i} value={value} field={field} />;
        })}
      <td>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {renderCustomRowButtons?.map((action, i) => {
            return (
              <Button
                key={`custom-action-${i}`}
                color={action.color ? action.color : "blue"}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row);
                }}
              >
                <Icon md={"material:" + action.icon} />
              </Button>
            );
          })}
          {allowEdit && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                f7.views.main.router.navigate(allowEdit, {
                  transition: "f7-parallax",
                  props: {
                    id: row.id,
                  },
                });
              }}
            >
              <Icon md="material:edit" />
            </Button>
          )}
          {allowDelete && (
            <Button
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Estas seguro de eliminar el item seleccionado?")) {
                  allowDelete(row.id);
                }
              }}
            >
              <Icon md="material:delete" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export const Pagination = ({
  currentPage,
  lastPage,
  onChangePage,
  pageInfoString,
}: {
  currentPage: number | null;
  lastPage: number | null;
  onChangePage?: (page: number) => void;
  pageInfoString?: string;
}) => {
  if (!currentPage || !lastPage || !onChangePage) return <></>;

  return (
    <div className="data-table-pagination">
      <span className="data-table-pagination-label">{pageInfoString}</span>
      <a
        className={
          // "link"
          currentPage <= 1 ? "link disabled" : "link"
        }
        onClick={() => {
          onChangePage(currentPage - 1);
        }}
      >
        <i className="icon icon-prev color-gray"></i>
      </a>
      <span>
        {currentPage} de {lastPage}
      </span>
      <a
        className={
          // "link"
          currentPage >= lastPage ? "link disabled" : "link"
        }
        onClick={() => {
          onChangePage(currentPage + 1);
        }}
      >
        <i className="icon icon-next color-gray"></i>
      </a>
      {/* TODO: GO TO PAGE  */}
    </div>
  );
};

export const AddRecordRowButton = ({
  allowAdd,
  colSpan,
}: {
  allowAdd?: string;
  colSpan: number;
}) => {
  if (!allowAdd) return <></>;

  return (
    <tr>
      <td colSpan={colSpan}>
        <Button
          outline
          className="margin"
          onClick={() => {
            if (allowAdd) {
              f7.views.main.router.navigate(allowAdd, {
                transition: "f7-parallax",
              });
            }
          }}
        >
          <Icon md="material:add" />
          Agregar nuevo registro
        </Button>
      </td>
    </tr>
  );
};
