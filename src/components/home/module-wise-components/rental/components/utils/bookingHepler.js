import { getGuestId, getToken } from "helper-functions/getToken";

// One slot per identity so a guest session and a logged-in session don't see
// each other's recently visited destinations on the same browser. For signed-in
// users we key by customer id (stable across token rotation); for guests we
// fall back to the guest id. If the user is signed in but the customer id
// hasn't loaded yet, return null so we don't write to the wrong slot.
export const buildDestinationLocationKey = (customerId) => {
  if (typeof window === "undefined") return null;
  const token = getToken();
  if (token) {
    if (customerId == null || customerId === "") return null;
    return `destination_location:user:${customerId}`;
  }
  const guestId = getGuestId();
  if (!guestId) return "destination_location";
  return `destination_location:guest:${guestId}`;
};

export const cardTotalPrice = (price, tripHours, quantity) => {
  return price * tripHours * quantity || 1;
};

export const cardDiscount = (
  price,
  tripHours,
  quantity,
  discount,
  discountType,
  storeDiscount,
  max_discount
) => {
  let mainPrice = price * (tripHours || 1) * (quantity || 1); // Calculate the base price

  if (discount && discount > 0) {
    // Apply user-provided discount
    if (discountType === "amount") {
      mainPrice -= discount * (quantity || 1);
    } else if (discountType === "percent") {
      mainPrice -= (discount / 100) * mainPrice;
    }
  }

  return mainPrice > 0 ? mainPrice : 0; // Ensure the final price is not negative
};

export function mainPrice(data, tripType) {
  if (tripType) {
    if (tripType === "distance_wise") {
      return data.distance_price;
    } else if (tripType === "hourly") {
      return data.hourly_price;
    } else if (tripType === "day_wise") {
      return data.day_wise_price;
    } else {
      return 0;
    }
  } else {
    if (
      data?.trip_hourly === 1 &&
      data?.trip_distance === 1 &&
      data?.trip_day_wise === 1
    ) {
      return Math.min(
        data.hourly_price,
        data.distance_price,
        data.day_wise_price
      );
    } else if (data?.trip_hourly === 1) {
      return data.hourly_price;
    } else if (data?.trip_distance === 1) {
      return data.distance_price;
    } else if (data?.trip_day_wise === 1) {
      return data.day_wise_price;
    } else {
      return 0;
    }
  }
}

export function updateDestinationLocations(newLocations, customerId) {
  const key = buildDestinationLocationKey(customerId);
  if (!key) return;
  const locationsArray = Array.isArray(newLocations)
    ? newLocations
    : [newLocations];
  const existingLocations = JSON.parse(localStorage.getItem(key)) || [];
  locationsArray.forEach((location) => {
    if (
      !existingLocations.some(
        (existingLocation) =>
          JSON.stringify(existingLocation) === JSON.stringify(location)
      )
    ) {
      existingLocations.push(location);
      if (existingLocations.length > 5) {
        existingLocations.shift();
      }
    }
  });

  localStorage.setItem(key, JSON.stringify(existingLocations));
}
