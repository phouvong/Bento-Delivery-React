import React from "react";
import { Stack } from "@mui/system";
import { Typography, useTheme } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import RoomIcon from "@mui/icons-material/Room";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

const DeliveryInfoCard = ({
	title,
	name,
	phone,
	address,
	houseNumber,
	floor,
	roadNumber,
	email,
}) => {
	const theme = useTheme();
	return (
		<CustomStackFullWidth spacing={0.5}>
			<Stack width="100%">
				<Typography fontWeight="500" fontSize="16px">{title}</Typography>
			</Stack>
			<Stack
				width="100%"
				padding=".9rem"
				backgroundColor={theme.palette.background.paper}
				borderRadius="7px"
				spacing={0.75}
			>
				<Stack direction="row" spacing={1.3} alignItems="center">
					<PersonIcon
						sx={{
							width: "15px",
							height: "15px",
						}}
					/>
					<Typography
						fontSize="12px"
						color={theme.palette.neutral[500]}
					>
						{name}
					</Typography>
				</Stack>
				<Stack direction="row" spacing={1.3} alignItems="center">
					<LocalPhoneIcon
						sx={{
							width: "15px",
							height: "15px",
						}}
					/>
					<Typography
						fontSize="12px"
						color={theme.palette.neutral[500]}
					>
						{phone}
					</Typography>
				</Stack>
				<Stack direction="row" spacing={1.3} alignItems="center">
					<EmailIcon
						sx={{
							width: "15px",
							height: "15px",
						}}
					/>
					<Typography
						fontSize="12px"
						color={theme.palette.neutral[500]}
					>
						{email}
					</Typography>
				</Stack>
				<Stack direction="row" spacing={1.3} alignItems="center">
					<RoomIcon
						sx={{
							width: "15px",
							height: "15px",
						}}
					/>
					<Typography
						fontSize="12px"
						color={theme.palette.neutral[500]}
					>
						{address}
					</Typography>
				</Stack>
				<Typography
					fontSize="12px"
					color={theme.palette.neutral[500]}
					sx={{
						display: "flex",
						gap: ".5rem",
						flexWrap: "wrap",
						alignItems: "center",
						marginTop: ".5rem !important"
					}}
				>
					<Typography component="span">{roadNumber && `Road: ${roadNumber} `}</Typography>
					{houseNumber && <Typography component="span" color={theme.palette.neutral[400]}>|</Typography>}
					<Typography component="span">{houseNumber && `House: ${houseNumber} `}</Typography>
					{floor && <Typography component="span" color={theme.palette.neutral[400]}>|</Typography>}
					<Typography component="span">{floor && `Floor: ${floor}`}</Typography>
				</Typography>
			</Stack>
		</CustomStackFullWidth>
	);
};

export default DeliveryInfoCard;
