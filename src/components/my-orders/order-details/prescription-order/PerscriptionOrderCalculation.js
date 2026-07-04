import React, { useState } from "react";
import { OrderSummaryCalculationCard } from "../other-order/OrderCalculation";
import { Typography, useTheme } from "@mui/material";
import { alpha, Stack } from "@mui/system";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { getAmountWithSign } from "../../../../helper-functions/CardHelpers";
import CustomModal from "components/modal";
import ChatWithAdmin from "components/my-orders/order-details/other-order/ChatWithAdmin";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetAutomatedMessage";
import { getToken } from "helper-functions/getToken";
import CustomImageContainer from "components/CustomImageContainer";
import adminImage from "../../../../../public/static/profile/fi_4460756 (1).png";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";

const PrescriptionOrderCalculation = ({
  t,
  data,
  trackOrderData,
  configData,
}) => {
  const [openAdmin, setOpenAdmin] = useState(false);
  const { data: automateMessageData } = useGetOrderCancelReason();
  const theme = useTheme();
  const proDeliveryReduction =
    Number(trackOrderData?.delivery_fee_reduction_amount) || 0;
  const hasProDeliveryReduction =
    trackOrderData?.benefit_type === "delivery_fee" && proDeliveryReduction > 0;
  const originalDeliveryFee = hasProDeliveryReduction
    ? Number(trackOrderData?.delivery_charge || 0) + proDeliveryReduction
    : Number(trackOrderData?.delivery_charge || 0);
  const proOrderDiscount = Number(trackOrderData?.pro_discount) || 0;
  const hasProOrderDiscount =
    trackOrderData?.benefit_type === "discount" && proOrderDiscount > 0;
  return (
    <OrderSummaryCalculationCard spacing={1.5}>
      <Typography fontWeight="500">{t("Summary")}</Typography>
      <Stack width="100%" marginTop="auto" spacing={1.5}>
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography>{t("Item Price")}</Typography>
          <Typography>
            {trackOrderData &&
              getAmountWithSign(
                trackOrderData?.order_amount +
                  trackOrderData?.store_discount_amount -
                  trackOrderData?.coupon_discount_amount -
                  trackOrderData?.total_tax_amount -
                  trackOrderData?.dm_tips -
                  trackOrderData?.delivery_charge -
                  trackOrderData?.additional_charge
              )}
          </Typography>
        </CustomStackFullWidth>
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography>{t("Discount")}</Typography>
          <Typography>
            (-){" "}
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.store_discount_amount)}
          </Typography>
        </CustomStackFullWidth>
        {hasProOrderDiscount && (
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography
                component="span"
                sx={{
                  flexShrink: 0,
                  fontSize: "11px",
                  px: 0.75,
                  py: 0.1,
                  borderRadius: "999px",
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                {t("Pro")}
              </Typography>
              <Typography>{t("Discount")}</Typography>
            </Stack>
            <Typography
              fontWeight={600}
              sx={{ color: theme.palette.success?.main }}
            >
              (-) {getAmountWithSign(proOrderDiscount)}
            </Typography>
          </CustomStackFullWidth>
        )}
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography>{t("Coupon discount")}</Typography>
          <Typography>
            (+){" "}
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.coupon_discount_amount)}
          </Typography>
        </CustomStackFullWidth>
        {trackOrderData?.tax_status === "excluded" &&
          trackOrderData?.total_tax_amount > 0 && (
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography>{t("VAT/TAX")}</Typography>
              <Typography>
                {trackOrderData?.tax_status !== "included" && " (+) "}
                {trackOrderData &&
                  getAmountWithSign(trackOrderData?.total_tax_amount)}
              </Typography>
            </CustomStackFullWidth>
          )}

        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography>{t("Delivery fee")}</Typography>
          {trackOrderData ? (
            <Stack direction="row" alignItems="center" spacing={0.75}>
              {hasProDeliveryReduction ? (
                <Typography
                  sx={{
                    textDecoration: "line-through",
                    color: theme.palette.neutral?.[400],
                    fontSize: "13px",
                  }}
                >
                  {getAmountWithSign(originalDeliveryFee)}
                </Typography>
              ) : null}
              <Typography
                fontWeight={hasProDeliveryReduction ? 600 : 400}
                color={
                  hasProDeliveryReduction ? "primary.main" : "text.primary"
                }
              >
                (+) {getAmountWithSign(trackOrderData?.delivery_charge)}
              </Typography>
            </Stack>
          ) : null}
        </CustomStackFullWidth>
        {hasProDeliveryReduction && (
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography
                component="span"
                sx={{
                  flexShrink: 0,
                  fontSize: "11px",
                  px: 0.75,
                  py: 0.1,
                  borderRadius: "999px",
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                {t("Pro")}
              </Typography>
              <Typography>{t("Delivery Fee Discount")}</Typography>
            </Stack>
            <Typography
              fontWeight={600}
              sx={{ color: theme.palette.success?.main }}
            >
              (-) {getAmountWithSign(proDeliveryReduction)}
            </Typography>
          </CustomStackFullWidth>
        )}
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography>{t("Deliveryman tips")}</Typography>
          <Typography>
            (+) {trackOrderData && getAmountWithSign(trackOrderData?.dm_tips)}
          </Typography>
        </CustomStackFullWidth>
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography>{t(configData?.additional_charge_name)}</Typography>
          <Typography>
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.additional_charge)}
          </Typography>
        </CustomStackFullWidth>
        <Stack
          width="100%"
          sx={{
            mt: "20px",
            mb: "10px",
            borderBottom: (theme) => `2px solid ${theme.palette.neutral[300]}`,
          }}
        ></Stack>
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography component="span" fontWeight="bold" color="primary.main">
            {t("Total")}
            {trackOrderData?.tax_status === "included" && (
              <Typography
                component="span"
                ml={"3px"}
                fontSize="12px"
                fontWeight="normal"
                color="text.secondary"
              >
                {t("(Vat/Tax incl.)")}
              </Typography>
            )}
          </Typography>
          <Typography fontWeight="bold">
            {trackOrderData && getAmountWithSign(trackOrderData?.order_amount)}
          </Typography>
        </CustomStackFullWidth>
        {hasProDeliveryReduction ? (
          <ProSavingsBanner
            amount={proDeliveryReduction}
            message={`${t("You saved")} ${getAmountWithSign(
              proDeliveryReduction
            )} ${t("on delivery fees as a Pro member.")}`}
          />
        ) : hasProOrderDiscount ? (
          <ProSavingsBanner
            amount={proOrderDiscount}
            message={`${t("You saved")} ${getAmountWithSign(
              proOrderDiscount
            )} ${t("as a Pro member.")}`}
          />
        ) : null}
      </Stack>
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
    </OrderSummaryCalculationCard>
  );
};

export default PrescriptionOrderCalculation;
