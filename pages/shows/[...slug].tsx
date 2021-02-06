import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { fetchShows } from '../../show-buddy/plex-api';
import { ShowFilterContext } from '../../show-buddy/show-api/ShowFilterContext';
import ShowDetails from '../../show-buddy/ShowDetails';
import styles from './index.module.scss';

const ShowDetailsPage: React.FC = (props) => {
    const router = useRouter();
    console.log(router.query);
    const { slug } = router.query as { slug: string[] };

    const [plexShows, setPlexShows] = useState([] as string[]);

    useEffect(() => {
        fetchShows().then((shows) => {
            setPlexShows(shows);
        });
    }, []);

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
                                showId={Number(slug[0])}
                                plexShows={plexShows}
                            />
                        )}
                    </ShowFilterContext.Provider>
                </div>
            </div>
        </section>
    );
};

// export const getStaticProps: GetStaticProps<Props> = async () => {
//     const blogEntries = await loadBlogEntries();

//     return {
//         path:
//         props: {
//             blogEntries,
//         },
//     };
// };

export default React.memo(ShowDetailsPage);
