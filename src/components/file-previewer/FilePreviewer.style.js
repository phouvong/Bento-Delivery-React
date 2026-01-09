import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { ImageContainer } from "../../styled-components/CustomStyles.style";
import IconButton from "@mui/material/IconButton";
import React from "react";

export const FilePreviewerWrapper = styled(ImageContainer)(
  ({ theme, width, objectFit, height, borderRadius, marginLeft }) => ({
    cursor: "pointer",
    height: height ? height : "8.75rem",
    maxWidth: width,
    width: "100%",
    borderRadius: "50%",
    marginRight: "auto",
    marginLeft: marginLeft ?? "auto",
    "& img": {
      borderRadius: borderRadius ? borderRadius : "12px",
      height: "100%",
      //height:height ? height : 'auto',
      objectFit: objectFit ? "contained" : "cover",
    },
  })
);

export const IconButtonImagePreviewer = styled(IconButton)(({ theme }) => ({
  color: theme.palette.neutral[100],
  position: "absolute",
  borderRadius: "100rem",
  width: "22px",
  height: "22px",
  top: "-7px",
  right: "-7px",
  padding: "4px",
  backgroundColor: theme.palette.error.main,
  zIndex: 1,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  }
}));
export const CustomBoxForFilePreviewer = styled(Box)(({ theme, width }) => ({
  width: "100%",
  position: "relative",
  height: "7.75rem",
  // justifyContent:"center"
}));
export const CustomDotBox = styled(Box)(
  ({ theme, width, error, borderRadius }) => ({
    width: width && "100%",
    position: "relative",
    height: "8.125rem",
    border: "1px dashed ",
    borderRadius: borderRadius ? borderRadius : "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderColor: error ? "red" : theme.palette.neutral[400],
  })
);
export const CustomBoxImageText = styled(Box)(({ theme }) => ({
  maxWidth: "14.375rem",
}));
