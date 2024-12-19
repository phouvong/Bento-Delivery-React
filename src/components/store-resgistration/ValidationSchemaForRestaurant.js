import React from "react";

import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const IMAGE_SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
];

const ValidationSchemaForRestaurant = () => {
  const { t } = useTranslation();

  const FILE_SIZE = 20000000;

  return Yup.object({
    restaurant_name: Yup.object().required(t("restaurant name required")),
    restaurant_address: Yup.object().required(t("restaurant address required")),
    f_name: Yup.string().required(t("Name is required")),
    l_name: Yup.string().required(t("last name required")),
    phone: Yup.string().required(t("phone number required")),
    vat: Yup.string().required(t("vat is required")),
    min_delivery_time: Yup.string().required(t("Minimum Delivery Time")),
    max_delivery_time: Yup.string().required(t("Maximum Delivery Time")),
    lat: Yup.string().required(t("Latitude is required")),
    lng: Yup.string().required(t("Longitude is required")),
    logo: Yup.mixed()
      .required()
      .test(
        "fileSize",
        "file too large",
        (value) => value === null || (value && value.size <= FILE_SIZE)
      )
      .test(
        "fileFormat",
        t("Unsupported Format"),
        (value) => value && IMAGE_SUPPORTED_FORMATS.includes(value.type)
      ),
    cover_photo: Yup.mixed()
      .required()
      .test(
        "fileSize",
        "file too large",
        (value) => value === null || (value && value.size <= FILE_SIZE)
      )
      .test(
        "fileFormat",
        t("Unsupported Format"),
        (value) => value && IMAGE_SUPPORTED_FORMATS.includes(value.type)
      ),
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required(t("Email is required")),

    password: Yup.string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 characters minimum.")
      .matches(/[0-9]/, "Password must contain at least one number.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character."
      ),
    confirm_password: Yup.string()
      .required(t("Confirm Password required"))
      .oneOf([Yup.ref("password"), null], t("Passwords must match")),
  });
};

export default ValidationSchemaForRestaurant;
