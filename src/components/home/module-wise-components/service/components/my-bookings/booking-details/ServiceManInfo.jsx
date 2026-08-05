import { Stack } from "@mui/material";
import DeliveryManInfo from "components/my-orders/order-details/other-order/DeliveryManInfo";

const ServiceManInfo = ({ servicemenData, configData, storeData }) => {
  return (
    <Stack gap={{ xs: "4px", md: "6px" }} width="100%">
      {servicemenData?.map((serviceman) => (
        <DeliveryManInfo
          key={serviceman?.id}
          deliveryManData={serviceman}
          configData={configData}
          storeData={storeData}
          isBooking
          isServiceman
        />
      ))}
    </Stack>
  );
};

export default ServiceManInfo;
