import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import {
  Box,
  Typography,
  styled,
  Button,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import CustomModal from "components/modal";
import { t } from "i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import CartStoreCard from "components/cards/newCard/CartStoreCard";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import useGetLastOrders from "api-manage/hooks/react-query/order/useGetLastOrders";
//import usePostReorder from "api-manage/hooks/react-query/order/usePostReorder";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { toast } from "react-hot-toast";
import usePostReorder, {
  reOrderToastMessageHandler,
} from "api-manage/hooks/react-query/order/usePostReorder";
// Maps an unavailable-item code from the reorder response to its toast message.
const UNAVAILABLE_ITEM_MESSAGES = {
  item_unavailable: "is unavailable",
  out_of_stock: "is out of stock",
  vehicle_not_found: "is not available",
};

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

const LastOrdersSection = ({ title, store_id }) => {
  const theme = useTheme();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reorderingId, setReorderingId] = useState(null);
  const [pendingReorder, setPendingReorder] = useState(null); // { orderId, storeName }

  const { data } = useGetLastOrders({ store_id });
  const { cartList } = useSelector((state) => state.cart);

  // Normalize rental trips into the same shape the card expects (store,
  // items_preview, created_at, order_amount, order_id). Detected by the
  // presence of `provider` + `trip_details` on the row.
  const orders = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const rawOrders = data;
    return rawOrders.map((row) => {
      const isRentalTrip = row?.provider && Array.isArray(row?.trip_details);
      if (!isRentalTrip) return row;
      const tripDate = formatTripDate(row.created_at);
      const hours = Number(row.estimated_hours) || 0;
      const placedDate =
        hours > 0 && tripDate ? `${tripDate} | ${hours}hr` : tripDate;
      return {
        ...row,
        id: row.id,
        order_id: row.id,
        store: row.provider,
        items_preview: (row.trip_details || []).map((td) => ({
          image_full_url: td?.vehicle?.thumbnail_full_url,
          name: td?.vehicle?.name,
        })),
        order_amount: row.trip_amount,
        placedDate,
      };
    });
  }, [data]);

  const { mutate: reorderMutate } = usePostReorder();

  const handleReorder = (orderId) => {
    if (reorderingId) return;
    setReorderingId(orderId);
    reorderMutate(
      { order_id: orderId },
      {
        onSuccess: (res) => {
          setReorderingId(null);
          reOrderToastMessageHandler(res);
        },
        onError: (err) => {
          setReorderingId(null);
          reOrderToastMessageHandler(err, false);
        },
      },
    );
  };

  // ── Confirm modal handlers ─────────────────────────────────────────────────
  const handleReorderClick = (order) => {
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

  const isFood = getCurrentModuleType() === "food";

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
              {title ??
                (getCurrentModuleType() === "rental"
                  ? t("Your Last Trips")
                  : t("Your Last Orders"))}
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
                items={order.items_preview?.length ? order.items_preview : []}
                placedDate={order.placedDate ?? order.created_at}
                totalPrice={order.order_amount ?? order.totalPrice}
                onReorder={() => handleReorderClick(order)}
                isReordering={reorderingId === order.order_id}
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
              {t("Start a New Order?")}
            </Typography>
            <Typography
              fontSize="13px"
              color="text.secondary"
              textAlign="center"
              lineHeight={1.65}
              sx={{ maxWidth: "290px" }}
            >
              {isFood
                ? t(
                    "Reordering from {{name}} will clear your current restaurant cart. Do you want to continue?",
                    { name: pendingReorder?.storeName },
                  )
                : t(
                    "Reordering from {{name}} will clear your current store cart. Do you want to continue?",
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
              {t("Yes, Reorder")}
            </Button>
          </Stack>
        </Stack>
      </CustomModal>
    </>
  );
};

export default LastOrdersSection;
