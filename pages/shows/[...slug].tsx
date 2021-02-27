import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { of } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { fetchShows } from '../../show-buddy/plex-api';
import { Season, ShowDto } from '../../show-buddy/show-api/ShowApi';
import { ShowFilterContext } from '../../show-buddy/show-api/ShowFilterContext';
import {
    loadSeasonsWithEpisodes,
    TmdbShowApi,
} from '../../show-buddy/show-api/TmdbApi';
import ShowDetails from '../../show-buddy/ShowDetails';
import styles from './index.module.scss';

const ShowDetailsPage: React.FC<{
    show: ShowDto;
    seasons: Season[];
    plexShows: string[];
    isShowInPlex: boolean;
}> = ({ show, seasons, plexShows, isShowInPlex }) => {
    const router = useRouter();
    const { slug } = router.query as { slug: string[] };

    return (
        <section className={styles.showBuddy}>
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">ShowBuddy</h1>
                    <ShowFilterContext.Provider
                        value={{ excludedGenreIds: [16] }}
                    >
                        {!router.isFallback && slug && (
                            <ShowDetails
                                show={show}
                                seasons={seasons}
                                showId={Number(slug[0])}
                                plexShows={plexShows}
                                isShowInPlex={isShowInPlex}
                            />
                        )}
                    </ShowFilterContext.Provider>
                </div>
            </div>
        </section>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const showId = Number(context.params?.slug?.[0]);
    const show = await TmdbShowApi.fetchShow(showId).toPromise();
    const { seasons } = await of(show.name)
        .pipe(loadSeasonsWithEpisodes)
        .toPromise();
    return {
        props: {
            show,
            seasons,
            plexShows: await fetchShows(),
        }, // will be passed to the page component as props
    };
};

export default ShowDetailsPage;
