import React from "react";
import type { FilterData, FiltersSchema } from "../filtering/FilterData";
import FilterSelector from "./FilterSelector";
import { useQuery } from "crossroad";
import parseQueryFilters from "../filtering/parseQueryFilters";

interface Props {
  schema: FiltersSchema[];
}

const FiltersBar: React.FC<Props> = ({ schema }) => {
  const [searchParams, setSearhParams] = useQuery();
  const [filters, setFilters] = React.useState<FilterData[]>(
    parseQueryFilters(searchParams.filters)
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-y-3 items-start">
      {filters.map((f, i) => (
        <div key={i} className="flex items-center gap-x-2">
          <button
            className="text-red-600 border-red-600 bg-white border-2 rounded-md px-4 py-2 hover:border-red-900 hover:text-red-900 cursor-pointer"
            onClick={() => {
              const newFilters = filters.filter((_, fi) => fi !== i);
              setFilters(newFilters);
              setSearhParams({
                filters: JSON.stringify(newFilters),
                page: "1",
              });
            }}
          >
            Remove
          </button>
          <FilterSelector
            data={f}
            onDataChange={(newData) =>
              setFilters((old) => old.map((f, fi) => (fi === i ? newData : f)))
            }
            schema={schema}
          />
        </div>
      ))}

      <div className="flex items-center gap-x-2">
        <button
          className="text-gray-600 border-gray-600 bg-white border-2 rounded-md px-4 py-2 hover:border-gray-900 hover:text-gray-900 cursor-pointer"
          onClick={() =>
            setFilters((old) => [
              ...old,
              { propertyName: null, operator: null, value: null },
            ])
          }
        >
          Add filter
        </button>

        {filters.length > 0 && (
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-700 cursor-pointer"
            onClick={() => {
              setSearhParams({
                filters: JSON.stringify(filters),
                page: "1",
              });
            }}
          >
            Apply Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltersBar;
