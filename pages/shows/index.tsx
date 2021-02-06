import React, { useEffect, useState } from 'react';
import { fetchShows } from '../../show-buddy/plex-api';
import { ShowFilterContext } from '../../show-buddy/show-api/ShowFilterContext';
import { ShowSearch } from '../../show-buddy/show-search/ShowSearch';
import styles from './index.module.scss';

const ShowBuddy: React.FC = (props) => {
    const [plexShows, setPlexShows] = useState([] as string[]);
    useEffect(() => {
        fetchShows().then((shows) => {
            setPlexShows(shows);
        });
    }, []);

    // const routes = {
    //     '/:id/:name': ({ id }: HookRouter.QueryParams) => (
    //         <ShowDetails showId={id} plexShows={plexShows} />
    //     ),
    //     '/': () => <ShowSearch />,
    // };

    // const routeResult = useRoutes(routes);

    return (
        <section className={styles.showBuddy}>
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">ShowBuddy</h1>
                    <ShowFilterContext.Provider
                        value={{ excludedGenreIds: [16] }}
                    >
                        {/* {routeResult} */}
                        <ShowSearch />
                    </ShowFilterContext.Provider>
                </div>
            </div>
        </section>
    );
};

export default React.memo(ShowBuddy);
