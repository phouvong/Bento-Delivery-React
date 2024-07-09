import * as Yup from "yup";
import { t } from "i18next";

const ValidationSchemaForRestaurant = () => {
  return Yup.object({
    senderName: Yup.string().required(t("Sender name required")),
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
