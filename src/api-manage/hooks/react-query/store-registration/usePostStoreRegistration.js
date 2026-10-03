import { useMutation } from "react-query";
import {
  order_place_api,
  signIn_api,
  signUp_api,
  store_registration,
} from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { getApiContent } from "../../../getApiContent";
import dayjs from "dayjs";
// Untouched languages fall back to the first language's value (backend rejects empty values).
const withDefaultLocaleValue = (valuesByLocale = {}) => {
  const entries = Object.entries(valuesByLocale || {});
  const defaultValue =
    entries[0]?.[1]?.trim() ||
    entries.find(([, value]) => value?.trim())?.[1] ||
    "";
  return entries.map(([locale, value]) => [
    locale,
    value?.trim() ? value : defaultValue,
  ]);
};

const postData = async (storeData) => {
  const translationsR = [];
  for (const [locale, name] of withDefaultLocaleValue(
    storeData.restaurant_name
  )) {
    translationsR.push({ id: null, locale, key: "name", value: name });
  }

  for (const [locale, address] of withDefaultLocaleValue(
    storeData.restaurant_address
  )) {
    translationsR.push({ id: null, locale, key: "address", value: address });
  }
  const translations = JSON.stringify(translationsR);
  let finalData = {
    translations,
    minimum_delivery_time: storeData?.min_delivery_time,
    maximum_delivery_time: storeData?.max_delivery_time,
    latitude: storeData?.lng,
    longitude: storeData?.lat,
    f_name: storeData?.f_name,
    l_name: storeData?.l_name,
    phone: storeData?.phone,
    email: storeData?.email,
    password: storeData?.password,
    zone_id: storeData?.zoneId,
    module_id: storeData?.module_id,
    delivery_time_type: "minute",
    business_plan: storeData?.value?.business_plan,
    package_id: storeData?.value?.package_id,
    logo: storeData?.logo,
    cover_photo: storeData?.cover_photo,
    pickup_zone_id: storeData?.pickup_zone_id
      ? JSON.stringify(storeData?.pickup_zone_id?.map(String))
      : [],
  };

// ✅ Conditionally add TIN-related fields only if they exist
  if (storeData?.tin || storeData?.tin_expire_date || storeData?.tin_certificate_image) {
    finalData = {
      ...finalData,
      ...(storeData?.tin && { tin: storeData.tin }),
      ...(storeData?.tin_expire_date && {
        tin_expire_date: dayjs(storeData.tin_expire_date).format("YYYY-MM-DD"),
      }),
      ...(storeData?.tin_certificate_image && {
        tin_certificate_image: storeData.tin_certificate_image,
      }),
    };
  }
  const formData = new FormData();
  const appendFormData = (formData, data, parentKey = "") => {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;
      if (value && typeof value === "object" && !(value instanceof File)) {
        appendFormData(formData, value, fullKey);
      } else {
        formData.append(fullKey, value);
      }
    });
  };
  appendFormData(formData, finalData); // Use finalData instead of storeData
  const { data: responseData } = await MainApi.post(
    `${store_registration}`,
    formData
  );
  // The envelope's `content` carries `store_id`/`type`/`package_id` — callers
  // read those directly off the resolved value (`res.type`, not
  // `res.content.type`), so unwrap here rather than at every call site.
  return getApiContent(responseData);
};

export const usePostStoreRegistration = () => {
  return useMutation("store-reg", postData);
};
