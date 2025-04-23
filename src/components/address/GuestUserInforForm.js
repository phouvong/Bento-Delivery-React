import React, { useEffect } from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { useFormik } from "formik";
import { Grid } from "@mui/material";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import CustomPhoneInput from "../custom-component/CustomPhoneInput";
import { getLanguage } from "../../helper-functions/getLanguage";
import { setGuestUserInfo } from "../../redux/slices/guestUserInfo";

import { useDispatch, useSelector } from "react-redux";
import FormSubmitButton from "../profile/FormSubmitButton";

const GuestUserInforForm = ({
  configData,
  editAddress,
  setEditAddress,
  handleClose,
  rental,
}) => {
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const dispatch = useDispatch();
  const addAddressFormik = useFormik({
    initialValues: {
      contact_person_name: guestUserInfo
        ? guestUserInfo?.contact_person_name
        : "",
      contact_person_number: guestUserInfo
        ? guestUserInfo?.contact_person_number
        : "",
      contact_person_email: guestUserInfo
        ? guestUserInfo?.contact_person_email
        : "",
    },
    onSubmit: async (values, helpers) => {
      try {
        dispatch(setGuestUserInfo(values));
        handleClose();
      } catch (err) {}
    },
  });

  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const nameHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_name", value);
    if (rental) {
      dispatch(
        setGuestUserInfo({
          ...addAddressFormik.values,
          contact_person_name: value,
        })
      );
    }
  };
  const numberHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_number", value);
    if (rental) {
      dispatch(
        setGuestUserInfo({
          ...addAddressFormik.values,
          contact_person_number: value,
        })
      );
    }
  };
  const emailHandler = (value) => {

    addAddressFormik.setFieldValue("contact_person_email", value);
    if (rental) {
      dispatch(
        setGuestUserInfo({
          ...addAddressFormik.values,
          contact_person_email: value,
        })
      );
    }
  };

  useEffect(() => {
    if (rental) {
      dispatch(
        setGuestUserInfo({
          ...addAddressFormik.values,
          contact_person_number:
            addAddressFormik?.values?.contact_person_number,
        })
      );
      dispatch(
        setGuestUserInfo({
          ...addAddressFormik.values,
          contact_person_name: addAddressFormik?.values?.contact_person_name,
        })
      );
    }
  }, [addAddressFormik?.values]);
  const handleReset = () => {
    addAddressFormik.setFieldValue("contact_person_name", "");
    addAddressFormik.setFieldValue("contact_person_number", "");
    addAddressFormik.setFieldValue("contact_person_email", "");
  };
  return (
    <CustomStackFullWidth
      p={rental ? "1rem" : "2rem"}
      minHeight={rental ? "100%" : "300px"}
      alignItems={rental ? "start" : "center"}
      justifyContent={rental ? "start" : "center"}
    >
      <form
        noValidate
        onSubmit={addAddressFormik.handleSubmit}
        style={{ width: "100%" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("Contact Person Name")}
              touched={addAddressFormik.touched.contact_person_name}
              errors={addAddressFormik.errors.contact_person_name}
              fieldProps={addAddressFormik.getFieldProps("contact_person_name")}
              onChangeHandler={nameHandler}
              value={addAddressFormik.values.contact_person_name}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <CustomPhoneInput
              value={addAddressFormik.values.contact_person_number}
              onHandleChange={numberHandler}
              initCountry={configData?.country}
              touched={addAddressFormik.touched.contact_person_number}
              errors={addAddressFormik.errors.contact_person_number}
              rtlChange="true"
              lanDirection={lanDirection}
              height="45px"
              borderRadius="10px"
            />
          </Grid>
      
          <Grid item xs={12} md={12} sx={{ marginTop: "8px" }}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("Contact Person Email")}
              touched={addAddressFormik.touched.contact_person_email}
              errors={addAddressFormik.errors.contact_person_email}
              fieldProps={addAddressFormik.getFieldProps(
                "contact_person_email"
              )}
              onChangeHandler={emailHandler}
              value={addAddressFormik.values.contact_person_email}
            />
          </Grid>
          {!rental && (
            <Grid item xs={12} md={12} align="end">
              <FormSubmitButton
                handleReset={handleReset}
                //isLoading={editAddress ? isUpdateLoading : isLoading}
                reset={t("Reset")}
                submit={editAddress ? t("Save") : t("Save")}
              />
            </Grid>
          )}
        </Grid>
      </form>
    </CustomStackFullWidth>
  );
};

export default GuestUserInforForm;
