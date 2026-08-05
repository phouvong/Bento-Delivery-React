import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import CustomModal from "components/modal";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import CartStoreCard from "components/cards/newCard/CartStoreCard";
import useGetServiceLastBookings from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useGetServiceLastBookings";
import usePostServiceRebook, {
  rebookToastMessageHandler,
} from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/usePostServiceRebook";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const formatTripDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── Styled ────────────────────────────────────────────────────────────────

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  padding: "24px 0px 24px 24px",
  boxShadow:
    "0px 1px 4px 0px rgba(0,0,0,0.05), 0px 1px 4px 0px rgba(0,0,0,0.10)",
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
    boxShadow: "none",
    padding: "20px 0px 20px 16px",
    background:
      theme.palette.mode === "dark"
        ? `linear-gradient(180deg, ${theme.palette.warning.light}22 0%, ${theme.palette.background.default} 100%)`
        : "linear-gradient(180deg, #FFF1C2 0%, #F7F7F7 100%)",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "20px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  "& .slick-slide > div > *": {
    width: "100% !important",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// ─── Main ──────────────────────────────────────────────────────────────────

const ServiceLastBookingSection = ({ title, store_id }) => {
  const theme = useTheme();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reorderingId, setReorderingId] = useState(null);
  const [pendingReorder, setPendingReorder] = useState(null); // { orderId, storeName }
  const { cartList } = useSelector((state) => state.cart);
  const { configData } = useSelector((state) => state.configData);
  const canRebook = Boolean(configData?.service_module?.rebooking_option);

  const { data } = useGetServiceLastBookings({
    provider_id: store_id,
    limit: 20,
    offset: 1,
    canRebook,
  });

  // Normalize service bookings into the shape CartStoreCard expects.
  // Backend shape: { provider, services: string[], booking_amount, created_at }
  const orders = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data?.map((row) => ({
      ...row,
      id: row.id,
      order_id: row.id,
      // provider is the store equivalent for service module
      store: row.provider,
      // services[] is an array of service name strings — no images in the API response
      items_preview: (row.services || []).map((name) => ({
        image_full_url: null,
        name: typeof name === "string" ? name : name?.name ?? "",
      })),
      order_amount: row.booking_amount ?? row.order_amount ?? 0,
      placedDate: formatTripDate(row.created_at),
    }));
  }, [data]);

  console.log({ orders, data });

  const { mutate: rebookMutate } = usePostServiceRebook();

  const handleReorder = (orderId) => {
    if (!canRebook || reorderingId) return;
    setReorderingId(orderId);
    rebookMutate(
      { booking_id: orderId },
      {
        onSuccess: (res) => {
          setReorderingId(null);
          rebookToastMessageHandler(res, true);
        },
        onError: (err) => {
          setReorderingId(null);
          rebookToastMessageHandler(err, false);
        },
      },
    );
  };

  // ── Confirm modal handlers ─────────────────────────────────────────────────
  const handleReorderClick = (order) => {
    if (!canRebook) return;
    const storeId = order.store?.id;
    const hasCartFromSameStore =
      Array.isArray(cartList) &&
      cartList.length > 0 &&
      cartList.some((item) => String(item?.store_id) === String(storeId));

    if (hasCartFromSameStore) {
      setPendingReorder({
        orderId: order.order_id,
        storeName: order.store?.name,
      });
    } else {
      handleReorder(order.order_id);
    }
  };

  const handleCancelReorder = () => {
    setPendingReorder(null);
  };

  const handleConfirmReorder = () => {
    if (!pendingReorder) return;
    handleReorder(pendingReorder.orderId);
    setPendingReorder(null);
  };

  if (!Array.isArray(orders) || orders.length === 0) {
    return null;
  }

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.4,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 3.4,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.4,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
    ],
  };

  return (
    <>
      <Container>
        <SliderSectionHeader
          sliderRef={slider}
          currentSlide={currentSlide}
          totalSlides={orders.length}
          slidesToShow={3.4}
          heading={
            <Typography
              sx={{
                fontSize: { xs: "18px", md: "24px" },
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-1.2px",
                whiteSpace: "nowrap",
              }}
            >
              {title ?? t("Your Previous Booking")}
            </Typography>
          }
          sx={{ pr: { xs: "16px", md: "24px" } }}
        />
        <SliderWrapper>
          <Slider
            {...sliderSettings}
            ref={slider}
            afterChange={(idx) => setCurrentSlide(idx)}
          >
            {orders.map((order) => (
              <CartStoreCard
                key={order.id}
                variant="order_placed"
                store={order.store}
                items={order.services?.length ? order.services : []}
                placedDate={order.placedDate ?? order.created_at}
                totalPrice={order.order_amount ?? order.totalPrice}
                isReordering={reorderingId === order.order_id}
                onReorder={() => handleReorderClick(order)}
                showReorder={canRebook}
              />
            ))}
          </Slider>
        </SliderWrapper>
      </Container>

      {/* ── Reorder Confirm Modal ─────────────────────────────────────────── */}
      <CustomModal
        openModal={Boolean(pendingReorder)}
        handleClose={handleCancelReorder}
        maxWidth="400px"
      >
        <Stack spacing={2.5} alignItems="center" sx={{ p: "28px 24px 24px" }}>
          {/* Icon */}
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <i
              className="fi fi-rr-refresh"
              style={{
                fontSize: "26px",
                display: "flex",
                lineHeight: 1,
                color: theme.palette.primary.main,
              }}
            />
          </Stack>

          {/* Text */}
          <Stack alignItems="center" spacing={1}>
            <Typography
              fontSize="18px"
              fontWeight={700}
              textAlign="center"
              color="text.primary"
              lineHeight={1.2}
            >
              {t("Start a New Booking?")}
            </Typography>
            <Typography
              fontSize="13px"
              color="text.secondary"
              textAlign="center"
              lineHeight={1.65}
              sx={{ maxWidth: "290px" }}
            >
              {t(
                "Reordering from {{name}} will clear your current provider cart. Do you want to continue?",
                { name: pendingReorder?.storeName },
              )}
            </Typography>
          </Stack>

          {/* Buttons */}
          <Stack direction="row" spacing={1.5} width="100%">
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCancelReorder}
              sx={{
                borderRadius: "10px",
                fontWeight: 600,
                textTransform: "none",
                py: 1.25,
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                "&:hover": { borderColor: theme.palette.text.primary },
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={handleConfirmReorder}
              sx={{
                borderRadius: "10px",
                fontWeight: 600,
                textTransform: "none",
                py: 1.25,
              }}
            >
              {t("Yes, Rebook")}
            </Button>
          </Stack>
        </Stack>
      </CustomModal>
    </>
  );
};

export default ServiceLastBookingSection;
