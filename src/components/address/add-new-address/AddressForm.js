import React, { useEffect } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { useFormik } from "formik";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import ValidationSchemaForAddAddress from "./ValidationSchemaForAddAddress";
import usePostAddress from "../../../api-manage/hooks/react-query/address/usePostAddress";
import toast from "react-hot-toast";
import { onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import { getLanguage } from "../../../helper-functions/getLanguage";
import FormSubmitButton from "../../profile/FormSubmitButton";
import useUpdatedAddress from "../../../api-manage/hooks/react-query/address/useUpdatedAddress";
import { useDispatch, useSelector } from "react-redux";
import { setGuestUserInfo } from "../../../redux/slices/guestUserInfo";
import { setOpenAddressModal } from "../../../redux/slices/addAddress";
import { t } from "i18next";
import { add } from "date-fns";

const AddressForm = ({
  configData,
  deliveryAddress,
  personName,
  phone,
  lat,
  lng,
  popoverClose,
  refetch,
  isRefetcing,
  atModal,
  addressType,
  editAddress,
  setAddAddress,
  email,
  setAddress,
  handleLatLng,
  checkoutLocationOnly,
  contactInfoOnly,
  address
}) => {
  const typeData = [
    {
      label: t("Home"),
      value: "home",
    },
    {
      label: t("Office"),
      value: "Office",
    },
    {
      label: t("Others"),
      value: "Others",
    },
  ];
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const { mutate, isLoading } = usePostAddress();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdatedAddress();

  const addAddressFormik = useFormik({
    initialValues: {
      contact_person_email: token
        ? email
          ? email
          : ""
        : guestUserInfo
        ? guestUserInfo.contact_person_email
        : "",
      address: editAddress?.address || guestUserInfo?.address || "",
      address_type: token
        ? addressType
          ? addressType
          : ""
        : guestUserInfo
        ? guestUserInfo.address_type
        : "",
      address_label: token
        ? ""
        : guestUserInfo
        ? guestUserInfo.address_label
        : "",
      contact_person_name: token
        ? editAddress?.contact_person_name || personName || ""
        : guestUserInfo
        ? guestUserInfo.contact_person_name
        : "",
      contact_person_number: token
        ? editAddress?.contact_person_number || phone || ""
        : guestUserInfo
        ? guestUserInfo.contact_person_number
        : "",
      additional_information: token
        ? editAddress
          ? editAddress?.additional_information
          : ""
        : guestUserInfo
        ? guestUserInfo.additional_information
        : "",
      latitude: lat,
      longitude: lng,
      road: token
        ? editAddress
          ? editAddress?.road
          : ""
        : guestUserInfo
        ? guestUserInfo.road
        : "",
      house: token
        ? editAddress
          ? editAddress?.house
          : ""
        : guestUserInfo
        ? guestUserInfo.house
        : "",
      floor: token
        ? editAddress
          ? editAddress?.floor
          : ""
        : guestUserInfo
        ? guestUserInfo.floor
        : "",
    },
    
    onSubmit: async (values, helpers) => {
    
      
      try {
        let newData = {
          ...values,
          address_type:
            values.address_label !== ""
              ? values.address_label
              : values.address_type,
        };
        formSubmitOnSuccess(newData);
      } catch (err) {}
    },
  });

  const formSubmitOnSuccess = (values) => {
    const updateSelectedAddress = (addressValues) => {
      if (typeof handleLatLng === "function") {
        handleLatLng(addressValues);
        return;
      }

      if (typeof setAddress === "function") {
        setAddress({
          ...addressValues,
          lat: addressValues?.latitude ?? addressValues?.lat,
          lng: addressValues?.longitude ?? addressValues?.lng,
        });
      }
    };
console.log({editAddress,address});

    if (token) {
      if (editAddress && editAddress?.address_type) {
           console.log({values,editAddress});
        // "Selected Address" is the transient checkout address — not yet
        // persisted server-side. Editing it only updates local state.
        if (address?.address_type === "Selected Address" || !editAddress?.id ) {
       
          
          const newValue = { ...values, id: editAddress?.id };
          updateSelectedAddress(newValue);
          if (atModal === "true") {
            popoverClose?.();
          } else {
            setAddAddress(false);
          }
          return;
        }
       
        
        const newValue = { ...values, id: editAddress?.id };
         
        updateMutate(newValue, {
          onSuccess: (response) => {
            updateSelectedAddress(newValue);
            if (atModal === "true") {
              toast.success(response?.message);
              popoverClose();
              refetch?.();
            } else {
              toast.success(response?.message);
              refetch?.();
              setAddAddress(false);
            }

            // if (response?.data) {
            //   refetch();
            //   setOpen(false);
            // }
          },
          onError: onErrorResponse,
        });
      } else {
        mutate(values, {
          onSuccess: (response) => {
            if (response) {
              updateSelectedAddress(values);
              if (atModal === "true") {
                toast.success(response?.message);
                popoverClose?.();
                refetch?.();
              } else {
                toast.success(response?.message);
                refetch?.();
                setAddAddress(false);
              }
            }

            // if (response?.data) {
            //   refetch();
            //   setOpen(false);
            // }
          },
          onError: onErrorResponse,
        });
      }
    } else {
      dispatch(setGuestUserInfo(values));
      dispatch(setOpenAddressModal(false));
    }
  };

  const nameHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_name", value);
  };
  const numberHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_number", value);
  };
  const addressTypeHandler = (value) => {
    addAddressFormik.setFieldValue("address_type", value);
  };
  const addressLabelHandler = (value) => {
    addAddressFormik.setFieldValue("address_label", value);
  };
  const additionalHandler = (value) => {
    addAddressFormik.setFieldValue("additional_information", value);
  };
  const roadHandler = (value) => {
    addAddressFormik.setFieldValue("road", value);
  };
  const houseHandler = (value) => {
    addAddressFormik.setFieldValue("house", value);
  };
  const floorHandler = (value) => {
    addAddressFormik.setFieldValue("floor", value);
  };
  const emailHandler = (value) => {
    addAddressFormik.setFieldValue("email", value);
  };
  useEffect(() => {
    // Don't overwrite a valid address (e.g. seeded from editAddress) with an
    // empty geocode result while the map is still resolving.
    if (deliveryAddress) {
      addAddressFormik.setFieldValue("address", deliveryAddress);
    }
    addAddressFormik.setFieldValue("address_type", addressType);
    addAddressFormik.setFieldValue("latitude", lat);
    addAddressFormik.setFieldValue("longitude", lng);
  }, [deliveryAddress, addressType, lat, lng]);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  const handleReset = () => {
    addAddressFormik.setFieldValue("contact_person_name", "");
    addAddressFormik.setFieldValue("contact_person_number", "");
    addAddressFormik.setFieldValue("additional_information", "");
    addAddressFormik.setFieldValue("house", "");
    addAddressFormik.setFieldValue("floor", "");
    //setAddressType("");
  };

  return (
    <Stack>
      <form noValidate onSubmit={addAddressFormik.handleSubmit}>
        <Grid container rowSpacing={{ xs: 1.25, md: 2.8 }} columnSpacing={2.8}>
          {!contactInfoOnly && addressType === "other" && (
            <Grid item xs={12} md={12}>
              {" "}
              <CustomTextFieldWithFormik
                type="text"
                label={t("Label Name(Optional)")}
                touched={addAddressFormik.touched.address_label}
                errors={addAddressFormik.errors.address_label}
                fieldProps={addAddressFormik.getFieldProps("address_label")}
                onChangeHandler={addressLabelHandler}
                value={addAddressFormik.values.address_label}
              />
            </Grid>
          )}

          {!checkoutLocationOnly && (
            <>
              <Grid item xs={12} md={6}>
                <CustomTextFieldWithFormik
                  required="true"
                  type="text"
                  label={t("Contact Person Name")}
                  touched={addAddressFormik.touched.contact_person_name}
                  errors={addAddressFormik.errors.contact_person_name}
                  fieldProps={addAddressFormik.getFieldProps(
                    "contact_person_name"
                  )}
                  onChangeHandler={nameHandler}
                  value={addAddressFormik.values.contact_person_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ width: "100%", minHeight: "55px" }}>
                  <CustomPhoneInput
                    value={addAddressFormik.values.contact_person_number}
                    onHandleChange={numberHandler}
                    initCountry={configData?.country}
                    touched={addAddressFormik.touched.contact_person_number}
                    errors={addAddressFormik.errors.contact_person_number}
                    rtlChange="true"
                    lanDirection={lanDirection}
                    height="45px"
                    borderRadius="8px"
                  />
                </Box>
              </Grid>
              {(!token || contactInfoOnly) && (
                <Grid item xs={12} md={6}>
                  <CustomTextFieldWithFormik
                    required
                    label={t("Email")}
                    touched={addAddressFormik.touched.contact_person_email}
                    errors={addAddressFormik.errors.contact_person_email}
                    fieldProps={addAddressFormik.getFieldProps(
                      "contact_person_email"
                    )}
                    onChangeHandler={emailHandler}
                    value={addAddressFormik.values.contact_person_email}
                  />
                </Grid>
              )}
            </>
          )}

          {!contactInfoOnly && (
            <>
              <Grid item xs={12} md={6}>
                <CustomTextFieldWithFormik
                  type="text"
                  label={t("House")}
                  touched={addAddressFormik.touched.house}
                  errors={addAddressFormik.errors.house}
                  fieldProps={addAddressFormik.getFieldProps("house")}
                  onChangeHandler={houseHandler}
                  value={addAddressFormik.values.house}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextFieldWithFormik
                  type="text"
                  label={t("Floor")}
                  touched={addAddressFormik.touched.floor}
                  errors={addAddressFormik.errors.floor}
                  fieldProps={addAddressFormik.getFieldProps("floor")}
                  onChangeHandler={floorHandler}
                  value={addAddressFormik.values.floor}
                />
              </Grid>
              <Grid item xs={12} md={token ? "12" : "6"}>
                <CustomTextFieldWithFormik
                  type="text"
                  label={t("Road")}
                  touched={addAddressFormik.touched.road}
                  errors={addAddressFormik.errors.road}
                  fieldProps={addAddressFormik.getFieldProps("road")}
                  onChangeHandler={roadHandler}
                  value={addAddressFormik.values.road}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <CustomTextFieldWithFormik
                  type="text"
                  label={t("Additional Information")}
                  touched={addAddressFormik.touched.additional_information}
                  errors={addAddressFormik.errors.additional_information}
                  fieldProps={addAddressFormik.getFieldProps(
                    "additional_information"
                  )}
                  onChangeHandler={additionalHandler}
                  value={addAddressFormik.values.additional_information}
                  height="60px"
                />
              </Grid>
            </>
          )}

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            align="end"
            sx={{
              "@media (max-width: 899.95px)": {
                position: "sticky",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 5,
                backgroundColor: (theme) => theme.palette.background.paper,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                mx: -2,
                px: 2,
                py: 1.5,
                mt: 2,
              },
            }}
          >
            <FormSubmitButton
              handleReset={handleReset}
              isLoading={
                editAddress && editAddress?.address_type
                  ? isUpdateLoading
                  : isLoading
              }
              reset={t("Reset")}
              margin="8px"
              submit={
                token
                  ? editAddress && editAddress?.address_type
                    ? t("Update Address")
                    : t("Add Address")
                  : guestUserInfo
                  ? t("Update Address")
                  : t("Add Address")
              }
            />
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
};
export default AddressForm;
