import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Zoom,
  styled,
  tooltipClasses,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useSaveFiles } from "api-manage/hooks/react-query/saved-files/useSaveFiles";
import MediaLibrary from "components/multi-file-uploader/MediaLibrary";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomizeMultipleFileUpload from "../../multi-file-uploader/CustomizeMultipleFileUpload";
import UploadedFilesPreviewStrip from "../../multi-file-uploader/UploadedFilesPreviewStrip";
import UploadTriggerCard from "../../multi-file-uploader/UploadTriggerCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_FILES = 5;

const isAllowedFile = (file) => {
  const type = (file?.type || "").toLowerCase();
  const ext = (file?.name || "").split(".").pop()?.toLowerCase() || "";
  return ALLOWED_MIME_TYPES.includes(type) || ALLOWED_EXTENSIONS.includes(ext);
};

const isWithinSizeLimit = (file) => (file?.size ?? 0) <= MAX_FILE_SIZE;

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: "430px",
    backgroundColor: theme.palette.neutral[100],
    color: theme.palette.neutral[1000],
    boxShadow: theme.shadows[1],
    fontSize: 11,
    [theme.breakpoints.down("sm")]: {
      minWidth: "380px",
    },
  },
}));

const MultiPrescriptionRoot = ({
  prescriptionImages,
  setPrescriptionImages,
}) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { mutate: saveFilesMutate } = useSaveFiles();
  const theme = useTheme();

  const handleRemoveUploadedFile = (index) => {
    setPrescriptionImages((prev) => {
      const next = [...prev];
      try {
        URL.revokeObjectURL(next[index].preview);
      } catch (_) {
        // ignore
      }
      next.splice(index, 1);
      return next;
    });
  };

  const handleModalUpload = (allFiles, autoSaveFiles) => {
    if (prescriptionImages.length >= MAX_FILES) {
      toast.error(t("You can upload a maximum of 5 prescriptions"));
      return;
    }

    const typeChecked = allFiles.filter(isAllowedFile);
    if (typeChecked.length < allFiles.length) {
      toast.error(t("Only image and PDF files are allowed"));
    }
    if (!typeChecked.length) return;

    const safeFiles = typeChecked.filter(isWithinSizeLimit);
    if (safeFiles.length < typeChecked.length) {
      toast.error(t("Each file must be 2MB or smaller"));
    }
    if (!safeFiles.length) return;

    const safeAutoSaveFiles = (autoSaveFiles || [])
      .filter(isAllowedFile)
      .filter(isWithinSizeLimit);

    const dedupedFiles = safeFiles.filter(
      (file) =>
        !prescriptionImages.some(
          (entry) =>
            entry.file &&
            entry.file.name === file.name &&
            entry.file.size === file.size,
        ),
    );

    if (dedupedFiles.length < safeFiles.length) {
      toast.error(t("Some files are already added"));
    }

    if (!dedupedFiles.length) return;

    const remaining = MAX_FILES - prescriptionImages.length;
    const allowedFiles = dedupedFiles.slice(0, remaining);
    if (allowedFiles.length < dedupedFiles.length) {
      toast.error(t("You can upload a maximum of 5 prescriptions"));
    }

    const newEntries = allowedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      autoSave: safeAutoSaveFiles.includes(file),
    }));
    setPrescriptionImages((prev) => [...prev, ...newEntries]);

    if (safeAutoSaveFiles.length > 0) {
      saveFilesMutate(safeAutoSaveFiles, {
        onSuccess: () => {
          toast.success(t("Files saved successfully"));
        },
        onError: (error) => {
          error?.response?.data?.errors?.forEach((item) =>
            toast.error(item.message, { position: "bottom-right" }),
          );
        },
      });
    }
  };

  const handleMediaLibraryUpload = (selected) => {
    if (prescriptionImages.length >= MAX_FILES) {
      toast.error(t("You can upload a maximum of 5 prescriptions"));
      return;
    }

    const dedupedSelected = selected.filter(
      (img) => !prescriptionImages.some((entry) => entry.preview === img.url),
    );

    if (dedupedSelected.length < selected.length) {
      toast.error(t("Some files are already added"));
    }

    if (!dedupedSelected.length) return;

    const remaining = MAX_FILES - prescriptionImages.length;
    const allowedSelected = dedupedSelected.slice(0, remaining);
    if (allowedSelected.length < dedupedSelected.length) {
      toast.error(t("You can upload a maximum of 5 prescriptions"));
    }

    const newEntries = allowedSelected.map((img) => ({
      file: null,
      preview: img.url,
      name: img.name ?? img.url,
      autoSave: false,
    }));
    setPrescriptionImages((prev) => [...prev, ...newEntries]);
  };

  const list = () => (
    <CustomStackFullWidth
      minWidth={{ xs: "350px", sm: "400px" }}
      p="10px"
      gap="10px"
      sx={{ backgroundColor: theme.palette.neutral[100] }}
    >
      <Typography fontWeight={500}>{t("Why upload prescription -")}</Typography>
      <ol
        type="1"
        style={{
          color: theme.palette.neutral[400],
          fontSize: "12px",
          paddingLeft: "10px",
          marginTop: "0px",
        }}
      >
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>
            {t(
              "You're free from the fear of losing prescriptions, find your digital prescription with Lifetime Cure.",
            )}
          </Typography>
        </li>
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>
            {t(
              "According to government regulations, prescription is mandatory for ordering some medicines.",
            )}
          </Typography>
        </li>
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>
            {t(
              "No problem if you can't understand the doctor's handwriting, our Pharmacist will assist you in ordering the medicine by viewing the prescription.",
            )}
          </Typography>
        </li>
      </ol>

      <Typography fontWeight={500} mt={1}>
        {t("Upload options -")}
      </Typography>
      <ul
        style={{
          color: theme.palette.neutral[400],
          fontSize: "12px",
          paddingLeft: "10px",
          marginTop: "0px",
        }}
      >
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>
            {t("Allowed formats:")} {ALLOWED_EXTENSIONS.join(", ").toUpperCase()}
          </Typography>
        </li>
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>
            {t("Maximum file size:")} {(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)} MB
          </Typography>
        </li>
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>
            {t("You can upload up to")} {MAX_FILES} {t("prescriptions")}
          </Typography>
        </li>
      </ul>
    </CustomStackFullWidth>
  );

  useEffect(() => {
    return () => {
      prescriptionImages.forEach((entry) => {
        try {
          URL.revokeObjectURL(entry.preview);
        } catch (_) {
          // ignore
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CustomPaperBigCard height="auto" padding="20px">
      {/* title description */}
      <CustomStackFullWidth flexDirection="row" justifyContent="space-between">
        <Typography
          fontSize={{ xs: "14px", sm: "14px", md: "16px" }}
          fontWeight="600"
          alignItems="center"
        >
          {t("Prescription")}{" "}
        </Typography>
        <LightTooltip TransitionComponent={Zoom} title={<div>{list()}</div>}>
          <IconButton>
            <InfoOutlinedIcon
              color="primary.main"
              sx={{ height: "18px", width: "18px" }}
            />
          </IconButton>
        </LightTooltip>
      </CustomStackFullWidth>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ width: "100%" }}
      >
        {/* box image button */}
        <UploadTriggerCard
          label={
            prescriptionImages.length >= MAX_FILES
              ? t("Max 5 prescriptions reached")
              : t("Upload your prescription")
          }
          onClick={() => {
            if (prescriptionImages.length >= MAX_FILES) {
              toast.error(t("You can upload a maximum of 5 prescriptions"));
              return;
            }
            setUploadModalOpen(true);
          }}
        />
        {prescriptionImages.length > 0 && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <UploadedFilesPreviewStrip
              files={prescriptionImages}
              onRemove={handleRemoveUploadedFile}
            />
          </Box>
        )}
      </Stack>

      <CustomizeMultipleFileUpload
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleModalUpload}
        title={t("Upload Prescription")}
        showPreviewStep={true}
        mediaLibrary={
          <MediaLibrary
            onUpload={(selected) => {
              handleMediaLibraryUpload(selected);
              setUploadModalOpen(false);
            }}
            onDeleteFiles={() => {
              setPrescriptionImages((prev) => {
                const filterNotNamedImage = prev.filter((entry) => !entry.name);
                return filterNotNamedImage;
              });
            }}
          />
        }
      />
    </CustomPaperBigCard>
  );
};

export default MultiPrescriptionRoot;
