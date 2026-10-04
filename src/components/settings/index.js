import React, { useState } from "react";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { t } from "i18next";
import ThemeSwitches from "components/header/top-navbar/ThemeSwitches";
import CustomLanguage from "components/header/top-navbar/language/CustomLanguage";
import CustomModal from "components/modal";
import DeleteAccount from "components/user-information/DeleteAccount";
import { useSettings } from "contexts/use-settings";

// ── Reusable setting row ──────────────────────────────────────────────────────

const SettingRow = ({ label, value, action, danger = false }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    gap="16px"
    sx={{ py: "20px", px: "24px" }}
  >
    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: 600,
          color: danger ? "error.main" : "neutral.1050",
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
      {value && (
        <Typography
          sx={{ fontSize: "13px", color: "neutral.500", lineHeight: 1.4 }}
        >
          {value}
        </Typography>
      )}
    </Stack>
    {action}
  </Stack>
);

// ── Section container ─────────────────────────────────────────────────────────

const Section = ({ title, children, danger = false }) => (
  <Box>
    {title && (
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 700,
          color: danger ? "error.main" : "neutral.1050",
          mb: "8px",
          letterSpacing: "-0.48px",
        }}
      >
        {title}
      </Typography>
    )}
    <Box
      sx={{
        border: "1px solid",
        borderColor: danger ? "error.main" : "divider",
        borderRadius: "12px",
        overflow: "hidden",
        "& > *:not(:last-child)": {
          borderBottom: "1px solid",
          borderColor: danger ? "error.light" : "divider",
        },
      }}
    >
      {children}
    </Box>
  </Box>
);

// ── Main component ────────────────────────────────────────────────────────────

const CustomSettings = ({
  configData,
  deleteUserHandler,
  accountDeleteStatus,
  setAccountDeleteStatus,
  isLoadingDelete,
}) => {
  const theme = useTheme();
  const { countryCode, language } = useSelector(
    (state) => state.configData,
  );
  const { settings: themeSettings } = useSettings();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const currentThemeLabel =
    themeSettings?.theme === "light" ? t("Light Mode") : t("Dark Mode");

  return (
    <Box sx={{ py: "24px", px: { xs: "4px", md: "24px" } }}>
      <Stack spacing={4}>
        {/* ── General settings ── */}
        <Section>
          <SettingRow
            label={t("Theme")}
            value={currentThemeLabel}
            action={<ThemeSwitches noText />}
          />
          <SettingRow
            label={t("Language")}
            value={language || t("Default")}
            action={
              <CustomLanguage countryCode={countryCode} language={language} />
            }
          />
          {deleteUserHandler ? (
            <SettingRow
              // danger
              label={t("Delete your account")}
              value={t(
                "Deleting your account will remove all your orders, addresses, wallet balance and personal data permanently.",
              )}
              action={
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => setDeleteModalOpen(true)}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    minWidth: "120px",
                    flexShrink: 0,
                    borderColor: "error.main",
                    color: "error.main",
                    "&:hover": { backgroundColor: "error.main", color: "#fff" },
                  }}
                >
                  {t("Delete Account")}
                </Button>
              }
            />
          ) : null}
        </Section>
      </Stack>

      {/* Delete Account Modal */}
      <CustomModal
        openModal={deleteModalOpen}
        handleClose={() => {
          setDeleteModalOpen(false);
          setAccountDeleteStatus?.(true);
        }}
      >
        <DeleteAccount
          deleteUserHandler={deleteUserHandler}
          accountDeleteStatus={accountDeleteStatus}
          isLoading={isLoadingDelete}
          handleClose={() => {
            setDeleteModalOpen(false);
            setAccountDeleteStatus?.(true);
          }}
        />
      </CustomModal>
    </Box>
  );
};

export default CustomSettings;
