import { Box } from "@mui/material";
import { useRef, useState } from "react";

interface Props {
  /** Full image URL to display and zoom. */
  src: string;
  alt?: string;
  /** Border radius for the (clipped) container. Mirrors the parent container radius. */
  radius?: string;
  /** Zoom factor applied on hover. */
  zoom?: number;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

/**
 * Lightweight, dependency-free image magnifier.
 *
 * Replaces `react-image-magnify`, which relies on React internals removed in
 * React 19 (`findDOMNode`, legacy lifecycles) and therefore crashes at mount.
 *
 * It zooms the image in-place following the cursor (transform-origin tracking),
 * preserving `object-fit: cover` and staying inside the rounded, overflow-hidden
 * container — so it can't be clipped like an external "beside" panel would be.
 */
const ImageMagnifier = ({
  src,
  alt = "image",
  radius = "12px",
  zoom = 2.2,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [origin, setOrigin] = useState("50% 50%");
  const [isZooming, setIsZooming] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100);
    setOrigin(`${x}% ${y}%`);
  };

  if (!src) return null;

  return (
    <Box
      ref={containerRef}
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMove}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: radius,
        cursor: "zoom-in",
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        draggable={false}
        loading="eager"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transformOrigin: origin,
          transform: isZooming ? `scale(${zoom})` : "none",
          transition: "transform 0.15s ease-out",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

export default ImageMagnifier;
