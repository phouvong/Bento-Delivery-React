import React from "react";
import {
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	Paper,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IsSmallScreen } from "utils/CommonValues";
import CustomPopover from "../../CustomPopover";
import {
	CustomBoxFullWidth,
	CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomSlider from "../../search/CustomSlider";
import CustomRatings from "../../search/CustomRatings";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const Filter = (props) => {
	const { border, priceRange, filterDataAndFunctions, minMax, setMinMax } =
		props;
	const {
		filterData,
		handleCheckbox,
		handleChangeRatings,
		getRatingValue,
		currentTab,
	} = filterDataAndFunctions;
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const { t } = useTranslation();
	const handleMinMax = (value) => {
		setMinMax(value);
	};
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	// Split the array into two halves.
	const dataWithoutPrice = filterData?.filter(
		(item) =>
			item?.value !== "price" &&
			item?.value !== "ratings" &&
			item?.value !== "coupon" &&
			item?.value !== "free_delivery"
	);
	const midpoint = Math.ceil(dataWithoutPrice.length / 2);
	const firstHalf = dataWithoutPrice.slice(0, midpoint + 1);
	const secondHalf = dataWithoutPrice.slice(midpoint + 1);
	const offerFilterData = filterData?.filter(
		(item) =>
			item?.value === "coupon" ||
			item?.value === "free_delivery" ||
			(item?.value === "fast_delivery" && currentTab === 1)
	);

	return (
		<div>
			<Button
				onClick={handleClick}
				variant={border ? "outlined" : "text"}
				sx={{
					color: (theme) => theme.palette.customColor.textGray,
					borderColor: (theme) => theme.palette.customColor.textGray,
				}}
			>
				<FilterAltOutlinedIcon fontSize="small" />
				{IsSmallScreen() ? null : (
					<>
						<Typography>{t("Filter")}</Typography>
						{open ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon />
						)}
					</>
				)}
			</Button>
			{open && (
				<CustomPopover
					openPopover={open}
					anchorEl={anchorEl}
					placement="bottom"
					handleClose={() => setAnchorEl(null)}
					top="10px"
					left="-230px"
				>
					<Paper
						sx={{
							p: "25px",
							width: "355px",
						}}
					>
						<CustomBoxFullWidth>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Typography fontWeight="bold">
										{t("Filter By")}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									{filterData?.length > 0 &&
										firstHalf?.map((item, index) => {
											if (
												(currentTab === 0 &&
													item?.value ===
													"currently_open") ||
												(currentTab === 0 &&
													item?.value === "nearby")
											) {
												return null;
											} else {
												return (
													<FormControlLabel
														sx={{
															"& .MuiFormControlLabel-label":
															{
																fontSize:
																	"13px",
																fontWeight:
																	item?.checked &&
																	"450",
															},
														}}
														key={index}
														control={
															<Checkbox
																checked={
																	item?.checked
																}
																onChange={(e) =>
																	handleCheckbox(
																		item,
																		e
																	)
																}
																name={
																	item?.label
																}
															/>
														}
														label={item?.label}
													/>
												);
											}
										})}
								</Grid>
								<Grid item xs={6}>
									{filterData?.length > 0 &&
										secondHalf?.map((item, index) => {
											if (
												((currentTab === 0 &&
													item?.value ===
													"currently_open") ||
												item?.value === "coupon" ||
												item?.value ===
												"free_delivery" ||
												item?.value === "fast_delivery" ) || (currentTab===1 && item?.value==="available_now" || getCurrentModuleType()!=="food" )
											) {
												return null;
											} else {
												return (
													<FormControlLabel
														sx={{
															"& .MuiFormControlLabel-label":
															{
																fontSize:
																	"13px",
																fontWeight:
																	item?.checked &&
																	"420",
															},
														}}
														key={index}
														control={
															<Checkbox
																checked={
																	item?.checked
																}
																onChange={(e) =>
																	handleCheckbox(
																		item,
																		e
																	)
																}
																name={
																	item?.label
																}
															/>
														}
														label={item?.label}
													/>
												);
											}
										})}
								</Grid>
								{currentTab !== 0 && (
									<>
										<Grid item xs={12}>
											<Typography fontWeight="bold">
												{t("Offers")}
											</Typography>
										</Grid>
										<Grid item xs={12}>
											{filterData?.length > 0 &&
												offerFilterData?.map(
													(item, index) => {
														if (
															(currentTab === 0 &&
																item?.value ===
																"currently_open") ||
															(currentTab === 0 &&
																item?.value ===
																"nearby") ||
															(currentTab === 0 &&
																item?.value ===
																"coupon") ||
															(currentTab === 0 &&
																item?.value ===
																"free_delivery")
														) {
															return null;
														} else {
															return (
																<FormControlLabel
																	sx={{
																		"& .MuiFormControlLabel-label":
																		{
																			fontSize:
																				"13px",
																			fontWeight:
																				item?.checked &&
																				"450",
																		},
																	}}
																	key={index}
																	control={
																		<Checkbox
																			checked={
																				item?.checked
																			}
																			onChange={(
																				e
																			) =>
																				handleCheckbox(
																					item,
																					e
																				)
																			}
																			name={
																				item?.label
																			}
																		/>
																	}
																	label={
																		item?.label
																	}
																/>
															);
														}
													}
												)}
										</Grid>

									</>
								)}
								{currentTab === 0 ? (
									<Grid item xs={12}>
										<CustomStackFullWidth spacing={1}>
											<Typography fontWeight="bold">
												{t("Price")}
											</Typography>
											<CustomSlider
												handleChangePrice={handleMinMax}
												minMax={minMax}
												priceFilterRange={minMax}
											/>
										</CustomStackFullWidth>
									</Grid>
								) : null}

								<Grid item xs={12}>
									<CustomStackFullWidth
										spacing={1}
										alignItems="center"
										justifyContent="center"
									>
										<Typography fontWeight="bold">
											{t("Ratings")}
										</Typography>
										<CustomRatings
											ratingValue={getRatingValue}
											fontSize="20px"
											handleChangeRatings={
												handleChangeRatings
											}
										// readOnly
										/>
									</CustomStackFullWidth>
								</Grid>
							</Grid>
						</CustomBoxFullWidth>
					</Paper>
				</CustomPopover>
			)}
		</div>
	);
};

Filter.propTypes = {};

export default Filter;
