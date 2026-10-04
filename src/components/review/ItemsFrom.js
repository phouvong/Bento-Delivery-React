import { useFormik } from "formik";

import { Grid, Stack, Typography } from "@mui/material";
import {
  CustomColouredTypography,
  CustomStackFullWidth, CustomTextArea,
  CustomTypographyBold,
  CustomTypographyGray,
} from "../../styled-components/CustomStyles.style";

import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";

import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import CustomImageContainer from "../CustomImageContainer";
import { Button } from "@mui/material";

import toast from "react-hot-toast";

import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useSubmitItemReview } from "api-manage/hooks/react-query/review/useSubmitItemReview";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import CustomRatings from "../search/CustomRatings";

const ItemForm = ({ data, onReviewComplete }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const itemImage = configData?.base_urls?.item_image_url;

  const { mutate, isLoading, error } = useSubmitItemReview();
  const formik = useFormik({
    initialValues: {
      rating: "",
      comment: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        handleFormsubmit(values);
      } catch (err) { }
    },
  });
  const handleChangeRatings = (value) => {
    formik.setFieldValue("rating", value);
  };
  const handleFormsubmit = (values) => {
    const formData = {
      ...values,
      delivery_man_id: null,
      item_id: data?.item_id,
      order_id: data?.order_id,
    };
    mutate(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        if (data?.item_id) {
          onReviewComplete?.(data.id);
        }
      },
      onError: onErrorResponse,
    });
  };

  const languageDirection = localStorage.getItem("direction");
  return (
    <CustomStackFullWidth>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
            >
              <CustomImageContainer
                src={data?.image_full_url}
                width="80px"
                height="80px"
                objectFit="cover"
              />
              <Stack>
                <Typography fontSize="16px">
                  {data?.item_details?.name}
                </Typography>
                <CustomTypographyGray sx={{ fontSize: "12px", mt: 0.5 }}>
                  {t("Qty")} : {data?.quantity}
                </CustomTypographyGray>
                <CustomColouredTypography
                  color="primary.main"
                  sx={{ fontSize: "16px", fontWeight: "bold", mt: 0.5 }}
                >
                  {getAmountWithSign(data?.item_details?.price)}
                </CustomColouredTypography>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={12}>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                backgroundColor: theme => theme.palette.neutral[300],
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: "normal" }}>
                {t("Rate the item")}
              </Typography>
              <CustomRatings
                handleChangeRatings={handleChangeRatings}
                ratingValue={formik.values.rating}
                fontSize={"1.2rem"}
                color={theme.palette.primary.main}
              />
            </Stack>

          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              spacing={1}
              sx={{
                padding: "15px",
                border: `1px solid ${theme.palette.neutral[300]}`,
                borderRadius: "10px",
                backgroundColor: theme => theme.palette.neutral[300],
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: "normal", mb: 1 }}>
                {t("Share your opinion")}
              </Typography>

              <CustomTextArea
                sx={{
                  width: "100%",
                  minHeight: "100px",
                  fontSize: "12px",
                  border: "none",
                  "& fieldset": { border: "none" }
                }}
                placeholder={t("Type your opinion")}
                touched={formik.touched.comment}
                errors={formik.errors.comment}
                multiline
                rows={4}
                value={formik.values.comment}
                onChange={formik.handleChange}
                name="comment"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={12} mt="1rem">
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#F3F3F3",
                  color: "#333333",
                  "&:hover": {
                    backgroundColor: "#E0E0E0",
                  },
                  width: "100%",
                  boxShadow: "none",
                  textTransform: "none",
                  fontWeight: "400",
                }}
                onClick={() => {
                  if (data?.item_id) {
                    onReviewComplete?.(data?.id)
                  }
                }}
              >
                {t("Skip for Now")}
              </Button>
              <LoadingButton
                fullWidth
                variant="contained"
                type="submit"
                loading={isLoading}
                sx={{ width: '100%', backgroundColor: "#008631" }} // Specific green as per image
              >
                {t("Submit")}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </CustomStackFullWidth>
  );
};

ItemForm.propTypes = {};

export default ItemForm;
