export type Game = {
  gameUrl: string;
  submissionUrl: string;
  coverUrl: string | null;
  name: string;
  authors: { url: string; name: string }[];
  ratingsCount: number;
  ranks: {
    category: string;
    place: number;
    score: number;
    rawScore: number;
  }[];
  genres: string[] | undefined;
  tags: string[] | undefined;
};
