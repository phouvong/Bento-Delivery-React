import MainApi from "../../MainApi";
import { landing_page_api } from "../../ApiRoutes";
import { getApiContent } from "../../getApiContent";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setLandingPage } from "redux/slices/storedData";
import useIsRehydrated from "hooks/useIsRehydrated";

const getData = async () => {
  const { data } = await MainApi.get(landing_page_api);
  return getApiContent(data);
};

const STALE_TIME = 1000 * 60 * 15;

// Four components consume this (page, LandingLayout, footer, home). With
// `enabled: false` each had to call refetch() on mount, and refetch() ignores
// staleTime — so the same landing payload was fetched four times per page load.
// One shared, enabled query fixes that within a session.
//
// react-query's cache is memory-only though, so every reload started cold and
// refetched. The payload is CMS content that changes rarely, so it is mirrored
// into redux (`storedData` survives redux-persist) and read back here. Note the
// persisted copy is returned as `data` rather than passed as react-query's
// `initialData`: initialData is only honoured when the query is first created,
// which on a reload is one render before rehydration has restored anything.
export default function useGetLandingPage() {
  const dispatch = useDispatch();
  const isRehydrated = useIsRehydrated();
  const cached = useSelector((state) => state.storedData?.landingPage);

  const cachedData = cached?.data ?? undefined;
  const cachedIsStale =
    !cachedData ||
    !cached?.fetchedAt ||
    Date.now() - cached.fetchedAt > STALE_TIME;

  const query = useQuery("landing-page-data", getData, {
    // Until rehydration lands the store still holds initialState, so deciding
    // now would discard the persisted copy and refetch on every reload.
    enabled: isRehydrated && cachedIsStale,
    staleTime: STALE_TIME,
    cacheTime: 1000 * 60 * 30,
    onSuccess: (data) => {
      if (data) dispatch(setLandingPage({ data, fetchedAt: Date.now() }));
    },
  });

  return { ...query, data: query.data ?? cachedData };
}
