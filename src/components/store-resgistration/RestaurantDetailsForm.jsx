import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { alpha, Grid, InputAdornment, useTheme } from "@mui/material";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";
import WorkIcon from "@mui/icons-material/Work";
import RoomIcon from "@mui/icons-material/Room";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import PaidIcon from "@mui/icons-material/Paid";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LangTab from "components/store-resgistration/LanTab";
import { useSelector } from "react-redux";
import CustomMultiSelect from "components/custom-multi-select/CustomMultiSelect";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export const checkTaxiModule = (value,moduleOption) => {
	const moduleObj = moduleOption?.find(item => item.value === value);
	return moduleObj?.type === "rental";
	}
const RestaurantDetailsForm = ({
  RestaurantJoinFormik,
  restaurantNameHandler,
  restaurantAddressHandler,
  restaurantvatHandler,
  zoneOption,
  zoneHandler,
  moduleHandler,
  moduleOption,
  handleTimeTypeChangeHandler,
  currentTab,
  handleCurrentTab,
  tabs,
  selectedLanguage,
  minDeliveryTimeHandler,
  maxDeliveryTimeHandler,
  pickupZoneHandler,
}) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const [address, setAddress] = React.useState("");
	const timeType = [
		{ label: "Minute", value: "minute" },
		{ label: "Hour", value: "hour" },
		{ label: "Day", value: "day" },
	];
	useEffect(() => {
		setAddress(
			RestaurantJoinFormik.values.restaurant_address[selectedLanguage]
		);
	}, [RestaurantJoinFormik.values.restaurant_address[selectedLanguage]]);
	const { selectedModule } = useSelector((state) => state.utilsData);
	const [moduleType, SetModuleType] = useState("");
	useEffect(() => {
		SetModuleType(selectedModule?.module_type);
	}, [selectedModule]);



	return (
		<CustomStackFullWidth
			alignItems="center"
			key={address || selectedLanguage}
		>
			<Grid container spacing={{ xs: "0", md: "3" }}>
				<CustomStackFullWidth spacing={4}>
					<CustomStackFullWidth
						sx={{
							padding: { xs: "0px", md: "20px" },
							borderRadius: "10px",
							gap: "20px",
							backgroundColor: (theme) =>
								theme.palette.background.default,
						}}
					>
						<LangTab
							tabs={tabs}
							currentTab={currentTab}
							setCurrentTab={handleCurrentTab}
							fontSize=""
						/>
						<Grid item xs={12}>
							<CustomTextFieldWithFormik
							   labelColor={alpha(theme.palette.neutral[1000],0.8)}
								backgroundColor
								required="true"
								type="text"
								label={t("Vendor Name")}
								placeholder={t("Vendor name")}
								value={
									RestaurantJoinFormik.values.restaurant_name[
										selectedLanguage
									]
								}
								touched={
									RestaurantJoinFormik.touched.restaurant_name
								}
								errors={
									RestaurantJoinFormik.errors.restaurant_name
								}
								onChangeHandler={restaurantNameHandler}
								fontSize="12px"
								startIcon={
									<InputAdornment position="start">
										<WorkIcon
											sx={{
												color:
													RestaurantJoinFormik.touched
														.restaurant_name &&
													!RestaurantJoinFormik.errors
														.restaurant_name
														? theme.palette.primary
																.main
														: theme.palette
																.neutral[400],
												fontSize: "18px",
											}}
										/>
									</InputAdornment>
								}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<CustomTextFieldWithFormik
							labelColor={alpha(theme.palette.neutral[1000],0.8)}
								backgroundColor
								placeholder={t("Vendor address")}
								required="true"
								type="text"
								label={t("Vendor Address")}
								touched={
									RestaurantJoinFormik.touched
										.restaurant_address
								}
								errors={
									RestaurantJoinFormik.errors
										.restaurant_address
								}
								value={
									RestaurantJoinFormik.values
										.restaurant_address[selectedLanguage]
								} // Use the selected language value
								onChangeHandler={restaurantAddressHandler}
								fontSize="12px"
								startIcon={
									<InputAdornment position="start">
										<RoomIcon
											sx={{
												color:
													RestaurantJoinFormik.touched
														.restaurant_address &&
													!RestaurantJoinFormik.errors
														.restaurant_address
														? theme.palette.primary
																.main
														: alpha(
																theme.palette
																	.neutral[400],
																0.7
														  ),
												fontSize: "18px",
											}}
										/>
									</InputAdornment>
								}
							/>
						</Grid>
					</CustomStackFullWidth>

					<CustomStackFullWidth gap={{ xs: "20px", md: "30px" }}>
						<Grid item xs={12} sm={12} md={12}>
							<CustomSelectWithFormik
							labelColor={alpha(theme.palette.neutral[1000],0.8)}
								selectFieldData={zoneOption}
								inputLabel={t("Business Zone")}
								passSelectedValue={zoneHandler}
								touched={RestaurantJoinFormik.touched.zoneId}
								errors={RestaurantJoinFormik.errors.zoneId}
								fieldProps={RestaurantJoinFormik.getFieldProps(
									"zoneId"
								)}
								startIcon={
									<RoomIcon
										sx={{
											color:
												RestaurantJoinFormik.touched
													.zoneId &&
												!RestaurantJoinFormik.errors
													.zoneId
													? theme.palette.primary.main
													: alpha(
															theme.palette
																.neutral[400],
															0.7
													  ),
											fontSize: "18px",
										}}
									/>
								}
							/>
						</Grid>
						
						{RestaurantJoinFormik.values.zoneId && (
							<Grid item xs={12} sm={12} md={12}>
								<CustomSelectWithFormik
								labelColor={alpha(theme.palette.neutral[1000],0.8)}
									selectFieldData={moduleOption}
									inputLabel={t("Business Module")}
									passSelectedValue={moduleHandler}
									touched={
										RestaurantJoinFormik.touched.module_id
									}
									errors={
										RestaurantJoinFormik.errors.module_id
									}
									fieldProps={RestaurantJoinFormik.getFieldProps(
										"module_id"
									)}
									
									startIcon={
										<RoomIcon
											sx={{
												color:
													RestaurantJoinFormik.touched
														.module_id &&
													!RestaurantJoinFormik.errors
														.module_id
														? theme.palette.primary
																.main
														: alpha(
																theme.palette
																	.neutral[400],
																0.7
														  ),
												fontSize: "18px",
											}}
										/>
									}
								/>
							</Grid>
						)}
						{ checkTaxiModule(RestaurantJoinFormik?.values?.module_id,moduleOption) && (
							<Grid item xs={12} sm={12} md={12}>
								<CustomMultiSelect
									zoneOption={zoneOption}
									label="Pickup Area"
									placeholder={RestaurantJoinFormik.values.pickup_zone_id.length < 1
										? "Select Pickup Area"
										: ""}
									handleChange={pickupZoneHandler}
									icon={
										<LocationOnIcon
											sx={{
												color:
													RestaurantJoinFormik.touched
														.restaurant_name &&
													!RestaurantJoinFormik.errors
														.restaurant_name
														? theme.palette.primary
																.main
														: alpha(
																theme.palette
																	.neutral[400],
																0.7
														  ),
												fontSize: "16px",
											}}
										/>
									}
								/>
							</Grid>
						)}
  
						{/*<Grid item xs={12} sm={12} md={12}>*/}
						{/*	<CustomTextFieldWithFormik*/}
						{/*	labelColor={alpha(theme.palette.neutral[1000],0.8)}*/}
						{/*		required="true"*/}
						{/*		type="number"*/}
						{/*		label={t("VAT/TAX")}*/}
						{/*		placeholder={t("VAT/TAX")}*/}
						{/*		maxLength={100} // HTML attribute to limit input*/}
						{/*		touched={RestaurantJoinFormik.touched.vat}*/}
						{/*		errors={RestaurantJoinFormik.errors.vat}*/}
						{/*		fieldProps={RestaurantJoinFormik.getFieldProps(*/}
						{/*			"vat"*/}
						{/*		)}*/}
						{/*		onChangeHandler={restaurantNameHandler}*/}
						{/*		value={RestaurantJoinFormik.values.vat}*/}
						{/*		fontSize="12px"*/}
						{/*		startIcon={*/}
						{/*			<InputAdornment position="start">*/}
						{/*				<PaidIcon*/}
						{/*					sx={{*/}
						{/*						color:*/}
						{/*							RestaurantJoinFormik.touched*/}
						{/*								.vat &&*/}
						{/*							!RestaurantJoinFormik.errors*/}
						{/*								.vat*/}
						{/*								? theme.palette.primary*/}
						{/*										.main*/}
						{/*								: alpha(*/}
						{/*										theme.palette*/}
						{/*											.neutral[400],*/}
						{/*										0.7*/}
						{/*								  ),*/}
						{/*						fontSize: "18px",*/}
						{/*					}}*/}
						{/*				/>*/}
						{/*			</InputAdornment>*/}
						{/*		}*/}
						{/*	/>*/}
						{/*</Grid>*/}
						<Grid
							item
							container
							xs={12}
							sm={12}
							md={12}
							spacing={2}
						>
							<Grid item md={4} xs={12}>
								<CustomTextFieldWithFormik
								labelColor={alpha(theme.palette.neutral[1000],0.8)}
									placeholder={checkTaxiModule(RestaurantJoinFormik?.values?.module_id,moduleOption)?t("Min Pickup Time"):t("Min Delivery Time")}
									required="true"
									type="number"
									name="min_delivery_time"
									label={checkTaxiModule(RestaurantJoinFormik?.values?.module_id,moduleOption)?t("Minimum Pickup Time"):t("Minimum Delivery Time")}
									touched={
										RestaurantJoinFormik.touched
											.min_delivery_time
									}
									errors={
										RestaurantJoinFormik.errors
											.min_delivery_time
									}
									fieldProps={RestaurantJoinFormik.getFieldProps(
										"min_delivery_time"
									)}
									onChangeHandler={minDeliveryTimeHandler}
									value={
										RestaurantJoinFormik.values
											.min_delivery_time
									}
									fontSize="12px"
									startIcon={
										<InputAdornment position="start">
											<LocalShippingIcon
												sx={{
													color:
														RestaurantJoinFormik
															.touched
															.min_delivery_time &&
														!RestaurantJoinFormik
															.errors
															.min_delivery_time
															? theme.palette
																	.primary
																	.main
															: alpha(
																	theme
																		.palette
																		.neutral[400],
																	0.7
															  ),
													fontSize: "18px",
												}}
											/>
										</InputAdornment>
									}
								/>
							</Grid>
							<Grid item md={4} xs={12}>
								<CustomTextFieldWithFormik
								labelColor={alpha(theme.palette.neutral[1000],0.8)}
									placeholder={checkTaxiModule(RestaurantJoinFormik?.values?.module_id,moduleOption)?t("Max Pickup Time"):t("Max Delivery Time")}
									required="true"
									type="number"
									name="max_delivery_time"
									label={checkTaxiModule(RestaurantJoinFormik?.values?.module_id,moduleOption)?t("Maximum Pickup Time"):t("Maximum Delivery Time")}
									touched={
										RestaurantJoinFormik.touched
											.max_delivery_time
									}
									errors={
										RestaurantJoinFormik.errors
											.max_delivery_time
									}
									fieldProps={RestaurantJoinFormik.getFieldProps(
										"max_delivery_time"
									)}
									onChangeHandler={maxDeliveryTimeHandler}
									value={
										RestaurantJoinFormik.values
											.max_delivery_time
									}
									fontSize="12px"
									startIcon={
										<InputAdornment position="start">
											<LocalShippingIcon
												sx={{
													color:
														RestaurantJoinFormik
															.touched
															.max_delivery_time &&
														!RestaurantJoinFormik
															.errors
															.max_delivery_time
															? theme.palette
																	.primary
																	.main
															: alpha(
																	theme
																		.palette
																		.neutral[400],
																	0.7
															  ),
													fontSize: "18px",
												}}
											/>
										</InputAdornment>
									}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={4}>
								<CustomSelectWithFormik
								labelColor={alpha(theme.palette.neutral[1000],0.8)}
									selectFieldData={timeType}
									inputLabel={t("Duration type")}
									passSelectedValue={
										handleTimeTypeChangeHandler
									}
									touched={
										RestaurantJoinFormik.touched
											.delivery_time_type
									}
									errors={
										RestaurantJoinFormik.errors
											.delivery_time_type
									}
									fieldProps={RestaurantJoinFormik.getFieldProps(
										"delivery_time_type"
									)}
								/>
							</Grid>
						</Grid>
					</CustomStackFullWidth>
				</CustomStackFullWidth>
			</Grid>
		</CustomStackFullWidth>
	);
};
export default RestaurantDetailsForm;
