import {
	Box,
	NoSsr,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { CustomStackForLoaction } from "../NavBar.style";
import ThemeSwitches from "./ThemeSwitches";
import AddressReselect from "./address-reselect/AddressReselect";
import CustomLanguage from "./language/CustomLanguage";

import { useSelector } from "react-redux";
import CallToAdmin from "../../CallToAdmin";
import CustomContainer from "../../container";
import LogoSide from "../../logo/LogoSide";
import DrawerMenu from "./drawer-menu/DrawerMenu";

export const AddressTypographyGray = styled(Typography)(({ theme }) => ({
	color: theme.palette.neutral[1000],
	fontSize: "13px",
	overflow: "hidden",
	textOverflow: "ellipsis",
	display: "-webkit-box",
	WebkitLineClamp: "1",
	WebkitBoxOrient: "vertical",
}));

const TopNavBar = () => {
	const { configData, countryCode, language } = useSelector(
		(state) => state.configData
	);
	const [tempLocation, setTempLocation] = useState(() => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("location");
	});
	const [openDrawer, setOpenDrawer] = useState(false);
	const isSmall = useMediaQuery("(max-width:1180px)");

	useEffect(() => {
		if (typeof window === "undefined") return;

		const readLocation = () => localStorage.getItem("location");
		let prevLocation = readLocation();

		const syncLocation = () => {
			const nextLocation = readLocation();
			if (nextLocation !== prevLocation) {
				prevLocation = nextLocation;
				setTempLocation(nextLocation);
			}
		};

		setTempLocation(prevLocation);
		window.addEventListener("storage", syncLocation);
		window.addEventListener("focus", syncLocation);
		const intervalId = window.setInterval(syncLocation, 1000);

		return () => {
			window.removeEventListener("storage", syncLocation);
			window.removeEventListener("focus", syncLocation);
			window.clearInterval(intervalId);
		};
	}, []);

	return (
		<>
			<NoSsr>
				<Box
					sx={{
						width: "100%",
						background: (theme) => theme.palette.neutral[100],
					}}
				>
					{!isSmall && (
						<CustomContainer>
							<Box
								sx={{
									display: isSmall ? "none" : "block",
									borderRadius: "0",
								}}
							>
								<Stack
									pt=".4rem"
									pb=".4rem"
									width="100%"
									height="30px"
									direction="row"
									justifyContent="space-between"
								>
									<CustomStackForLoaction direction="row">
										
									<AddressReselect
												setOpenDrawer={setOpenDrawer}
												location={tempLocation}
											/>
									</CustomStackForLoaction>
									<Stack
										direction="row"
										spacing={2}
										justifyContent="end"
										alignItems="center"
									>
										<ThemeSwitches />
										{configData?.phone && (<CallToAdmin configData={configData} />)}

										<CustomLanguage
											countryCode={countryCode}
											language={language}
										/>

										</Stack>
									</Stack>
								</Box>
								{!tempLocation && (
									<Box
										sx={{
											display: {
												xs: "flex",
											md: "none",
											alignItems: "center",
											gap: "10px",
											flexDirection: "row",
											justifyContent: " space-between ",
										},
										flexGrow: 1,
									}}
								>
									<Stack
										alignItems="center"
										justifyContent="flex-start"
									>
										<LogoSide
											width="126px"
											configData={configData}
										/>
									</Stack>
									<Stack>
										<DrawerMenu
											openDrawer={openDrawer}
											setOpenDrawer={setOpenDrawer}
										/>
									</Stack>
								</Box>
							)}
						</CustomContainer>
					)}
				</Box>
			</NoSsr>
		</>
	);
};

export default TopNavBar;
