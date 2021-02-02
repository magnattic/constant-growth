export interface TvShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  popularity: number;
  first_air_date: string;
  genres: Genre[];
  seasons: Season[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Season {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  episode_count: number;
  episodes: Episode[];
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  air_date: string;
}
