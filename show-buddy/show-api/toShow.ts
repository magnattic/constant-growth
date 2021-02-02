import { TvShow } from "../TvShow";
import { GenreDto, ShowDto, ShowSearchResult } from "./ShowApi";

export const toShow = (show: ShowDto): TvShow => {
  return show;
};

export const toShowFromSearch = (
  dto: ShowSearchResult,
  genres: GenreDto[]
): TvShow => {
  const showGenres = dto.genre_ids
    .map((id) => genres.find((g) => g.id === id))
    .filter((x): x is GenreDto => x != null);
  return {
    id: dto.id,
    name: dto.name,
    backdrop_path: dto.backdrop_path,
    first_air_date: dto.first_air_date,
    overview: dto.overview,
    popularity: dto.popularity,
    poster_path: dto.poster_path,
    seasons: dto.seasons,
    vote_average: dto.vote_average,
    genres: showGenres,
  };
};
