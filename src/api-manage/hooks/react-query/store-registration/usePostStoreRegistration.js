import { useMutation } from "react-query";
import {
  order_place_api,
  signIn_api,
  signUp_api,
  store_registration,
} from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const postData = async (storeData) => {
  const translationsR = [];
  for (const [locale, name] of Object.entries(storeData.restaurant_name)) {
    translationsR.push({ id: null, locale, key: "name", value: name });
  }

  for (const [locale, address] of Object.entries(
    storeData.restaurant_address
  )) {
    translationsR.push({ id: null, locale, key: "address", value: address });
  }
  const translations = JSON.stringify(translationsR);
  const finalData = {
    translations,
    tax: storeData.vat,
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
    business_plan: storeData?.value.business_plan,
    package_id: storeData?.value.package_id,
    logo: storeData?.logo,
    cover_photo: storeData?.cover_photo,
  };
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
  return responseData;
};

export const usePostStoreRegistration = () => {
  return useMutation("store-reg", postData);
};
