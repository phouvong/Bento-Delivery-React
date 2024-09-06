import React from "react";
import CustomImageContainer from "../CustomImageContainer";
import { Typography } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { getImageUrl } from "utils/CustomFunctions";

const AuthHeader = ({ title, configData }) => {
  const businessLogo = configData?.base_urls?.business_logo_url;
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }
  const router = useRouter();
  const handleLogoClick = () => {
    if (router.pathname.includes("/auth")) {
      router.push("/home", undefined, { shallow: true });
    }
  };
  return (
    <CustomStackFullWidth
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Box onClick={handleLogoClick}>
        <CustomImageContainer
          width="150px"
          height="50px"
          objectfit="cover"
          src={configData?.logo_full_url}
        />
      </Box>

      <Typography variant="h4" textTransform="uppercase">
        {title}
      </Typography>
    </CustomStackFullWidth>
  );
};

export default AuthHeader;
