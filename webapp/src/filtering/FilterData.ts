import type { Game } from "../types/Game";

export type FilterData = {
  propertyName: string | null;
  propertyName2?: string | null | undefined;
  propertyName3?: string | null | undefined;
  operator: string | null;
  value: string | number | string[] | null;
};

export const stringOperators = [
  "contains",
  "does not contain",
  "starts with",
  "ends with",
];
export const numericOperators = ["==", "!=", "<", "<=", ">", ">="];
export const dropdownOperators = ["contains", "not empty", "empty"];

export type InputNumberProps = {
  min: number;
  max: number;
  step: number;
};

export type FiltersSchema = {
  propertyName: string;
  label: string;
  createPredicate: (data: FilterData) => (game: Game) => boolean;
} & (
  | {
      type: "string";
    }
  | {
      type: "number";
      inputProps?: Partial<InputNumberProps>;
    }
  | {
      type: "dropdown";
      values: string[];
    }
  | {
      type: "nested";
      nestedFilters: FiltersSchema[];
    }
);
