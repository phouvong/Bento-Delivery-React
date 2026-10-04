import React from "react";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import InputLabel from "@mui/material/InputLabel";
import ImageUploaderWithPreview from "components/single-file-uploader-with-preview/ImageUploaderWithPreview";
import { Typography, Stack, useTheme, Box } from "@mui/material";

const ImageSection = ({
	RestaurantJoinFormik,
	singleFileUploadHandlerForImage,
	imageOnchangeHandlerForImage,
	singleFileUploadHandlerForCoverPhoto,
	imageOnchangeHandlerForCoverPhoto,
}) => {
	const { t } = useTranslation();
	const theme = useTheme();

	return (
		<CustomStackFullWidth
			gap="20px"
			sx={{
				flexDirection: { xs: "column", sm: "column", md: "row" },
			}}
		>
			<Box
				sx={{
					backgroundColor: theme.palette.background.default,
					borderRadius: ".5rem",
					padding: "1rem",
					textAlign: "center",
					flexGrow: 1,
				}}>
				<Stack spacing={1.5} mb=".8rem" sx={{ flexGrow: 1 }}>
					<Stack>
						<InputLabel
							sx={{
								fontWeight: "500",
								color: theme.palette.neutral[1000],
							}}
						>
							{t("Business Cover")}<span style={{ color: "red" }}>*</span>
						</InputLabel>
						<Typography fontSize="10px" mt={.25}>
							{t("JPG, JPEG, PNG,WEBP  Less Than 1MB (Ratio 2:1)")}
						</Typography>
					</Stack>
					<ImageUploaderWithPreview
						type="file"
						labelText={t("Add Image")}
						hintText="Image format - jpg, png, jpeg,Webp,gif Image Size - maximum size 2 MB Image Ratio - 1:1"
						file={RestaurantJoinFormik.values.cover_photo}
						onChange={singleFileUploadHandlerForCoverPhoto}
						imageOnChange={imageOnchangeHandlerForCoverPhoto}
						width="250px"
						height={"100%"}
						error={
							RestaurantJoinFormik.touched.cover_photo &&
							RestaurantJoinFormik.errors.cover_photo
						}
					/>
					{RestaurantJoinFormik.touched.cover_photo &&
						RestaurantJoinFormik.errors.cover_photo && (
							<Typography
								sx={{
									fontSize: "12px",
									ml: "10px",
									fontWeight: "inherit",
									color: theme.palette.error.main,

								}}
							>
								{RestaurantJoinFormik.errors.cover_photo.replaceAll("_"," ")}
							</Typography>
						)}
				</Stack>
			</Box>
			<Box
				sx={{
					backgroundColor: theme.palette.background.default,
					borderRadius: ".5rem",
					padding: "1rem",
					textAlign: "center",
					flexGrow: 1,
				}}>
				<Stack spacing={1.5} mb=".8rem" sx={{ flexGrow: 0 }}>
					<Stack>
						<InputLabel
							sx={{
								fontWeight: "500",
								color: (theme) => theme.palette.neutral[1000],
							}}
						>
							{t("Business Logo")}<span style={{ color: "red" }}>*</span>
						</InputLabel>
						<Typography fontSize="10px" mt={.25}>
							{t("JPG, JPEG, PNG,WEBP Less Than 1MB (Ratio 1:1)")}
						</Typography>
					</Stack>
					<ImageUploaderWithPreview
						type="file"
						labelText={t("Add Image")}
						hintText="Image format - jpg, png, jpeg, Webp, gif Image Size - maximum size 2 MB Image Ratio - 1:1"
						file={RestaurantJoinFormik?.values?.logo}
						onChange={singleFileUploadHandlerForImage}
						imageOnChange={imageOnchangeHandlerForImage}
						width="150px"
						height="100%"
						error={
							RestaurantJoinFormik.touched.logo &&
							RestaurantJoinFormik.errors.logo
						}
					/>
					{RestaurantJoinFormik.touched.logo &&
						RestaurantJoinFormik.errors.logo && (
							<Typography
								sx={{
									fontSize: "12px",
									ml: "10px",


									fontWeight: "inherit",
									color: (theme) => theme.palette.error.main,
								}}
							>
								{RestaurantJoinFormik.errors.logo}
							</Typography>
						)}
				</Stack>
			</Box >
		</CustomStackFullWidth >
	);
};
export default ImageSection;