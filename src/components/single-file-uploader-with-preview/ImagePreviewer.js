import React, { useEffect, useState } from "react";
import {
  FilePreviewerWrapper,
  CustomBoxForFilePreviewer,
} from "../file-previewer/FilePreviewer.style";
import ImageUploaderThumbnail from "./ImageUploaderThumbnail";
import CustomImageContainer from "components/CustomImageContainer";
import ImageHoverOverlay from "./ImageHoverOverlay";
import ImageViewModal from "./ImageViewModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewImage(null);
      return;
    }

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

  const handleViewClick = () => {
    setIsModalOpen(true);
  };

  const handleEditClick = () => {
    anchor?.current?.click();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <CustomBoxForFilePreviewer>
        {previewImage ? (
          <FilePreviewerWrapper
            marginLeft={marginLeft}
            width={width}
            height={height}
            objectFit={objectFit}
            borderRadius={borderRadius}
            style={{ position: "relative" }}
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
            <ImageHoverOverlay
              onViewClick={handleViewClick}
              onEditClick={handleEditClick}
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

      <ImageViewModal
        open={isModalOpen}
        onClose={handleCloseModal}
        imageSrc={previewImage}
        alt={label || "Image preview"}
      />
    </>
  );
};

export default ImagePreviewer;
