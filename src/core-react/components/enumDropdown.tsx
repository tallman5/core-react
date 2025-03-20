import React from "react";

interface EnumDropdownProps<T extends Record<string, string | number>>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  enumObject: T;
  value: keyof T | undefined;
  onChange: (value: keyof T) => void;
}

export const EnumDropdown = <T extends Record<string, string | number>>({
  enumObject,
  value,
  onChange,
  ...selectProps
}: EnumDropdownProps<T>) => {
  // Get all enum keys (excluding reverse-mapped numeric keys)
  const enumKeys = Object.keys(enumObject).filter((key) =>
    isNaN(Number(key))
  ) as (keyof T)[];

  return (
    <select
      value={value ? String(value) : ""}
      onChange={(e) => {
        const selectedValue = e.target.value;
        if (enumKeys.includes(selectedValue as keyof T)) {
          onChange(selectedValue as keyof T);
        }
      }}
      {...selectProps}
    >
      <option value="" disabled>
        Select an option...
      </option>
      {enumKeys.map((key) => (
        <option key={String(key)} value={String(key)}>
          {String(enumObject[key])} {/* Display value instead of key */}
        </option>
      ))}
    </select>
  );
};
