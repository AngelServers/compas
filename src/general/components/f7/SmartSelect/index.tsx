import React, { useEffect, useState } from "react";
import {
  Page,
  Navbar,
  List,
  ListItem,
  Link,
  Popup,
  Searchbar,
} from "framework7-react";

import "./styles.scss";

type SmartSelectSection = {
  name: string;
  options: string[];
};

type SmartSelectOptions =
  | string[]
  | SmartSelectSection[]
  | { [key: string]: string };

type SmartSelectProps = {
  listProps?: any; // Propiedades de List
  options: SmartSelectOptions;

  title: string;
  value?: { key: string; value: string };
  onChange?: (value: { key: string; value: string }) => void;
  notFoundContent?: React.ReactNode;
  outlined?: boolean;
  inputRef?: React.RefObject<any>;
};

const SmartSelect = ({
  listProps,
  options,
  title,
  value,
  onChange,
  notFoundContent,
  outlined,
  inputRef,
}: SmartSelectProps) => {
  const [opened, setOpened] = useState(false);

  const [optionsList, setOptionsList] = useState<SmartSelectSection[]>([
    {
      name: "",
      options: [],
    },
  ]);
  useEffect(() => {
    const newOptionsList: SmartSelectSection[] = [
      {
        name: "",
        options: [],
      },
    ];

    if (Array.isArray(options)) {
      options.map((section, index) => {
        if (typeof section === "string") {
          newOptionsList[0].options.push(section);
        }
        if (typeof section === "object") {
          if (newOptionsList[index] === undefined)
            newOptionsList[index] = { name: "", options: [] };
          newOptionsList[index].name = section.name;
          newOptionsList[index].options = section.options;
        }
      });
    } else {
      Object.keys(options).map((key) => {
        newOptionsList[0].options.push(options[key]);
      });
    }

    setOptionsList(newOptionsList);
  }, [options]);

  useEffect(() => {
    if (value) {
      setSelected(value.key, value.value);
    }
  }, [value]);

  const [selected, _setSelected] = useState<{
    key: string | null;
    value: string | null;
  }>({
    key: null,
    value: null,
  });

  const setSelected = (_key: string, _value: string) => {
    const newVal = {
      key: _key,
      value: _value,
    };
    _setSelected(newVal);
    if (onChange && _key != selected.key) onChange(newVal);
  };

  return (
    <>
      <div className="list inset" {...listProps}>
        <ul
          style={{
            paddingTop: "var(--f7-list-item-padding-vertical)",
            paddingBottom: "var(--f7-list-item-padding-vertical)",
          }}
        >
          <li
            style={{
              borderRadius: "4px",
              paddingLeft: "12px",
              paddingRight: "12px",
              border: "1px solid #444",
              padding: "0",
            }}
          >
            <a
              className="item-link compas-smart-select-outlined"
              href="#"
              onClick={() => {
                setOpened(true);
              }}
              ref={inputRef}
            >
              <div className="item-content" style={{ minHeight: "30px" }}>
                <div className="item-inner" style={{ minHeight: "30px" }}>
                  <div className="item-title">{title}</div>
                  <div className="item-after">
                    <span>
                      {selected.key && selected.value
                        ? selected.value
                        : "Seleccionar un valor"}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>

      <Popup opened={opened} onPopupClosed={() => setOpened(false)}>
        <Page>
          <Navbar large title={title}>
            <div slot="title-large">
              <Searchbar
                style={{
                  overflow: "hidden",
                  borderRadius: "var(--f7-popup-tablet-border-radius)",
                }}
                disableButton={false}
                searchContainer=".search-list"
                searchIn=".item-title"
                notFoundEl=".not-found-content"
                placeholder={`Buscar ${title.toLowerCase()}`}
                backdrop={false}
              />
            </div>
            <span slot="left" style={{ marginLeft: "10px" }}>
              {title}
            </span>
            <Link slot="right" popupClose>
              Cerrar
            </Link>
          </Navbar>

          <List className="searchbar-not-found" style={{ margin: 0 }}>
            <ListItem title="Sin resultados"></ListItem>
          </List>
          <List className="search-list searchbar-found" style={{ margin: 0 }}>
            {renderOptions({
              options: optionsList,
              setSelected,
              setOpened,
              selected,
            })}
          </List>
          <div style={{ display: "none" }} className="not-found-content">
            {notFoundContent ? (
              notFoundContent
            ) : (
              <List>
                <ListItem title={"Nothing found"} />
              </List>
            )}
          </div>
        </Page>
      </Popup>
    </>
  );
};

const renderOptions = ({
  options,
  setSelected,
  setOpened,
  selected,
}: {
  options: SmartSelectSection[];
  setSelected: (key: string, value: string) => void;
  setOpened: (opened: boolean) => void;
  selected: { key: string | null; value: string | null };
}): React.ReactNode => {
  return options.map((section, sectionIndex) => {
    if (typeof section === "object") {
      return (
        <ul key={`smart-select-section-${sectionIndex}`}>
          <li className="list-group-title">{section.name}</li>
          {section.options.map((option, optionIndex) => {
            const key = `smart-select-${sectionIndex}-${optionIndex}`;
            return (
              <ListItem
                key={`select-item-${key}`}
                title={option}
                noChevron
                radio
                checked={selected.key === key}
                onClick={() => {
                  setSelected(key, option);
                  setOpened(false);
                }}
              />
            );
          })}
        </ul>
      );
    }
  });
};

export default SmartSelect;
