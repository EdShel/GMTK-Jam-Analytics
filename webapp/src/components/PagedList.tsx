import React from "react";
import type { Game } from "../types/Game";
import GameCard from "./GameCard";
import { useQuery } from "crossroad";

interface Props {
  games: Game[];
}

const PagedList: React.FC<Props> = ({ games }) => {
  const [page, setPage] = useQuery("page");
  const itemsPerPage = 20;
  const currentPage = (page && Number(page)) || 1;
  const totalPages = Math.ceil(games.length / itemsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 gap-12">
        {games
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((game) => (
            <GameCard key={game.gameUrl} game={game} />
          ))}
      </div>

      {games.length > itemsPerPage && (
        <div className="flex justify-center mt-12 gap-2">
          {calculatePagination(currentPage, totalPages).map((page, index) =>
            page === "..." ? (
              <span key={index} className="mx-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setPage(String(page))}
                className={`rounded px-3 py-1 ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } cursor-pointer`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PagedList;

function calculatePagination(
  currentPage: number,
  totalPages: number
): (number | "...")[] {
  const maxVisiblePages = 5;
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}
