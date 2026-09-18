import cookie from "js-cookie";
import { getGuestId, getToken } from "helper-functions/getToken";
import { updateDestinationLocations } from "components/home/module-wise-components/rental/components/utils/bookingHepler";

export const formattedDate = (isoString) => {
  const date = new Date(isoString);
  const updatedDate = new Date(date.getTime()); // Add 6 hours

  const pad = (num) => num.toString().padStart(2, '0');

  return `${updatedDate.getFullYear()}-${pad(updatedDate.getMonth() + 1)}-${pad(updatedDate.getDate())} ` +
    `${pad(updatedDate.getHours())}:${pad(updatedDate.getMinutes())}:${pad(updatedDate.getSeconds())}`;
};


export const bookingConfirm = ({
  id,
  locations,
  searchKey1,
  searchKey2,
  tripType,
  durationValue,
  dateValue,
  data,
  confirmMutate,
  dispatch,
  setCartList,
  toast,
  handleClose,
  onErrorResponse,
}) => {
  // 2025-01-22 03:48:00 PM
  const userDate = new Date(dateValue);
  const cartObject = {
    vehicle_id: id,
    quantity: 1,
    pickup_location: { ...locations?.pickup, location_name: searchKey1 },
    destination_location: {
      ...locations?.destination,
      location_name: searchKey2,
    },
    rental_type: tripType,
    estimated_hours: tripType === "day_wise" ? durationValue * 24 : durationValue,
    pickup_time: formattedDate(userDate),
    destination_time: Number(data?.duration?.replace('s', '')) / (60 * 60),
    distance: Math.floor(
      data?.distanceMeters
    ) / 1000,
    guest_id: getToken() ? null : getGuestId(),
  };

  confirmMutate(cartObject, {
    onSuccess: (res) => {
      if (res) {

        dispatch(setCartList(res));
        updateDestinationLocations({
          latitude: res.user_data?.destination_location?.lat,
          longitude: res.user_data?.destination_location?.lng,
          location_name: searchKey2,
        });
        cookie.set("cart-list", res?.carts?.length);
        toast.success("The vehicle successfully added to your cart.");
        handleClose?.();
      }
    },
    onError: onErrorResponse,
  });
};
