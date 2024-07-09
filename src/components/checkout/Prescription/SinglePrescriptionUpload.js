import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { IconButton, Tooltip, Typography, Zoom, styled, tooltipClasses, useTheme } from "@mui/material";
import ImageUploaderWithPreview from "../../single-file-uploader-with-preview/ImageUploaderWithPreview";
import ImageAddIcon from "../../single-file-uploader-with-preview/ImageAddIcon";
import { Stack, height } from "@mui/system";
import addImage from "./assets/add-image.png";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
const SinglePrescriptionUpload = (props) => {
  const { t, handleImageUpload, borderRadius } = props;
  const theme = useTheme();
  const [image, setImage] = useState("");
  const customerImageUrl = "https://6ammart.ragnar66.com/dev/storage/app/public/profile";
  useEffect(() => {
    typeof image !== "string" && handleImageUpload?.(image);
  }, [image]);

  const singleFileUploadHandlerForImage = (value) => {
    setImage(value.currentTarget.files[0]);
  };
  const imageOnchangeHandlerForImage = (value) => {
    setImage(value);
  };
  const list = () => (
    <CustomStackFullWidth minWidth={{ xs: "350px", sm: "400px" }} p="10px" gap="10px" sx={{ backgroundColor: theme.palette.neutral[100] }}>
      <Typography fontWeight={500}>{t("Why upload prescription -")}</Typography>
      <ol type="1" style={{ color: theme.palette.neutral[400], fontSize: "12px", paddingLeft: "10px", marginTop: "0px" }}>
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>{t("You're free from the fear of losing prescriptions, find your digital prescription with Lifetime Cure.")}</Typography>
        </li>
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>{t("According to government regulations, prescription is mandatory for ordering some medicines.")}</Typography>
        </li>
        <li>
          <Typography sx={{ color: theme.palette.neutral[400] }}>{t("No problem if you can't understand the doctor's handwriting, our Pharmacist will assist you in ordering the medicine by viewing the prescription.")}</Typography>
        </li>
      </ol>
    </CustomStackFullWidth>
  );
  return (
    <CustomStackFullWidth
      alignItems="flex-start"
      justifyContent="center"
      spacing={3}
    >
      <CustomStackFullWidth flexDirection="row" justifyContent="space-between">
        <Typography
          fontSize={{ xs: "14px", sm: "14px", md: "16px" }}
          fontWeight="600"
          alignItems="center"
        >
          {t("Prescription")}{" "}
          <span style={{ color: theme.palette.error.light, fontSize: "12px" }}>
            ({t("Max size 2MB")})
          </span>{" "}
        </Typography>
        <LightTooltip TransitionComponent={Zoom} title={<div>{list()}</div>}>
          <IconButton>
            <InfoOutlinedIcon color="primary.main" sx={{ height: "18px", width: "18px" }} />
          </IconButton>
        </LightTooltip>
      </CustomStackFullWidth>
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        sx={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: "15px !important",
          paddingBottom: "20px"
        }}
      >
        <Stack width="140px" position="relative">
          <ImageUploaderWithPreview
            type="file"
            // labelText={t("File upload")}
            hintText="Image format - jpg, png, jpeg, gif Image Size - maximum size 2 MB Image Ratio - 1:1"
            file={image}
            onChange={singleFileUploadHandlerForImage}
            imageOnChange={imageOnchangeHandlerForImage}
            width="8.75rem"
            borderRadius={borderRadius ?? "50%"}
          />
          {typeof image !== "string" && (
            <ImageAddIcon top="10px" right="10px" height="30px" width="30px" iconSize="15px" imageChangeHandler={singleFileUploadHandlerForImage} />
          )}
        </Stack>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

SinglePrescriptionUpload.propTypes = {};

export default SinglePrescriptionUpload;
