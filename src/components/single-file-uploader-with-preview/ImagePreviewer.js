import React, { useEffect, useState } from "react";
import {
  FilePreviewerWrapper,
  CustomBoxForFilePreviewer,
} from "../file-previewer/FilePreviewer.style";
import ImageUploaderThumbnail from "./ImageUploaderThumbnail";
import CustomImageContainer from "components/CustomImageContainer";
import emptyImage from "../profile/asset/gallery-add.png";

const ImagePreviewer = ({
                          anchor,
                          file,
                          label,
                          width = "100%",
                          borderRadius = "8px",
                          error,
                          objectFit = "cover",
                          height = "130px",
                          marginLeft,
                        }) => {
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!file) return;

    // If file is a File/Blob object (from input)
    if (file instanceof File || file instanceof Blob) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // Clean up on unmount or file change
      return () => URL.revokeObjectURL(objectUrl);
    }

    // If it's a string (existing image URL)
    if (typeof file === "string" && file !== "") {
      setPreviewImage(file);
    }
  }, [file]);

  return (
    <CustomBoxForFilePreviewer>
      {previewImage ? (
        <FilePreviewerWrapper
          marginLeft={marginLeft}
          onClick={() => anchor?.current?.click()}
          width={width}
          height={height}
          objectFit={objectFit}
          borderRadius={borderRadius}
        >
          <CustomImageContainer
            src={previewImage}
            width="100%"
            height={height}
            objectfit={objectFit}
            borderRadius={borderRadius}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = emptyImage;
            }}
          />
        </FilePreviewerWrapper>
      ) : (
        <FilePreviewerWrapper
          marginLeft={marginLeft}
          onClick={() => anchor?.current?.click()}
          width={width}
          height={height}
          objectFit={objectFit}
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
  );
};

export default ImagePreviewer;
