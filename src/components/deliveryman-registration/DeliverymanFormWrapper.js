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
          borderRadius: "10px",
        }}
      >
        <TitleTopSection
          sx={{
            borderBottom: `1px solid ${theme.palette.neutral[200]}`,
            padding: "1rem",
          }}
        >
          <H4 text={title} sx={{ fontWeight: "500", fontSize: "18px" }} />
        </TitleTopSection>
        <Box p={3} pt={4}>{component}</Box>
      </CustomBoxFullWidth>
    </>
  );
};

export default DeliverymanFormWrapper;
