import { forkJoin, of, pipe } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import {
    Episode,
    GenreDto,
    Season,
    ShowApi,
    ShowDto,
    ShowSearchResult,
} from './ShowApi';

export interface Config {
    images: {
        base_url: string;
        secure_base_url: string;
        poster_sizes: string[];
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fakeGenres: GenreDto[] = [
    {
        id: 10759,
        name: 'Action & Adventure',
    },
    {
        id: 16,
        name: 'Animation',
    },
    {
        id: 35,
        name: 'Comedy',
    },
    {
        id: 80,
        name: 'Crime',
    },
    {
        id: 99,
        name: 'Documentary',
    },
    {
        id: 18,
        name: 'Drama',
    },
    {
        id: 10751,
        name: 'Family',
    },
    {
        id: 10762,
        name: 'Kids',
    },
    {
        id: 9648,
        name: 'Mystery',
    },
    {
        id: 10763,
        name: 'News',
    },
    {
        id: 10764,
        name: 'Reality',
    },
    {
        id: 10765,
        name: 'Sci-Fi & Fantasy',
    },
    {
        id: 10766,
        name: 'Soap',
    },
    {
        id: 10767,
        name: 'Talk',
    },
    {
        id: 10768,
        name: 'War & Politics',
    },
    {
        id: 37,
        name: 'Western',
    },
];

const fakeShows: ShowDto[] = [
    {
        id: 4076,
        name: 'Lost',
        overview:
            'Lost ist ne super Show, echt ma!\nLeute sind auf ner Insel und kommische Sachen passieren! Die letzte Staffel ist leider mist, aber davor echt cool.\n\nHier noch mehr Text damit man sieht was bei Überlänge passiert.',
        genres: [
            {
                id: 1000,
                name: 'Action & Adventure',
            },
        ],
        first_air_date: '2010-10-19',
        vote_average: 9.8,
    } as ShowDto,
    {
        id: 4079,
        name: 'How I Met Your Mother',
        overview:
            'Lost ist ne super Show, echt ma!\nLeute sind auf ner Insel und kommische Sachen passieren! Die letzte Staffel ist leider mist, aber davor echt cool.\n\nHier noch mehr Text damit man sieht was bei Überlänge passiert.',
        genres: [
            {
                id: 2002,
                name: 'Comedy',
            },
            {
                id: 3999,
                name: 'Drama',
            },
        ],
        first_air_date: '2010-10-19',
        vote_average: 5.8,
    } as ShowDto,
];

const fetchShows = (search: string) =>
    fromFetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&query=${search}&pag=1`
    ).pipe(
        switchMap((res) => res.json()),
        map((json) => json.results as ShowDto[])
    );

const fetchShow = (showId: number) => of({ ...fakeShows[0], id: showId });

const fetchSeasons = (showId: number) =>
    fetchShow(showId).pipe(map((json) => json.seasons as Season[]));

const fetchEpisodes = (showId: number, seasonNumber: number) =>
    fromFetch(
        `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
    ).pipe(
        switchMap((res) => res.json()),
        map((json) => json.episodes as Episode[])
    );

export const loadShowByName = (search: string) =>
    fetchShows(search).pipe(map((shows) => shows[0]));

export const loadShowSearch = pipe(
    debounceTime<string>(200),
    switchMap((search) => (search ? of(fakeShows) : of([])))
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

export const loadSeasonsWithEpisodes = () =>
    pipe(
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

const getShowPoster = (show: ShowDto | ShowSearchResult) =>
    '/mayflower_klein.jpg';

export const FakeShowApi: ShowApi = {
    fetchShow,
    getShowPoster,
    loadShowSearch,
    discoverShowsByGenres: () => of([]),
};
