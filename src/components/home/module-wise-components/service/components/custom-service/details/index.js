import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import CustomContainer from "components/container";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import CustomDialogConfirmStyle from "components/custom-dialog/confirm/CustomDialogConfirm";
import StatusBadge from "components/common/StatusBadge";
import EmptyBidderCard from "./EmptyBidderCard";
import BidderCard from "./BidderCard";
import ServiceInfoCard from "./ServiceInfoCard";
import useGetCustomServiceRequestDetails from "../../../service-api-manage/hooks/react-query/custom-service/useGetCustomServiceRequestDetails";
import useDeleteCustomService from "../../../service-api-manage/hooks/react-query/custom-service/useDeleteCustomService";
import usePostBidStatus from "../../../service-api-manage/hooks/react-query/custom-service/usePostBidStatus";
import useServiceBusinessConfig from "../../../service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";

// Convert "14:30" / "14:30:00" → "2:30 PM" so the details card matches the
// look-and-feel of the create form.
const formatBookingTime = (raw) => {
  if (!raw) return "";
  const parsed = dayjs(`2000-01-01 ${raw}`);
  return parsed.isValid() ? parsed.format("h:mm A") : raw;
};

const formatBookingDate = (raw) => {
  if (!raw) return "";
  const parsed = dayjs(raw);
  return parsed.isValid() ? parsed.format("DD MMM YY") : raw;
};

const mapBidToBidder = (bid) => ({
  id: bid?.id,
  providerName: bid?.provider?.name ?? "",
  logo: bid?.provider?.image_full_url ?? null,
  rating: Number(bid?.provider?.avg_rating ?? 0),
  reviews: Number(bid?.provider?.review_count ?? 0),
  offerPrice: Number(bid?.offer_price ?? 0),
  description: bid?.note ?? "",
  isSelected: !!bid?.is_selected,
});

const mapDetailToService = (detail) => {
  if (!detail) return null;
  const customer = detail?.customer_information ?? {};
  return {
    category: detail?.category?.name ?? "",
    sub_category: detail?.sub_category?.name ?? "",
    service_date: formatBookingDate(detail?.booking_date),
    service_time: formatBookingTime(detail?.booking_time),
    description: detail?.description ?? "",
    contact_person_name: customer?.name ?? "",
    contact_person_number: customer?.phone ?? "",
    address: customer?.address ?? "",
    image: detail?.category_image_full_url ?? null,
    status: detail?.status,
    status_label: detail?.status_label,
  };
};

const BiddersShimmer = () => (
  <Stack spacing={2}>
    {Array.from({ length: 3 }).map((_, i) => (
      <Box
        key={i}
        sx={{
          backgroundColor: "background.paper",
          borderRadius: "8px",
          p: { xs: 2, md: 2.5 },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          flexWrap="wrap"
        >
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ flex: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="30%" height={14} />
            </Stack>
          </Stack>
          <Skeleton variant="rounded" width={130} height={36} />
          <Stack direction="row" gap={1.5}>
            <Skeleton variant="rounded" width={90} height={36} />
            <Skeleton variant="rounded" width={90} height={36} />
          </Stack>
        </Stack>
        <Skeleton variant="text" width="90%" height={16} sx={{ mt: 1.5 }} />
        <Skeleton variant="text" width="70%" height={16} />
      </Box>
    ))}
  </Stack>
);

const ServiceInfoShimmer = () => (
  <Stack spacing={2}>
    <Stack
      direction={{ xs: "row", md: "column" }}
      alignItems="center"
      gap={1.5}
    >
      <Skeleton variant="rounded" width={100} height={100} />
      <Stack spacing={1} sx={{ flex: 1, width: "100%" }}>
        <Skeleton variant="text" width="60%" height={22} />
        <Skeleton variant="text" width="40%" height={16} />
      </Stack>
    </Stack>
    <Skeleton variant="text" width="30%" height={20} />
    <Skeleton variant="text" width="100%" height={14} />
    <Skeleton variant="text" width="95%" height={14} />
    <Skeleton variant="text" width="80%" height={14} />
    <Skeleton variant="text" width="30%" height={20} sx={{ mt: 1 }} />
    <Skeleton variant="text" width="70%" height={16} />
    <Skeleton variant="text" width="90%" height={14} />
  </Stack>
);

const CustomServiceDetails = ({ serviceId, configData }) => {
  useScrollToTop();
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { isPostExpired } = useServiceBusinessConfig(configData);

  const [isDisabled, setIsDisabled] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: detailsResponse, isLoading } =
    useGetCustomServiceRequestDetails({ id: serviceId });

  const { mutate: deleteService, isLoading: isDeleting } =
    useDeleteCustomService({
      onSuccess: async (res) => {
        toast.success(res?.message || t("Request deleted successfully"));
        setIsConfirmOpen(false);
        await queryClient.refetchQueries("my-custom-service-list");
        router.replace("/profile?page=custom-service");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || t("Something went wrong"));
      },
    });

  const { mutate: postBidStatus } = usePostBidStatus({
    onSuccess: async (res, variables) => {
      toast.success(
        res?.message ||
          (variables?.status === "approve"
            ? t("Bid selected successfully")
            : t("Bid rejected successfully"))
      );
      await queryClient.refetchQueries([
        "custom-service-request-details",
        serviceId,
      ]);
      if (variables?.status === "approve") {
        router.push({
          pathname: "/service/checkout/custom-service",
          query: { reqServiceId: serviceId },
        });
      } else {
        setIsDisabled(false);
      }
    },
    onError: (err) => {
      setIsDisabled(false);
      toast.error(err?.response?.data?.message || t("Something went wrong"));
    },
  });

  const detail = detailsResponse?.data ?? null;
  const bidsData = detailsResponse?.bids?.data ?? [];
  const service = useMemo(() => mapDetailToService(detail), [detail]);
  const bidders = useMemo(() => bidsData.map(mapBidToBidder), [bidsData]);
  const isExpired = isPostExpired(detail?.created_at);
  const isBooked = (detail?.status ?? "").toLowerCase() === "booked";

  const breadcrumbItems = useMemo(
    () => [
      {
        key: "home",
        label: t("Home"),
        icon: (
          <i
            className="fi fi-rr-home"
            style={{ fontSize: 12, display: "flex", lineHeight: 1 }}
          />
        ),
        onRedirect: "/home",
      },
      {
        key: "custom-service-list",
        label: t("Custom Service List"),
        onRedirect: "/profile?page=custom-service",
      },
      {
        key: "details",
        label: service?.category || t("Custom Service Details"),
      },
    ],
    [service?.category, t]
  );

  const handleDeny = (offerId) => {
    if (!serviceId || !offerId) return;
    setIsDisabled(true);
    postBidStatus({ requestId: serviceId, offerId, status: "reject" });
  };

  const handleApprove = (offerId) => {
    if (!serviceId || !offerId) return;
    setIsDisabled(true);
    postBidStatus({ requestId: serviceId, offerId, status: "approve" });
  };

  const handleCancelPost = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!serviceId) return;
    deleteService(serviceId);
  };

  const cancelPostButton = isBooked ? (
    <StatusBadge status="booked" label={t("Booked")} />
  ) : isExpired ? (
    <StatusBadge status="expired" label={t("Expired")} />
  ) : (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleCancelPost}
      sx={{
        borderRadius: "10px",
        py: 1.25,
        fontSize: "14px",
        fontWeight: 600,
        textTransform: "none",
        borderColor: alpha(theme.palette.error.main, 0.3),
        color: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.06),
        "&:hover": {
          borderColor: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.1),
        },
      }}
    >
      {t("Cancel Post")}
    </Button>
  );

  return (
    <CustomStackFullWidth
      sx={{ minHeight: "100vh", mt: { xs: "70px", md: "45px" } }}
      spacing={3}
    >
      <CustomContainer>
        <Box>
          <CustomStackFullWidth
            direction="row"
            sx={{
              mb: { xs: 1.5, md: 2 },
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              "& nav": {
                flexWrap: "nowrap",
                minWidth: "max-content",
              },
            }}
          >
            <CustomPageBreadCrumb items={breadcrumbItems} />
          </CustomStackFullWidth>
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontSize: "32px",
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 2.5,
            }}
          >
            {t("Custom Service Details")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2.5, md: 3.5 },
              flexDirection: { xs: "column-reverse", md: "row" },
              alignItems: "stretch",
            }}
          >
            {/* Left column — bidders */}
            <Box sx={{ flex: { xs: "1 1 auto", md: 8.5 }, minWidth: 0 }}>
              {isLoading ? (
                <BiddersShimmer />
              ) : bidders.length === 0 ? (
                <EmptyBidderCard />
              ) : (
                <Stack spacing={2}>
                  {bidders.map((bidder) => (
                    <BidderCard
                      key={bidder.id}
                      bidder={bidder}
                      onDeny={handleDeny}
                      onApprove={handleApprove}
                      isDisabled={isDisabled}
                      hideActions={isBooked}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            {/* Right column — Service description */}
            <Box
              sx={{
                flex: { md: 3.5 },
                minWidth: 0,
                alignSelf: "flex-start",
                position: { xs: "static", md: "sticky" },
                width: { xs: "100%", md: "auto" },
                top: "70px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: { xs: "10px", md: "14px" },
                  boxShadow: `0 1px 4px ${alpha(
                    theme.palette.text.primary,
                    0.06
                  )}`,
                  px: { xs: 2, md: 3 },
                  py: { xs: 2, md: 2.5 },
                  mb: 2,
                }}
              >
                {isLoading || !service ? (
                  <ServiceInfoShimmer />
                ) : (
                  <ServiceInfoCard service={service} />
                )}
                <Box sx={{ display: { xs: "none", md: "block" }, mt: 2.5 }}>
                  {cancelPostButton}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CustomContainer>

      {/* Submit button — mobile only (fixed bottom) */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          backgroundColor: "background.paper",
          px: 2,
          py: 1.5,
          boxShadow: `0 -1px 16px 0 ${alpha(
            theme.palette.text.primary,
            0.04
          )}, 0 -1px 16px 0 ${alpha(theme.palette.text.primary, 0.08)}`,
        }}
      >
        {cancelPostButton}
      </Box>

      <CustomDialogConfirmStyle
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onSuccess={handleConfirmDelete}
        dialogTexts={t("Are you sure you want to delete this service?")}
        isLoading={isDeleting}
      />
    </CustomStackFullWidth>
  );
};

export default CustomServiceDetails;
