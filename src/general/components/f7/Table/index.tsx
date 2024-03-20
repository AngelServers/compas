import React from "react";

import "./styles.css";

import { ITable } from "./types";

import { getColsSize, parseData, parsePagination } from "./helpers";
import { Progressbar } from "framework7-react";
import {
  AddRecordRowButton,
  FilterRemover,
  Filters,
  Loader,
  Pagination,
  TableRow,
} from "./renders";

export const Table = ({
  data,
  loading,
  allowOpen,
  addButton,
  allowAdd,
  allowEdit,
  allowDelete,
  fields,
  style,
  applyFilter,
  searchFilters,
  renderCustomRowButtons,
  onChangePage,
  skeletonRows,
  outline,
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
        outline ? "compas-table-outline" : ""
      }`}
      style={style}
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
              <AddRecordRowButton
                allowAdd={allowAdd}
                addButton={addButton}
                colSpan={cols}
              />
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
              <Icon material="add" />
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
