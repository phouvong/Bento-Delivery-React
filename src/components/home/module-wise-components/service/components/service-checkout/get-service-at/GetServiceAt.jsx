import { useEffect, useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Button,
  Popover,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import useGetAddressList from "api-manage/hooks/react-query/address/useGetAddressList";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AddNewAddress from "components/address/add-new-address";
import { setOpenAddressModal } from "redux/slices/addAddress";
import useServiceBusinessConfig from "components/home/module-wise-components/service/service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import CustomerLocationDetails from "./CustomerLocationDetails";
import ContactInfoSection from "./ContactInfoSection";
import { ProviderProfileCard, ProviderLocationNote } from "./ProviderLocationDetails";

const getZoneWiseAddresses = (addresses, restaurantId) => {
  const newArray = [];
  addresses?.forEach(
    (item) => item.zone_ids.includes(restaurantId) && newArray.push(item)
  );
  return newArray;
};

const GetServiceAt = ({
  setAddress,
  address,
  renderOnNavbar,
  configData,
  storeZoneId,
  orderType,
  formik,
  passwordHandler,
  confirmPasswordHandler,
  check,
  setCheck,
  isCustomService,
  serviceLocation,
  setServiceLocation,
  providerData,
  isProviderFetching,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const reduxDispatch = useDispatch();
  const { openAddressModal } = useSelector((s) => s.addressModel);
  const [allAddress, setAllAddress] = useState();
  const [data, setData] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [addressFormMode, setAddressFormMode] = useState("location");

  // AddNewAddress always closes via a single global redux flag — only one
  // instance may exist on this page, regardless of which location branch
  // (customer vs provider) triggered it. Both branches call these.
  const openAddressEditor = (mode, addr = null) => {
    setEditAddress(addr);
    setAddressFormMode(mode);
    reduxDispatch(setOpenAddressModal(true));
  };
  const handleLatLng = (values) => {
    const next = { ...values, lat: values.latitude, lng: values.longitude };
    setAddress(next);
    if (renderOnNavbar === "true") window.location.reload();
  };

  const SERVICE_LOCATION_OPTIONS = [
    {
      key: "my_location",
      label: t("My Location"),
      description: t("By selecting this service will provided at your location"),
    },
    {
      key: "provider_location",
      label: t("Provider Location"),
      description: t("By selecting this service will get from provider location"),
    },
  ];

  const {
    canChooseCustomerLocation,
    canChooseProviderLocation,
    canChangeServiceLocation: canChangeServiceLocationConfig,
  } = useServiceBusinessConfig(configData, providerData);
  const configLoaded = Boolean(providerData) && !isProviderFetching;
  const canChangeServiceLocation = configLoaded && canChangeServiceLocationConfig;

  // Only offer the locations the provider actually supports
  // (service_location_customer_status / service_location_provider_status).
  const availableLocationOptions = SERVICE_LOCATION_OPTIONS.filter((option) =>
    option.key === "my_location"
      ? canChooseCustomerLocation
      : canChooseProviderLocation
  );

  useEffect(() => {
    if (!configLoaded || canChangeServiceLocation) return;
    if (canChooseCustomerLocation) {
      setServiceLocation("my_location");
    } else if (canChooseProviderLocation) {
      setServiceLocation("provider_location");
    }
  }, [
    configLoaded,
    canChangeServiceLocation,
    canChooseCustomerLocation,
    canChooseProviderLocation,
    setServiceLocation,
  ]);

  const mainAddress = { ...address };

  const handleSuccess = (addressData) => {
    if (storeZoneId) {
      setData({
        ...addressData,
        addresses: getZoneWiseAddresses(addressData?.addresses, storeZoneId),
      });
    } else {
      setData(addressData);
    }
  };

  const { refetch, isRefetching } = useGetAddressList(handleSuccess);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    data && setAllAddress([mainAddress, ...data.addresses]);
  }, [data]);

  const isCardWrapped = renderOnNavbar !== "true";
  const showHeader = isCardWrapped && orderType !== "take_away";

  const selectedLabel = SERVICE_LOCATION_OPTIONS.find(
    (o) => o.key === serviceLocation
  )?.label;

  const content = (
    <>
      {showHeader && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 1.5, md: 2.5 } }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "14px", md: "16px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("Get Service At")}
          </Typography>

          {!isCustomService && canChangeServiceLocation && (
            <>
              <Button
                onClick={(e) => setLocationAnchorEl(e.currentTarget)}
                disableElevation
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.whiteContainer.main,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "12px", md: "13px" },
                  borderRadius: "8px",
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 0.6, md: 0.75 },
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                {selectedLabel}
              </Button>
              <Popover
                open={Boolean(locationAnchorEl)}
                anchorEl={locationAnchorEl}
                onClose={() => setLocationAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 0.75,
                    p: 1.5,
                    borderRadius: "12px",
                    boxShadow: `0 4px 20px ${alpha(theme.palette.text.primary, 0.12)}`,
                    minWidth: { xs: "80%", md: "300px" },
                    overflow: "hidden",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  {availableLocationOptions.map((option) => (
                    <Box
                      key={option.key}
                      onClick={() => {
                        setServiceLocation(option.key);
                        setLocationAnchorEl(null);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1,
                        cursor: "pointer",
                        backgroundColor:
                          serviceLocation === option.key
                            ? theme.palette.background.secondary
                            : "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.background.secondary,
                        },
                      }}
                    >
                      <Stack spacing={0.25} flex={1} minWidth={0} pr={1}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "14px", md: "16px" },
                            color: theme.palette.text.primary,
                            lineHeight: 1.3,
                          }}
                        >
                          {option.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "12px", md: "14px" },
                            color: theme.palette.text.secondary,
                            lineHeight: 1.4,
                          }}
                        >
                          {option.description}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: `2px solid ${
                            serviceLocation === option.key
                              ? theme.palette.primary.main
                              : theme.palette.neutral?.[400] ||
                                theme.palette.text.disabled
                          }`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {serviceLocation === option.key && (
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: theme.palette.primary.main,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Popover>
            </>
          )}

        </Stack>
      )}

      {isCustomService ? (
        <CustomerLocationDetails
          address={address}
          setAddress={setAddress}
          renderOnNavbar={renderOnNavbar}
          configData={configData}
          orderType={orderType}
          data={data}
          allAddress={allAddress}
          refetch={refetch}
          isRefetching={isRefetching}
          check={check}
          setCheck={setCheck}
          formik={formik}
          passwordHandler={passwordHandler}
          confirmPasswordHandler={confirmPasswordHandler}
          handleLatLng={handleLatLng}
          onOpenFullAddressForm={() => openAddressEditor("full")}
          onOpenContactForm={() => openAddressEditor("contact", address)}
          onEditContactForm={() => openAddressEditor("contact", address)}
        />
      ) : (
        <>
          {serviceLocation === "my_location" && (
            <CustomerLocationDetails
              address={address}
              setAddress={setAddress}
              renderOnNavbar={renderOnNavbar}
              configData={configData}
              orderType={orderType}
              data={data}
              allAddress={allAddress}
              refetch={refetch}
              isRefetching={isRefetching}
              check={check}
              setCheck={setCheck}
              formik={formik}
              passwordHandler={passwordHandler}
              confirmPasswordHandler={confirmPasswordHandler}
              handleLatLng={handleLatLng}
              onOpenFullAddressForm={() => openAddressEditor("full")}
              onOpenContactForm={() => openAddressEditor("contact", address)}
              onEditContactForm={() => openAddressEditor("contact", address)}
            />
          )}
          {serviceLocation === "provider_location" && (
            <Stack spacing={{ xs: 1, md: 1.5 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems="stretch"
                gap={{ xs: 1, md: 1.5 }}
              >
                <ProviderProfileCard
                  providerData={providerData}
                  isFetching={isProviderFetching}
                />
                <ContactInfoSection
                  address={address}
                  onAddContactInfo={() => openAddressEditor("contact", address)}
                  onEditContactInfo={() => openAddressEditor("contact", address)}
                />
              </Stack>
              <ProviderLocationNote />
            </Stack>
          )}
        </>
      )}

      {openAddressModal && (
        <AddNewAddress
          refetch={refetch}
          t={t}
          configData={configData}
          openAddressModal={openAddressModal}
          editAddress={editAddress}
          setEditAddress={setEditAddress}
          setAddress={setAddress}
          handleLatLng={handleLatLng}
          mode={addressFormMode}
          address={address}
        />
      )}
    </>
  );

  if (!isCardWrapped) {
    return content;
  }

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "10px", md: "14px" },
        boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.06)}`,
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
      }}
    >
      {content}
    </Box>
  );
};

export default GetServiceAt;
