import { Grid, styled, Typography } from "@mui/material";
import { alpha, Box, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";
import { CustomBoxFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import Body2 from "../typographies/Body2";
import { PrimaryToolTip } from "components/cards/QuickView";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";

const Wrapper = styled(CustomBoxFullWidth)(({ theme, hover }) => ({
  position: "relative",
  height: "180px",
  boxShadow:
    hover === "true" ? "0px 10px 20px rgba(88, 110, 125, 0.1)" : "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all ease .3s",
  "&:hover": {
    // transform: "scale(1.03)",
    img: {
      transform: "scale(1.05)",
    },
  },
}));
const ContentWrapper = styled(CustomBoxFullWidth)(({ theme, hover }) => ({
  position: "absolute",
  width: "calc(100% + 2px)",
  left: "-1px",
  bottom: "-1px",
  zIndex: "2",
  transition: "all ease .3s",
  background:
    hover === "true"
      ? theme.palette.background.paper
      : alpha(theme.palette.background.paper, 0.9),
  borderRadius: "40px 0px 10px 10px",
  height: "93px",
  padding: "12px",
}));

const PharmacyFeaturedStoreCard = (props) => {
  const { data } = props;
  const classes = textWithEllipsis();
  const [hover, setHover] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const handleClick = () => {
    router.push({
      pathname: `/store/[id]`,
      query: {
        id: `${data?.slug ? data?.slug : data?.id}`,
        module_id: `${data?.module_id}`,
        module_type: getCurrentModuleType(),
        store_zone_id: `${data?.zone_id}`,
      },
    });
  };
  return (
    <Wrapper
      hover={hover ? "true" : "false"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
    >
      <CustomImageContainer
        src={data?.cover_photo}
        alt={data?.name}
        height="100%"
        width="100%"
        obejctfit="contained"
        borderRadius="10px"
      />
      <ContentWrapper hover={hover ? "true" : "false"}>
        <Grid container>
          <Grid item xs={3} sm={3} md={2.5}>
            <Box
              sx={{
                border: ".4px solid",
                width: "37px",
                height: "37px",
                borderRadius: "37px",
                borderColor: "#72D9FF",
              }}
            >
              <CustomImageContainer
                src={data?.logo}
                alt={data?.name}
                height="100%"
                width="100%"
                obejctfit="contained"
                borderRadius="37px"
              />
            </Box>
          </Grid>
          <Grid item xs={9} sm={9} md={9.5}>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="flex-start"
              spacing={2}
            >
              <Stack alignItems="flex-start" spacing={1}>
                <PrimaryToolTip
                  text={data?.name}
                  placement="bottom"
                  arrow="false"
                >
                  <Typography
                    variant="subtitle1"
                    className={classes.singleLineEllipsis}
                    maxHeight="20px"
                  >
                    {data?.name}
                  </Typography>
                </PrimaryToolTip>
                <Body2 text={data?.address} />
                <Typography
                  variant="body2"
                  color="primary.main"
                  fontWeight="500"
                >
                  {data?.total_items === 1
                    ? data?.total_items
                    : data?.total_items - 1}
                  {data?.total_items > 2 && "+"} {t("Items")}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </ContentWrapper>
    </Wrapper>
  );
};

PharmacyFeaturedStoreCard.propTypes = {};

export default PharmacyFeaturedStoreCard;
