import { useContext, useEffect, useState } from "react";
import { of } from "rxjs";
import { Season, ShowDto } from "./show-api/ShowApi";
import { ShowApiContext } from "./show-api/ShowApiContext";
import { loadSeasonsWithEpisodes } from "./show-api/TmdbApi";

export const useFetchShow = (showId: number, plexShows: string[]) => {
  const [state, setState] = useState({
    show: null as ShowDto | null,
    isShowInPlex: false,
    seasons: [] as Season[],
  });

  const showApi = useContext(ShowApiContext);

  useEffect(() => {
    const subscription = showApi.fetchShow(showId).subscribe((show) => {
      setState((state) => ({
        ...state,
        show,
        isShowInPlex: plexShows.includes(show.name),
      }));
    });
    return () => subscription.unsubscribe();
  }, [showId, plexShows, showApi]);

  useEffect(() => {
    const subscription = of(state.show ? state.show.name : "")
      .pipe(loadSeasonsWithEpisodes)
      .subscribe(({ seasons }) =>
        setState((state) => ({
          ...state,
          seasons,
        }))
      );
    return () => subscription.unsubscribe();
  }, [showApi, state.show]);

  return state;
};
