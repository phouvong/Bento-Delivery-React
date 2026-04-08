import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useGetOrderDetails from "../../../api-manage/hooks/react-query/order/useGetOrderDetails";
import useGetTrackOrderData from "../../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import OtherOrder from "./other-order";
import { getGuestId, getToken } from "helper-functions/getToken";
import { useSelector } from "react-redux";
import PushNotificationLayout from "../../PushNotificationLayout";

const OrderDetails = ({ configData, id, page }) => {
  const router = useRouter();
  const guestId = getGuestId();
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const phone = guestUserInfo?.contact_person_number || router.query?.phone;
  const {
    refetch,
    data,
    isRefetching,
    isLoading: dataIsLoading,
  } = useGetOrderDetails(id, guestId);
  const { refetch: refetchTrackOrder, data: trackOrderData } =
    useGetTrackOrderData(id, phone, guestId);
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  useEffect(() => {
    if (!id) return;

    if (getToken() || phone) {
      refetchTrackOrder();
    }
  }, [id, phone, guestId, refetchTrackOrder]);

  return (
    <div>
      <PushNotificationLayout
        refetchTrackOrder={refetchTrackOrder}
        pathName="profile"
      >
        <OtherOrder
          configData={configData}
          data={data}
          refetch={refetch}
          id={id}
          dataIsLoading={dataIsLoading}
          page={page}
        />
      </PushNotificationLayout>
    </div>
  );
};

OrderDetails.propTypes = {};

export default OrderDetails;
