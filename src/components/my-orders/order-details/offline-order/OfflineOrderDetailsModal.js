import React from "react";
import {
  Button,
  Grid,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme, Box
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { t } from "i18next";

import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import DotSpin from "../../../DotSpin";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import {
  ItemWrapper,
  ModalCustomTypography,
} from "../../../order-details-modal/OrderDetailsModal.style";
import CheckoutFailedCard from "components/checkout/CheckoutFailedCard";
import { useRouter } from "next/router";
import { CustomBox } from "styled-components/CustomStyles.style";
const OfflineOrderDetailsModal = ({
  trackData,
  handleOfflineClose,
  trackDataIsLoading,
  trackDataIsFetching,
  page,
  setOpenPaymentMethod,
  setPaymentFailedData,
  refetchTrackData
}) => {
  const theme = useTheme();
  const router = useRouter();
  console.log({ trackDataIsFetching });

  return (
    <CustomStackFullWidth
      padding={{ xs: "30px 15px", md: "60px 45px 40px" }}
      alignItems="center"
      gap="20px"
    >
      {(trackDataIsLoading || trackDataIsFetching) ? (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", maxWidth: "540px", width: "100%", minWidth: "340px", minHeight: "340px" }}>
          <DotSpin />
        </Box>
      ) : (
        <Typography fontSize="14px" fontWeight="400">
          {(page === "my-orders?flag=fail" || page === "my-orders?flag=cancel" || trackData?.order_status === "failed") ? (
            <CheckoutFailedCard
              handleOrderDetailsClose={handleOfflineClose}
              id={trackData?.id}
              setOpenPaymentMethod={setOpenPaymentMethod}
              amount={trackData?.order_amount}
              setPaymentFailedData={setPaymentFailedData}
              refetchTrackData={refetchTrackData}
            />
          ) : (
            <Stack sx={{ alignItems: "center", justifyContent: "center", gap: "1rem", maxWidth: "540px" }}>
              <CheckCircleIcon
                sx={{ color: theme.palette.success.main, fontSize: "50px" }}
              />

              <Typography fontSize="20px" textAlign="center" fontWeight="500" >
                {t("Order Payment Details submitted successfully")}!
              </Typography>

              <Typography
                component="span"
                fontWeight="600"
                textAlign="center"
              >
                <Typography >
                  {t("We will begin processing your order shortly. Your Order ID is")}
                  <Typography component="span" fontWeight="bold" color="primary.main">
                    #{trackData?.id}
                  </Typography>
                  {t(", Please keep this Order ID handy for tracking")}
                </Typography>
              </Typography>
            </Stack>
          )}
        </Typography>
      )}

      {trackData?.offline_payment && (
        <>
          <CustomStackFullWidth
            padding="40px 10px 20px 20px"
            backgroundColor={alpha(theme.palette.primary.main, 0.1)}
            alignItems="center"
            gap="30px"
            borderRadius="10px"
          >
            <Typography fontWeight={500}>{t("Payment Info")}</Typography>
            <CustomStackFullWidth
              alignItems="center"
              gap="20px"
              borderRadius="10px"

            >
              {trackDataIsLoading ? (
                <Grid container padding="40px">
                  <DotSpin />
                </Grid>
              ) : (
                <Stack>
                  <ItemWrapper container>
                    <ModalCustomTypography>
                      {`${t("Order")} #`}
                    </ModalCustomTypography>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      :&nbsp;&nbsp;{trackData?.id}
                    </Typography>
                  </ItemWrapper>
                  <ItemWrapper>
                    <ModalCustomTypography>
                      {`${t("Order Time")}`}
                    </ModalCustomTypography>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      :&nbsp;&nbsp;{trackData?.created_at}
                    </Typography>
                  </ItemWrapper>
                  <ItemWrapper>
                    <ModalCustomTypography>
                      {`${t("Order Status")}`}
                    </ModalCustomTypography>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      :&nbsp;&nbsp;{trackData?.order_status}
                    </Typography>
                  </ItemWrapper>
                  {trackData?.offline_payment && (
                    <>
                      {trackData?.offline_payment?.input?.map((item, index) => {
                        return (
                          <ItemWrapper key={index}>
                            <ModalCustomTypography
                              sx={{ textTransform: "capitalize" }}
                            >
                              {item?.user_input.replaceAll("_", " ")}
                            </ModalCustomTypography>
                            <Typography sx={{ wordWrap: "break-word" }}>
                              :&nbsp;&nbsp;
                              {item?.user_data.replaceAll("_", " ")}
                            </Typography>
                          </ItemWrapper>
                        );
                      })}
                      <ItemWrapper>
                        {trackData?.offline_payment?.data?.customer_note && (
                          <>
                            <ModalCustomTypography>
                              {"Note"}
                            </ModalCustomTypography>
                            <Typography sx={{ wordWrap: "break-word" }}>
                              :&nbsp;&nbsp;
                              {trackData?.offline_payment?.data?.customer_note}
                            </Typography>
                          </>
                        )}
                      </ItemWrapper>
                    </>
                  )}
                </Stack>
              )}
            </CustomStackFullWidth>
          </CustomStackFullWidth>
          <Typography color={theme.palette.text.secondary} padding="0px 0px">
            <Typography
              component="span"
              color={theme.palette.error.main}
              fontSize="18px"
            >
              {" "}
              *{" "}
            </Typography>
            {t(
              "If you accidentally provided incorrect payment information, you can edit the details in the order details section while the order is still pending."
            )}
          </Typography>
        </>
      )}
      {/* <Button
        variant="contained"
        color="primary"
        // onClick={handleOfflineClose}
        onClick={() => router.push("/home")}
      >
        {t("Back to Home")}
      </Button> */}
    </CustomStackFullWidth>
  );
};

export default OfflineOrderDetailsModal;
