import { useRouter } from 'next/router';
import React, {
    ChangeEventHandler,
    useContext,
    useEffect,
    useState,
} from 'react';
import { ReplaySubject } from 'rxjs';
import { ShowApiContext } from '../show-api/ShowApiContext';
import PhantomShowCard from '../show-card/PhantomShowCard';
import ShowCard from '../show-card/ShowCard';
import { TvShow } from '../TvShow';
import styles from './ShowSearch.module.scss';

const valueChanged$ = new ReplaySubject<string>(1);

export const ShowSearch: React.FC<{
    onSearchChanged?: (search: string) => void;
}> = (props) => {
    const showApi = useContext(ShowApiContext);

    const router = useRouter();

    const [state, setState] = useState({
        search: '',
        searchResults: [] as (TvShow | null)[],
    });

    useEffect(() => {
        const subscription = valueChanged$
            .pipe(showApi.loadShowSearch)
            .subscribe((shows) =>
                setState((state) => ({
                    ...state,
                    searchResults: shows,
                }))
            );
        return () => subscription.unsubscribe();
    }, [showApi]);

    const searchValueChanged: ChangeEventHandler<HTMLInputElement> = (e) => {
        const search = e.target.value;
        setState((state) => ({
            ...state,
            search,
            searchResults: [null, null, null, null, null],
        }));
        valueChanged$.next(search);
    };

    const searchResultSelected = (show: TvShow) => {
        router.push(`/shows/${show.id}/${show.name}`);
        const search = show.name;
        props.onSearchChanged && props.onSearchChanged(search);
        setState((state) => ({
            ...state,
            search,
            searchResults: [],
        }));
    };

    return (
        <React.Fragment>
            <div className={`${styles.showSearch} is-inline-block`}>
                <input
                    type="text"
                    className="input"
                    placeholder="Your favorite show"
                    value={state.search}
                    onChange={searchValueChanged}
                ></input>
            </div>
            <div
                className={`columns ${styles.showSuggestions} ${
                    state.searchResults.length > 0
                        ? styles.showSuggestionsVisible
                        : ''
                }`}
            >
                {state.searchResults.length > 0 &&
                    state.searchResults.map((show, index) => (
                        <div
                            className="column is-one-fifth"
                            key={`show_${index}`}
                        >
                            {show !== null ? (
                                <ShowCard
                                    show={show}
                                    showClicked={() =>
                                        searchResultSelected(show)
                                    }
                                />
                            ) : (
                                <PhantomShowCard />
                            )}
                        </div>
                    ))}
            </div>
        </React.Fragment>
    );
};

export default React.memo(ShowSearch);
