import {
	alpha,
	Box,
	Grid,
	styled,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import CustomContainer from "components/container";
import DollarSignHighlighter from "components/DollarSignHighlighter";
import { t } from "i18next";

const ComponentTwoContainer = styled(Box)(
	({ theme, paddingTop, paddingBottom }) => ({
		marginTop: ".6rem",
		paddingTop: paddingTop ? paddingTop : "1.5rem",
		paddingBottom: paddingBottom ? paddingBottom : "1rem",
		background: theme.palette.background.default,
	})
);
const AvailableZoneSection = ({ zoneSection }) => {
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	const toolTipsContent = (zone) => {
		return (
			<>
				<Stack>
					<Typography paddingX="7px">{zone?.display_name}</Typography>
					<Stack direction="row" p="7px" flexWrap="wrap" gap="4px">
						{zone?.modules?.length > 0 ? (
							<Typography fontSize="12px">
								{t("Modules are")}{" "}
							</Typography>
						) : (
							<Typography fontSize="12px">
								{t("No module available")}
							</Typography>
						)}

						{/* Add a space after the text */}
						{zone?.modules?.map((item, index) => (
							<Typography key={index} fontSize="12px">
								{item}
								{index !== zone.modules.length - 1 ? "," : "."}
							</Typography>
						))}
					</Stack>
				</Stack>
			</>
		);
	};

	return (
		<ComponentTwoContainer
			background
			paddingTop={isSmall ? "0rem" : "1rem"}
			paddingBottom={{ xs: "0rem", md: "3rem" }}
		>
			<CustomContainer>
				<Grid
					container
					alignItems="center"
					justifyContent="center"
					spacing={{ xs: 2, md: 3 }}
				>
					<Grid
						item
						xs={12}
						sm={12}
						md={6}
						align={isSmall ? "center" : "left"}
					>
						<Box
							sx={{
								paddingTop: "1rem",
								maxHeight: "270px",
								overflowY: "auto",
								"&::-webkit-scrollbar": {
									width: "3px",
								},
								"&::-webkit-scrollbar-track": {
									backgroundColor: "#f0f0f0",
								},
								"&::-webkit-scrollbar-thumb": {
									backgroundColor: "#c1c1c1",
									borderRadius: "3px",
								},
								"&::-webkit-scrollbar-thumb:hover": {
									backgroundColor: "#003638",
								},
							}}
						>
							<Typography
								fontSize={{ xs: "18px", md: "30px" }}
								fontWeight={{ xs: "600", md: "700" }}
								component="h2"
								align={isSmall ? "center" : "left"}
							>
								<DollarSignHighlighter text={zoneSection?.available_zone_title} theme={theme} />
							</Typography>
							<Typography
								fontSize={{ xs: "12px", md: "16px" }}
								fontWeight={{ xs: "400", }}
								color={theme.palette.neutral[400]}
								paddingTop={isSmall ? "10px" : "0rem"}
								align={isSmall ? "center" : "left"}
								dangerouslySetInnerHTML={{ __html: zoneSection?.available_zone_short_description }}
							/>
						</Box>
					</Grid>
					<Grid
						item
						xs={12}
						sm={12}
						md={6}
						align={isSmall ? "center" : "right"}
					>
						<Box sx={{
							position: "relative",
							marginTop: { xs: "10px", md: "35px" },
							backgroundColor: theme => theme.palette.neutral[100],
							padding: { xs: ".5rem", md: "1rem" },
							borderRadius: "10px",
							boxShadow: "0px 3px 10px 0px #0000000F",



						}}>
							<Box
								sx={{
									height: 200,
									overflowY: "auto",
									paddingRight: "10px",
									"&::-webkit-scrollbar": {
										width: "3px",
									},
									"&::-webkit-scrollbar-track": {
										backgroundColor: "#f0f0f0",
									},
									"&::-webkit-scrollbar-thumb": {
										backgroundColor: "#c1c1c1",
										borderRadius: "3px",
									},
									"&::-webkit-scrollbar-thumb:hover": {
										backgroundColor: "#003638",
									},
									alignItems: "center",
									justifyContent: "center",
									display: "flex",
								}}
							>
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: "12px",
										maxWidth: "543px",
										justifyContent: { xs: "center", md: "flex-start" },

									}}
								>
									{zoneSection?.available_zone_list
										?.filter((item) => item?.modules?.length > 0)
										.map((zone, index) => (
											<Tooltip
												arrow
												placement="top"
												title={toolTipsContent(zone)}
												key={index}
											>
												<Box
													sx={{
														borderRadius: "10px",
														border: "1px solid",
														borderColor: alpha(
															theme.palette.neutral[400],
															0.2
														),
														backgroundColor: (theme) =>
															theme.palette.neutral[100],
														padding: { xs: "10px 15px", md: "10px 20px" },
														cursor: "pointer",
														fontSize: { xs: "16px", md: "18px" },
														fontWeight: 400,
														textAlign: "center",
														textDecoration: "none",
														"&:hover": {
															boxShadow: `0px 4px 12px 0px #0000001A;`,
															color: theme.palette.neutral[1000],
															fontWeight: 500,
														},
													}}
												>
													{zone?.display_name}
												</Box>
											</Tooltip>
										))}
								</Box>
							</Box>

							{/* The gradient overlay at the bottom */}

							{/* <Box
								sx={{
									position: "absolute",
									height: "62px",
									bottom: 0,
									left: 0,
									width: "100%",
									background: `linear-gradient(180deg, ${alpha(
										theme.palette.background.default,
										0.0
									)} 43.03%,  ${alpha(
										theme.palette.background.default,
										0.72
									)} 55.48%,  ${alpha(
										theme.palette.background.default,
										0.9
									)} 100%)`,
									pointerEvents: "none",
								}}
							/> */}
						</Box>
					</Grid>
				</Grid>
			</CustomContainer>
		</ComponentTwoContainer >
	);
};

export default AvailableZoneSection;
