import toast from "react-hot-toast";
import { t } from "i18next";
import Router from "next/router";

export const handleTokenExpire = (item, status) => {
  if (status === 401) {
    if (window.localStorage.getItem("token")) {
      toast.error(t("Your account is inactive or Your token has been expired"));
      window?.localStorage.removeItem("token");
      Router.push("/home", undefined, { shallow: true });
    }
  } else {
    toast.error(item?.message, {
      id: "error",
    });
  }
};

export const onErrorResponse = (error) => {
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors)) {
    errors.forEach((item) => {
      handleTokenExpire(item);
    });
  } else if (errors) {
    // Some endpoints return a plain value instead of the usual array —
    // e.g. { "errors": "Unauthorized" } on auth failures.
    handleTokenExpire(
      { message: typeof errors === "string" ? errors : errors?.message },
      error?.response?.status
    );
  }
};
export const onSingleErrorResponse = (error) => {
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return onErrorResponse(error);
  }
  const message =
    error?.response?.data?.message ||
    (typeof errors === "string" ? errors : undefined);
  toast.error(message, {
    id: "error",
  });
  handleTokenExpire(error, error?.response?.status);
};
