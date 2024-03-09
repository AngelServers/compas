import React from "react";
import "./styles.scss";
type SmartSelectSection = {
    name: string;
    options: string[];
};
type SmartSelectOptions = string[] | SmartSelectSection[] | {
    [key: string]: string;
};
type SmartSelectProps = {
    listProps?: any;
    options: SmartSelectOptions;
    title: string;
    value?: {
        key: string;
        value: string;
    };
    onChange?: (value: {
        key: string;
        value: string;
    }) => void;
    notFoundContent?: React.ReactNode;
    outlined?: boolean;
    inputRef?: React.RefObject<any>;
};
declare const SmartSelect: ({ listProps, options, title, value, onChange, notFoundContent, outlined, inputRef, }: SmartSelectProps) => JSX.Element;
export default SmartSelect;
