import {
  Box,
  ButtonBase,
  Drawer,
  Modal,
  Radio,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setParcelInformation } from "redux/slices/parcelCategoryData";
import useGetParcelCategory from "api-manage/hooks/react-query/percel/usePercelCategory";
import {
  useGetParcelDimension,
  useGetParcelWeight,
} from "api-manage/hooks/react-query/percel/useGetParcelAttributes";
import {
  formatParcelDimensionSize,
  formatParcelWeight,
} from "helper-functions/parcelInformationLabel";
import useParcelZoneId from "api-manage/hooks/react-query/percel/useParcelZoneId";

/**
 * Gate into the parcel flow: the customer picks what they are sending — type,
 * weight bracket and size bracket — before any address screen. Both entry
 * points open it (a category card, and the "send to this location" search),
 * which is why it owns its own data rather than taking it from a parent.
 *
 * Weight and dimension are separate zone-scoped endpoints and each is behind
 * its own admin toggle (`status`), so either section can be absent — the modal
 * then only asks for what the zone actually offers.
 */

const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: { xs: "15px", md: "16px" },
      fontWeight: 700,
      color: (theme) => theme.palette.neutral[1000],
    }}
  >
    {children}
  </Typography>
);

// Splits e.g. "Extra Light (0-2Kg)" into a bold name and a lighter-weight
// trailing range, matching the design's two-span label. Falls back to a
// single bold span for labels with no parenthetical part (category names).
const LABEL_RANGE_RE = /^(.*?)(\s\(.*\))$/;

const OptionChip = ({ label, selected, onClick }) => {
  const match = typeof label === "string" ? label.match(LABEL_RANGE_RE) : null;
  const name = match ? match[1] : label;
  const range = match ? match[2] : null;

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        flexShrink: 0,
        px: "16px",
        height: "36px",
        borderRadius: "8px",
        fontSize: "14px",
        letterSpacing: "-0.42px",
        transition: "background-color 0.2s ease, color 0.2s ease",
        backgroundColor: (theme) =>
          selected ? theme.palette.primary.main : theme.palette.background.secondary,
        color: (theme) =>
          selected
            ? theme.palette.primary.contrastText
            : theme.palette.neutral[1000],
        "&:hover": {
          backgroundColor: (theme) =>
            selected
              ? theme.palette.primary.dark
              : alpha(theme.palette.neutral[400], 0.28),
        },
      }}
    >
      <Box component="span" sx={{ fontWeight: 600 }}>
        {name}
      </Box>
      {range && (
        <Box component="span" sx={{ fontWeight: 400 }}>
          {range}
        </Box>
      )}
    </ButtonBase>
  );
};

// The chip rows overflow rather than wrap, and can be dragged left/right
// with the mouse (like a touch swipe) in addition to the native scrollbar,
// matching the design's slideable row when a zone has more brackets than fit.
const ChipRow = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: false });

  const onMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const onMouseMove = (e) => {
    const el = scrollRef.current;
    if (!el || !dragState.current.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 3) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScrollLeft - delta;
  };

  const endDrag = () => {
    dragState.current.dragging = false;
  };

  // Swallow the click that follows a drag so a swipe never also selects
  // whichever chip the pointer happened to end up over.
  const onClickCapture = (e) => {
    if (dragState.current.moved) {
      e.stopPropagation();
      dragState.current.moved = false;
    }
  };

  return (
    <Stack
      ref={scrollRef}
      direction="row"
      gap="12px"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onClickCapture={onClickCapture}
      sx={{
        overflowX: "auto",
        cursor: "grab",
        userSelect: "none",
        scrollbarWidth: "none",
        "&:active": { cursor: "grabbing" },
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {children}
    </Stack>
  );
};

// Mirrors OptionChip's shape (varied widths so the row doesn't look like a
// single grey bar) so the loading state doesn't jump around once data arrives.
const ChipSkeletonRow = ({ count = 4 }) => (
  <ChipRow>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rounded"
        width={64 + (index % 3) * 24}
        height={36}
        sx={{ borderRadius: "8px", flexShrink: 0 }}
      />
    ))}
  </ChipRow>
);

// Mirrors the dimension list rows (label + size + radio) instead of one
// blank block, so the shape it loads into is visible before data arrives.
const DimensionSkeletonRows = ({ count = 2 }) => (
  <Stack
    gap="20px"
    sx={{
      borderRadius: "16px",
      border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
      padding: "16px",
    }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <Stack
        key={index}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="16px"
      >
        <Skeleton variant="text" width={72} height={22} />
        <Stack direction="row" alignItems="center" gap="10px">
          <Skeleton variant="text" width={88} height={20} />
          <Skeleton variant="circular" width={18} height={18} />
        </Stack>
      </Stack>
    ))}
  </Stack>
);

const ParcelInformationModal = ({
  open,
  onClose,
  categories: categoriesFromProps,
  initialCategoryId,
  onConfirm,
  zoneId: zoneIdOverride,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // The category grid already holds the list; the search panel does not, so
  // fall back to fetching rather than making every caller pass it in.
  const shouldFetchCategories = open && !categoriesFromProps?.length;
  const { data: fetchedCategories, refetch: refetchCategories } =
    useGetParcelCategory();
  const categories = categoriesFromProps?.length
    ? categoriesFromProps
    : fetchedCategories;

  const { zoneId: parcelZoneId } = useParcelZoneId();
  const effectiveZoneId = zoneIdOverride ?? parcelZoneId;
  const attributesEnabled = open && effectiveZoneId != null;
  const { data: weightData, isLoading: weightLoading } =
    useGetParcelWeight(attributesEnabled, effectiveZoneId);
  const { data: dimensionData, isLoading: dimensionLoading } =
    useGetParcelDimension(attributesEnabled, effectiveZoneId);

  const weightUnit = weightData?.unit?.label ?? "";
  const dimensionUnit = dimensionData?.unit?.label ?? "";
  const weightOptions = weightData?.status ? weightData?.data ?? [] : [];
  const dimensionOptions = dimensionData?.status
    ? dimensionData?.data ?? []
    : [];

  const [categoryId, setCategoryId] = useState(initialCategoryId ?? null);
  const [weightId, setWeightId] = useState(null);
  const [dimensionId, setDimensionId] = useState(null);

  useEffect(() => {
    if (shouldFetchCategories) refetchCategories();
  }, [shouldFetchCategories]);

  // Re-seed on every open so a cancelled edit never leaks into the next one.
  // The location entry point passes no id, so the first category stands in —
  // that is the "based on the 1st category" default.
  useEffect(() => {
    if (!open) return;
    setCategoryId(initialCategoryId ?? categories?.[0]?.id ?? null);
  }, [open, initialCategoryId, categories]);

  useEffect(() => {
    if (!open) return;
    setWeightId((current) =>
      weightOptions.some((item) => item?.id === current)
        ? current
        : weightOptions[0]?.id ?? null
    );
  }, [open, weightData]);

  useEffect(() => {
    if (!open) return;
    setDimensionId((current) =>
      dimensionOptions.some((item) => item?.id === current)
        ? current
        : dimensionOptions[0]?.id ?? null
    );
  }, [open, dimensionData]);

  const selectedCategory = useMemo(
    () => categories?.find((item) => item?.id === categoryId) ?? null,
    [categories, categoryId]
  );
  const selectedWeight = useMemo(
    () => weightOptions.find((item) => item?.id === weightId) ?? null,
    [weightOptions, weightId]
  );
  const selectedDimension = useMemo(
    () => dimensionOptions.find((item) => item?.id === dimensionId) ?? null,
    [dimensionOptions, dimensionId]
  );

  const handleConfirm = () => {
    if (!selectedCategory) {
      toast.error(t("Please select a parcel type"));
      return;
    }
    // Only insist on a bracket the zone actually offers.
    if (weightOptions.length > 0 && !selectedWeight) {
      toast.error(t("Please select an item weight"));
      return;
    }
    if (dimensionOptions.length > 0 && !selectedDimension) {
      toast.error(t("Please select an item dimension"));
      return;
    }
    // Carry the zone's unit with the selection — the delivery-info card and the
    // checkout billing panel label the bracket without refetching either list.
    const selection = {
      category: selectedCategory,
      weight: selectedWeight
        ? { ...selectedWeight, unit_label: weightUnit }
        : null,
      dimension: selectedDimension
        ? { ...selectedDimension, unit_label: dimensionUnit }
        : null,
      zoneId: effectiveZoneId,
    };
    dispatch(setParcelInformation(selection));
    onConfirm?.(selection);
  };

  const renderContent = () => (
    <>
      <ButtonBase
        onClick={onClose}
        aria-label={t("Close")}
        sx={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 1,
          width: 36,
          height: 36,
          borderRadius: "50%",
          color: (theme) => theme.palette.neutral[500],
          "&:hover": {
            backgroundColor: (theme) => alpha(theme.palette.neutral[400], 0.12),
          },
        }}
      >
        <i
          className="fi fi-rr-cross-circle"
          style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
        />
      </ButtonBase>

      <Stack gap="2px" sx={{ px: 3, pt: 3, pb: 1, pr: 6 }}>
        <Typography
          sx={{
            fontSize: { xs: "20px", md: "24px" },
            fontWeight: 700,
            lineHeight: 1.1,
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("Parcel Information")}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "13px", md: "15px" },
            lineHeight: 1.2,
            color: (theme) => theme.palette.neutral[500],
          }}
        >
          {t("Choose parcel information to get better service.")}
        </Typography>
      </Stack>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          py: 2,
        }}
      >
        <Stack gap="12px" sx={{ mb: "24px", pl: 3 }}>
          <SectionLabel>{t("Parcel Type")}</SectionLabel>
          {categories?.length ? (
            <ChipRow>
              {categories.map((item) => (
                <OptionChip
                  key={item?.id}
                  label={item?.name}
                  selected={item?.id === categoryId}
                  onClick={() => setCategoryId(item?.id)}
                />
              ))}
            </ChipRow>
          ) : (
            <ChipSkeletonRow count={6} />
          )}
        </Stack>

        {(weightLoading || weightOptions.length > 0) && (
          <Stack gap="12px" sx={{ mb: "24px", pl: 3 }}>
            <SectionLabel>{t("Item Weight")}</SectionLabel>
            {weightLoading ? (
              <ChipSkeletonRow count={3} />
            ) : (
              <ChipRow>
                {weightOptions.map((item) => (
                  <OptionChip
                    key={item?.id}
                    label={formatParcelWeight(item, weightUnit)}
                    selected={item?.id === weightId}
                    onClick={() => setWeightId(item?.id)}
                  />
                ))}
              </ChipRow>
            )}
          </Stack>
        )}

        {(dimensionLoading || dimensionOptions.length > 0) && (
          <Stack gap="12px" sx={{ px: 3 }}>
            <SectionLabel>{t("Item Dimension")}</SectionLabel>
            {dimensionLoading ? (
              <DimensionSkeletonRows count={2} />
            ) : (
              <Stack
                gap="20px"
                sx={{
                  borderRadius: "16px",
                  border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
                  padding: "16px",
                }}
              >
                {dimensionOptions.map((item) => {
                  const selected = item?.id === dimensionId;
                  return (
                    <ButtonBase
                      key={item?.id}
                      onClick={() => setDimensionId(item?.id)}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "14px", md: "15px" },
                          fontWeight: selected ? 700 : 500,
                          color: (theme) => theme.palette.neutral[1000],
                        }}
                      >
                        {item?.name}
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap="8px"
                        sx={{ ml: "auto" }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "13px", md: "15px" },
                            color: (theme) => theme.palette.neutral[500],
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatParcelDimensionSize(item, dimensionUnit)}
                        </Typography>
                        <Radio
                          checked={selected}
                          size="small"
                          tabIndex={-1}
                          sx={{ p: 0 }}
                        />
                      </Stack>
                    </ButtonBase>
                  );
                })}
              </Stack>
            )}
          </Stack>
        )}
      </Box>

      <Stack
        direction="row"
        gap="20px"
        sx={{
          px: { xs: 2.5, md: 3 },
          pt: 2,
          pb: 2.5,
          backgroundColor: (theme) => theme.palette.background.paper,
          borderTop: (theme) => `1px solid ${theme.palette.neutral[200]}`,
        }}
      >
        <ButtonBase
          onClick={onClose}
          sx={{
            flex: 1,
            height: "40px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "-0.48px",
            backgroundColor: (theme) => theme.palette.background.secondary,
            color: (theme) => theme.palette.neutral[1000],
            "&:hover": {
              backgroundColor: (theme) =>
                alpha(theme.palette.neutral[400], 0.28),
            },
          }}
        >
          {t("Cancel")}
        </ButtonBase>
        <ButtonBase
          onClick={handleConfirm}
          sx={{
            flex: 1,
            height: "40px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "-0.48px",
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
          }}
        >
          {t("Confirm Information")}
        </ButtonBase>
      </Stack>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
        PaperProps={{
          sx: {
            position: "relative",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        {renderContent()}
      </Drawer>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "92%",
          maxWidth: "500px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          outline: "none",
          overflow: "hidden",
          borderRadius: "20px",
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: 24,
        }}
      >
        {renderContent()}
      </Box>
    </Modal>
  );
};

export default ParcelInformationModal;
