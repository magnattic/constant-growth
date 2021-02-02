import { Observable, UnaryFunction } from 'rxjs';
import { TvShow } from '../TvShow';

export interface ShowDto {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    vote_average: number;
    popularity: number;
    first_air_date: string;
    genres: GenreDto[];
    seasons: Season[];
}

export interface ShowSearchResult {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    vote_average: number;
    popularity: number;
    first_air_date: string;
    genre_ids: number[];
    seasons: Season[];
}

export interface GenreDto {
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

export interface ShowApi {
    fetchShow: (showId: number) => Observable<TvShow>;
    getShowPoster: (show: TvShow, size?: number) => string;
    loadShowSearch: UnaryFunction<Observable<string>, Observable<TvShow[]>>;
    discoverShowsByGenres: (
        genreIds: number[],
        excludedGenreIds?: number[]
    ) => Observable<TvShow[]>;
}
