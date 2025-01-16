import React from "react";

interface EnumDropdownProps<T> extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  enumObject: T; // The enum object to populate the dropdown
  value: keyof T | undefined; // Currently selected value (aligned with HTMLSelectElement's value type)
  onChange: (value: keyof T) => void; // Callback when a new value is selected
}

const EnumDropdown = <T extends Record<string, string | number>>({
  enumObject,
  value,
  onChange,
  ...selectProps // Spread the rest of the select attributes
}: EnumDropdownProps<T>) => {
  // Get all enum keys (filter out reverse-mapped keys for numeric enums)
  const enumKeys = Object.keys(enumObject).filter(
    (key) => isNaN(Number(key))
  ) as (keyof T)[];

  return (
    <select
      value={value ? String(value) : ""} // Convert value to string
      onChange={(e) => onChange(e.target.value as keyof T)}
      {...selectProps} // Pass additional select attributes
    >
      <option value="" disabled selected>
        Select an option...
      </option>
      {enumKeys.map((key) => (
        <option key={String(key)} value={String(key)}>
          {String(key)}
        </option>
      ))}
    </select>
  );
};

export default EnumDropdown;
