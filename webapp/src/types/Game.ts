export type Game = {
  gameUrl: string;
  submissionUrl: string;
  coverUrl: string;
  name: string;
  authors: { url: string; name: string }[];
  ratingsCount: number;
  ranks: {
    category: string;
    place: number;
    score: string;
    rawScore: string;
  }[];
  genres: string[];
  tags: string[];
};
