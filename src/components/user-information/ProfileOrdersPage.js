import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileOrdersList from "./ProfileOrdersList";
import ProfileRidesList from "./ProfileRidesList";
import MyTrips from "components/home/module-wise-components/rental/components/my-trips/MyTrips";
import useGetMyOrdersList from "api-manage/hooks/react-query/order/useGetMyOrdersList";
import ModuleTabbedLayout from "./ModuleTabbedLayout";
import { ModuleTypes } from "helper-functions/moduleTypes";

// ── Tab values ────────────────────────────────────────────────────────────────
const TAB_ALL = "all";

// URL query key that persists the currently selected order module tab.
// Intentionally separate from the system-wide `module` param so the two never
// collide. The selected module is derived from this key so it survives reloads
// and the "Back to Orders" round-trip, while an Orders & Trips menu click (which
// pushes a URL without this key) naturally resets to the first module.
export const ORDER_TAB_MODULE_KEY = "orderTabModule";

const ProfileOrdersPage = ({ configData }) => {
  const router = useRouter();
  const { modules } = useSelector((state) => state.configData);
  const [offset, setOffset] = useState(1);
  const [activeFilterTab, setActiveFilterTab] = useState(TAB_ALL);

  // Active module is derived from the URL. Falls back to the first module when
  // the param is missing (e.g. after the Orders & Trips menu item resets the
  // query) or when it points to a module that no longer exists.
  const urlModuleId = router.query[ORDER_TAB_MODULE_KEY];
  const activeModule =
    (urlModuleId != null &&
      modules?.find((m) => String(m.id) === String(urlModuleId))) ||
    modules?.[0];
  const activeModuleId = activeModule?.id ?? null;

  // Reset paging + filter whenever the resolved module changes (tab click,
  // back navigation, or menu reset).
  useEffect(() => {
    setOffset(1);
    setActiveFilterTab(TAB_ALL);
  }, [activeModuleId]);

  const {
    data: ordersData,
    isFetching: isFetchingOrder,
    isLoading: isLoadingOrder,
  } = useGetMyOrdersList(
    {
      orderType: "list",
      offset,
      moduleId: activeModuleId,
      type: activeFilterTab || TAB_ALL,
    },
    router.isReady && Boolean(activeModuleId),
  );

  const isRental = activeModule?.module_type === ModuleTypes.RENTAL;
  const isRide = activeModule?.module_type === ModuleTypes.RIDE;

  const onModuleChange = (module) => {
    if (!module || module.id === activeModuleId) return;
    // Persist the selection in the URL (shallow) so it survives reloads and the
    // order-details → back round-trip.
    router.push(
      {
        pathname: "/profile",
        query: { ...router.query, [ORDER_TAB_MODULE_KEY]: module.id },
      },
      undefined,
      { shallow: true },
    );
  };
  const onFilterTabChange = (tab) => {
    setOffset(1);
    setActiveFilterTab(tab?.key);
  };

  return (
    <ModuleTabbedLayout
      activeModuleId={activeModuleId}
      onModuleChange={onModuleChange}
    >
      {isRental ? (
        <MyTrips
          {...{
            offset,
            setOffset,
            activeFilterTab,
            onFilterTabChange,
            isLoadingOrder: isFetchingOrder || isLoadingOrder,
            ordersData,
            configData,
          }}
        />
      ) : isRide ? (
        <ProfileRidesList
          {...{
            offset,
            setOffset,
            activeFilterTab,
            onFilterTabChange,
            isLoadingOrder: isFetchingOrder || isLoadingOrder,
            ordersData,
          }}
        />
      ) : (
        <ProfileOrdersList
          {...{
            offset,
            setOffset,
            activeFilterTab,
            onFilterTabChange,
            isLoadingOrder: isFetchingOrder || isLoadingOrder,
            ordersData,
            moduleId: activeModule?.id,
            configData,
          }}
        />
      )}
    </ModuleTabbedLayout>
  );
};

export default ProfileOrdersPage;
