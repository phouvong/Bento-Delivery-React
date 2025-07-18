import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  alpha,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { t } from "i18next";
import React, { useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import CustomModal from "../../modal";
import nodata from "../assets/test.png";
import OfflineOrderDenied from "./offline-order/OfflineOrderDenied";
import OfflineOrderDetails from "./offline-order/OfflineOrderDetails";
import OfflinePaymentEdit from "./offline-order/OfflinePaymentEdit";
import SenderOrReceiverDetails from "./parcel-order/SenderOrReceiverDetails";
import { SummeryShimmer } from "./parcel-order/Shimmers";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetAutomatedMessage";
import ChatWithAdmin from "components/my-orders/order-details/other-order/ChatWithAdmin";
import { getToken } from "helper-functions/getToken";
import adminImage from "../../../../public/static/profile/fi_4460756 (1).png";

export const ParcelOrderSummaryBox = styled(CustomStackFullWidth)(
  ({ theme }) => ({
    border: "1px solid",
    borderColor: alpha(theme.palette.neutral[400], 0.2),
    padding: "20px 14px",
    borderRadius: "10px",
    [theme.breakpoints.down("md")]: {
      border: "none",
      backgroundColor: alpha(theme.palette.neutral[300], 0.5),
    },
  })
);

const ParcelOrderSummery = ({
  data,
  trackOrderData,
  configData,
  refetchTrackOrder,
}) => {
  const theme = useTheme();
  const [openAdmin, setOpenAdmin] = useState(false);
  const { data: automateMessageData } = useGetOrderCancelReason();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [openOfflineDetails, setOpenOfflineDetails] = useState(false);
  const [openOfflineModal, setOpenOfflineModal] = useState(false);

  const handleClickOffline = () => {
    setOpenOfflineDetails(!openOfflineDetails);
  };

  const buttonBackgroundColor = () => {
    if (trackOrderData?.offline_payment?.data?.status === "denied") {
      return `${alpha(theme.palette.error.deepLight, 0.9)}`;
    } else if (trackOrderData?.offline_payment?.data?.status === "unpaid") {
      return theme.palette.info.main;
    } else if (trackOrderData?.offline_payment?.data?.status === "verified") {
      return theme.palette.success.main;
    } else {
      return theme.palette.warning.lite;
    }
  };

  return (
    <Grid container pr={{ xs: "0px", sm: "0px", md: "40px" }}>
      <Grid item md={8.1} xs={12} pl={{ xs: "0px", sm: "20px", md: "25px" }}>
        <CustomStackFullWidth
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
        >
          <SenderOrReceiverDetails
            title="Sender Details"
            image={nodata}
            name={data?.delivery_address?.contact_person_name}
            address={data?.delivery_address?.address}
            phone={data?.delivery_address?.contact_person_number}
            house={data?.delivery_address?.house}
            floor={data?.delivery_address?.floor}
            road={data?.delivery_address?.road}
          />
          {!isSmall && (
            <Stack
              sx={{
                borderLeft: (theme) =>
                  `3px solid ${alpha(theme.palette.neutral[400], 0.2)}`,

                height: "129px",
              }}
            ></Stack>
          )}
          <SenderOrReceiverDetails
            title="Receiver Details"
            image={nodata}
            name={data?.receiver_details?.contact_person_name}
            address={data?.receiver_details?.address}
            phone={`+${data?.receiver_details?.contact_person_number}`}
            house={data?.receiver_details?.house}
            floor={data?.receiver_details?.floor}
            road={data?.receiver_details?.road}
          />
        </CustomStackFullWidth>
        <CustomStackFullWidth
          direction="row"
          spacing={2}
          pt="40px"
          pb={{ xs: "30px", md: "0" }}
          pl={{ xs: "6px", md: "0px" }}
          overflow="hidden"
        >
          <Box flexGrow="1" width="0">
            <Stack flexDirection="row" justifyContent="space-between">
              <Stack>
                <Typography
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight="500"
                >
                  {t("Payment")}
                </Typography>
                {trackOrderData?.payment_method ? (
                  <Typography
                    fontSize={{ xs: "12px", md: "14px" }}
                    fontWeight="400"
                    color={theme.palette.neutral[500]}
                    width={{ xs: "120px", md: "215px" }}
                    lineHeight="25px"
                    textTransform="capitalize"
                  >
                    {t(trackOrderData?.payment_method.replaceAll("_", " "))}
                  </Typography>
                ) : (
                  <Skeleton width="100px" variant="text" />
                )}
              </Stack>
              {trackOrderData?.payment_method === "offline_payment" && (
                <Stack alignItems="flex-end" gap="5px">
                  <Typography
                    component="span"
                    fontSize="12px"
                    sx={{
                      textTransform: "capitalize",
                      padding: "4px",
                      marginLeft: "15px",
                      borderRadius: "3px",
                      backgroundColor: buttonBackgroundColor(),
                      color: theme.palette.whiteContainer.main,
                      fontWeight: "600",
                    }}
                  >
                    {/* {trackData?.order_status.replace("_", " ")} */}
                    {trackOrderData?.offline_payment?.data?.status}
                  </Typography>
                  <ExpandMoreIcon
                    onClick={handleClickOffline}
                    sx={{ cursor: "pointer" }}
                  />
                </Stack>
              )}
            </Stack>
            {openOfflineDetails &&
              trackOrderData?.payment_method === "offline_payment" && (
                <OfflineOrderDetails
                  trackOrderData={trackOrderData}
                  setOpenOfflineModal={setOpenOfflineModal}
                />
              )}
            {trackOrderData?.offline_payment?.data?.status === "denied" && (
              <OfflineOrderDenied trackOrderData={trackOrderData} />
            )}
            {openOfflineModal && (
              <CustomModal
                openModal={openOfflineModal}
                handleClose={() => setOpenOfflineModal(false)}
              >
                <CustomStackFullWidth
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ position: "relative" }}
                >
                  <IconButton
                    onClick={() => setOpenOfflineModal(false)}
                    sx={{
                      zIndex: "99",
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: (theme) => theme.palette.neutral[100],
                      borderRadius: "50%",
                      [theme.breakpoints.down("md")]: {
                        top: 10,
                        right: 5,
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "24px", fontWeight: "500" }} />
                  </IconButton>
                </CustomStackFullWidth>
                <OfflinePaymentEdit
                  trackOrderData={trackOrderData}
                  refetchTrackOrder={refetchTrackOrder}
                  data={data}
                  setOpenOfflineModal={setOpenOfflineModal}
                />
              </CustomModal>
            )}
          </Box>
          {isSmall && (
            <Stack
              sx={{
                borderLeft: (theme) =>
                  `2px solid ${alpha(theme.palette.neutral[400], 0.2)}`,

                height: "64px",
                paddingRight: {
                  xs: "6px",
                  xl: "30px",
                },
              }}
            ></Stack>
          )}
          <Box flexGrow="1" width="0">
            <Typography fontSize={{ xs: "14px", md: "16px" }} fontWeight="500">
              {t("Charge Pay By")}
            </Typography>
            {trackOrderData?.payment_method ? (
              <Typography
                fontSize={{ xs: "12px", md: "14px" }}
                fontWeight="400"
                color={theme.palette.neutral[500]}
                width={{ xs: "150px", md: "215px" }}
                lineHeight="25px"
                textTransform="capitalize"
              >
                {data?.charge_payer}
              </Typography>
            ) : (
              <Skeleton width="100px" variant="text" />
            )}
          </Box>
        </CustomStackFullWidth>
        {trackOrderData?.delivery_instruction && (
          <Stack spacing={1} pt={{ xs: "0px", md: "20px" }}>
            <Typography fontSize={{ xs: "14px", md: "16px" }} fontWeight="500">
              {t("Instructions")}
            </Typography>
            <Stack
              padding={{ xs: "10px", sm: "15px", md: "20px" }}
              borderRadius="10px"
              backgroundColor={theme.palette.background.default}
            >
              <Typography
                fontSize={{ xs: "12px", md: "14px" }}
                fontWeight="400"
                color={theme.palette.neutral[500]}
                lineHeight="25px"
                textTransform="capitalize"
              >
                {trackOrderData?.delivery_instruction}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Grid>
      <Grid item md={3.9} xs={12} paddingLeft={{ xs: "0px", md: "26px" }}>
        {data ? (
          <ParcelOrderSummaryBox alignItems="center" spacing={2}>
            <CustomImageContainer
              width="144px"
              height="144px"
              src={data?.parcel_category?.image_full_url}
              alt={data?.parcel_category?.name}
            />
            <Stack alignItems="center" textAlign="center">
              <Typography fontSize="18px" fontWeight="600">
                {data?.parcel_category?.name}
              </Typography>
              <Typography color={theme.palette.neutral[400]}>
                {data?.parcel_category?.description}
              </Typography>
            </Stack>
            <Stack width="100%" spacing={1}>
              <Typography
                fontSize="16px"
                fontWeight="500"
                textTransform="capitalize"
                textAlign="left"
              >
                {t("Summary")}
              </Typography>
              {(data?.delivery_charge !== null ||
                data?.delivery_charge !== 0) && (
                <CustomStackFullWidth
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography
                    fontSize="14px"
                    color={theme.palette.neutral[400]}
                  >
                    {t("Delivery Fee")}
                  </Typography>
                  {data ? (
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[400]}
                    >
                      {data && getAmountWithSign(data?.delivery_charge)}
                    </Typography>
                  ) : (
                    <Skeleton width="100px" variant="text" />
                  )}
                </CustomStackFullWidth>
              )}
              {data?.ref_bonus_amount > 0 ? (
                <CustomStackFullWidth
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography
                    fontSize="14px"
                    color={theme.palette.neutral[400]}
                  >
                    {t("Referral Discount")}
                  </Typography>
                  {data ? (
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[400]}
                    >
                      -
                      {data &&
                        getAmountWithSign(trackOrderData?.ref_bonus_amount)}
                    </Typography>
                  ) : (
                    <Skeleton width="100px" variant="text" />
                  )}
                </CustomStackFullWidth>
              ) : null}
              {data?.tax_status !== "included" && data?.total_tax_amount>0 ? (
                <CustomStackFullWidth
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography
                    fontSize="14px"
                    color={theme.palette.neutral[400]}
                  >
                    {t("VAT/TAX")}
                  </Typography>
                  {data ? (
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[400]}
                    >
                      {data && getAmountWithSign(data?.total_tax_amount)}
                    </Typography>
                  ) : (
                    <Skeleton width="100px" variant="text" />
                  )}
                </CustomStackFullWidth>
              ) : null}

              {data?.dm_tips !== null || data?.dm_tips !== 0 ? (
                <CustomStackFullWidth
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography
                    fontSize="14px"
                    color={theme.palette.neutral[400]}
                  >
                    {t("Delivery Man Tips")}
                  </Typography>
                  {data ? (
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[400]}
                    >
                      {data && getAmountWithSign(data?.dm_tips)}
                    </Typography>
                  ) : (
                    <Skeleton width="100px" variant="text" />
                  )}
                </CustomStackFullWidth>
              ) : null}
              {data?.additional_charge !== null ||
              data?.additional_charge !== 0 ? (
                <CustomStackFullWidth
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography
                    fontSize="14px"
                    color={theme.palette.neutral[400]}
                  >
                    {t("Additional Charge")}
                  </Typography>
                  {data ? (
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[400]}
                    >
                      {data && getAmountWithSign(data?.additional_charge)}
                    </Typography>
                  ) : (
                    <Skeleton width="100px" variant="text" />
                  )}
                </CustomStackFullWidth>
              ) : null}
              <Stack
                width="100%"
                sx={{
                  marginBottom: "10px",
                  mt: "20px",
                  borderBottom: (theme) =>
                    `1px dotted ${theme.palette.neutral[400]}`,
                }}
              ></Stack>
              <CustomStackFullWidth
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography component="span" fontWeight="500">{t("Total Amount")}
                  {data?.tax_status==="included" ? (
                    <Typography sx={{marginInlineStart:"5px"}} component="span" fontWeight="400" color={theme.palette.neutral[400]} fontSize="12px" ml={1}>
                      {t("(Vat/Tax incl.)")}
                    </Typography>
                  ) : null}
                </Typography>
                {data ? (
                  <Typography fontWeight="600">
                    {data && getAmountWithSign(data?.order_amount)}
                  </Typography>
                ) : (
                  <Skeleton width="100px" variant="text" />
                )}
              </CustomStackFullWidth>
            </Stack>
          </ParcelOrderSummaryBox>
        ) : (
          <SummeryShimmer />
        )}
        {getToken() && (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            mt="1.4rem"
            alignItems="center"
          >
            <CustomImageContainer
              src={adminImage.src}
              width="35px"
              height="35px"
            />

            <Typography
              fontSize={{ xs: "14px", md: "16px" }}
              fontWeight="500"
              sx={{ cursor: "pointer" }}
              onClick={() => setOpenAdmin(true)}
            >
              {t(`Massage to `)}
              <Typography
                component="span"
                fontSize={{ xs: "14px", md: "16px" }}
                fontWeight="500"
                color="primary"
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {configData?.business_name}
              </Typography>
            </Typography>
          </Stack>
        )}
      </Grid>
      <CustomModal
        openModal={openAdmin}
        handleClose={() => setOpenAdmin(false)}
        closeButton
      >
        <ChatWithAdmin
          automateMessageData={automateMessageData?.data}
          orderID={trackOrderData?.id}
        />
      </CustomModal>
    </Grid>
  );
};

export default ParcelOrderSummery;
