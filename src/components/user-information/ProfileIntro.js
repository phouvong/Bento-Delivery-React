import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import NextImage from "components/NextImage";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import CustomModal from "components/modal";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { CustomDateFormat } from "components/date-and-time-formators/CustomDateFormat";
import wallet from "./asset/newWallet.png";
import loyaltyImage from "./asset/loyalty.png";
import orderImage from "./asset/order.png";
import Profile from "components/profile";

// ─── Slider wrapper ───────────────────────────────────────────────────────────

const SliderWrapper = styled(CustomBoxFullWidth)(() => ({
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "12px" },
  "& .slick-list": { overflow: "visible" },
}));

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ value, label, icon, mobile = false }) => (
  <Box
    sx={{
      flex: mobile ? undefined : 1,
      backgroundColor: mobile ? "background.paper" : "background.default",
      borderRadius: mobile ? "12px" : "16px",
      p: "16px",
      display: "flex",
      flexDirection: "column",
      gap: mobile ? "8px" : "12px",
    }}
  >
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography
        sx={{
          fontSize: mobile ? "18px" : "24px",
          fontWeight: 700,
          color: "neutral.1050",
          lineHeight: 1.1,
          letterSpacing: mobile ? "-0.54px" : "-1.2px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value ?? "—"}
      </Typography>
      <Box
        component="img"
        src={icon}
        alt={label}
        sx={{
          width: mobile ? 28 : 36,
          height: mobile ? 28 : 36,
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
    </Stack>
    <Typography
      sx={{
        fontSize: "16px",
        fontWeight: 400,
        color: "neutral.500",
        lineHeight: 1.2,
        letterSpacing: "-0.48px",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ProfileIntro = ({
  data,
  page,
  refetch,
  configData,
  addAddress,
  setAddAddress,
  editAddress,
  setEditAddress,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [editOpen, setEditOpen] = useState(false);

  const moduleParam = router.query.module;
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";

  const pageLabels = {
    addresses: t("Addresses"),
    "my-orders": t("My Orders"),
    wallet: t("Wallet"),
    coupons: t("Coupons"),
    "loyalty-points": t("Loyalty Points"),
    "referral-code": t("Referral Code"),
    inbox: t("Inbox"),
    settings: t("Settings"),
    "profile-settings": t("Profile"),
    "monthly-cart-list": t("Monthly Cart List"),
    "subscription-plan": t("Subscription Plan"),
    "track-order": t("Track Orders"),
  };
  const pageLabel = pageLabels[page] || t("Profile");

  const name = `${data?.f_name ?? ""} ${data?.l_name ?? ""}`.trim();
  const joinDate = data?.created_at ? CustomDateFormat(data.created_at) : null;
  const avatar = data?.image_full_url;
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const isProMember = proFeatureEnabled && Number(data?.pro_status) === 1;
  const ProCrownBadge = ({ size = 18 }) => (
    <Box
      component="span"
      aria-label={t("Pro member")}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ml: 0.75,
        lineHeight: 1,
        color: "#F5B027",
      }}
    >
      <i
        className="fi fi-sr-crown"
        style={{ fontSize: `${size}px`, lineHeight: 1, display: "flex" }}
      />
    </Box>
  );

  const stats = [
    {
      key: "wallet",
      value: getAmountWithSign(data?.wallet_balance ?? 0),
      label: t("Wallet"),
      icon: wallet.src,
    },
    {
      key: "loyalty",
      value: data?.loyalty_point ?? 0,
      label: t("Loyalty Points"),
      icon: loyaltyImage.src,
    },
    {
      key: "orders",
      value: data?.order_count ?? 0,
      label: t("Total Orders"),
      icon: orderImage.src,
    },
  ];

  const avatarEl = (size) => (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        backgroundColor: "background.secondary",
        border: `2px solid ${theme.palette.divider}`,
      }}
    >
      {avatar ? (
        <NextImage
          src={avatar}
          alt={name}
          width={String(size)}
          height={String(size)}
          objectFit="cover"
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className="fi fi-rr-user"
            style={{
              fontSize: "28px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[400],
            }}
          />
        </Box>
      )}
    </Box>
  );

  const editBtn = (label, absolute) => (
    <Button
      onClick={() => setEditOpen(true)}
      variant="text"
      size="small"
      startIcon={
        <i
          className="fi fi-rr-pencil"
          style={{ fontSize: "13px", lineHeight: 1, display: "flex" }}
        />
      }
      sx={{
        ...(absolute ? { position: "absolute", top: 0, right: 0 } : {}),
        borderRadius: "8px",
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 600,
        px: "12px",
        height: "36px",
        letterSpacing: "-0.42px",
        color: "primary.main",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "transparent",
          opacity: 0.75,
          boxShadow: "none",
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <>
      {isMobile ? (
        /* ── Mobile layout ── */
        <Box
          sx={{
            position: "relative",
            backgroundColor: "background.secondary",
            borderRadius: "16px",
            pt: "32px",
            pb: "16px",
            pl: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            overflow: "hidden",
          }}
        >
          {/* Edit button — absolute top-right */}
          {editBtn(t("Edit"), true)}

          {/* Avatar + name + join */}
          <Stack alignItems="center" gap="12px" sx={{ width: "100%" }}>
            {avatarEl(60)}
            <Stack alignItems="center" gap="6px">
              <Stack direction="row" alignItems="center">
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-1.2px",
                  }}
                >
                  {name || t("User")}
                </Typography>
                {isProMember && <ProCrownBadge size={20} />}
              </Stack>
              {joinDate && (
                <Stack direction="row" alignItems="center" gap="4px">
                  <i
                    className="fi fi-rr-calendar"
                    style={{
                      fontSize: "14px",
                      lineHeight: 1,
                      display: "flex",
                      color: theme.palette.neutral[500],
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "neutral.500",
                      lineHeight: 1.3,
                      letterSpacing: 0,
                    }}
                  >
                    {t("Join")} {joinDate}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>

          {/* Stat cards — slider showing 1.4 */}
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <SliderWrapper>
              <Slider
                dots={false}
                arrows={false}
                infinite={false}
                speed={300}
                slidesToShow={1.4}
                slidesToScroll={1}
              >
                {stats.map((s) => (
                  <div key={s.key}>
                    <StatCard
                      value={s.value}
                      label={s.label}
                      icon={s.icon}
                      mobile
                    />
                  </div>
                ))}
              </Slider>
            </SliderWrapper>
          </Box>
        </Box>
      ) : (
        /* ── Desktop layout ── */
        <Stack
          spacing={2.5}
          sx={{
            backgroundColor: "background.paper",
            pt: "16px",
            pb: "24px",
            px: "24px",
            borderRadius: "16px",
          }}
        >
          {/* Breadcrumb + Edit button */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap="8px"
          >
            <CustomPageBreadCrumb
              items={[
                {
                  key: "home",
                  label: t("Home"),
                  icon: (
                    <i
                      className="fi fi-rr-home"
                      style={{ fontSize: 12, display: "flex", lineHeight: 1 }}
                    />
                  ),
                  onRedirect: homeHref,
                },
                {
                  key: "profile",
                  label: t("Profile"),
                  ...(page && page !== "profile-settings"
                    ? {
                        onRedirect: "/profile",
                      }
                    : {}),
                },
                ...(page && page !== "profile-settings"
                  ? [{ key: "page", label: pageLabel }]
                  : []),
              ]}
            />
            {editBtn(t("Edit Profile"), false)}
          </Stack>

          {/* Avatar + name + stats row */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap="24px"
          >
            <Stack
              direction="row"
              alignItems="center"
              gap="16px"
              sx={{ flexShrink: 0 }}
            >
              {avatarEl(80)}
              <Stack spacing={0.5}>
                <Stack direction="row" alignItems="center">
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "neutral.1050",
                      lineHeight: 1.2,
                      letterSpacing: "-0.66px",
                    }}
                  >
                    {name || t("User")}
                  </Typography>
                  {isProMember && <ProCrownBadge size={20} />}
                </Stack>
                {joinDate && (
                  <Stack direction="row" alignItems="center" gap="6px">
                    <i
                      className="fi fi-rr-calendar"
                      style={{
                        fontSize: "14px",
                        lineHeight: 1,
                        display: "flex",
                        color: theme.palette.neutral[500],
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "neutral.500",
                        lineHeight: 1.2,
                        letterSpacing: "-0.42px",
                      }}
                    >
                      {t("Join")} {joinDate}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              gap="16px"
              sx={{ flex: 1, maxWidth: "700px" }}
            >
              {stats.map((s) => (
                <StatCard
                  key={s.key}
                  value={s.value}
                  label={s.label}
                  icon={s.icon}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}

      {/* Edit Profile Modal */}
      <CustomModal
        openModal={editOpen}
        handleClose={() => setEditOpen(false)}
        maxWidth="700px"
        drawerHeight="90dvh"
      >
        <Profile
          configData={configData}
          editProfile
          setEditProfile={() => setEditOpen(false)}
          addAddress={addAddress}
          setAddAddress={setAddAddress}
          editAddress={editAddress}
          addressRefetch={refetch}
          setEditAddress={setEditAddress}
        />
      </CustomModal>
    </>
  );
};

export default ProfileIntro;
