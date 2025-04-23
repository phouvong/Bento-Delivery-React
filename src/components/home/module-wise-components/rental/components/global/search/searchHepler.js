import cookie from "js-cookie";
import { getGuestId, getToken } from "helper-functions/getToken";
import { updateDestinationLocations } from "components/home/module-wise-components/rental/components/utils/bookingHepler";

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
  const cartObject = {
    vehicle_id: id,
    quantity: 1,
    pickup_location: { ...locations?.pickup, location_name: searchKey1 },
    destination_location: {
      ...locations?.destination,
      location_name: searchKey2,
    },
    rental_type: tripType,
    estimated_hours: durationValue,
    pickup_time: dateValue,
    destination_time: Math.floor(
      data?.rows?.[0]?.elements[0]?.duration?.value / (60 * 60)
    ),

    distance: data?.rows?.[0]?.elements[0]?.distance?.value / 1000,
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
        toast.success("Confirm booking successfully!");
        handleClose?.();
      }
    },
    onError: onErrorResponse,
  });
};
