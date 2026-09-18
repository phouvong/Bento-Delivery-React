import { Grid } from "@mui/material";
import useBookingRelation from "api-manage/hooks/custom-hooks/useBookingRelation";
import ServiceList from "./single-booking/ServiceList";
import RepeatBookingInfo from "./repeat-booking/RepeatBookingInfo";

const BookingInfo = ({
  data,
  summaryData,
  configData,
  items,
  t,
  isSmall,
}) => {
  const { isSubBooking, hasRepeatOccurrences } = useBookingRelation({
    isBooking: true,
    data,
  });

  if (data?.booking_type !== "repeat" && data?.booking_type !== "regular") {
    return null;
  }

  return (
    <Grid item xs={12} sm={12} md={12} pl={{ xs: "0px", sm: "20px", md: "25px" }}>
      {data?.booking_type === "repeat" && hasRepeatOccurrences && !isSubBooking ? (
        <RepeatBookingInfo data={data} t={t} />
      ) : (
        <ServiceList
          data={data}
          summaryData={summaryData}
          configData={configData}
          items={items}
          t={t}
          isSmall={isSmall}
        />
      )}
    </Grid>
  );
};

BookingInfo.propTypes = {};

export default BookingInfo;
