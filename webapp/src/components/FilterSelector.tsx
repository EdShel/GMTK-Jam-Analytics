import React from "react";
import {
  dropdownOperators,
  numericOperators,
  stringOperators,
  type FilterData,
  type FiltersSchema,
} from "../filtering/FilterData";

interface Props {
  data: FilterData;
  onDataChange: (value: FilterData) => void;
  schema: FiltersSchema[];
}

const FilterSelector: React.FC<Props> = ({
  data,
  data: { propertyName, operator, value },
  onDataChange,
  schema,
}) => {
  const renderProperty = (
    property: FiltersSchema,
    nestingLevel: number
  ): React.ReactNode => {
    switch (property.type) {
      case "string":
        return (
          <>
            <select
              className="p-2 border rounded"
              value={operator || ""}
              onChange={(e) =>
                onDataChange({ ...data, operator: e.target.value || null })
              }
            >
              <option value="">Select an operator</option>
              {stringOperators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="p-2 border rounded"
              placeholder="Search string"
              value={value || ""}
              onChange={(e) => onDataChange({ ...data, value: e.target.value })}
            />
          </>
        );
      case "number":
        return (
          <>
            <select
              className="p-2 border rounded"
              value={operator || ""}
              onChange={(e) =>
                onDataChange({ ...data, operator: e.target.value || null })
              }
            >
              <option value="">Select an operator</option>
              {numericOperators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="p-2 border rounded"
              placeholder="E.g. 42"
              value={value || ""}
              onChange={(e) => onDataChange({ ...data, value: e.target.value })}
              {...property.inputProps}
            />
          </>
        );
      case "dropdown":
        return (
          <>
            <select
              className="p-2 border rounded"
              value={operator || ""}
              onChange={(e) =>
                onDataChange({ ...data, operator: e.target.value || null })
              }
            >
              <option value="">Select an operator</option>
              {dropdownOperators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            {operator === "contains" && (
              <select
                className="p-2 border rounded"
                value={value || ""}
                onChange={(e) =>
                  onDataChange({ ...data, value: e.target.value })
                }
              >
                <option value="">Select a value</option>
                {property.values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            )}
          </>
        );
      case "nested": {
        const nestedPropertyKey = `propertyName${
          nestingLevel + 1
        }` as unknown as keyof typeof data;
        const nestedPropertyValue = data[nestedPropertyKey] as string | null;
        return (
          <>
            <select
              className="p-2 border rounded"
              value={nestedPropertyValue || ""}
              onChange={(e) =>
                onDataChange({
                  ...data,
                  [nestedPropertyKey]: e.target.value || null,
                })
              }
            >
              <option value="">Select a nested property</option>
              {property.nestedFilters.map((nested) => (
                <option key={nested.propertyName} value={nested.propertyName}>
                  {nested.label}
                </option>
              ))}
            </select>
            {nestedPropertyValue &&
              renderProperty(
                property.nestedFilters.find(
                  (n) => n.propertyName === nestedPropertyValue
                )!,
                nestingLevel + 1
              )}
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="flex space-x-4 items-center">
      <select
        className="p-2 border rounded"
        value={propertyName || ""}
        onChange={(e) =>
          onDataChange({
            propertyName: e.target.value || null,
            operator: null,
            value: null,
          })
        }
      >
        <option value="">Select a property</option>
        {schema.map((property) => (
          <option key={property.propertyName} value={property.propertyName}>
            {property.label}
          </option>
        ))}
      </select>
      {propertyName &&
        renderProperty(schema.find((p) => p.propertyName === propertyName)!, 1)}
    </div>
  );
};

export default FilterSelector;
