import React, { useState } from "react";
import { OrderSummaryCalculationCard } from "../other-order/OrderCalculation";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { getAmountWithSign } from "../../../../helper-functions/CardHelpers";
import CustomModal from "components/modal";
import ChatWithAdmin from "components/my-orders/order-details/other-order/ChatWithAdmin";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetAutomatedMessage";
import { getToken } from "helper-functions/getToken";
import CustomImageContainer from "components/CustomImageContainer";
import adminImage from "../../../../../public/static/profile/fi_4460756 (1).png";

const PrescriptionOrderCalculation = ({
  t,
  data,
  trackOrderData,
  configData,
}) => {
  const [openAdmin, setOpenAdmin] = useState(false);
  const { data: automateMessageData } = useGetOrderCancelReason();
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
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography>
            {t("Vat/Tax")}
            {trackOrderData?.tax_status === "included" ? "(included)" : ""}
          </Typography>
          <Typography>
            {trackOrderData?.tax_status !== "included" && " (+) "}
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.total_tax_amount)}
          </Typography>
        </CustomStackFullWidth>
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography>{t("Delivery fee")}</Typography>
          <Typography>
            (+){" "}
            {trackOrderData &&
              getAmountWithSign(trackOrderData?.delivery_charge)}
          </Typography>
        </CustomStackFullWidth>
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
          <Typography fontWeight="bold" color="primary.main">
            {t("Total")}
          </Typography>
          <Typography fontWeight="bold">
            {trackOrderData && getAmountWithSign(trackOrderData?.order_amount)}
          </Typography>
        </CustomStackFullWidth>
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
