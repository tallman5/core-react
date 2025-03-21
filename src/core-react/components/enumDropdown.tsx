import React from "react";

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

    const enumEntries = getEnumEntries(enumObject);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Object.entries(enumObject).find(([key, value]) => value.toString() === e.target.value)?.[1];
        if (selectedValue && onEnumChanged) {
            onEnumChanged(selectedValue as T[keyof T]);
        }
    };

    return (
        <select defaultValue={defaultValue} onChange={handleChange} {...rest}>
            {enumEntries.map((entry) => (
                <option key={entry.key} value={entry.value}>
                    {entry.key}
                </option>
            ))}
        </select>
    );
}
