import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomModal from "../modal";
import {
  alpha,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { setOrderDetailsModalOpen } from "../../redux/slices/utils";
import { getGuestId } from "../../helper-functions/getToken";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import jwt from "base-64";
import CheckoutFailed from "../checkout/CheckoutFailed";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { setOrderDetailsModal } from "redux/slices/offlinePaymentData";

const OrderDetailsModal = ({ orderDetailsModalOpen }) => {
  const dispatch = useDispatch();
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();
  const guestId = getGuestId();
  const router = useRouter();
  const { status, totalAmount, order_id, token, flag } = router.query;
  const { t } = useTranslation();
  const { total } = router.query;
  const [attributeId, setAttributeId] = useState("");
  const { guestUserOrderId, guestUserInfo } = useSelector(
    (state) => state.guestUserInfo
  );
  const { orderDetailsModal, offlineInfoStep } = useSelector(
    (state) => state.offlinePayment
  );
  const { orderInformation } = useSelector((state) => state.utilsData);
  const handleOrderDetailsClose = () => {
    dispatch(setOrderDetailsModal(false));
    dispatch(setOrderDetailsModalOpen(false));
  };
  const handleClickToRoute = (href) => {
    dispatch(setOrderDetailsModalOpen(false));
    router.push(href, undefined, { shallow: true });
  };
  console.log({orderDetailsModal});
  useEffect(() => {
    if (token) {
      try {
        // Attempt to decode the Base64 token
        const decodedToken = jwt.decode(token);

        // Check if decodedToken is a valid string
        if (typeof decodedToken === "string") {
          // Assuming decodedToken is in the format: "key1=value1&&key2=value2&&..."
          const keyValuePairs = decodedToken.split("&&");

          // Loop through the key-value pairs to find the one with attribute_id
          for (const pair of keyValuePairs) {
            const [key, value] = pair.split("=");
            if (key === "attribute_id") {
              setAttributeId(value);
              return; // Exit the loop when attribute_id is found
            }
          }
        } else {
          console.error("Decoded token is not a string:", decodedToken);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("Token is missing.");
    }
  }, [token]);
  return (
    <CustomModal
      openModal={orderDetailsModalOpen}
      handleClose={() => handleOrderDetailsClose()}
    >
      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ position: "relative" }}
      >
        <IconButton
          onClick={() => handleOrderDetailsClose()}
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
      {(flag && flag === "fail") || flag === "cancel" ? (
        <CheckoutFailed
          id={order_id ? order_id : attributeId}
          configData={configData}
          handleOrderDetailsClose={handleOrderDetailsClose}
        />
      ) : (
        <CustomStackFullWidth
          padding={{ xs: "40px 15px", md: "45px 45px 40px" }}
          alignItems="center"
          gap="20px"
        >
          <CheckCircleIcon
            sx={{
              height: "56px",
              width: "56px",
              color: alpha(theme.palette.primary.main, .9),
            }}
          />
          <Typography fontSize="18px" fontWeight="700">
            {`${t("Order Placed Successfully")}`}
          </Typography>
          {/* <CustomStackFullWidth
            padding={{ xs: "0px 20px", md: "0px 38px" }}
            textAlign="center"
          >
            <Typography fontWeight="400">
              {`${t("Make sure to remember your ")}`}
              <Typography component="span" fontWeight={500}>{`${t(
                "order ID and phone number"
              )}`}</Typography>
              <Typography component="span">
                {`${t(
                  " that is used in this order as you have ordered as guest user. Other wise you won’t be able to track your order in future."
                )}`}
              </Typography>
            </Typography>
          </CustomStackFullWidth> */}
          <Typography fontWeight="400" textAlign="center" maxWidth="380px">
            We will begin processing your order shortly. Your Order ID is
              <Typography component="span" fontWeight={600}>{ " " }{guestUserOrderId || order_id}</Typography>,
              placed using the phone number
              <Typography component="span" fontWeight={600}>{" "}{guestUserInfo?.phone || orderInformation?.phone || "+880170987654"}</Typography>.
          </Typography>
          <Typography fontWeight="400" textAlign="center" maxWidth="380px">
            Please keep this Order ID handy for track your order in future We’ve also emailed the details to you
          </Typography>



          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            maxWidth="370px"
            padding=".25rem .25rem .25rem .75rem"
            marginBlock="15px"
            borderRadius="999rem"
            sx={{
              border: `1px dashed ${theme.palette.neutral[400]}`,
            }}
          >
            <Typography fontWeight={700}>
              {t("Order ID")} #{guestUserOrderId || order_id}
            </Typography>
            <Button
              variant="contained"
              sx={{
                borderRadius: "999rem",
                padding: "6px 20px",
                textTransform: "capitalize",
                minWidth: "auto",
              }}
              onClick={() => {
                navigator.clipboard.writeText(guestUserOrderId || order_id);
                toast.success(t("Order ID copied!"));
              }}
            >
              {t("Copy")}
            </Button>
          </Stack>


          {/* <CustomStackFullWidth
            padding="20px 10px 20px 10px"
            backgroundColor={alpha(theme.palette.neutral[400], 0.09)}
            alignItems="center"
            gap="20px"
            borderRadius="10px"
          >
            <Typography fontWeight={700}>{t("Order Information :")}</Typography>
            <Stack textAlign="center">
              <Stack width="max-content">
                <ItemWrapper container>
                  <ModalCustomTypography>
                    {`${t("Order")} #`}
                  </ModalCustomTypography>
                  <Typography sx={{ wordWrap: "break-word" }}>
                    :&nbsp;&nbsp;{guestUserOrderId || order_id}
                  </Typography>
                </ItemWrapper>
                <ItemWrapper>
                  <ModalCustomTypography>
                    {`${t("Order Time")}`}
                  </ModalCustomTypography>
                  <Typography sx={{ wordWrap: "break-word" }}>
                    :&nbsp;&nbsp;{orderInformation?.created_at}
                  </Typography>
                </ItemWrapper>
                <ItemWrapper>
                  <ModalCustomTypography>
                    {`${t("Order Status")}`}
                  </ModalCustomTypography>
                  <Typography sx={{ wordWrap: "break-word" }}>
                    :&nbsp;&nbsp;{orderInformation?.status}
                  </Typography>
                </ItemWrapper>
              </Stack>
            </Stack>
          </CustomStackFullWidth> */}
          <Button
            onClick={() => handleClickToRoute("/track-order")}
            variant="contained"
          // maxWidth="150px"
          // fullWidth
          >
            {t("Track Order")}
          </Button>
        </CustomStackFullWidth>
      )}
    </CustomModal>
  );
};

export default OrderDetailsModal;
