import Router from "next/router";
import { getModuleId } from "./getModuleId";

// The BOGO sidebar tab pushes straight to `/bogo-list` bypassing
// ModuleHomeSidebarLayout's normal module-forwarding logic, so it must
// resolve the current module itself instead of dropping the query param.
export const navigateToBogoList = () => {
  const currentModule =
    Router.query?.module || Router.query?.module_id || getModuleId();
  Router.push(
    currentModule ? `/bogo-list?module=${currentModule}` : "/bogo-list",
  );
};
