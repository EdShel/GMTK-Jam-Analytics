import React from "react";
import type { Game } from "../types/Game";

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
    genres,
    tags,
  },
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold">{name}</h2>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`${name} cover`}
          className="w-[250px] h-[200px] object-cover mb-4"
          loading="lazy"
        />
      ) : (
        <div className="w-[250px] h-[200px] bg-gray-200 mb-4 flex items-center justify-center">
          <span className="text-gray-500">No cover image</span>
        </div>
      )}
    </div>
  );
};

export default GameCard;
