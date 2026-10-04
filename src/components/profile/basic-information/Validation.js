import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const ValidationSechemaProfile = () => {
  const { t } = useTranslation();
  return Yup.object({
    name: Yup.string().required(t("name is required")),
    phone: Yup.string().required(t("phone number required")),
    email: Yup.string()
      .email(t("Must be a valid email"))
      .max(255)
      .required(t("Email is required")),
    // password: Yup.string()
    //   .min(6, t("Password must be at least 6 characters"))
    //   .required(t("Password is required")),
    // confirm_password: Yup.string()
    //   .oneOf([Yup.ref("password"), null], t("Passwords must match"))
    //   .required(t("Confirm password is required")),
  });
};

export default ValidationSechemaProfile;