import React, { useEffect, useRef, useState } from "react";
import { Box, ListItemIcon, MenuItem, Modal, Typography } from "@mui/material";
import cookie from "js-cookie";
import i18n, { t } from "i18next";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSettings } from "../../../../contexts/use-settings";
import {
  setCountryCode,
  setLanguage,
} from "../../../../redux/slices/configData";
import {
  CustomModalWrapper,
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../../../styled-components/CustomStyles.style";
import { StyledMenu } from "../../NavBar.style";
import { languageList } from "../../top-navbar/language/languageList";
import { haveRtlLanguages } from "../../top-navbar/language/rtlLanguageList";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";

/**
 * Compact pill-style language switcher for AccountMenuPanel.
 * Same logic as CustomLanguage (StyledMenu + confirmation modal + locale change),
 * but a minimal Figma-spec UI: "English ⌄" in info-blue, white pill, no flag icon.
 */
const AccountLanguageButton = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.configData);
  const { settings, saveSettings } = useSettings();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("language-setting"));
      localStorage.setItem(
        "language-setting",
        JSON.stringify(stored || i18n.language)
      );
    }
  }, []);

  // Hydrate Redux from localStorage on mount / when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const languageSetting = JSON.parse(
        localStorage.getItem("language-setting")
      );
      const country = JSON.parse(localStorage.getItem("country"));
      if (languageSetting && languageSetting !== language) {
        dispatch(setCountryCode(country));
        dispatch(setLanguage(languageSetting));
        i18n.changeLanguage(languageSetting);
      }
    }
  }, [language]);

  useEffect(() => {
    if (selectedLanguage) {
      setAnchorEl(null);
      setOpenModal(true);
    }
  }, [selectedLanguage]);

  const isRTLLanguage = (value) => haveRtlLanguages.includes(value);

  const handleChangeLanguage = (lan) => {
    dispatch(setLanguage(lan?.languageCode));
    dispatch(setCountryCode(lan?.countryCode));
    cookie.set("languageSetting", lan?.languageCode);
    localStorage.setItem("language-setting", JSON.stringify(lan?.languageCode));
    localStorage.setItem("country", JSON.stringify(lan?.countryCode));
    toast.success(t("Language has been changed"), { id: "lan" });
    saveSettings({
      ...settings,
      direction: isRTLLanguage(lan?.languageCode) ? "rtl" : "ltr",
    });
    window.location.reload();
    setAnchorEl(null);
  };

  // Prefer Redux language; fall back to localStorage if Redux not yet hydrated
  const activeCode =
    language ||
    (typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("language-setting") || "null")
      : null) ||
    i18n.language;
  const currentLang =
    languageList?.find((item) => item?.languageCode === activeCode)
      ?.languageName ?? "English";

  const isMenuOpen = Boolean(anchorEl);

  return (
    <>
      <Box
        ref={anchorRef}
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          px: "12px",
          height: "36px",
          backgroundColor: isMenuOpen
            ? (t) => t.palette.action.hover
            : (t) => t.palette.background.secondary ?? "#f2f2f2",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.18s ease",
          flexShrink: 0,
          color: "text.primary",
          "&:hover": {
            backgroundColor: (t) => t.palette.action.hover,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.2,
            letterSpacing: "-0.42px",
            whiteSpace: "nowrap",
          }}
        >
          {currentLang}
        </Typography>
        <i
          className="fi fi-rr-angle-small-down"
          style={{
            fontSize: "16px",
            lineHeight: 1,
            display: "flex",
            color: "inherit",
            transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </Box>

      <StyledMenu
        disableScrollLock
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{ zIndex: 1600 }}
      >
        {languageList?.map((lan, index) => (
          <MenuItem
            key={index}
            disableRipple
            onClick={() => setSelectedLanguage(lan)}
            sx={{ "&:hover": { backgroundColor: "primary.main" } }}
          >
            <ListItemIcon>
              <img width="20" src={lan?.countryFlag} alt="flag" />
            </ListItemIcon>
            {lan.languageName}
          </MenuItem>
        ))}
      </StyledMenu>

      {openModal && (
        <Modal
          open={openModal}
          onClose={() => {
            setSelectedLanguage(null);
            setOpenModal(false);
          }}
        >
          <CustomModalWrapper>
            <CustomPaperBigCard
              noboxshadow="true"
              sx={{
                width: { xs: "300px", sm: "400px", md: "440px" },
                borderRadius: "16px",
                p: { xs: 2.5, sm: 3 },
              }}
            >
              <CustomStackFullWidth spacing={2.5} alignItems="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "rgba(57, 121, 224, 0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="fi fi-rs-globe"
                    style={{
                      fontSize: "26px",
                      lineHeight: 1,
                      display: "flex",
                      color: "#3979e0",
                    }}
                  />
                </Box>

                <CustomStackFullWidth spacing={0.75} alignItems="center">
                  <Typography
                    sx={{
                      fontSize: { xs: "16px", sm: "18px" },
                      fontWeight: 700,
                      textAlign: "center",
                      color: (theme) => theme.palette.neutral?.[1000],
                    }}
                  >
                    {t("Are you sure to change the language?")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 400,
                      textAlign: "center",
                      color: (theme) =>
                        theme.palette.neutral?.[600] || "text.secondary",
                    }}
                  >
                    {t("You're about to switch to")}{" "}
                    <b>{selectedLanguage?.languageName}</b>.
                  </Typography>
                </CustomStackFullWidth>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    mt: 0.5,
                  }}
                >
                  <CustomButtonPrimary
                    variant="outlined"
                    sx={{
                      borderRadius: "10px",
                      py: 1.1,
                      minWidth: "120px",
                    }}
                    onClick={() => {
                      setSelectedLanguage(null);
                      setOpenModal(false);
                    }}
                  >
                    {t("No")}
                  </CustomButtonPrimary>
                  <CustomButtonPrimary
                    variant="contained"
                    sx={{
                      borderRadius: "10px",
                      py: 1.1,
                      minWidth: "120px",
                    }}
                    onClick={() => {
                      handleChangeLanguage(selectedLanguage);
                      setSelectedLanguage(null);
                      setOpenModal(false);
                    }}
                  >
                    {t("Yes")}
                  </CustomButtonPrimary>
                </Box>
              </CustomStackFullWidth>
            </CustomPaperBigCard>
          </CustomModalWrapper>
        </Modal>
      )}
    </>
  );
};

export default AccountLanguageButton;
