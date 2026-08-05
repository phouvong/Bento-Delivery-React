import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileOrdersList from "./ProfileOrdersList";
import ProfileRidesList from "./ProfileRidesList";
import MyTrips from "components/home/module-wise-components/rental/components/my-trips/MyTrips";
import useGetMyOrdersList from "api-manage/hooks/react-query/order/useGetMyOrdersList";
import useGetServiceBookingList from "../home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useGetServiceBookingList";
import ModuleTabbedLayout from "./ModuleTabbedLayout";
import MyBookings from "../home/module-wise-components/service/components/my-bookings/MyBookings";
import { ModuleTypes } from "helper-functions/moduleTypes";

// ── Tab values ────────────────────────────────────────────────────────────────
const TAB_ALL = "all";


export const ORDER_TAB_MODULE_KEY = "orderTabModule";

const ProfileOrdersPage = ({ configData }) => {
  const router = useRouter();
  const { modules } = useSelector((state) => state.configData);
  const [offset, setOffset] = useState(1);
  const [activeFilterTab, setActiveFilterTab] = useState(TAB_ALL);

  const urlModuleId = router.query[ORDER_TAB_MODULE_KEY];
  const activeModule =
    (urlModuleId != null &&
      modules?.find((m) => String(m.id) === String(urlModuleId))) ||
    modules?.[0];
  const activeModuleId = activeModule?.id ?? null;

  useEffect(() => {
    setOffset(1);
    setActiveFilterTab(TAB_ALL);
  }, [activeModuleId]);

  const isService = activeModule?.module_type === ModuleTypes.SERVICE;
  const isRental = activeModule?.module_type === ModuleTypes.RENTAL;
  const isRide = activeModule?.module_type === ModuleTypes.RIDE;

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
    router.isReady && Boolean(activeModuleId) && !isService,
  );

  const {
    data: bookingsData,
    isFetching: isFetchingBookings,
    isLoading: isLoadingBookings,
  } = useGetServiceBookingList(
    { offset, tab: activeFilterTab, only_parent: 1 },
    router.isReady && Boolean(activeModuleId) && isService,
  );

  const onModuleChange = (module) => {
    if (!module || module.id === activeModuleId) return;
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
      ) : isService ? (
          <MyBookings
            {...{
              offset,
              setOffset,
              activeFilterTab,
              onFilterTabChange,
              isLoadingOrder: isFetchingBookings || isLoadingBookings,
              ordersData: bookingsData,
              moduleId: activeModule?.id,
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
