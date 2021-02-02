import { map } from "rxjs/operators";
import { ShowApi } from "../show-api/ShowApi";
import { ShowFilter } from "../show-api/ShowFilter";
import { TvShow } from "../TvShow";

export const buddy = (showApi: ShowApi, plexShows: string[]) => {
  return {
    recommendShowsByGenre: (genreIds: number[]) =>
      showApi
        .discoverShowsByGenres(genreIds)
        .pipe(
          map((recommendations) =>
            recommendations.filter((show) => !plexShows.includes(show.name))
          )
        ),
    recommendSimilarShows: (show: TvShow, showFilter: ShowFilter) => {
      const genresIds = show.genres.map((g) => g.id);
      return showApi
        .discoverShowsByGenres(genresIds, showFilter.excludedGenreIds)
        .pipe(map((recs) => recs.filter((rec) => rec.id !== show.id)));
    },
  };
};
