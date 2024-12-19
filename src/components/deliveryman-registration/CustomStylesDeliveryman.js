import styled from "@emotion/styled";
import { Box } from "@mui/system";

export const RegistrationCardWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.neutral[200]}`, // Add width, style, and color
  borderRadius: "20px", // Optional: Add border radius
  padding: "30px",
  marginTop: "40px", // Optional: Add padding
  [theme.breakpoints.down("md")]: {
    padding: "16px",
    marginTop: "30px",
  },
}));

export const ActonButtonsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
  gap: "15px",
}));

export const FormSection = styled(Box)(({ theme }) => ({}));
export const TitleTopSection = styled(Box)(({ theme }) => ({}));
