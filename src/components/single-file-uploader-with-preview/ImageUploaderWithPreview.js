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
  console.log({ error })
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
        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          // Allowed MIME types
          const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/webp",
          ];

          // Block dangerous extensions explicitly
          const blockedExtensions = [
            ".php", ".js", ".exe", ".sh", ".bat", ".cmd",
            ".svg", ".html", ".htm", ".json"
          ];

          const fileName = file.name.toLowerCase();

          const hasBlockedExtension = blockedExtensions.some(ext =>
            fileName.endsWith(ext)
          );

          if (!allowedTypes.includes(file.type) || hasBlockedExtension) {
            e.target.value = "";
            alert("Only JPG, PNG, JPEG, WEBP, or GIF images are allowed.");
            return;
          }

          onChange(e);
        }}
      />


    </>
  );
};
export default ImageUploaderWithPreview;