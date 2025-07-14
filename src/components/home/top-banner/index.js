import { alpha, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import banner from "../assets/banner.webp";
import rcommerceSearchBg from "../assets/ecommerce_top_bg.png";
import foodBanner from "../assets/food.png";
import pharmacy from "../assets/par.png";
import parcelImage from "../assets/parcelBg.png";
import { BannerCityIcon } from "components/home/module-wise-components/rental/RentalIcons";
import LeftCar from "/public/static/rental/left_car.png";
import RightCar from "/public/static/rental/right_car.png";
import { useEffect, useState } from "react";
import Image from 'next/image'


const TopBanner = () => {
  const [moduleType, setModuleType] = useState(null);
  const theme = useTheme();
  // Ensure moduleType is set on the client
  useEffect(() => {
    setModuleType(getCurrentModuleType());
  }, []);

  const getBGColor = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return alpha(theme.palette.primary.main, 0.2);
      case ModuleTypes.PHARMACY:
        return alpha(theme.palette.primary.main, 0.2);
      case ModuleTypes.ECOMMERCE:
        return alpha(theme.palette.primary.main, 0.2);
      case ModuleTypes.FOOD:
        return alpha(theme.palette.primary.main, 0.2);
      case ModuleTypes.PARCEL:
        return alpha(theme.palette.primary.main, 0.2);
      case ModuleTypes.RENTAL:
        return alpha(theme.palette.primary.main, 0.05);
      default:
        return "inherit";
    }
  };
  const getBGImage = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return banner?.src;
      case ModuleTypes.PHARMACY:
        return pharmacy?.src;
      case ModuleTypes.ECOMMERCE:
        return rcommerceSearchBg?.src;
      case ModuleTypes.FOOD:
        return foodBanner?.src;
      case ModuleTypes.PARCEL:
        return parcelImage?.src;

      default:
        return "inherit";
    }
  };
  // if (!moduleType) return null;

  return (
    <CustomBoxFullWidth
      sx={{
        minHeight: {
          xs: moduleType === "parcel" ? "250px" : "160px",
          sm: "270px",
          md:"270px"
        },
        backgroundColor: getBGColor(),
        position: "relative",
        overflow: "hidden",
      }}
    >
      {getCurrentModuleType() === "rental" ? (
        <Box
          sx={{
            svg: { position: "absolute" },
            ".left_img": (theme) => ({
              position: "absolute",
              left: "-150px",
              bottom: 0,
              [theme.breakpoints.up("sm")]: {
                left: "-60px",
              },
            }),
            ".right_img": (theme) => ({
              position: "absolute",
              left: "auto",
              right: "-150px",
              bottom: 0,
              [theme.breakpoints.up("sm")]: {
                right: "-50px",
              },
            }),
          }}
        >
          <BannerCityIcon height="100%" width="100%" objectFit="cover" />
          <CustomImageContainer
            className="left_img"
            src={LeftCar?.src}
            width={238}
            height={94}
          />
          <CustomImageContainer
            className="right_img"
            src={RightCar?.src}
            width={246}
            height={122}
          />
        </Box>
      ) : (
        <Box sx={{ position: "absolute", height: "100%", width: "100%", "img": { objectFit: "cover", width: "100%", height: "100%" } }}>
          {/*<CustomImageContainer*/}
          {/*  src={getBGImage()}*/}
          {/*  alt="banner"*/}
          {/*  height="100%"*/}
          {/*  width="100%"*/}
          {/*  obejctfit="cover"*/}
          {/*  loading="eager"*/}
          {/*  fetchpriority="high"*/}
          {/*/>*/}
          <Image width={1917} height={270} src={getBGImage()} alt="banner" priority={true} />
        </Box>
      )}
    </CustomBoxFullWidth>
  );
};

export default TopBanner;