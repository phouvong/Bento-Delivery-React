import React, { useEffect, useRef, useState } from "react";
import { getToken } from "helper-functions/getToken";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import CustomModal from "../modal";
import TabsTypeTwo from "components/custom-tabs/TabsTypeTwo";

export interface CustomizeMultipleFileUploadProps {
  open: boolean;
  onClose: () => void;
  onUpload: (allFiles: File[], autoSaveFiles: File[]) => void;
  showPreviewStep?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFormats?: string;
  supportedExtensionsLabel?: string;
  title?: string;
  // When provided, a "Media Library" tab is shown with children rendered inside
  mediaLibrary?: React.ReactNode;
}

type Step = "select" | "preview";

const TAB_UPLOAD = 0;
const TAB_LIBRARY = 1;

const CustomizeMultipleFileUpload: React.FC<
  CustomizeMultipleFileUploadProps
> = ({
  open,
  onClose,
  onUpload,
  showPreviewStep = true,
  multiple = true,
  maxFiles = 5,
  maxFileSize = 2 * 1024 * 1024,
  acceptedFormats = "image/jpeg,image/jpg,image/png",
  supportedExtensionsLabel = "JPG, JPEG, PNG",
  title,
  mediaLibrary,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const tabsList = [
    { name: "Upload files", value: "upload" },
    { name: "Media Library", value: "media" },
  ];

  const [activeTab, setActiveTab] = useState(TAB_UPLOAD);
  const [step, setStep] = useState<Step>("select");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [autoSave, setAutoSave] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLoggedIn = Boolean(getToken());

  useEffect(() => {
    if (!isLoggedIn) {
      setAutoSave(false);
      setActiveTab(TAB_UPLOAD);
    }
  }, [isLoggedIn]);

  const revokePreviews = (urls: string[]) => {
    urls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {
        // ignore
      }
    });
  };

  const resetState = () => {
    revokePreviews(previews);
    setStep("select");
    setFiles([]);
    setPreviews([]);
    setAutoSave(false);
    setCurrentIndex(0);
    setActiveTab(TAB_UPLOAD);
  };

  useEffect(() => {
    if (!open) resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => revokePreviews(previews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePickClick = () => {
    inputRef.current?.click();
  };

  const handleFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (inputRef.current) inputRef.current.value = "";
    if (!picked.length) return;

    const validBySize = picked.filter((f) => {
      if (f.size > maxFileSize) {
        toast.error(
          `${f.name} ${t("exceeds the maximum file size")} (${(
            maxFileSize /
            (1024 * 1024)
          ).toFixed(0)} MB)`,
        );
        return false;
      }
      return true;
    });

    if (!validBySize.length) return;

    const trimmed = multiple
      ? validBySize.slice(0, maxFiles)
      : validBySize.slice(0, 1);

    if (multiple && validBySize.length > maxFiles) {
      toast.error(`${t("You can upload up to")} ${maxFiles} ${t("files")}`);
    }

    revokePreviews(previews);
    const urls = trimmed.map((f) => URL.createObjectURL(f));

    setFiles(trimmed);
    setPreviews(urls);
    setCurrentIndex(0);

    if (showPreviewStep) {
      setStep("preview");
    } else {
      onUpload(trimmed, []);
      onClose();
    }
  };

  const handleConfirmUpload = () => {
    onUpload(files, autoSave ? files : []);
    onClose();
  };


  const renderSelectStep = () => (
    <Box
      sx={{
        background: theme.palette.action.hover,
        borderRadius: "16px",
        padding: { xs: "12px", md: "16px" },
        minWidth:"300px",
       // height: "250px"
      }}
    >
      {/* Dashed dropzone */}
      <Box
        onClick={handlePickClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handlePickClick();
        }}
        sx={{
          border: `1.5px dashed ${theme.palette.divider}`,
          borderRadius: "12px",
          padding: { xs: "40px 16px", md: "52px 24px" },
          textAlign: "center",
          cursor: "pointer",
          background: theme.palette.background.paper,
          transition: "border-color 150ms ease",
          width: { xs: "100%", sm: "70%" },
          mx: "auto",
          display: "block",
          "&:hover": {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Stack spacing={1} alignItems="center">
          <CloudUploadOutlinedIcon
            sx={{ fontSize: { xs: 36, md: 44 }, color: theme.palette.text.disabled }}
          />
          <Typography
            color={theme.palette.primary.main}
            fontWeight={600}
            fontSize={{ xs: "14px", md: "15px" }}
          >
            {t("Click to upload")}
          </Typography>
        </Stack>
      </Box>

      {/* Info text inside container */}
      <Typography
        textAlign="center"
        color="text.secondary"
        fontSize="12px"
        mt={1.5}
      >
        {supportedExtensionsLabel} {t("Image size")}: {t("Max")}{" "}
        {(maxFileSize / (1024 * 1024)).toFixed(0)} MB
      </Typography>
    </Box>
  );

  const renderPreviewStep = () => {
    const currentFile = files[currentIndex];
    const currentPreview = previews[currentIndex];

    return (
      <Stack spacing={2}>
        <Typography
          textAlign="center"
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",paddingTop: 1,
          }}
        >
          {currentFile?.name}
        </Typography>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: { xs: "240px", md: "340px" },
            background: theme.palette.action.hover,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {currentIndex > 0 && (
            <IconButton
              onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              aria-label={t("Previous")}
              sx={{
                position: "absolute",
                insetInlineStart: 8,
                background: theme.palette.background.paper,
                boxShadow: 2,
                "&:hover": { background: theme.palette.background.paper },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}

          {currentPreview && (
            <Box
              component="img"
              src={currentPreview}
              alt={currentFile?.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          )}

          {currentIndex < files.length - 1 && (
            <IconButton
              onClick={() =>
                setCurrentIndex((i) => Math.min(i + 1, files.length - 1))
              }
              aria-label={t("Next")}
              sx={{
                position: "absolute",
                insetInlineEnd: 8,
                background: theme.palette.background.paper,
                boxShadow: 2,
                "&:hover": { background: theme.palette.background.paper },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontSize="14px" fontWeight={600}>
            {currentIndex + 1}/{files.length}
          </Typography>
          <Button
            variant="contained"
            onClick={handleConfirmUpload}
            sx={{
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              fontWeight: 600,
              minWidth: 140,
              borderRadius: "8px",
              "&:hover": { background: theme.palette.primary.dark },
            }}
          >
            {t("Upload")}
          </Button>
        </Stack>
      </Stack>
    );
  };

  return (
    <CustomModal
      openModal={open}
      handleClose={onClose}
      closeButton
      maxWidth="640px"
    >
      <Box
        sx={{ padding: { xs: "8px 16px 16px", md: "4px 24px 24px" }, minWidth: { md: "560px" } }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFormats}
          multiple={multiple}
          onChange={handleFilesChosen}
          style={{ display: "none" }}
        />

        {/* Title row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          mb={1.5}
        >
          <Typography
            component="h2"
            fontSize={{ xs: "18px", md: "20px" }}
            fontWeight={700}
            color={theme.palette.neutral?.[1000] ?? theme.palette.text.primary}
          >
            {title ?? t("Upload Files")}
          </Typography>
          {activeTab === TAB_UPLOAD && step === "preview" && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              flexWrap="wrap"
            >
              {isLoggedIn && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={autoSave}
                      onChange={() => setAutoSave((prev) => !prev)}
                      sx={{
                        color: theme.palette.primary.main,
                        "&.Mui-checked": { color: theme.palette.primary.main },
                      }}
                    />
                  }
                  label={
                    <Typography fontSize="14px" fontWeight={500}>
                      {t("Enable auto save")}
                    </Typography>
                  }
                  sx={{ marginRight: 0 }}
                />
              )}
              <Button
                onClick={handlePickClick}
                endIcon={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 22,
                      borderRadius: "6px",
                      background: theme.palette.primary.main,
                      color: "#fff",
                    }}
                  >
                    <PhotoCameraOutlinedIcon sx={{ fontSize: 14 }} />
                  </Box>
                }
                disableElevation
                sx={{
                  background: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "13px",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  boxShadow: "none",
                  "&:hover": {
                    background: theme.palette.action.selected,
                    boxShadow: "none",
                  },
                }}
              >
                {t("Upload again")}
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Tabs — only for logged-in users, hidden during preview step */}
        {isLoggedIn && step !== "preview" && (
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              mb: 2.5,
            }}
          >
            <TabsTypeTwo
              tabs={tabsList}
              currentTab={activeTab}
              setCurrentTab={(index: number) => setActiveTab(index)}
            />
          </Box>
        )}

        {/* Upload files tab */}
        {activeTab === TAB_UPLOAD && (
          <>{step === "select" ? renderSelectStep() : renderPreviewStep()}</>
        )}

        {/* Media Library tab — requires login */}
        {isLoggedIn && activeTab === TAB_LIBRARY && mediaLibrary}
      </Box>
    </CustomModal>
  );
};

export default CustomizeMultipleFileUpload;
