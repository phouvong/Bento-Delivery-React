import { useState } from "react";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockIcon from "@mui/icons-material/Lock";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import CheckoutAddressPickerModal from "components/checkout/delivery-address/CheckoutAddressPickerModal";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { getToken } from "helper-functions/getToken";
import { useTranslation } from "react-i18next";
import "simplebar-react/dist/simplebar.min.css";
import ContactInfoSection from "./ContactInfoSection";

const CustomerLocationDetails = ({
  address,
  setAddress,
  renderOnNavbar,
  configData,
  orderType,
  data,
  allAddress,
  refetch,
  isRefetching,
  check,
  setCheck,
  formik,
  passwordHandler,
  confirmPasswordHandler,
  handleLatLng,
  onOpenFullAddressForm,
  onOpenContactForm,
  onEditContactForm,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openAddressPicker, setOpenAddressPicker] = useState(false);
  const token = getToken();

  const handleCheckbox = (e) => setCheck?.(e.target.checked);

  const addressTitle =
    address?.address_type && address?.address_type !== "Selected Address"
      ? t(address.address_type)
      : t("Current Location");

  const iconCircleSx = {
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: alpha(
      theme.palette.neutral?.[400] || theme.palette.text.secondary,
      0.15
    ),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const pillBoxSx = {
    flex: 1,
    minWidth: 0,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "10px",
    px: { xs: 1, md: 1.25 },
    py: { xs: 0.75, md: 1 },
    display: "flex",
    alignItems: "center",
    gap: 1,
    backgroundColor: theme.palette.background.paper,
  };

  const AddressPill = (
    <Box sx={pillBoxSx}>
      <Box sx={iconCircleSx}>
        <LocationOnOutlinedIcon
          sx={{ fontSize: 16, color: theme.palette.text.secondary }}
        />
      </Box>
      <Stack spacing={0.25} flex={1} minWidth={0}>
        <Typography
          sx={{
            fontSize: { xs: "12px", md: "13px" },
            fontWeight: 600,
            color: theme.palette.text.primary,
            textTransform: "capitalize",
            lineHeight: 1.2,
          }}
        >
          {addressTitle}
        </Typography>
        {address?.address && (
          <Typography
            sx={{
              fontSize: { xs: "10px", md: "11px" },
              color: theme.palette.text.secondary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
            }}
          >
            {address.address}
          </Typography>
        )}
        {(address?.house || address?.road || address?.floor) && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              fontSize: { xs: "10px", md: "11px" },
              color: theme.palette.text.secondary,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
            }}
          >
            {address?.house && (
              <Typography variant="inherit">
                {t("House")}: {address.house}
              </Typography>
            )}
            {address?.road && (
              <Typography variant="inherit">
                {t("Road")}: {address.road}
              </Typography>
            )}
            {address?.floor && (
              <Typography variant="inherit">
                {t("Floor")}: {address.floor}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
      <IconButton
        onClick={() => setOpenAddressPicker(true)}
        size="small"
        sx={{ p: 0.5, color: theme.palette.primary.main, flexShrink: 0 }}
      >
        <i
          className="fi fi-rs-pencil"
          style={{ fontSize: 14, display: "flex", lineHeight: 1 }}
        />
      </IconButton>
    </Box>
  );

  return (
    <>
      {renderOnNavbar !== "true" && orderType !== "take_away" && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="stretch"
          gap={{ xs: 1, md: 2 }}
        >
          {AddressPill}
          <ContactInfoSection
            address={address}
            onAddContactInfo={onOpenContactForm}
            onEditContactInfo={onEditContactForm}
          />
        </Stack>
      )}

      {!getToken() &&
        configData?.centralize_login?.manual_login_status === 1 && (
          <Stack>
            <Stack mt={1}>
              <FormControlLabel
                onChange={handleCheckbox}
                control={<Checkbox checked={check} />}
                label={
                  <Typography
                    fontWeight="500"
                    fontSize="16px"
                    color={theme.palette.neutral[1000]}
                  >
                    {t("Create account with existing info.")}
                  </Typography>
                }
              />
            </Stack>
            {check && (
              <Grid container spacing={2} pt="10px">
                <Grid item sm={12} md={6}>
                  <CustomTextFieldWithFormik
                    required="true"
                    type="password"
                    label={t("Password")}
                    placeholder={t("Password")}
                    touched={formik.touched.password}
                    errors={formik.errors.password}
                    fieldProps={formik.getFieldProps("password")}
                    onChangeHandler={passwordHandler}
                    value={formik.values.password}
                    startIcon={
                      <InputAdornment position="start">
                        <LockIcon
                          sx={{ color: (t) => t.palette.neutral[400] }}
                        />
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <CustomTextFieldWithFormik
                    label={t("Confirm Password")}
                    required="true"
                    type="password"
                    placeholder={t("Confirm Password")}
                    touched={formik.touched.confirm_password}
                    errors={formik.errors.confirm_password}
                    fieldProps={formik.getFieldProps("confirm_password")}
                    onChangeHandler={confirmPasswordHandler}
                    value={formik.values.confirm_password}
                    startIcon={
                      <InputAdornment position="start">
                        <LockIcon
                          sx={{ color: (t) => t.palette.neutral[400] }}
                        />
                      </InputAdornment>
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Stack>
        )}

      {openAddressPicker && (
        <CheckoutAddressPickerModal
          open={openAddressPicker}
          onClose={() => setOpenAddressPicker(false)}
          data={data}
          allAddress={allAddress}
          address={address}
          handleLatLng={handleLatLng}
          t={t}
          isLoading={isRefetching}
          token={token}
          onAddNewAddress={() => {
            setOpenAddressPicker(false);
            onOpenFullAddressForm?.();
          }}
        />
      )}
    </>
  );
};

export default CustomerLocationDetails;
