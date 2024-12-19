import { Box, useTheme } from "@mui/system";
import H4 from "components/typographies/H4";
import React from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { TitleTopSection } from "./CustomStylesDeliveryman";

const DeliverymanFormWrapper = ({ title, component }) => {
  const theme = useTheme();
  return (
    <>
      <CustomBoxFullWidth
        sx={{
          bgcolor: (theme) => theme.palette.neutral[100],
          mb: "30px",
          pb: "30px",
          pt: "20px",
          borderRadius: "10px",
        }}
      >
        <TitleTopSection
          sx={{
            borderBottom: `1px solid ${theme.palette.neutral[200]}`,
            pl: "20px",
            pb: "11px",
          }}
        >
          <H4 text={title} sx={{ fontWeight: "500" }} />
        </TitleTopSection>
        <Box sx={{ mt: "20px", mx: "20px" }}>{component}</Box>
      </CustomBoxFullWidth>
    </>
  );
};

export default DeliverymanFormWrapper;
