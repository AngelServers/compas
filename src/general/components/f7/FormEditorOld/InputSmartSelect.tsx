import React, { useState, useEffect } from "react";
import { FormEditorFieldContext } from ".";
import { SkeletonInput } from "./Skeleton";

import { ListItem } from "framework7-react";

const InputSmartSelect = (props: FormEditorFieldContext) => {
  const { ctx } = props;

  // Is null when start to dont render the smartselect till the data is getted.
  // That's to prevent leaving the "after" slot empty (The selected value preview).
  // This "after" slot is being setted on start.
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      setOptions(await getSmartSelectValues());
    };
    init();
  }, [ctx.value]);

  // Generate html <option> from values
  const getSmartSelectValues = async () => {
    //DEVELOPER: SE DEBE DEPRECAR LA OBTENCION DE CONTEXT
    const options = ctx.field.options;
    if (options) {
      if (typeof options === "function") {
        // Función que obtiene la data
        let gettedData = await options();

        // Data from strapi
        if (gettedData?.data?.data) {
          gettedData = gettedData.data.data;
        } else if (gettedData?.data) {
          gettedData = gettedData.data;
        }

        const opts = Object.keys(gettedData).map((itemId, i) => {
          const item = gettedData[itemId];

          const attributes = item?.attributes ? item.attributes : item;

          const itemValue = attributes.name;

          const name = itemValue;
          const key = item.id;

          return (
            <option key={`${ctx.key}-opt-${i}`} value={key}>
              {name}
            </option>
          );
        });

        if (ctx.value !== null) return opts;
        return [
          <option key={`${ctx.key}-opt-[null]`}>Seleccionar una opción</option>,
          ...opts,
        ];
      } else {
        // Para string arrays
        return options.map((item, i) => {
          return (
            <option key={`${ctx.key}-opt-${i}`} value={item}>
              {item}
            </option>
          );
        });
      }
    } else {
      console.warn(
        "Angel's FormEditor: Se esta pasando un SmartSelect sin opciones"
      );
      return; // Porque se debe devolver vacio?
    }
  };

  if (!options) return <SkeletonInput />;

  return (
    <ul
      className="margin-vertical-half"
      style={{
        margin: "0rem 1rem",
        borderRadius: "var(--f7-input-outline-border-radius)",
        border: "1px solid var(--f7-input-outline-border-color)",
      }}
    >
      <ListItem
        title={ctx.label}
        smartSelect
        smartSelectParams={{
          openIn: "popup",
          searchbar: true,
          scrollToSelectedItem: true,
          searchbarPlaceholder: "Buscar",
          popupCloseLinkText: "Cerrar",
          closeOnSelect: true,
        }}
        style={{
          padding: "0.2rem",
        }}
      >
        <select
          name={ctx.label}
          // defaultValue={defaultValue}
          onChange={ctx.onChange}
          value={ctx.value || "[null]"}
          style={
            {
              // paddingTop: "16px",
              // paddingBottom: "16px",
            }
          }
        >
          {options}
        </select>
      </ListItem>
    </ul>
  );
};
export default InputSmartSelect;
