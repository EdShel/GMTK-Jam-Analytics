import React, { useMemo } from "react";
import type { Game } from "../types/Game";
import { type FilterData, type FiltersSchema } from "../filtering/FilterData";
import GameCard from "./GameCard";
import FilterSelector from "./FilterSelector";

interface Props {
  data: Game[];
}

const Games: React.FC<Props> = ({ data }) => {
  const [filters, setFilters] = React.useState<FilterData[]>([
    {
      propertyName: null,
      operator: null,
      value: null,
      propertyName2: null,
    },
  ]);

  const rankingCategories = data[0].ranks.map((r) => r.category);

  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    data.forEach((game) => {
      game.genres?.forEach((genre) => genresSet.add(genre));
    });
    const result = Array.from(genresSet);
    result.sort();
    return result;
  }, [data]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    data.forEach((game) => {
      game.tags?.forEach((tag) => tagsSet.add(tag));
    });
    const result = Array.from(tagsSet);
    result.sort();
    return result;
  }, [data]);

  const schema: FiltersSchema[] = useMemo(
    () => [
      {
        propertyName: "coverUrl",
        label: "Cover",
        type: "dropdown",
        values: ["image", "gif", "missing"],
        createPredicate: (data: FilterData): ((game: Game) => boolean) => {
          if (data.value === "missing") {
            return (g) => !g.coverUrl;
          }
          if (data.value === "image") {
            return (g) => !!g.coverUrl && !g.coverUrl.endsWith(".gif");
          }
          if (data.value === "gif") {
            return (g) => !!g.coverUrl && g.coverUrl.endsWith(".gif");
          }
          return () => true;
        },
      },
      {
        propertyName: "name",
        label: "Name",
        type: "string",
        createPredicate: (data: FilterData): ((game: Game) => boolean) => {
          if (!data.value || !data.operator) {
            return () => true;
          }
          const value = (data.value as string).toLowerCase();
          switch (data.operator) {
            case "contains":
              return (g) => g.name.toLowerCase().includes(value);
            case "does not contain":
              return (g) => !g.name.toLowerCase().includes(value);
            case "starts with":
              return (g) => g.name.toLowerCase().startsWith(value);
            case "ends with":
              return (g) => g.name.toLowerCase().endsWith(value);
            default:
              return () => true;
          }
        },
      },
      {
        propertyName: "authorsCount",
        label: "Authors count",
        type: "number",
        inputProps: { min: 0, step: 1 },
        createPredicate: (data: FilterData): ((game: Game) => boolean) => {
          if (!Number.isFinite(Number(data.value)) || !data.operator) {
            return () => true;
          }
          const value = Number(data.value);
          switch (data.operator) {
            case "==":
              return (g) => g.authors.length === value;
            case "!=":
              return (g) => g.authors.length !== value;
            case "<":
              return (g) => g.authors.length < value;
            case "<=":
              return (g) => g.authors.length <= value;
            case ">":
              return (g) => g.authors.length > value;
            case ">=":
              return (g) => g.authors.length >= value;
            default:
              return () => true;
          }
        },
      },
      {
        propertyName: "votesCount",
        label: "Votes count",
        type: "number",
        createPredicate: (data: FilterData): ((game: Game) => boolean) => {
          if (!Number.isFinite(Number(data.value)) || !data.operator) {
            return () => true;
          }
          const value = Number(data.value);
          switch (data.operator) {
            case "==":
              return (g) => g.ratingsCount === value;
            case "!=":
              return (g) => g.ratingsCount !== value;
            case "<":
              return (g) => g.ratingsCount < value;
            case "<=":
              return (g) => g.ratingsCount <= value;
            case ">":
              return (g) => g.ratingsCount > value;
            case ">=":
              return (g) => g.ratingsCount >= value;
            default:
              return () => true;
          }
        },
      },
      {
        propertyName: "ranks",
        label: "Ranks",
        type: "nested",
        nestedFilters: rankingCategories.map((c) => ({
          propertyName: c,
          label: c,
          type: "nested",
          nestedFilters: [
            {
              propertyName: "place",
              label: "Place",
              type: "number",
              inputProps: { min: 1, step: 1 },
              createPredicate: (): ((game: Game) => boolean) => () => true,
            },
            {
              propertyName: "score",
              label: "Score",
              type: "number",
              createPredicate: (): ((game: Game) => boolean) => () => true,
            },
            {
              propertyName: "rawScore",
              label: "Raw Score",
              type: "number",
              createPredicate: (): ((game: Game) => boolean) => () => true,
            },
          ],
          createPredicate: (): ((game: Game) => boolean) => () => true,
        })),
        createPredicate: (data: FilterData): ((game: Game) => boolean) => {
          const category = data.propertyName2;
          const categoryProperty = data.propertyName3;
          if (!category || !categoryProperty || !data.operator) {
            return () => true;
          }
          return (game: Game) => {
            const rank = game.ranks.find((r) => r.category === category);
            if (!rank) return false;
            const value = rank[categoryProperty as keyof typeof rank] as number;
            if (Number.isFinite(Number(data.value))) {
              const filterValue = Number(data.value);
              switch (data.operator) {
                case "==":
                  return value === filterValue;
                case "!=":
                  return value !== filterValue;
                case "<":
                  return value < filterValue;
                case "<=":
                  return value <= filterValue;
                case ">":
                  return value > filterValue;
                case ">=":
                  return value >= filterValue;
                default:
                  return true;
              }
            } else {
              return false;
            }
          };
        },
      },
      {
        propertyName: "genres",
        label: "Genres",
        type: "dropdown",
        values: allGenres,
        createPredicate: (data: FilterData): ((game: Game) => boolean) => {
          if (!data.value || !data.operator) {
            return () => true;
          }
          const value = data.value as string;
          switch (data.operator) {
            case "contains":
              return (g) => !!g.genres && g.genres.includes(value);
            case "not empty":
              return (g) => !!g.genres && g.genres.length > 0;
            case "empty":
              return (g) => !g.genres || g.genres.length === 0;
            default:
              return () => true;
          }
        },
      },
      {
        propertyName: "tags",
        label: "Tags",
        type: "dropdown",
        values: allTags,
        createPredicate: (data: FilterData): ((game: Game) => boolean) => {
          if (!data.value || !data.operator) {
            return () => true;
          }
          const value = data.value as string;
          switch (data.operator) {
            case "contains":
              return (g) => !!g.tags && g.tags.includes(value);
            case "not empty":
              return (g) => !!g.tags && g.tags.length > 0;
            case "empty":
              return (g) => !g.tags || g.tags.length === 0;
            default:
              return () => true;
          }
        },
      },
    ],
    [allGenres, allTags, rankingCategories]
  );

  const filteredData = useMemo(() => {
    let predicate: ((game: Game) => boolean) | undefined = undefined;

    for (const filter of filters) {
      if (!filter.propertyName) {
        continue;
      }
      const predicateForThisFilter = schema
        .find((s) => s.propertyName === filter.propertyName)!
        .createPredicate(filter);
      predicate = predicate
        ? (game: Game) => predicate!(game) && predicateForThisFilter(game)
        : predicateForThisFilter;
    }

    if (!predicate) {
      return data;
    }

    return data.filter(predicate);
  }, [data, filters, schema]);
  return (
    <div className="max-w-4xl mx-auto">
      {filters.map((f, i) => (
        <FilterSelector
          key={i}
          data={f}
          onDataChange={(newData) =>
            setFilters((old) => old.map((f, fi) => (fi === i ? newData : f)))
          }
          schema={schema}
        />
      ))}

      {filteredData.map((game) => (
        <GameCard key={game.gameUrl} game={game} />
      ))}
    </div>
  );
};

export default Games;
