import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { useFormik } from "formik";
import { getToken } from "helper-functions/getToken";
import { t } from "i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setParcelData } from "redux/slices/parcelDeliveryInfo";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import GuestCheckoutModal from "../../cards/GuestCheckoutModal";
import H1 from "../../typographies/H1";
import ParcelInfo from "./ParcelInfo";
import ReceiverInfoFrom from "./ReceiverInfoFrom";
import SenderInfoForm from "./SenderInfoForm";
import ValidationSchema from "./ValidationSchema";
import dynamic from "next/dynamic";
const AuthModal = dynamic(() => import("components/auth/AuthModal"));
const PercelDelivery = ({ configData }) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { parcelInfo } = useSelector((state) => state.parcelInfoData);
  const { parcelCategories } = useSelector((state) => state.parcelCategories);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [senderLocation, setSenderLocation] = useState(
    parcelInfo ? parcelInfo?.senderLocations : {}
  );
  const [senderFormattedAddress, setSenderFormattedAddress] = useState("");
  const [receiverLocation, setReceiverLocation] = useState(
    parcelInfo ? parcelInfo?.receiverLocations : {}
  );
  const [receiverFormattedAddress, setReceiverFormattedAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  let token = getToken();
  const [openAuth, setOpenAuth] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");
  // if (typeof window !== undefined) {
  //   token = localStorage.getItem("token");
  // }

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });
  const addAddressFormik = useFormik({
    initialValues: {
      senderName: token
        ? profileInfo?.f_name
          ? profileInfo?.f_name
          : ""
        : parcelInfo?.senderName
        ? parcelInfo?.senderName
        : "",
      senderPhone: token
        ? profileInfo?.phone
          ? profileInfo?.phone
          : ""
        : parcelInfo?.senderPhone
        ? parcelInfo?.senderPhone
        : "",
      senderEmail: parcelInfo?.senderEmail ? parcelInfo?.senderEmail : "",
      receiverName: parcelInfo?.receiverName ? parcelInfo?.receiverName : "",
      receiverPhone: parcelInfo?.receiverPhone ? parcelInfo?.receiverPhone : "",
      receiverEmail: parcelInfo?.receiverEmail ? parcelInfo?.receiverEmail : "",
      senderRoad: parcelInfo?.senderRoad ? parcelInfo?.senderRoad : "",
      senderHouse: parcelInfo?.senderHouse ? parcelInfo?.senderHouse : "",
      senderFloor: parcelInfo?.senderFloor ? parcelInfo?.senderFloor : "",
      road: parcelInfo?.road ? parcelInfo?.road : "",
      house: parcelInfo?.house ? parcelInfo?.house : "",
      floor: parcelInfo?.floor ? parcelInfo?.floor : "",
    },
    validationSchema: ValidationSchema(),
    onSubmit: async (values, helpers) => {
      await formSubmitHandler(values);
    },
  });
  useEffect(() => {
    const currentLocationLatLng = JSON.parse(
      localStorage.getItem("currentLatLng")
    );
    const currentLocation = localStorage.getItem("location");
    setSenderLocation(currentLocationLatLng);
    setSenderFormattedAddress(currentLocation);
  }, []);

  useEffect(() => {
    addAddressFormik.setFieldValue(
      "senderPhone",
      profileInfo?.phone ? profileInfo?.phone : parcelInfo?.senderPhone
    );
  }, [profileInfo?.phone]);
  // useEffect(() => {
  //   setReceiverLocation(parcelInfo ? parcelInfo?.receiverLocations : {});
  //   setSenderLocation(parcelInfo ? parcelInfo?.senderLocations : {});
  // }, [parcelInfo?.senderLocations, parcelInfo?.receiverLocations]);

  const senderNameHandler = (value) => {
    addAddressFormik.setFieldValue("senderName", value);
  };
  const senderPhoneHandler = (value) => {
    addAddressFormik.setFieldValue("senderPhone", value);
  };
  const receiverNameHandler = (value) => {
    addAddressFormik.setFieldValue("receiverName", value);
  };
  const receiverPhoneHandler = (value) => {
    addAddressFormik.setFieldValue("receiverPhone", value);
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
  const senderRoadHandler = (value) => {
    addAddressFormik.setFieldValue("senderRoad", value);
  };
  const senderHouseHandler = (value) => {
    addAddressFormik.setFieldValue("senderHouse", value);
  };
  const senderFloorHandler = (value) => {
    addAddressFormik.setFieldValue("senderFloor", value);
  };

  const senderEmailHandler = (value) => {
    addAddressFormik?.setFieldValue("senderEmail", value);
  };
  const handleSenderLocation = (location, currentLocation) => {
    setSenderLocation(location);
    setSenderFormattedAddress(currentLocation);
  };
  const handleReceiverLocation = (location, currentLocation) => {
    setReceiverLocation(location);
    setReceiverFormattedAddress(currentLocation);
  };
  const receiverEmailHandler = (value) => {
    addAddressFormik?.setFieldValue("receiverEmail", value);
  };

  const handleRoute = () => {
    router.push("/checkout?page=parcel", undefined, { shallow: true });
  };

  const formSubmitHandler = (values) => {
    const tempValue = {
      ...values,
      senderLocations: senderLocation,
      senderAddress: senderFormattedAddress,
      receiverLocations: receiverLocation,
      receiverAddress: receiverFormattedAddress,
      name: parcelCategories?.name,
      image: parcelCategories?.image_full_url,
      description: parcelCategories?.description,
    };
    if (senderLocation && receiverLocation) {
      dispatch(setParcelData(tempValue));
      if (!token && configData?.guest_checkout_status === 1) {
        setOpen(true);
      } else {
        if (token) {
          router.push(
            {
              pathname: "/checkout",
              query: { page: "parcel" },
            },
            undefined,
            { shallow: true }
          );
        } else {
          setOpenAuth(true);
        }
      }
    } else {
      toast.error(t("Sender or Receiver location is missing"));
    }
  };

  return (
    <CustomStackFullWidth
      paddingBottom={{ xs: "20px", sm: "20px", md: "80px" }}
      pt="1.5rem"
    >
      <Stack paddingBottom="30px">
        <H1
          text="Parcel Delivery Information"
          textAlign="left"
          fontWeight="600"
          component="h1"
        />
      </Stack>
      <form noValidate onSubmit={addAddressFormik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={4}>
            <SenderInfoForm
              addAddressFormik={addAddressFormik}
              senderNameHandler={senderNameHandler}
              senderPhoneHandler={senderPhoneHandler}
              coords={coords}
              configData={configData}
              senderFormattedAddress={senderFormattedAddress}
              handleLocation={handleSenderLocation}
              setSenderFormattedAddress={setSenderFormattedAddress}
              setSenderLocation={setSenderLocation}
              senderRoadHandler={senderRoadHandler}
              senderHouseHandler={senderHouseHandler}
              senderFloorHandler={senderFloorHandler}
              senderEmailHandler={senderEmailHandler}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ReceiverInfoFrom
              addAddressFormik={addAddressFormik}
              receiverNameHandler={receiverNameHandler}
              receiverPhoneHandler={receiverPhoneHandler}
              roadHandler={roadHandler}
              houseHandler={houseHandler}
              floorHandler={floorHandler}
              coords={coords}
              handleLocation={handleReceiverLocation}
              receiverFormattedAddress={receiverFormattedAddress}
              setReceiverLocation={setReceiverLocation}
              setReceiverFormattedAddress={setReceiverFormattedAddress}
              configData={configData}
              receiverEmailHandler={receiverEmailHandler}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ParcelInfo parcelCategories={parcelCategories} />
          </Grid>
        </Grid>
      </form>
      {open && (
        <GuestCheckoutModal
          open={open}
          setOpen={setOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          handleRoute={handleRoute}
          setModalFor={setModalFor}
          setOpenAuth={setOpenAuth}
        />
      )}
      <AuthModal
        modalFor={modalFor}
        setModalFor={setModalFor}
        open={openAuth}
        handleClose={() => setOpenAuth(false)}
      />
    </CustomStackFullWidth>
  );
};

export default PercelDelivery;
