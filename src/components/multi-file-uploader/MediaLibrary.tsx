import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next";
import { useGetSavedFiles } from "api-manage/hooks/react-query/saved-files/useGetSavedFiles";
import { useDeleteAllSavedFiles } from "api-manage/hooks/react-query/saved-files/useDeleteAllSavedFiles";
import CustomDialogDelete from "components/custom-dialog/delete/CustomDialogDelete";
import toast from "react-hot-toast";

export interface MediaImage {
  id: string;
  url: string;
  name?: string;
}

export interface MediaLibraryProps {
  maxSelect?: number;
  onUpload: (selected: MediaImage[]) => void;
  onDeleteFiles?: () => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  maxSelect = 5,
  onUpload,
  onDeleteFiles,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { data: savedFilesData, isLoading } = useGetSavedFiles();
  const { mutate: deleteAllMutate } = useDeleteAllSavedFiles();

  const handleDeleteAll = () => {
    deleteAllMutate(undefined, {
      onSuccess: () => {
        setSelected(new Set());
        setConfirmDeleteOpen(false);
        onDeleteFiles?.();
        toast.success(t("All files deleted successfully"));
      },
      onError: (error: any) => {
        error?.response?.data?.errors?.forEach((item: any) =>
          toast.error(item.message, { position: "bottom-right" }),
        );
      },
    });
  };

  const images: MediaImage[] = (savedFilesData?.saved_files ?? [])
    .filter(
      (item: any) =>
        item?.image_full_url &&
        typeof item.image_full_url === "string" &&
        item.image_full_url !== "undefined" &&
        item.image_full_url.trim() !== "",
    )
    .map((item: any) => ({
      id: item.image_full_url,
      url: item.image_full_url,
      name: item.file_name,
    }));

  const atLimit = selected.size >= maxSelect;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= maxSelect) return prev;
        next.add(id);
      }
      return next;
    });
  };

  const handleUpload = () => {
    const selectedImages = images.filter((img) => selected.has(img.id));
    onUpload(selectedImages);
  };

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "250px" ,minWidth: "300px" }}
      >
        <CircularProgress
          size={32}
          sx={{ color: theme.palette.primary.main }}
        />
      </Stack>
    );
  }

  if (!images.length) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1.5}
        sx={{ height: "200px",minWidth: "300px" }}
      >
        <ImageOutlinedIcon
          sx={{ fontSize: 52, color: theme.palette.text.disabled }}
        />
        <Typography
          fontSize="15px"
          fontWeight={500}
          color={theme.palette.text.secondary}
        >
          {t("No images in media library")}
        </Typography>
        <Typography
          fontSize="13px"
          color={theme.palette.text.disabled}
          textAlign="center"
        >
          {t("Upload files first and they will appear here")}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack sx={{ minWidth: "300px" }}>
      {/* Fixed header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5, flexShrink: 0 }}
      >
        <Typography fontSize="13px" color={theme.palette.text.secondary}>
          {selected.size > 0
            ? `${selected.size} ${t("selected")}`
            : t("Select images to upload")}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => setConfirmDeleteOpen(true)}
          sx={{
            color: theme.palette.error.main,
            fontWeight: 600,
            textTransform: "none",
            padding: "2px 8px",
            minWidth: "auto",
            "&:hover": { background: theme.palette.error.main + "14" },
          }}
        >
          {t("Clear All")}
        </Button>
      </Stack>

      {/* Scrollable grid */}
      <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 ,pb:"1rem"}}>
        <Grid container spacing={1.5}>
          {images.map((img) => {
            const isSelected = selected.has(img.id);
            const isDisabled = !isSelected && atLimit;

            return (
              <Grid item xs={4} sm={3} key={img.id}>
                <Box
                  onClick={() => !isDisabled && toggle(img.id)}
                  sx={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: `2px solid ${
                      isSelected
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.45 : 1,
                    background: theme.palette.action.hover,
                    transition: "border-color 150ms ease, opacity 150ms ease",
                    "&:hover": {
                      borderColor: isDisabled
                        ? theme.palette.divider
                        : theme.palette.primary.main,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={img.url}
                    alt={img.name ?? ""}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  {/* Selection overlay */}
                  {isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: theme.palette.primary.main + "22",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  {/* Checkmark badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 5,
                      insetInlineStart: 5,
                    }}
                  >
                    {isSelected ? (
                      <CheckCircleIcon
                        sx={{
                          fontSize: 20,
                          color: theme.palette.primary.main,
                          background: theme.palette.common.white,
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: `2px solid ${theme.palette.common.white}`,
                          background: "rgba(0,0,0,0.25)",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Fixed footer */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 1.5, flexShrink: 0 }}
      >
        {atLimit ? (
          <Typography
            fontSize="12px"
            color={theme.palette.error.main}
            fontWeight={500}
          >
            {t("You have reached your maximum limit of")} {maxSelect}.
          </Typography>
        ) : (
          <Typography
            fontSize="12px"
            color={theme.palette.text.secondary}
            fontWeight={500}
          >
            {selected.size}/{maxSelect} {t("selected")}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={selected.size === 0}
          sx={{
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textTransform: "none",
            fontWeight: 600,
            minWidth: 140,
            borderRadius: "8px",
            "&:hover": { background: theme.palette.primary.dark },
            "&.Mui-disabled": {
              background: theme.palette.action.disabledBackground,
            },
          }}
        >
          {t("Upload")}
        </Button>
      </Stack>
      <CustomDialogDelete
        open={confirmDeleteOpen}
        onClick={() => setConfirmDeleteOpen(false)}
        onClose={() => setConfirmDeleteOpen(false)}
        onSuccess={handleDeleteAll}
        title={t("Delete all saved files?")}
        subTitle={t("This action cannot be undone. Are you sure you want to delete all saved files?")}
      />
    </Stack>
  );
};

export default MediaLibrary;
