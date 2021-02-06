import { forkJoin, from, of, pipe } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
    concatMap,
    debounceTime,
    delay,
    filter,
    map,
    switchMap,
    toArray,
    withLatestFrom,
} from 'rxjs/operators';
import { combinations } from '../../utils/combinations';
import { TvShow } from '../TvShow';
import {
    Episode,
    GenreDto,
    Season,
    ShowApi,
    ShowDto,
    ShowSearchResult,
} from './ShowApi';
import { toShow, toShowFromSearch } from './toShow';

export interface Config {
    images: {
        base_url: string;
        secure_base_url: string;
        poster_sizes: string[];
    };
}

const baseUrl = 'https://api.themoviedb.org/3/';
const buildApiUrl = (path: string, query?: { [key: string]: string }) => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY!;
    const queryParams = new URLSearchParams(
        Object.entries({
            api_key: apiKey,
            ...query,
        })
    );
    return `${baseUrl}${path}?${queryParams}`;
};

export const discoverShowsByGenres = (
    genreIds: number[],
    excludedGenreIds?: number[]
) =>
    from(combinations(genreIds).reverse()).pipe(
        concatMap((genreIdSubset) =>
            fromFetch(
                buildApiUrl('discover/tv', {
                    with_original_language: 'en',
                    with_genres: genreIdSubset.join(','),
                    without_genres: excludedGenreIds
                        ? excludedGenreIds.join(',')
                        : '',
                    sort_by: 'vote_average.desc',
                    'vote_count.gte': '200',
                    'first_air_date.gte': '2000',
                })
            )
        ),
        switchMap((res) => res.json()),
        map((json) => json.results as ShowSearchResult[]),
        toArray(),
        // tap(show => console.log(show.map(s => s.name)))
        // tap(x => console.log(JSON.stringify(x.map(y => y.map(z => z.name))))),
        map((shows) => shows.flat()),
        map((shows) =>
            shows.filter(
                (value, index, self) =>
                    self.findIndex((item) => item.id === value.id) === index
            )
        ),
        withLatestFrom(fetchGenres()),
        map(([shows, genres]) =>
            shows.map((show) => toShowFromSearch(show, genres))
        )
    );

const fetchShows = (search: string) =>
    fromFetch(buildApiUrl('search/tv', { query: search, pag: '1' })).pipe(
        switchMap((res) => res.json()),
        map((json) => json.results as ShowSearchResult[])
    );

export const fetchShow = (showId: number) =>
    fromFetch(buildApiUrl(`tv/${showId}`)).pipe(
        switchMap((res) => res.json() as Promise<ShowDto>),
        map((showDto) => toShow(showDto))
    );

const fetchSeasons = (showId: number) =>
    fetchShow(showId).pipe(map((json) => json.seasons as Season[]));

const fetchEpisodes = (showId: number, seasonNumber: number) =>
    fromFetch(buildApiUrl(`tv/${showId}/season/${seasonNumber}`)).pipe(
        switchMap((res) => res.json()),
        map((json) => json.episodes as Episode[])
    );

const fetchGenres = () =>
    fromFetch<{ genres: GenreDto[] }>(buildApiUrl('genre/tv/list'), {
        selector: (res) => res.json(),
    }).pipe(map((res) => res.genres));

export const loadShowByName = (search: string) =>
    fetchShows(search).pipe(map((shows) => shows[0]));

const loadShowSearch = pipe(
    debounceTime<string>(200),
    delay(1000),
    switchMap((search) =>
        search
            ? fetchShows(search).pipe(map((shows) => shows.slice(0, 5)))
            : of([])
    ),
    withLatestFrom(fetchGenres()),
    map(([shows, genres]) =>
        shows.map((show) => toShowFromSearch(show, genres))
    )
);

export const loadShow = () =>
    pipe(
        switchMap((search: string) =>
            search ? loadShowByName(search) : of(null)
        )
    );

export const loadSeasons = () =>
    pipe(
        loadShow(),
        switchMap((show) =>
            show
                ? fetchSeasons(show.id).pipe(
                      map((seasons) => ({ show, seasons }))
                  )
                : of({ show: null as ShowDto | null, seasons: [] as Season[] })
        )
    );

export const loadSeasonsWithEpisodes = pipe(
    loadSeasons(),
    filter(({ show }) => show != null),
    switchMap(({ show, seasons }) =>
        forkJoin(
            seasons.map((season: Season) =>
                fetchEpisodes(show!.id, season.season_number).pipe(
                    map((episodes) => ({ ...season, episodes } as Season))
                )
            )
        ).pipe(map((seasons) => ({ show, seasons })))
    )
);

export const loadEpisodes = () =>
    pipe(
        loadSeasons(),
        switchMap(({ show, seasons }) =>
            show ? of({ show, seasons }) : of({ show: null, seasons: [] })
        )
    );

export const getShowPoster = (show: TvShow, size = 300) => {
    const imagePath = show.backdrop_path || show.poster_path;
    return imagePath
        ? `http://image.tmdb.org/t/p/w${size}${imagePath}`
        : '/dummy.jpg';
};

export const TmdbShowApi: ShowApi = {
    fetchShow,
    getShowPoster,
    loadShowSearch,
    discoverShowsByGenres,
};
