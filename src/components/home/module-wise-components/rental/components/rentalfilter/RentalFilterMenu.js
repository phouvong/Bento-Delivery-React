import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	CustomBoxFullWidth,
	CustomTextField,
} from "styled-components/CustomStyles.style";
import {
	Button,
	InputAdornment,
	styled,
	useMediaQuery,
	useTheme,
} from "@mui/material";

import { alpha, Box } from "@mui/system";
import WindowIcon from "@mui/icons-material/Window";

import ViewListIcon from "@mui/icons-material/ViewList";
import Body2 from "components/typographies/Body2";
import RentalCarHighToLow from "./RentalCarHighToLow";
import H1 from "components/typographies/H1";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { t } from "i18next";
import { useRouter } from "next/router";

const ViewWrapper = styled(Box)(({ theme, active }) => ({
	display: "flex",
	direction: "row",
	alignItems: "center",
	justifyContent: "center",
	height: "100%",
	gap: "5px",
	cursor: "pointer",

	color:
		active === "true"
			? theme.palette.primary.main
			: theme.palette.neutral[500],
}));

const RentalFilterMenu = (props) => {
	const {
		currentView,
		setCurrentView,
		setSideDrawerOpen,
		setSearchKey,
		setSortBy,
		sortBy,
	} = props;
	const router = useRouter();
	const topRated = router?.query?.top_rated;
	const total = 1000;
	const [showView, setShowView] = useState(true);
	const theme = useTheme();
	const isSmallSize = useMediaQuery(theme.breakpoints.down("sm"));
	
	const debounceTimeout = useRef(null);
	const handleSearch = (value) => {
		setSearchKey(value);
	};

	const debounce = (callback, delay) => {
		return (value) => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
			debounceTimeout.current = setTimeout(() => {
				callback(value);
			}, delay);
		};
	};

	const debouncedSearch = debounce(handleSearch, 300);
	const handleChange = (e) => {
		const value = e.target.value;
		debouncedSearch(value);
	};

	const handleSortBy = (value) => {
		setSortBy(value);
	};

	return (
		<CustomBoxFullWidth
			sx={{
				marginBottom: "30px",
				background: (theme) => theme.palette.background.default,
				borderBottom: (theme) =>
					`1px solid ${theme.palette.neutral[200]}`,
				py: "20px",
			}}
		>
			<Box
				sx={{
					display: { xs: "flex", md: "none" },
					justifyContent: "space-between",
					alignItems: "center",
					gap: "10px",
					mb: "20px",
				}}
			>
				<Box sx={{ flex: 1 }}>
					<CustomTextField
						sx={{
							width: "100%",

							"& .MuiInputBase-input": {
								padding: "10px 0px",
								"& .MuiOutlinedInput-input": {
									padding: "4px 0px",
									borderRadius: "5px",
								},
							},
						}}
						placeholder={t("Search for items...")}
						onChange={handleChange}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon
										sx={{
											color: "primary.main",
											fontSize: "18px",
										}}
									/>
								</InputAdornment>
							),
						}}
					/>
				</Box>
				<Box>
					<Button
						onClick={() => setSideDrawerOpen(true)}
						variant="outlined"
						sx={{ px: "0px" }}
					>
						<FilterListIcon />
					</Button>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexWrap: "wrap",
					gap: "10px",
				}}
			>
				<H1
					textTransform="capitalize"
					textAlign="start"
					text={topRated ? "Top Rated Vehicles" : "All Vehicles"}
				/>
				<Box
					sx={{ display: "flex", justifyContent: "end", gap: "24px" }}
				>
					<Box>
						{showView ? (
							<ViewWrapper
								active={currentView === 0 ? "true" : "false"}
								
								onClick={() => setCurrentView(0)}
							>
								<WindowIcon />
								{isSmallSize ? null : (
									<Body2 text="Grid view" />
								)}
							</ViewWrapper>
						) : null}
					</Box>
					<Box>
						{showView ? (
							<ViewWrapper
								active={currentView === 1 ? "true" : "false"}
								onClick={() => setCurrentView(1)}
						
							>
								<ViewListIcon sx={{ fontSize: "30px" }} />
								{isSmallSize ? null : (
									<Body2 text="List view" />
								)}
							</ViewWrapper>
						) : null}
					</Box>
					<Box sx={{ display: { xs: "none", md: "block" } }}>
						<CustomTextField
							sx={{
								width: { xs: "100%", lg: "40ch" },

								"& .MuiInputBase-input": {
									padding: "10px 0px",
									"& .MuiOutlinedInput-input": {
										padding: "4px 0px",
										borderRadius: "5px",
									},
								},
							}}
							onChange={handleChange}
							placeholder={t("Search vehicles...")}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon
											sx={{
												color: "primary.main",
												fontSize: "18px",
											}}
										/>
									</InputAdornment>
								),
							}}
						/>
					</Box>
					{isSmallSize ? null : ( // </Box> // 	<SortIcon /> // > // 	}} // 		justifyContent: "center", // 		alignItems: "center", // 		display: "flex", // 	sx={{ // <Box
						<Box>
							{showView ? (
								<RentalCarHighToLow
									handleSortBy={handleSortBy}
									sortBy={sortBy}
								/>
							) : null}
						</Box>
					)}
				</Box>
			</Box>
		</CustomBoxFullWidth>
	);
};

export default RentalFilterMenu;
