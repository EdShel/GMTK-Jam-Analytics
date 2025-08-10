import React from "react";
import type { Game } from "../types/Game";
import Chip from "./Chip";

interface Props {
  game: Game;
}

const GameCard: React.FC<Props> = ({
  game: {
    gameUrl,
    submissionUrl,
    coverUrl,
    name,
    authors,
    ratingsCount,
    ranks,
    platforms,
    genres,
    madeWith,
    tags,
  },
}) => {
  const sortedRanks = [...ranks].sort((a, b) =>
    a.category.localeCompare(b.category)
  );
  return (
    <div className="flex gap-4">
      <a href={gameUrl} className="block shrink-0">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${name} cover`}
            className="block w-[250px] h-[200px] object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-[250px] h-[200px] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No cover image</span>
          </div>
        )}
      </a>
      <div className="grow flex flex-col">
        <h2 className="text-2xl font-bold">
          <a href={gameUrl}>{name}</a>{" "}
          <span className="text-sm font-medium text-gray-600">
            by{" "}
            {authors.map((a, i) => (
              <React.Fragment key={i}>
                {i > 0 && ", "}
                <a href={a.url} className="underline">
                  {a.name}
                </a>
              </React.Fragment>
            ))}
          </span>
        </h2>

        <div className="flex flex-wrap gap-2 mt-2">
          {genres?.map((g, i) => (
            <Chip key={i} title="Genre" className="bg-emerald-800 text-white">
              {g}
            </Chip>
          ))}
          {platforms?.map((p, i) => (
            <Chip key={i} title="Platform" className="bg-yellow-700 text-white">
              {p}
            </Chip>
          ))}
          {madeWith?.map((m, i) => (
            <Chip
              key={i}
              title="Made with"
              className="bg-purple-700 text-white"
            >
              {m}
            </Chip>
          ))}
          {tags?.map((t, i) => (
            <Chip key={i} title="Tag" className="bg-sky-700 text-white">
              #{t}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {sortedRanks.map((rank, i) => (
            <Chip
              key={i}
              title={`${rank.score} score`}
              className="bg-amber-200 text-black font-bold"
            >
              #{rank.place} in {rank.category}
            </Chip>
          ))}
        </div>

        <div className="grow flex flex-col justify-end">
          <div className="flex flex-wrap gap-4 items-end">
            <a
              href={gameUrl}
              className="bg-amber-700 text-white font-bold px-4 py-2 rounded mt-4 inline-block hover:bg-amber-800 transition-colors"
            >
              Open game page
            </a>
            <a
              href={`https://itch.io${submissionUrl}`}
              className="py-2 text-zinc-700 underline"
            >
              View submission page ({ratingsCount} votes)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
