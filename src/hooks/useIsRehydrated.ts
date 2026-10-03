import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface PersistedRootState {
  _persist?: { rehydrated?: boolean };
}

// Safety valve: if the flag never flips (persistor not started, storage
// unavailable, private-mode quota error) callers would sit disabled forever and
// never fetch. Better to lose the optimization than the feature.
const REHYDRATE_TIMEOUT_MS = 1000;

/**
 * True once redux-persist has replayed localStorage into the store.
 *
 * There is no `PersistGate` in `_app.js`, so the first client render always
 * sees each slice's `initialState` and rehydration lands a tick later. Any
 * "only fetch when the store is empty" guard must wait for this, otherwise it
 * reads an empty store on every reload and fires the request it was meant to
 * avoid.
 */
export const useIsRehydrated = (): boolean => {
  const rehydrated = useSelector(
    (state: PersistedRootState) => state._persist?.rehydrated === true,
  );
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (rehydrated) return;
    const id = setTimeout(() => setTimedOut(true), REHYDRATE_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [rehydrated]);

  return rehydrated || timedOut;
};

export default useIsRehydrated;
