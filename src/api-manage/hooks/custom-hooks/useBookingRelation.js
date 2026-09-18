import { useRouter } from "next/router";

// A repeat booking's parent record has no payment/review of its own — those
// belong to each individually-scheduled sub booking, opened with `parentBookingId`.
const useBookingRelation = ({ isBooking, data }) => {
  const router = useRouter();
  const isSubBooking = !!isBooking && !!router.query?.parentBookingId;
  const hasRepeatOccurrences = (data?.repeat_log?.length ?? 0) > 0;
  const isParentRepeatBooking =
    !!isBooking &&
    data?.booking_type === "repeat" &&
    hasRepeatOccurrences &&
    !isSubBooking;

  return { isSubBooking, hasRepeatOccurrences, isParentRepeatBooking };
};

export default useBookingRelation;
