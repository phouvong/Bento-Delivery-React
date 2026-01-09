import React from "react";
import { CustomDotBox } from "../file-previewer/FilePreviewer.style";
import emptyImage from "/public/static/empty_img.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Stack } from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import { useTheme } from "@mui/material/styles";

const ImageUploaderThumbnail = ({
  label,
  maxWidth,
  width,
  error,
  borderRadius,
}) => {
  const theme = useTheme();

  return (
    <CustomDotBox width={width} error={error} borderRadius={borderRadius} sx={{backgroundColor: theme.palette.background.paper}}>
      <CustomImageContainer
        src={emptyImage.src}
        width="36px"
        height="36px"
        objectfit="cover"
        borderRadius="0px"
      />
      <Stack fontSize="10px" marginTop="5px" fontWeight="500" sx={{ color: theme.palette.info.dark }}>
        {label}
      </Stack>
    </CustomDotBox>
  );
};
export default ImageUploaderThumbnail;
