import type { FilterData } from "./FilterData";

export default function parseQueryFilters(
  query: string | null | undefined
): FilterData[] {
  if (!query) {
    return [];
  }
  const parsed = JSON.parse(query) as FilterData[];
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
}
