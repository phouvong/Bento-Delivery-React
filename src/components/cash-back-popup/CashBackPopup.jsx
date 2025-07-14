/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Collapse, Stack, Typography } from "@mui/material";
import { alpha, Box } from "@mui/system";
import useGetCashbackList from "api-manage/hooks/react-query/cashback/useGetCashbackList";
import { CustomDateFormat } from "components/date-and-time-formators/CustomDateFormat";
import CloseIcon from "components/icons/CloseIcon";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCashbackList } from "redux/slices/cashbackList";
import CustomImageContainer from "components/CustomImageContainer";
import cashbackImage from "../../../public/static/cash-back.svg";

const CashBackPopup = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleSuccess = (data) => {
    dispatch(setCashbackList(data));
  };
  const { refetch } = useGetCashbackList(handleSuccess);
  const { cashbackList } = useSelector((state) => state.cashbackList);

  useEffect(() => {
    if (!cashbackList) refetch();
  }, []);

  if (cashbackList?.length > 0)
    return (
      <>
        <CustomPopupButtonBox onClick={() => setOpen(!open)}>
          <CustomImageContainer
            width="68px"
            height="72px"
            src={cashbackImage.src}
            alt="cashback"
          />
          {/*<img*/}
          {/*  src="/static/cash-back.svg"*/}
          {/*  alt="Cashback"*/}
          {/*  width={68}*/}
          {/*  height={72}*/}
          {/*/>*/}
        </CustomPopupButtonBox>
        <CustomPopupBox>
          <Collapse in={open}>
            <Box
              position={"relative"}
              padding={"16px"}
              paddingTop={"0"}
              sx={{
                background: alpha(theme.palette.neutral[1000], 0.2),
                borderRadius: "8px",
              }}
            >
              <Stack
                onClick={() => setOpen(!open)}
                position={"sticky"}
                top={"0"}
                justifyContent={"flex-end"}
                direction={"row"}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    transform: "translateX(16px)",
                  }}
                >
                  <CloseIcon />
                </Box>
              </Stack>
              <Stack gap={"10px"}>
                {cashbackList.map((item, index) => (
                  <CustomOfferBox key={index}>
                    <Box className="box-top">
                      <Typography variant={"h6"}>
                        {item?.cashback_type === "amount"
                          ? getAmountWithSign(item?.cashback_amount)
                          : item?.cashback_amount + "%"}{" "}
                        {t(item?.title)}
                      </Typography>
                    </Box>
                    <Stack direction={"row"} px={1}>
                      <Box component={"span"}>
                        {t("Min Spent")} {getAmountWithSign(item?.min_purchase)}
                      </Box>
                      <Box component={"span"} mx={"4px"}>
                        |
                      </Box>
                      <Box component={"span"}>
                        {CustomDateFormat(item?.end_date)}
                      </Box>
                    </Stack>
                  </CustomOfferBox>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </CustomPopupBox>
      </>
    );
};

const CustomPopupButtonBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  cursor: "pointer",
  display: "flex",
  bottom: "23px",
  right: "5%",
  zIndex: "999",
  [theme.breakpoints.down("lg")]: {
    bottom: "63px",
  },
  [theme.breakpoints.down("sm")]: {
    bottom: "53px",
    img: {
      width: "50px",
      height: "50px",
    },
  },
}));
const CustomOverlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  display: "none",
  bottom: "0",
  right: "0",
  width: "100%",
  height: "100%",
  zIndex: "999",
  background: alpha(theme.palette.neutral[900], 0.9),
  [theme.breakpoints.down("1200")]: {
    display: "block",
  },
}));
const CustomPopupBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: "100px",
  right: "23px",
  zIndex: "99999",
  overflowY: "auto",
  width: "293px",
  maxHeight: "calc(100dvh - 200px)",
  [theme.breakpoints.down("lg")]: {
    bottom: "130px",
  },
  [theme.breakpoints.down("sm")]: {
    bottom: "110px",
    maxHeight: "calc(100dvh - 170px)",
  },
}));
const CustomOfferBox = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  padding: "10px",
  borderRadius: "5px",
  fontSize: "10px",
  boxShadow: theme.shadows[14],
  ".box-top": {
    background: theme.palette.background.custom7,
    padding: "8px",
    borderRadius: "3px",
    mb: 2,
    ".MuiTypography-h6": {
      fontSize: "14px",
    },
  },
}));
export default CashBackPopup;
