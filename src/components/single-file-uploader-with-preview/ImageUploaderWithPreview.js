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
        accept="image/*"
        hidden
        onChange={(e) => {
          onChange(e);
        }}
      />
    </>
  );
};
export default ImageUploaderWithPreview;
