import { TvShow } from "../TvShow";

export interface ShowFilter {
  excludedGenreIds: number[];
}

export const createFilter = (filter: ShowFilter) => (show: TvShow) => {
  const showGenreIds = show.genres.map((g) => g.id);
  return !showGenreIds.some((showGenreId) =>
    filter.excludedGenreIds.includes(showGenreId)
  );
};
