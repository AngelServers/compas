import React, { useContext } from "react";

import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  Link,
  Fab,
  Icon,
  FabButton,
  FabButtons,
} from "framework7-react";

import { ICustomButton, ITable } from "../Table/types";
import { Table } from "../Table";
import UseStrapiFilters from "../../../hooks/useStrapiFilters";
import { CompasProvider } from "../../../../CompasProvider";

type ITablePage = {
  title: string;
  allowBack?: boolean;
  topContent?: JSX.Element;
  tableData: Partial<ITable>;
  bottomContent?: JSX.Element;
  actions?: Array<ICustomButton>;
  context: any;
};

export const TablePage = ({
  title,
  allowBack,
  topContent,
  tableData,
  bottomContent,
  actions,
  context,
}: ITablePage) => {
  const ctx: {
    get: any;
    data: any;
    loading: boolean;
    del: (id: number | string) => void;
  } = useContext(context);
  const { get, data, loading, del } = ctx;

  const { ApplyFilters, searchFilters } = UseStrapiFilters(get);

  return (
    <Page
      onPageBeforeIn={() => {
        get();
      }}
    >
      {allowBack ? (
        <Navbar title={title} backLink="Back" />
      ) : (
        <Navbar>
          <NavLeft>
            <Link panelOpen="left">
              <Icon material="menu" />
            </Link>
          </NavLeft>
          <NavTitle sliding>{title}</NavTitle>
        </Navbar>
      )}

      {topContent}

      <Table
        data={data}
        loading={loading}
        allowOpen={tableData.allowOpen}
        allowAdd={tableData.allowAdd}
        allowEdit={tableData.allowEdit}
        allowDelete={tableData.allowDelete ? del : null}
        onChangePage={(page) => {
          ApplyFilters("page", page);
        }}
        fields={tableData?.fields || []}
        applyFilter={ApplyFilters}
        searchFilters={searchFilters}
      />

      {bottomContent}

      {actions && (
        <Fab position="left-bottom" slot="fixed">
          <Icon material="more_horiz" />
          <Icon material="close" />
          <FabButtons position="top">
            {tableData && tableData.allowAdd && (
              <FabButton
                fabClose
                label="Agregar"
                onClick={() =>
                  CompasProvider.compasF7.views.main.router.navigate(
                    tableData.allowAdd,
                    {
                      transition: "f7-parallax",
                    }
                  )
                }
              >
                <Icon material="add" />
              </FabButton>
            )}
            {actions &&
              actions.map((action) => {
                return (
                  <FabButton
                    key={`fab-action-${action.text}`}
                    fabClose
                    color={action.color}
                    label={action.text || ""}
                    onClick={action.onClick}
                  >
                    <Icon md={"material:" + action.icon} />
                  </FabButton>
                );
              })}
          </FabButtons>
        </Fab>
      )}
      {!actions && tableData.allowAdd && (
        <Fab
          position="left-bottom"
          slot="fixed"
          onClick={() => {
            CompasProvider.compasF7.views.main.router.navigate(
              tableData.allowAdd,
              {
                transition: "f7-parallax",
              }
            );
          }}
        >
          <Icon material="add" />
        </Fab>
      )}
    </Page>
  );

  // console.log(props);

  // if (buttons) {
  //   return (

  //   );
  // } else {
  //   return (
  //
  //   );
  // }
};
