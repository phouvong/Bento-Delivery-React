import React, { useRef } from "react";
import ImagePreviewer from "./ImagePreviewer";

const ImageUploaderWithPreview = ({
  file,
  type,
  labelText,
  hintText,
  imageOnChange,
  onChange,
  width,
  imageUrl,
  borderRadius,
  error,
  objectFit,
  height,
  marginLeft,
}) => {
  const imageContainerRef = useRef();
  return (
    <>
      <ImagePreviewer
        anchor={imageContainerRef}
        file={file}
        label={labelText}
        hintText={hintText}
        width={width}
        imageUrl={imageUrl}
        borderRadius={borderRadius}
        error={error}
        height={height}
        objectFit={objectFit}
        marginLeft={marginLeft}
      />
      <input
        ref={imageContainerRef}
        id="file"
        name="file"
        type="file"
        accept="image/jpeg, image/png, image/jpg, image/gif"
        hidden
        onChange={(e) => {
          const file = e.target.files[0];
          const unsupportedFormats = ["image/avif", "image/webp", "application/pdf"];

          if (file && unsupportedFormats.includes(file.type)) {
            e.target.value = "";
            alert("This file format is not supported. Please upload JPG, PNG, JPEG, or GIF images only.");
            return;
          }
          onChange(e);
        }}

      />
    </>
  );
};
export default ImageUploaderWithPreview;
