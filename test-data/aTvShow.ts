import { TvShow } from '../show-buddy/TvShow';
import { random, sample } from 'lodash';

export const aTvShow = (): TvShow => ({
    id: random(1000, 9999),
    backdrop_path: '/7NlcCG8WxQzlYxkDNOmjMVPaFKb.jpg',
    name: sample(['Community', 'Lost'])!,
    first_air_date: '2018-01-13',
    genres: [{ id: 1, name: 'Comedy' }],
    overview: 'A very good show.',
    popularity: 99.9,
    poster_path: '5yzb0iWXilLpg3iz1LT3H3UGBYs.jpg',
    seasons: [],
    vote_average: 9.9,
});
