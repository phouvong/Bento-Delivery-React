import { alpha, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import receiverImage from "../../../public/static/receiverimage.svg";
import senderImage from "../../../public/static/senderimage.svg";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import { CustomTypography } from "../landing-page/hero-section/HeroSection.style";

const ChangePayBy = ({ paidBy, setPaidBy, zoneData }) => {
	const theme = useTheme();
	return (
		<CustomStackFullWidth spacing={1.2} gap="5px">
			<CustomStackFullWidth>
				<CustomTypography fontWeigh="500">
					{t("Charge Paid By")}
				</CustomTypography>
			</CustomStackFullWidth>
			<CustomStackFullWidth
				direction="row"
				sx={{
					gap: {
						xs: 1,
					},
					flexWrap: "wrap",
				}}
			>
				<Stack
					spacing={0.5}
					sx={{ cursor: "pointer" }}
					onClick={() => setPaidBy("sender")}
					flexWrap
				>
					<Stack
						backgroundColor={
							paidBy === "sender" &&
							alpha(theme.palette.primary.main, 0.1)
						}
						sx={{ borderRadius: "5px" }}
						direction="row"
						alignItems="center"
						spacing={1}
						padding="8px 30px"
						border="1px solid"
						borderColor={
							paidBy === "sender"
								? theme.palette.primary.main
								: theme.palette.neutral[400]
						}
					>
						<CustomImageContainer
							src={senderImage.src}
							height="30px"
							width="30x"
							objectfit="contain"
						/>
						<Typography align="center">{t("Sender")}</Typography>
					</Stack>
				</Stack>
				{zoneData?.data?.zone_data?.[0]?.cash_on_delivery && (
					<Stack
						spacing={0.5}
						onClick={() => setPaidBy("receiver")}
						sx={{ cursor: "pointer" }}
					>
						<Stack
							//selected={paidBy === "receiver"}

							backgroundColor={
								paidBy === "receiver" &&
								alpha(theme.palette.primary.main, 0.1)
							}
							sx={{ borderRadius: "5px" }}
							direction="row"
							alignItems="center"
							spacing={1}
							padding="8px 20px"
							border="1px solid"
							borderColor={
								paidBy === "receiver"
									? theme.palette.primary.main
									: theme.palette.neutral[400]
							}
						>
							<CustomImageContainer
								src={receiverImage.src}
								height="30px"
								width="30px"
								objectfit="contain"
							/>
							<Typography align="center">{t("Receiver")}</Typography>
						</Stack>
					</Stack>
				)}
			</CustomStackFullWidth>
		</CustomStackFullWidth>
	);
};

export default ChangePayBy;
