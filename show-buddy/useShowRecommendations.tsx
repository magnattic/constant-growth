import { useContext, useEffect, useState } from "react";
import { ShowDto } from "./show-api/ShowApi";
import { ShowApiContext } from "./show-api/ShowApiContext";
import { ShowFilterContext } from "./show-api/ShowFilterContext";
import { buddy } from "./show-recommendation/buddy";

export const useShowRecommendations = (
  show: ShowDto | null,
  plexShows: string[]
) => {
  const showApi = useContext(ShowApiContext);
  const showFilter = useContext(ShowFilterContext);
  const [showRecommendations, setShowRecommendations] = useState(
    [] as ShowDto[]
  );

  useEffect(() => {
    if (showApi && plexShows && show) {
      const subscription = buddy(showApi, plexShows)
        .recommendSimilarShows(show, showFilter)
        .subscribe((shows) => setShowRecommendations(shows));
      return () => subscription.unsubscribe();
    }
  }, [plexShows, showApi, showFilter, show]);

  return showRecommendations;
};
