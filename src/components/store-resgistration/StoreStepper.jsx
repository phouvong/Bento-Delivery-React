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
    padding: isSmallSize ? "10px 10px" : "15px 37px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  "& .MuiStepLabel-root .MuiStepLabel-label": {
    marginTop: "5px",
    fontWeight: 400,
    color: complete
      ? "green"
      : active
      ? theme.palette.text.primary
      : theme.palette.grey[500],
    fontSize: isSmallSize ? "12px" : "16px",
    lineHeight: "16px",
  },
}));

const steps = ["General Information", "Business Plan", "Complete Registration"];

const CustomStepper = ({ activeStep, flag }) => {
  const theme = useTheme();
  const isSmallSize = useMediaQuery(theme.breakpoints.down("md"));
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
            }}
            key={label}
            active={index === activeStep}
            complete={isComplete}
          >
            {index !== steps.length - 1 && !isSmallSize && (
              <Box
                sx={{
                  position: "absolute",
                  right: "18px",
                  top: "50%",
                  width: "38px",
                  height: "38px",
                  content: '""',
                  borderLeft: `2px solid ${
                    isComplete
                      ? "green"
                      : activeStep === index
                      ? theme.palette.primary.main
                      : theme.palette.neutral[400]
                  }`,
                  borderTop: `2px solid ${
                    isComplete
                      ? "green"
                      : activeStep === index
                      ? theme.palette.primary.main
                      : theme.palette.neutral[400]
                  }`,
                  transform: "translateY(-50%) rotate(135deg)",
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
      sx={{ marginTop: "40px" }}
      justifyContent="center"
      alignItems="center"
    >
      <CustomStepper flag={flag} activeStep={activeStep} />
    </CustomStackFullWidth>
  );
}
