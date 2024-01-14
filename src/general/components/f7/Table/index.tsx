import React from "react";

import "./styles.css";

import { ITable } from "./types";

import { getColsSize, handleSort, parseData, parsePagination } from "./helpers";
import { Button, Icon, Progressbar, f7 } from "framework7-react";
import {
  FilterRemover,
  Filters,
  Loader,
  Pagination,
  TableCellValue,
  TableRow,
} from "./renders";

export const Table = ({
  data,
  loading,
  allowOpen,
  allowAdd,
  allowEdit,
  allowDelete,
  fields,
  applyFilter,
  searchFilters,
  renderCustomRowButtons,
  onChangePage,
}: ITable) => {
  const tableData = parseData(data);

  const { currentPage, lastPage } = parsePagination(data);

  const cols = getColsSize(
    fields,
    allowEdit,
    allowDelete,
    renderCustomRowButtons
  );

  return (
    <div className={`card data-table ${loading && false && "skeleton-text"}`}>
      {/* Loading Bar */}
      {loading ? (
        <Progressbar infinite />
      ) : (
        <div style={{ height: "4px", width: "100%", background: "#673ab7" }} />
      )}
      <div style={{ overflowX: "auto" }}>
        <table>
          {fields && (
            <thead>
              <tr>
                <Filters
                  fields={fields}
                  applyFilter={applyFilter}
                  searchFilters={searchFilters}
                />
                <FilterRemover
                  applyFilter={applyFilter}
                  searchFilters={searchFilters}
                />
              </tr>
            </thead>
          )}
          <tbody>
            <Loader fields={fields} loading={loading} data={data} />

            {tableData.data?.map(
              (row: { id: number; attributes: Object }, rowId: number) => {
                return (
                  <TableRow
                    key={`table-row-${rowId}`}
                    row={row}
                    rowId={rowId}
                    fields={fields}
                    allowOpen={allowOpen}
                    allowEdit={allowEdit}
                    allowDelete={allowDelete}
                    renderCustomRowButtons={renderCustomRowButtons}
                  />
                );
              }
            )}
            <tr>
              <td colSpan={cols}>
                <p>No results found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="data-table-footer">
        {allowAdd && (
          <div
            style={{
              marginLeft: "50px",
            }}
          >
            <Button
              onClick={() => {
                f7.views.main.router.navigate(allowAdd, {
                  transition: "f7-parallax",
                });
              }}
            >
              <Icon md="material:add" />
            </Button>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onChangePage={onChangePage}
        />
      </div>
    </div>
  );
};
