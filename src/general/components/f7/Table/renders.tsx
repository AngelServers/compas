import React from "react";

import { IApplyFilter, ICustomButton, IField, ISearchFilters } from "./types";
import { JoinUrl } from "../../../url";
import {
  getSortIcon,
  getSortLabelColor,
  handleSort,
  parseFilterOperator,
  parseRawData,
} from "./helpers";
import { Rut } from "../../../rut";
import { Button, Icon, f7 } from "framework7-react";

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
        width: field?.width | 40,
        height: field?.width | 40,
        backgroundColor: "#ccc",
      }}
    />
  );

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
      return <td key={cellKey}></td>;
    }
  } else {
    if (typeof value == "object" || typeof value == "function") {
      console.error(`Table Generator: val is ${typeof value}`, value);
      return <td key={cellKey}></td>;
    } else {
      return <td key={cellKey}>{value}</td>;
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
}) => {
  return fields.map((field) => {
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
          style={{ width: field.width }}
          key={`custom-table-filter-${field.key}`}
          className="input-cell"
        >
          <span className="table-head-label">{field.name}</span>
        </th>
      );
    }
  });
};

export const FilterRemover = ({
  applyFilter,
  searchFilters,
}: {
  applyFilter: IApplyFilter;
  searchFilters: ISearchFilters;
}) => {
  return (
    <th
      style={{ display: "flex", justifyContent: "end" }}
      className="input-cell"
    >
      <span className="table-head-label"></span>
      <span
        className="table-head-label sorteable-header"
        onClick={() => {
          handleSort("updatedAt:desc", searchFilters, applyFilter);
        }}
      >
        {"✖"}
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
  var inputType = field.type;
  if (field.type === "tax_id") inputType = "text";

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

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

  return (
    <th key={`custom-table-filter-${field.key}`} className="input-cell">
      <span
        className="table-head-label sorteable-header"
        style={getSortLabelColor(field, searchFilters)}
        onClick={() => {
          handleSort(field.key, searchFilters, applyFilter);
        }}
      >{`${field.name} ${getSortIcon(field, searchFilters)}`}</span>
      <div className="input" style={{ width: field.width }}>
        <input
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
  return (
    <th key={`custom-table-filter-${field.key}`} className="input-cell">
      <span
        className="table-head-label sorteable-header"
        style={getSortLabelColor(field, searchFilters)}
        onClick={() => {
          handleSort(field.key, searchFilters, applyFilter);
        }}
      >
        {`${field.name} ${getSortIcon(field, searchFilters)}`}
      </span>
      <div className="input input-dropdown" style={{ width: field.width }}>
        <select
          onChange={(e) => {
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
  if (loading || !data) {
    return [0, 1, 2, 3, 4, 5].map((i) => {
      return (
        <tr key={`skeleton-${i}`} className="skeleton-text">
          {fields &&
            fields.map((field, i) => {
              var str = "";
              const fWidth = field.width ? field.width : 100;
              var count =
                fWidth / (6 + Math.round(Math.random() * 10 * 6) / 10);
              for (var s = 0; s < count; s++) {
                str += "-";
              }
              return <td key={`skeleton-td-${i}`}>{str}</td>;
            })}
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
              f7.views.main.router.navigate(allowOpen, {
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
          var value = parseRawData(row)[fieldKey];

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
}: {
  currentPage: number | null;
  lastPage: number | null;
  onChangePage?: (page: number) => void;
}) => {
  const pageInfoString = `asd`;

  if (!currentPage || !lastPage || !onChangePage) return <></>;

  return (
    <div className="data-table-pagination">
      <span className="data-table-pagination-label">{pageInfoString}</span>
      <a
        className={
          "link"
          // currentPage <= 1 || currentPage === "Cargando..."
          //   ? "link disabled"
          //   :
        }
        onClick={() => {
          onChangePage(currentPage - 1);
        }}
      >
        <i className="icon icon-prev color-gray"></i>
      </a>
      <a
        className={
          "link"
          // currentPage >= lastPage || currentPage === "Cargando..."
          //   ? "link disabled"
          //   : "link"
        }
        onClick={() => {
          onChangePage(currentPage + 1);
        }}
      >
        <i className="icon icon-next color-gray"></i>
      </a>
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
