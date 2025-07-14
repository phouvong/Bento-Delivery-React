import * as Yup from "yup";
import { t } from "i18next";
import { getToken } from "helper-functions/getToken";

const ValidationSchemaForRestaurant = () => {
  return Yup.object({
    senderName: Yup.string().required(t("Sender name required")),
    senderEmail:
      !getToken() &&
      Yup.string()
        .email(t("Must be a valid email"))
        .max(255)
        .required(t("Email is required")),
    senderPhone: Yup.string()
      .required(t("Sender phone required"))
      .min(10, "number must be 10 digits"),
    receiverName: Yup.string().required(t("Receiver name required")),
    receiverPhone: Yup.string()
      .required(t("Receiver phone required"))
      .min(10, "number must be 10 digits"),
  });
};

export default ValidationSchemaForRestaurant;
