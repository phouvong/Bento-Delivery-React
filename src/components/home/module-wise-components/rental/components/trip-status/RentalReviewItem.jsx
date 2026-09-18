import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Rating,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import CustomImageContainer from "components/CustomImageContainer";
import CustomRatings from "components/search/CustomRatings";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSubmitRentalReview } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/review/useSubmitRentalReview";
import { toast } from "react-hot-toast";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import StarIcon from "@mui/icons-material/Star";

const RentalReviewItem = ({
  item,
  trip_id,
  vehicleIdentityId,
  currentSlide,
  vehicleIdentity,
  handleClose,
  vehicleId,
  refetchTripDetails,
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const { t } = useTranslation();

  const { mutate } = useSubmitRentalReview();

  const formik = useFormik({
    initialValues: {
      rating: "",
      comment: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        handleFormSubmit(values);
      } catch (err) {}
    },
  });

  const labels = {
    1: "Bad!",
    2: "Average!",
    3: "Good!",
    4: "Best!",
    5: "Excellent!",
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }
  useEffect(() => {
    setValue(formik.values.rating);
  }, [formik.values.rating]);

  const handleChangeRatings = (value) => {
    formik.setFieldValue("rating", value);
  };

  const handleChangeComment = (e) => {
    formik.setFieldValue("comment", e.target.value);
  };

  const handleFormSubmit = (values) => {
    if (!formik.values.rating || formik.values.rating === 0) {
      toast.error("Please give a rating");
      return;
    }
    if (!formik.values.comment || formik.values.comment === " ") {
      toast.error("Please write a comment");
      return;
    }

    const formData = {
      ...values,
      trip_id: trip_id,
      vehicle_identity_id: vehicleIdentityId,
      vehicle_id: vehicleId,
    };
    mutate(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        refetchTripDetails();
        formik.setFieldValue("rating", 0);
        formik.setFieldValue("comment", "");
        currentSlide === vehicleIdentity.length - 1 && handleClose();
      },
      onError: onErrorResponse,
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack mt={3}>
        <Box
          bgcolor={theme.palette.mode === "light" ? "#fafafa" : "#0d131d"}
          p={2.5}
          borderRadius={1}
        >
          <Stack textAlign="center" alignItems="center">
            <CustomImageContainer
              mb={1.5}
              width={160}
              height={80}
              borderRadius={5}
              src={item?.vehicles?.thumbnail_full_url}
              alt={"Rental Review"}
            />

            <Typography
              mb={1}
              fontWeight={500}
              variant="body1"
              textTransform="capitalize"
            >
              {item?.vehicles?.name}
            </Typography>
            <Stack direction="row" gap={1} mb={2}>
              <Typography variant="body2" color={theme.palette.neutral[400]}>
                {t("License No")} :
              </Typography>
              <Typography variant="body2" color={theme.palette.neutral[400]}>
                {item?.vehicle_identity_data?.license_plate_number}
              </Typography>
            </Stack>

            <Box
              sx={{
                width: 200,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                alignItems: "center",
                ".MuiRating-root": { color: theme.palette.primary.main },
              }}
            >
              <Rating
                name="hover-feedback"
                value={value}
                precision={1}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                  setValue(newValue);
                  handleChangeRatings(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              {value !== null && (
                <Box>{labels[hover !== -1 ? hover : value]}</Box>
              )}
            </Box>
          </Stack>

          <Stack mt={1} pt={2}>
            <TextField
              label={t("Type Here")}
              touched={formik.touched.comment}
              errors={formik.errors.comment}
              value={formik.values.comment}
              onChange={handleChangeComment}
              multiline
              rows={3}
            />
          </Stack>
        </Box>
      </Stack>
    </form>
  );
};

export default RentalReviewItem;
