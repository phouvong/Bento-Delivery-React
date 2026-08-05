import { Box, Stack, useTheme } from "@mui/system";
import { Button, Grid, Typography, useMediaQuery } from "@mui/material";

import PlayStoreIcon from "/public/static/rental/playStore.png";
import AppStoreIcon from "/public/static/rental/appStore.png";
import { DownloadAppButton } from "components/home/module-wise-components/rental/components/Rental.style";
import H2 from "components/typographies/H2";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import CustomImageContainer from "components/CustomImageContainer";
import NextImage from "components/NextImage";

const DownloadSection = ({ landingPageData }) => {
	const router = useRouter();
	const theme = useTheme();
	const mobile = useMediaQuery("(max-width: 575px)");

	const handleRegistrationClick = () => {
		router.push({
			pathname: "/store-registration",
			query: { active: "active" },
		});
	};

	return (
		<Box sx={{ mb: { sm: "30px", md: "-30px" } }}>
			<Stack mt={3}></Stack>
			<Grid container spacing={5}>
				{landingPageData?.module_home_page_data_title ?(
					<Grid item xs={12} md={6}>
					<Box
						borderRadius={3}
						bgcolor={theme.palette.background.custom7}
						sx={{
							padding: "30px",
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							alignItems: { xs: "stretch", sm: "flex-end" },
							gap: { xs: 3, sm: 2 },
						}}
					>
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Box>
								<H2
									textAlign={{xs: "center", sm: "start"}}
									text={
										landingPageData?.module_home_page_data_title
									}
									component="h2"
								/>
								<Typography
									textAlign={{xs: "center", sm: "start"}}
									mt={1}
									variant="body1"
									color="textSecondary"
								>
									{
										landingPageData?.module_home_page_data_sub_title
									}
								</Typography>

								<Stack
									mt={4}
									mb={mobile ? 4 : 0}
									alignItems={{xs: "center", sm: "flex-start"}}
									gap={2}
								>
									{landingPageData?.download_user_app_links
										?.playstore_url_status === "1" && (
										<DownloadAppButton
											onClick={() => {
												router.push(
													landingPageData
														?.download_user_app_links
														?.playstore_url
												);
											}}
										>
											<NextImage
												width={25}
												height={25}
												src={PlayStoreIcon?.src}
											/>
											<Stack alignItems="flex-start">
												<Typography
													variant="subtitle2"
													fontSize={11}
												>
													{t("Get it on")}
												</Typography>
												<Typography
													variant="subtitle1"
													fontSize={14}
													fontWeight={600}
												>
													{t("Google Play")}
												</Typography>
											</Stack>
										</DownloadAppButton>
									)}

									{landingPageData?.download_user_app_links
										?.apple_store_url_status === "1" && (
										<DownloadAppButton
											onClick={() => {
												router.push(
													landingPageData
														?.download_user_app_links
														?.apple_store_url
												);
											}}
										>
											<NextImage
												width={25}
												height={25}
												src={AppStoreIcon?.src}
											/>
											<Stack alignItems="flex-start">
												<Typography
													variant="subtitle2"
													fontSize={11}
												>
													{t("Download on")}
												</Typography>
												<Typography
													variant="subtitle1"
													fontSize={14}
													fontWeight={600}
												>
													{t("App Vendor")}
												</Typography>
											</Stack>
										</DownloadAppButton>
									)}
								</Stack>
							</Box>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: { xs: "center", sm: "flex-end" },
								alignItems: "flex-end",
								flexShrink: 0,
								width: { xs: "100%", sm: "auto" },
							}}
						>
							<CustomImageContainer
								maxWidth="250px"
								objectfit="cover"
								src={
									landingPageData?.module_home_page_data_image
								}
							/>
						</Box>
					</Box>
				</Grid>
				):null}
				{landingPageData?.module_vendor_registration_data_title ?(
					<Grid item xs={12} md={6}>
					<Box
						borderRadius={3}
						bgcolor={theme.palette.background.custom7}
						sx={{
							height: "100%",
							padding: "30px",
							pb: {xs: 0, sm:"100px"},
							position:"relative"
						}}
					>
						<Box>
							<Box>
								<H2
									textAlign={{xs: "center", sm: "start"}}
									text={
										landingPageData?.module_vendor_registration_data_title
									}
									component="h2"
								/>
								<Typography
									textAlign={{xs: "center", sm: "start"}}
									mt={1}
									variant="body1"
									color="textSecondary"
								>
									{
										landingPageData?.module_vendor_registration_data_sub_title
									}
								</Typography>

								<Stack
									mt={4}
									mb={mobile ? 4 : 0}
									alignItems={{xs: "center", sm: "start"}}
									gap={2}
								>
									{landingPageData?.module_vendor_registration_data_button_title?(<Button
										variant="contained"
										onClick={handleRegistrationClick}
									>
										{
											landingPageData?.module_vendor_registration_data_button_title
										}
									</Button>):null}
									
								</Stack>
							</Box>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: { xs: "center", sm: "end" },
								alignItems: "flex-end",
								position:{sm: "absolute"},
								bottom:"0",
								right:{sm:"40px"},
							}}
						>
							<CustomImageContainer
								maxWidth="342px"
								objectfit="cover"
								src={
									landingPageData?.module_vendor_registration_data_image
								}
							/>
						</Box>
					</Box>
				</Grid>
				):null}
			</Grid>
		</Box>
	);
};

DownloadSection.propTypes = {};

export default DownloadSection;
