import React from "react";
import { Stack, Tooltip, useTheme } from "@mui/material";
import emptyImage from "/public/static/empty_img.png";
import {
  DashedBox,
  FileUploadHeader,
  FileUploadTextContainer,
  ImageContainerFileUpload,
} from "./FileUpload.style";
import {
  CustomTypographyEllipsis,
  CustomTypographyGray,
} from "../../styled-components/CustomTypographies.style";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import FileFormatInfo from "../file-format-text/FileFormatInfo";
import { useTranslation } from "react-i18next";

const FileUpload = (props) => {
  const {
    anchor,
    color,
    width,
    errorStatus,
    labelText,
    titleText,
    hintText,
    alignItems,
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Stack width="100%" spacing={3}>
      {titleText && (
        <FileUploadHeader>
          <CustomTypographyGray variant="h5">{titleText}</CustomTypographyGray>
        </FileUploadHeader>
      )}
      <Stack alignItems="baseline" justifyContent="center" spacing={3}>
        <DashedBox
          onClick={() => anchor.current.click()}
          color={color}
          component="label"
          width={width}
          errorStatus={errorStatus}
        >
          <Stack alignItems="center" justifyContent="center" spacing={1.5}>
            <ImageContainerFileUpload sx={{ img: {width: "36px", height: "36px"} }}>
              <img src={emptyImage.src} alt="emptyImage" />
            </ImageContainerFileUpload>
            <Tooltip title={labelText}>
              <FileUploadTextContainer>
                <CustomTypographyEllipsis
                  sx={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: (theme) => theme.palette.primary.main,
                  }}
                >
                  {labelText ? labelText : t("Add Image")}
                </CustomTypographyEllipsis>
              </FileUploadTextContainer>
            </Tooltip>
          </Stack>
        </DashedBox>
        {hintText && <FileFormatInfo text={hintText} />}
      </Stack>
    </Stack>
  );
};

FileUpload.propTypes = {};

export default FileUpload;
