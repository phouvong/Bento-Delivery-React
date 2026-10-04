import { alpha, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import receiverImage from "../../../public/static/receiverimage.svg";
import senderImage from "../../../public/static/senderimage.svg";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import { CustomTypography } from "../landing-page/hero-section/HeroSection.style";

const ChangePayBy = ({ paidBy, setPaidBy, zoneData, setPaymentMethod, setSelectedPaymentMethod }) => {
	console.log({ zoneData });
	const theme = useTheme();
	return (
		<CustomStackFullWidth spacing={1.2} gap="5px">
			<CustomStackFullWidth
				direction="row"
				sx={{
					gap: 1,
					flexWrap: "wrap",
					padding: "1rem",
					borderRight: { xs: "0px solid", md: "1px solid" },
					borderColor: theme.palette.neutral[400],
				}}
			>
				<Stack
					spacing={0.5}
					sx={{ cursor: "pointer" }}
					onClick={() => {
						setPaidBy("sender");
						setPaymentMethod("cash_on_delivery");
						setSelectedPaymentMethod("cash_on_delivery");
					}}
					flexWrap
				>
					<Stack
						backgroundColor={
							paidBy === "sender" &&
							alpha(theme.palette.primary.main, 1)
						}
						color={
							paidBy === "sender" &&
							theme.palette.neutral[100]
						}
						sx={{ borderRadius: ".5rem" }}
						direction="row"
						alignItems="center"
						spacing={1}
						padding="8px 30px"
						fontWeight="500"
						border="1px solid"
						borderColor={
							paidBy === "sender"
								? theme.palette.primary.main
								: theme.palette.neutral[400]
						}
					>
						{/* <CustomImageContainer
							src={senderImage.src}
							height="30px"
							width="30x"
							objectfit="contain"
						/> */}
						<Typography align="center">{t("Sender")}</Typography>
					</Stack>
				</Stack>
				{zoneData?.zone_data[0]?.cash_on_delivery && (
					<Stack
						spacing={0.5}
						onClick={() => {
							setPaidBy("receiver");
							setPaymentMethod("cash_on_delivery");
							setSelectedPaymentMethod("cash_on_delivery");
						}}
						sx={{ cursor: "pointer" }}
					>
						<Stack
							selected={paidBy === "receiver"}

							backgroundColor={
								paidBy === "receiver" &&
								alpha(theme.palette.primary.main, 1)
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
							color={
								paidBy === "receiver" &&
								theme.palette.neutral[100]
							}
						>
							{/* <CustomImageContainer
								src={receiverImage.src}
								height="30px"
								width="30px"
								objectfit="contain"
							/> */}
							<Typography align="center">{t("Receiver")}</Typography>
						</Stack>
					</Stack>
				)}
			</CustomStackFullWidth>
		</CustomStackFullWidth>
	);
};

export default ChangePayBy;
