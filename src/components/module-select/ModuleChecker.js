import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setSelectedModule } from "redux/slices/utils";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import toast from "react-hot-toast";
import { setModules } from "redux/slices/configData";
import { getSavedModuleIdentifier, saveModuleParam } from "../../utils/moduleParamManager";

// Whether the module currently in localStorage IS the one the URL asks for
// (matched loosely by slug/module_type/id, same as the resolver below).
// Used to decide whether a sync is even needed, instead of only checking
// "is storage empty" — on a fast switch between modules, storage already
// holds the PREVIOUS module, so an empty-only check never notices the
// mismatch and every downstream query keeps reading the stale module.
const storedModuleMatchesUrl = (identifier, storedModule) => {
  if (!storedModule) return false;
  const idStr = String(identifier);
  return (
    String(storedModule?.slug) === idStr ||
    String(storedModule?.module_type) === idStr ||
    String(storedModule?.id) === idStr
  );
};

const ModuleChecker = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, refetch } = useGetModule();
  
// useEffect(() => {
//     if (data) {
//       dispatch(setModules(data));
//     }
//   }, [data]);
  // Sync Storage -> URL (keep module param on every route)
  useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return;

    const moduleFromUrl = router.query.module;
    const legacyModuleId = router.query.module_id;

    const storedIdentifier =
      getSavedModuleIdentifier() ||
      JSON.parse(localStorage.getItem("module") || "null")?.slug ||
      JSON.parse(localStorage.getItem("module") || "null")?.id;

    const identifierToUse = moduleFromUrl || legacyModuleId || storedIdentifier;

    if (!identifierToUse) return;

    // Add module if missing, and/or remove legacy module_id
    if (!moduleFromUrl || legacyModuleId) {
      const { module_id: _legacy, ...restQuery } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: { ...restQuery, module: String(identifierToUse) },
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
  }, [router.isReady, router.asPath]);

  // Sync URL -> Storage
  useEffect(() => {
    const moduleIdFromUrl = router.query.module || router.query.module_id;
    if (!moduleIdFromUrl) return;

    const storedModule = JSON.parse(localStorage.getItem("module") || "null");
    if (!storedModuleMatchesUrl(moduleIdFromUrl, storedModule)) {
      refetch();
    }
  }, [router.query.module, router.query.module_id, refetch]);

  useEffect(() => {
    const moduleIdFromUrl = router.query.module || router.query.module_id;
    const storedModule = JSON.parse(localStorage.getItem("module") || "null");
    const alreadyMatches = storedModuleMatchesUrl(moduleIdFromUrl, storedModule);

    if (data && moduleIdFromUrl && !alreadyMatches) {
      const moduleIdStr = String(moduleIdFromUrl);
      const selectedModule = data.find(
        (item) =>
          String(item?.slug) === moduleIdStr ||
          String(item?.module_type) === moduleIdStr ||
          String(item?.id) === moduleIdStr
      );
      if (selectedModule) {
        localStorage.setItem("module", JSON.stringify(selectedModule));
        saveModuleParam(selectedModule?.id, selectedModule?.slug);
        dispatch(setSelectedModule(selectedModule));
      }else{
        toast.error("Selected module is not available");
        localStorage.removeItem("module");
        router.replace(
          { pathname: "/", query: {} },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [data, router.query.module, router.query.module_id, dispatch]);

  return null;
};

export default ModuleChecker;
