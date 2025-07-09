"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import placeholder from "../../public/static/no-image-found.png";

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e5e4e4" offset="20%" />
      <stop stop-color="#ddd" offset="50%" />
      <stop stop-color="#e5e4e4" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#e5e4e4" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const NextImage = ({
   src,
   altSrc = placeholder,
   alt = "Image",
   width,
   height,
   objectFit,
   borderRadius,
   aspectRatio,
   ...props
 }) => {
  const [currentSrc, setCurrentSrc] = useState(src || altSrc);

  useEffect(() => {
    setCurrentSrc(src || altSrc);
  }, [src, altSrc]);

  const handleError = () => {
    if (altSrc && currentSrc !== altSrc) {
      setCurrentSrc(altSrc);
    }
  };

  // Conditionally create style object
  const style = {
    objectFit,
    borderRadius,
    aspectRatio,
    ...props.style, // allow passing additional styles
  };

  return (
    <Image
      src={currentSrc}
      width={width}
      height={height}
      alt={alt}
      onError={handleError}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
      style={style}

      {...props}
    />
  );
};

export default NextImage;