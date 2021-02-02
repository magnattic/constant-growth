import { createContext } from "react";
import { ShowFilter } from "./ShowFilter";

export const ShowFilterContext = createContext<ShowFilter>({
  excludedGenreIds: [],
});
