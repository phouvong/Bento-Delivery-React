import React from "react";
import {
  FilePreviewerWrapper,
  CustomBoxForFilePreviewer,
  IconButtonImagePreviewer,
} from "../file-previewer/FilePreviewer.style";
import { InputLabel } from "@mui/material";
import ImageUploaderThumbnail from "./ImageUploaderThumbnail";
import DeleteIcon from "@mui/icons-material/Delete";
import emptyImage from "../profile/asset/gallery-add.png";
import CustomImageContainer from "components/CustomImageContainer";

const ImagePreviewer = ({
  anchor,
  file,
  label,
  width,
  imageUrl,
  borderRadius,
  error,
  objectFit,
  height,
}) => {
  let previewImage;

  if (typeof file !== "string") {
    previewImage = {
      url: URL.createObjectURL(file), // type: file.name.split('.').pop(),
    };
  } else previewImage = file;

  return (
    <>
      <CustomBoxForFilePreviewer>
        {previewImage ? (
          <FilePreviewerWrapper
            onClick={() => anchor.current.click()}
            width={width}
            objectFit={objectFit}
            borderRadius={borderRadius}
            height={height}
          >
            {typeof file !== "string" ? (
              <img src={previewImage.url} alt="preview" />
            ) : (
              <CustomImageContainer
                src={previewImage}
                width="100%"
                height="130px"
                objectfit="cover"
                borderRadius={borderRadius}
              />
              // <img
              //   src={previewImage}
              //   alt="profile"
              //   onError={(e) => {
              //     e.target.onerror = null; // Prevent infinite loop if fallback image also fails
              //     e.target.src = emptyImage.src;
              //   }}
              // />
            )}
          </FilePreviewerWrapper>
        ) : (
          <FilePreviewerWrapper
            onClick={() => anchor.current.click()}
            width={width}
            height={height}
            objectFit
            borderRadius={borderRadius}
          >
            <ImageUploaderThumbnail
              label={label}
              width={width}
              error={error}
              borderRadius={borderRadius}
            />
          </FilePreviewerWrapper>
        )}
      </CustomBoxForFilePreviewer>
    </>
  );
};

export default ImagePreviewer;
