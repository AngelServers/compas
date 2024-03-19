import React from "react";

import "./styles.css";

import { ITable } from "./types";

import { getColsSize, handleSort, parseData, parsePagination } from "./helpers";
import { Button, Icon, Progressbar } from "framework7-react";
import {
  AddRecordRowButton,
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
  skeletonRows,
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
    <div
      className={`card data-table compas-table ${
        loading && false && "skeleton-text"
      }`}
    >
      {/* Loading Bar */}
      <Progressbar infinite={loading} color="gray" />

      <div style={{ overflowX: "auto" }}>
        <table>
          {fields && (
            <thead>
              <tr>
                <Filters
                  fields={fields}
                  applyFilter={applyFilter ? applyFilter : () => {}}
                  searchFilters={searchFilters}
                />
                <FilterRemover
                  applyFilter={applyFilter ? applyFilter : () => {}}
                  searchFilters={searchFilters}
                />
              </tr>
            </thead>
          )}
          <tbody>
            <Loader
              fields={fields}
              loading={loading}
              data={data}
              skeletonRows={skeletonRows}
            />

            {!loading &&
              tableData.data?.map(
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
            {allowAdd && (
              <AddRecordRowButton allowAdd={allowAdd} colSpan={cols} />
            )}
          </tbody>
        </table>
      </div>
      <div className="data-table-footer">
        {/* {allowAdd && (
          <div
            style={{
              marginLeft: "50px",
            }}
          >
            <Button
              onClick={() => {
                CompasProvider.compasF7.views.main.router.navigate(allowAdd, {
                  transition: "f7-parallax",
                });
              }}
            >
              <Icon md="material:add" />
            </Button>
          </div>
        )} */}
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onChangePage={onChangePage}
        />
      </div>
    </div>
  );
};
