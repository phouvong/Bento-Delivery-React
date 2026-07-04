import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { getLanguage } from "helper-functions/getLanguage";

/**
 * Reusable slider section header.
 *
 * Props:
 *  sliderRef     — ref attached to the <Slider> element
 *  currentSlide  — current slide index (managed by parent via afterChange)
 *  totalSlides   — total number of slides (data.length)
 *  heading       — JSX rendered on the left (title, subtitle, etc.)
 *  trailing      — optional JSX rendered to the right of the arrows (e.g. "See more" link)
 *  sx            — extra sx for the root Stack
 *
 * Parent wires up afterChange:
 *   <Slider ref={sliderRef} afterChange={(i) => setCurrentSlide(i)} ...>
 */
const SliderSectionHeader = ({
  sliderRef,
  currentSlide = 0,
  totalSlides = 0,
  slidesToShow: slidesToShowProp,
  heading,
  trailing,
  trailingAfterArrows = false,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isRtl = getLanguage() === "rtl";

  const getSlidesToShow = () =>
    slidesToShowProp ??
    sliderRef?.current?.innerSlider?.state?.slidesToShow ??
    1;

  const visibleCount = getSlidesToShow();
  const hasOverflow = totalSlides > visibleCount;
  const isAtStart = currentSlide === 0;
  const isAtEnd = currentSlide >= totalSlides - visibleCount;

  const isPrevDisabled = isRtl ? isAtEnd : isAtStart;
  const isNextDisabled = isRtl ? isAtStart : isAtEnd;

  const handlePrev = () => {
    isRtl
      ? sliderRef?.current?.slickNext()
      : sliderRef?.current?.slickPrev();
  };

  const handleNext = () => {
    isRtl
      ? sliderRef?.current?.slickPrev()
      : sliderRef?.current?.slickNext();
  };

  const NavBtn = ({ onClick, icon, disabled }) => (
    <Box
      onClick={onClick}
      sx={{
        width: 28,
        height: 28,
        borderRadius: "9999px",
        backgroundColor: "background.paper",
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        flexShrink: 0,
        opacity: disabled ? 0.35 : 1,
        transition: "opacity 0.2s, background-color 0.2s",
        "&:hover": {
          backgroundColor: disabled ? "background.paper" : "action.hover",
        },
      }}
    >
      <Box
        component="i"
        className={`fi fi-rr-${icon}`}
        sx={{ fontSize: "13px", lineHeight: 1, display: "flex", color: "neutral.1050" }}
      />
    </Box>
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", ...sx }}
    >
      {/* Left — heading JSX */}
      <Box sx={{ flex: 1, minWidth: 0, textAlign: "start" }}>{heading}</Box>

      {/* Right — arrows + optional trailing */}
      <Stack direction="row" alignItems="center" gap="8px" sx={{ flexShrink: 0, overflow: "visible" }}>
        {trailing && !trailingAfterArrows && <Box sx={{ flexShrink: 0, minWidth: "max-content", overflow: "visible" }}>{trailing}</Box>}
        {!isMobile && hasOverflow && (
          <>
            <NavBtn
              onClick={handlePrev}
              icon={isRtl ? "angle-small-right" : "angle-small-left"}
              disabled={isPrevDisabled}
            />
            <NavBtn
              onClick={handleNext}
              icon={isRtl ? "angle-small-left" : "angle-small-right"}
              disabled={isNextDisabled}
            />
          </>
        )}
        {trailing && trailingAfterArrows && <Box sx={{ flexShrink: 0, minWidth: "max-content", overflow: "visible", ml: "8px" }}>{trailing}</Box>}
      </Stack>
    </Stack>
  );
};

export default SliderSectionHeader;
