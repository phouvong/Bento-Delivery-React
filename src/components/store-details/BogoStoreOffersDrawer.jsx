import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import useGetBogoStoreOffers from "api-manage/hooks/react-query/bogo/useGetBogoStoreOffers";
import BogoItemDetailsModal from "components/bogo-details/BogoItemDetailsModal";

const CardRoot = styled(Box)({
  width: "100%",
  cursor: "pointer",
  backgroundColor: "#f7f7f7",
  borderRadius: "12px",
  padding: "4px",
});

const BannerImage = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: "300 / 100",
  borderRadius: "8px 8px 0 0",
  overflow: "hidden",
});

const ItemAvatars = ({ items = [], size = 36, max = 2 }) => {
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;
  return (
    <Stack direction="row" alignItems="center" gap="4px" sx={{ flexShrink: 0 }}>
      <Stack direction="row" alignItems="center">
        {visible.map((item, index) => (
          <Tooltip key={item?.id ?? index} title={item?.name ?? ""} arrow disableHoverListener={!item?.name}>
            <Box
              sx={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: "2px solid",
                borderColor: "background.paper",
                overflow: "hidden",
                ml: index === 0 ? 0 : "-6px",
                zIndex: visible.length - index,
                flexShrink: 0,
                backgroundColor: "background.secondary",
                position: "relative",
              }}
            >
              <NextImage src={item?.image_full_url} alt={item?.name || ""} width={size} height={size} objectFit="cover" />
            </Box>
          </Tooltip>
        ))}
      </Stack>
      {overflow > 0 && (
        <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "neutral.500" }}>{`+${overflow}`}</Typography>
      )}
    </Stack>
  );
};

const OfferCard = ({ offer, onClick }) => {
  const theme = useTheme();

  return (
    <CardRoot
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Box sx={{ backgroundColor: "background.paper", borderRadius: "8px", overflow: "hidden" }}>
        <BannerImage>
          <NextImage src={offer?.image_full_url} alt={offer?.title} fill objectFit="cover" />
        </BannerImage>

        <Stack direction="row" alignItems="center" gap="16px" sx={{ p: "12px" }}>
          <Stack sx={{ flex: 1, minWidth: 0, gap: "4px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                letterSpacing: "-0.48px",
                color: "neutral.700",
                textTransform: "capitalize",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {offer?.title}
            </Typography>
            {offer?.valid_until && (
              <Typography sx={{ fontSize: "12px", color: "neutral.700" }}>
                {t("Validity")} : {offer.valid_until}
              </Typography>
            )}
          </Stack>
          <Typography sx={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.6px", color: "neutral.700", flexShrink: 0 }}>
            {getAmountWithSign(offer?.final_price ?? offer?.bundle_price)}
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: "16px" }}>
        <Stack alignItems="center" justifyContent="center" gap="6px" sx={{ flex: 1, minWidth: 0 }}>
          <ItemAvatars items={offer?.buy_items} />
          <Typography sx={{ fontSize: "14px", color: "neutral.500" }}>
            {t("Buy {{count}} Item", { count: offer?.buy_count ?? offer?.buy_qty ?? 1 })}
          </Typography>
        </Stack>

        <Box sx={{ flexShrink: 0, width: "20px", height: "20px", display: "flex" }}>
          <i
            className="fi fi-rs-arrow-small-right"
            style={{
              fontSize: "20px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[500],
              transform: theme.direction === "rtl" ? "scaleX(-1)" : "none",
            }}
          />
        </Box>

        <Stack alignItems="center" justifyContent="center" gap="6px" sx={{ flex: 1, minWidth: 0 }}>
          <ItemAvatars items={offer?.free_items} max={2} />
          <Typography sx={{ fontSize: "14px", color: "neutral.500" }}>
            {t("Get {{count}} FREE", { count: offer?.get_count ?? offer?.get_qty ?? 1 })}
          </Typography>
        </Stack>
      </Stack>
    </CardRoot>
  );
};

// `/bogo/store-offers` rows already merge the offer card and this store's
// bundle into one object (§5.4 of the BOGO API guide) — the `store` object
// is deliberately omitted there ("you already have it"), so it's rebuilt
// here from the page's own `storeDetails` for the modal's restaurant row.
const BogoStoreOffersDrawer = ({ open, onClose, onReopen, storeId, storeDetails }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const { data, isLoading } = useGetBogoStoreOffers(storeId, {}, open && !!storeId);
  const offers = data?.data ?? [];
  const [activeOffer, setActiveOffer] = useState(null);

  const anchor = isMobile ? "bottom" : "right";

  // Same flow as the /bogo-list page: picking an offer closes this list
  // drawer and opens the item-details modal; closing that modal reopens
  // this drawer (mobile gets the same handoff — the modal is just a bottom
  // sheet there instead of a side drawer).
  const handleSelectOffer = (offer) => {
    setActiveOffer(offer);
    onClose?.();
  };

  const handleCloseModal = () => {
    setActiveOffer(null);
    onReopen?.();
  };

  const activeBundle = activeOffer && {
    ...activeOffer,
    store: storeDetails
      ? {
          id: storeDetails.id,
          name: storeDetails.name,
          logo_full_url: storeDetails.logo_full_url,
          delivery_time: storeDetails.delivery_time,
          distance_label: storeDetails.distance_label,
        }
      : undefined,
  };

  return (
    <>
      <Drawer
        anchor={anchor}
        open={open}
        onClose={onClose}
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "420px" },
            maxWidth: "100vw",
            maxHeight: { xs: "85vh", md: "100%" },
            borderTopLeftRadius: { xs: "20px", md: 0 },
            borderTopRightRadius: { xs: "20px", md: 0 },
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: "16px 12px 4px 16px", flexShrink: 0 }}
        >
          <Typography sx={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.6px", color: "neutral.1050" }}>
            {t("BOGO Offer List")}
          </Typography>
          <IconButton onClick={onClose}>
            <i className="fi fi-rr-cross-small" style={{ fontSize: "20px" }} />
          </IconButton>
        </Stack>

        <Stack sx={{ p: "16px 24px", gap: "20px", overflowY: "auto", flex: 1 }}>
          {isLoading &&
            [...Array(3)].map((_, index) => (
              <Skeleton key={index} variant="rounded" width="100%" height={220} sx={{ borderRadius: "12px" }} />
            ))}

          {!isLoading &&
            offers.map((offer) => (
              <OfferCard offer={offer} key={offer?.id} onClick={() => handleSelectOffer(offer)} />
            ))}

          {!isLoading && offers.length === 0 && (
            <Typography sx={{ fontSize: "14px", color: "neutral.500", textAlign: "center", py: "40px" }}>
              {t("No BOGO offers available")}
            </Typography>
          )}
        </Stack>
      </Drawer>

      {activeBundle && (
        <BogoItemDetailsModal
          open={!!activeBundle}
          onClose={handleCloseModal}
          bundle={activeBundle}
          offer={{
            title: activeOffer?.offer_title ?? activeOffer?.title,
            description: activeOffer?.description,
            image_full_url: activeOffer?.image_full_url,
            buy_qty: activeOffer?.buy_qty ?? activeOffer?.buy_count,
            get_qty: activeOffer?.get_qty ?? activeOffer?.get_count,
            valid_until: activeOffer?.valid_until,
          }}
        />
      )}
    </>
  );
};

export default BogoStoreOffersDrawer;
