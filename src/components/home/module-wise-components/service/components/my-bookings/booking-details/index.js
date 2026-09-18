import OtherOrder from "components/my-orders/order-details/other-order";
import PushNotificationLayout from "components/PushNotificationLayout";
import { useEffect } from "react";
import useGetServiceBookingDetails from "../../../service-api-manage/hooks/react-query/booking/useGetServiceBookingDetails";

const BookingDetails = ({ configData, id, page }) => {
  const {
    refetch,
    data,
    isRefetching,
    isLoading: dataIsLoading,
  } = useGetServiceBookingDetails({ id });
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  return (
    <div>
      <PushNotificationLayout
        pathName="profile"
      >
        <OtherOrder
          configData={configData}
          data={data}
          refetch={refetch}
          id={id}
          dataIsLoading={dataIsLoading}
          page={page}
          isBooking
        />
      </PushNotificationLayout>
    </div>
  );
};

BookingDetails.propTypes = {};

export default BookingDetails;

