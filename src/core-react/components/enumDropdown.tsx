import React, { useState, useEffect, useMemo } from "react";

export interface IEnumEntry {
    key: string;
    value: string;
}

export type EnumDropdownProps<T extends Record<string, string | number>> = React.SelectHTMLAttributes<HTMLSelectElement> & {
    enumObject: T;
    defaultValue: T[keyof T];
    onEnumChanged?: (selectedValue: T[keyof T]) => void;
};

export const getEnumEntries = (enumObj: any): IEnumEntry[] => {
    return Object.entries(enumObj)
        .filter(([key, value]) => isNaN(Number(key)) && (typeof value === "string" || typeof value === "number"))
        .map(([key, value]) => ({
            key,
            value: typeof value === "number" ? value.toString() : (value as string),
        }));
};

export function EnumDropdown<T extends Record<string, string | number>>(
    { enumObject, defaultValue, onEnumChanged, ...rest }: EnumDropdownProps<T>) {

    const enumEntries = useMemo(() => getEnumEntries(enumObject), [enumObject]);
    const [selectedValue, setSelectedValue] = useState<T[keyof T]>(defaultValue);

    useEffect(() => {
        setSelectedValue(defaultValue);
    }, [defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = Object.entries(enumObject).find(([key, value]) => value.toString() === e.target.value)?.[1];
        if (newValue) {
            setSelectedValue(newValue as T[keyof T]);
            if (onEnumChanged) {
                onEnumChanged(newValue as T[keyof T]);
            }
        }
    };

    return (
        <select value={selectedValue} onChange={handleChange} {...rest}>
            {enumEntries.map((entry) => (
                <option key={entry.key} value={entry.value}>
                    {entry.key}
                </option>
            ))}
        </select>
    );
}
