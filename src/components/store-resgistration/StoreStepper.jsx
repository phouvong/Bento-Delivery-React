import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import Box from "@mui/material/Box";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  "&.MuiStepConnector-root": {
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiStepConnector-line": {
    border: "none",
    borderTop: "none",
    width: "100%",
    height: "3px",
  },
}));

const CustomStep = styled(Step)(({ theme, active, complete, isSmallSize }) => ({
  "& .MuiStepLabel-root": {
    //background: active ? alpha(theme.palette.primary.main, 0.2) : "transparent",
    color: complete ? "green" : active ? "white" : theme.palette.grey[600],
    padding: isSmallSize ? "10px" : "15px 37px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  "& .MuiStepLabel-root .MuiStepLabel-label": {
    // marginTop: isSmallSize ? 0 : "5px",
    fontWeight: 400,
    color: complete
      ? "green"
      : active
      ? theme.palette.text.primary
      : theme.palette.grey[500],
    fontSize: isSmallSize ? "8px" : "16px",
    lineHeight: isSmallSize ? "8px" : "16px",
  },
}));

const steps = ["General Information", "Business Plan", "Complete Registration"];

const CustomStepper = ({ activeStep, flag }) => {
  const theme = useTheme();
  const isSmallSize = useMediaQuery(theme.breakpoints.down("md"));
  let lanDirection = undefined;
  if (typeof window !== "undefined") {
    lanDirection = JSON.parse(localStorage.getItem("settings"));
  }

  return (
    <Stepper
      sx={{
        boxShadow: `0px 4.48276px 11.2069px ${alpha(
          theme.palette.neutral[1000],
          0.1
        )}`,
        paddingRight: "0px",
        paddingLeft: "0px",
      }}
      activeStep={activeStep}
      connector={<CustomConnector />}
    >
      {steps.map((label, index) => {
        const isComplete = index < activeStep;
        return (
          <CustomStep
            isSmallSize={isSmallSize}
            sx={{
              paddingLeft: "0px",
              paddingRight: "0px",
              position: "relative",
              ".MuiStepLabel-iconContainer": {
                paddingRight: "4px !important",
              },
              ".MuiStepLabel-iconContainer .MuiSvgIcon-root ": {
                width: isSmallSize ? "12px" : "1em",
                height: isSmallSize ? "12px" : "1em",
              }
            }}
            key={label}
            active={index === activeStep}
            complete={isComplete}
          >
            {index !== steps.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  right: isSmallSize ? "0px" : "18px",
                  top: "50%",
                  width: isSmallSize ? "16px" : "38px",
                  height: isSmallSize ? "16px" : "38px",
                  content: '""',
                  borderLeft: `${isSmallSize ? "1px" : "2px"} solid ${
                    isComplete
                      ? "green"
                      : activeStep === index
                      ? theme.palette.primary.main
                      : theme.palette.neutral[400]
                  }`,
                  borderTop: `${isSmallSize ? "1px" : "2px"} solid ${
                    isComplete
                      ? "green"
                      : activeStep === index
                      ? theme.palette.primary.main
                      : theme.palette.neutral[400]
                  }`,
                  transform:lanDirection?.direction === "rtl" ? "translateY(-50%) rotate(230deg)":"translateY(-50%) rotate(135deg)",
                }}
              ></Box>
            )}

            <StepLabel>{label}</StepLabel>
          </CustomStep>
        );
      })}
    </Stepper>
  );
};

export default function StoreStepper({ activeStep, flag }) {
  return (
    <CustomStackFullWidth
      sx={{ marginTop: {xs: "16px", md: "40px"} }}
      justifyContent="center"
      alignItems="center"
    >
      <CustomStepper flag={flag} activeStep={activeStep} />
    </CustomStackFullWidth>
  );
}
