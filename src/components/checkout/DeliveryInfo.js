import React, { useState } from "react";
import {
	alpha,
	Checkbox,
	FormControlLabel,
	Grid,
	IconButton,
	InputAdornment,
	Stack,
	Typography,
	useTheme,
	Card,
	Modal,
	Box,
} from "@mui/material";
import {
	CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";

import DeliveryInfoCard from "./DeliveryInfoCard";
import CustomImageContainer from "../CustomImageContainer";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../modal";
import CloseIcon from "@mui/icons-material/Close";
import DeliveryInstruction from "./DeliveryInstruction";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { getToken } from "helper-functions/getToken";
import { useSelector } from "react-redux";

import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeliveryFree from "./DeliveryFree";
import DeliveryManTip from "./DeliveryManTip";
import ChangePayBy from "./ChangePayBy";
import PaymentMethod from "./PaymentMethod";
import PaymentsIcon from "@mui/icons-material/Payments";
import Image from "next/image";

const DeliveryInfo = ({
	configData,
	deliveryInstruction,
	customerInstruction,
	setCustomerInstruction,
	setCheck,
	check,
	formik,
	confirmPasswordHandler,
	passwordHandler,
	data,
	parcelDeliveryFree,
	senderLocation,
	receiverLocation,
	extraChargeLoading,
	deliveryTip,
	setDeliveryTip,
	paidBy,
	setPaidBy,
	zoneData,
	setPaymentMethod,
	paymentMethod,
	isLoading,
	orderPlace,
	storeZoneId,
	currentZoneId,
	offlinePaymentOptions,
	getParcelPayment,
	selectedPaymentMethod,
	setSelectedPaymentMethod,
}) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [openModal, setOpenModal] = useState(false);
	const [customNote, setCustomNote] = useState("");
	const [openPaymentModal, setOpenPaymentModal] = useState(false);
	const [paymentMethodImage, setPaymentMethodImage] = useState("");
	const [switchToWallet, setSwitchToWallet] = useState(false);
	const [payableAmount, setPayableAmount] = useState(null);
	const [changeAmount, setChangeAmount] = useState();
	const token = getToken();
	const { parcelInfo } = useSelector((state) => state.parcelInfoData);
	const handleClick = () => {
		setOpenModal(!openModal);
	};
	const handleRemoveInstruction = () => {
		setCustomerInstruction(null);
		setSelectedInstruction(null);
		// setCustomNote("");
	};
	const handleRemoveInstructionDes = () => {
		setCustomNote("");
	};
	const handleCheckbox = (e) => {
		setCheck(e.target.checked);
	};
	console.log({ zoneData })
	const handlePartialPayment = () => {
		return;
		// if (payableAmount > customerData?.data?.wallet_balance) {
		// 	setUsePartialPayment(true);
		// 	setPaymentMethod("");
		// 	dispatch(setOfflineMethod(""));
		// } else {
		// 	setPaymentMethod("wallet");
		// 	setSwitchToWallet(true);
		// 	dispatch(setOfflineMethod(""));
		// }
	};

	const removePartialPayment = () => {
		return;
		// if (payableAmount > customerData?.data?.wallet_balance) {
		// 	setUsePartialPayment(false);
		// 	setPaymentMethod("");
		// 	dispatch(setOfflineMethod(""));
		// } else {
		// 	setPaymentMethod("");
		// 	setSwitchToWallet(false);
		// 	dispatch(setOfflineMethod(""));
		// }
	};

	const modalStyle = {
		position: 'absolute',
		top: { xs: "20px", md: "50%" },
		left: '50%',
		transform: { xs: "translateX(-50%) translateY(0)", md: "translateX(-50%) translateY(-50%)" },
		maxWidth: "650px",
		width: { xs: "95%", md: "70%" },
		bgcolor: 'background.paper',
		border: '1px solid #fff',
		boxShadow: 24,
		p: 4,
		borderRadius: "10px",
		maxHeight: { xs: "80vh", md: "90vh" },
		overflowY: "auto",
		outline: "none"
	};

	return (
		<Card sx={{ padding: "1.2rem", backgroundColor: theme.palette.background.custom, border: `1px solid rgba(0, 0, 0, 0.05)`, height: "100%", width: "100%" }}>
			<Typography fontWeight={500} fontSize="16px" mb={2}>
				{t("Delivery Information")}
			</Typography>

			<Stack spacing={3}>
				<Stack direction="row" flexWrap={{ xs: "wrap", md: "nowrap" }} gap={3} width="100%">
					<Stack flexGrow={1} flexBasis={{ xs: "100%", md: "50%" }}>
						<Stack
							padding="1.3rem"
							backgroundColor={theme.palette.background.paper}
							borderRadius=".5rem"
							spacing={2}
							direction="row"
							alignItems="center"
						>
							<CustomImageContainer
								width="50px"
								height="50px"
								src={parcelInfo?.image}
								objectfit="contain"
							/>
							<Stack>
								<Typography
									fontSize={{
										xs: "14px",
										sm: "16px",
										md: "16px",
									}}
									fontWeight="500"
								>
									{parcelInfo?.name}
								</Typography>
								<Typography
									color={theme.palette.neutral[500]}
									fontSize="12px"
								>
									{parcelInfo?.description}
								</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Stack flexGrow={1} flexBasis={{ xs: "100%", md: "50%" }}>
						<DeliveryFree
							data={data}
							parcelDeliveryFree={parcelDeliveryFree}
							senderLocation={senderLocation}
							receiverLocation={receiverLocation}
							configData={configData}
							extraChargeLoading={extraChargeLoading}
						/>
					</Stack>
				</Stack>

				<Stack direction="row" flexWrap={{ xs: "wrap", md: "nowrap" }} gap={3} width="100%">
					<Stack flexGrow={1} flexBasis={{ xs: "100%", md: "50%" }}>
						<DeliveryInfoCard
							title={t("Sender Info")}
							phone={
								token
									? parcelInfo?.senderPhone
									: `+ ${parcelInfo?.senderPhone}`
							}
							name={parcelInfo?.senderName}
							address={parcelInfo?.senderAddress}
							houseNumber={parcelInfo?.senderFloor}
							floor={parcelInfo?.senderFloor}
							roadNumber={parcelInfo?.senderRoad}
							email={parcelInfo?.senderEmail}
						/>
					</Stack>
					<Stack flexGrow={1} flexBasis={{ xs: "100%", md: "50%" }}>
						<DeliveryInfoCard
							title={t("Receiver Info")}
							phone={`+ ${parcelInfo?.receiverPhone}`}
							name={parcelInfo?.receiverName}
							address={parcelInfo?.receiverAddress}
							houseNumber={parcelInfo?.house}
							floor={parcelInfo?.floor}
							roadNumber={parcelInfo?.road}
							email={parcelInfo?.receiverEmail}
						/>
					</Stack>
				</Stack>


				{!getToken() && (
					<Stack
						sx={{
							backgroundColor: theme.palette.background.paper,
							borderRadius: ".5rem",
							padding: "1rem",
						}}
					>
						<Stack>
							<Stack>
								<FormControlLabel
									onChange={(e) => handleCheckbox(e)}
									control={<Checkbox />}
									label={
										<Typography
											fontWeight="500"
											fontSize="14px"
										>
											{t("Create account with sender info")}.
										</Typography>
									}
								/>
							</Stack>
							{check && (
								<Grid container spacing={3} pt="20px">
									<Grid item xs={12} sm={6}>
										<CustomTextFieldWithFormik
											required="true"
											type="password"
											label={t("Password")}
											placeholder={t("Password")}
											touched={formik.touched.password}
											errors={formik.errors.password}
											fieldProps={formik.getFieldProps(
												"password"
											)}
											onChangeHandler={passwordHandler}
											value={formik.values.password}
											startIcon={
												<InputAdornment position="start">
													<LockIcon
														sx={{
															color: (theme) =>
																theme.palette
																	.neutral[400],
														}}
													/>
												</InputAdornment>
											}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<CustomTextFieldWithFormik
											label={t("Confirm Password")}
											required="true"
											type="password"
											placeholder={t("Confirm Password")}
											touched={
												formik.touched.confirm_password
											}
											errors={formik.errors.confirm_password}
											fieldProps={formik.getFieldProps(
												"confirm_password"
											)}
											onChangeHandler={confirmPasswordHandler}
											value={formik.values.confirm_password}
											startIcon={
												<InputAdornment position="start">
													<LockIcon
														sx={{
															color: (theme) =>
																theme.palette
																	.neutral[400],
														}}
													/>
												</InputAdornment>
											}
										/>
									</Grid>
								</Grid>
							)}
						</Stack>
					</Stack>
				)}

				<DeliveryManTip
					parcel="true"
					deliveryTip={deliveryTip}
					setDeliveryTip={setDeliveryTip}
				/>

				<Stack>
					<Typography fontWeight="500" fontSize="16px" mb={1}>
						{t("Charge Paid By")}
					</Typography>
					<Stack sx={{ padding: "1.2rem", backgroundColor: theme.palette.background.paper, borderRadius: ".5rem" }}>
						<Stack direction="row" flexWrap={{ xs: "wrap", md: "nowrap" }} alignItems="center" gap={3} width="100%">
							<Stack flexGrow={1} flexBasis={{ xs: "100%", md: "50%" }}>
								<ChangePayBy
									paidBy={paidBy}
									setPaidBy={setPaidBy}
									zoneData={zoneData}
									setPaymentMethod={setPaymentMethod}
									setSelectedPaymentMethod={setSelectedPaymentMethod}
								/>
							</Stack>
							<Stack flexGrow={1} flexBasis={{ xs: "100%", md: "50%" }}>
								<Stack direction="row" gap={3} justifyContent="space-between">
									<Typography fontWeight="500" fontSize="16px">
										{t("Payment Method")}
									</Typography>
									<Stack
										direction="row"
										alignItems="center"
										gap={.5}
										onClick={() => setOpenPaymentModal(true)}
										sx={{
											cursor: "pointer",
											color: theme.palette.info.main,
											fontWeight: "500",
										}}>
										<EditIcon fontSize="12px" />
										{t("Edit")}
									</Stack>
								</Stack>
								<Stack
									direction="row"
									alignItems="center"
									mt={3}
									gap={1}
								>
									<Image src="/static/percel/dollar.png" alt="payment method" width={20} height={14.62} />
									{t(selectedPaymentMethod?.replaceAll("_", " "))}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
			{openPaymentModal && (
				<Modal
					open={openPaymentModal}
					onClose={() => setOpenPaymentModal(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={modalStyle}>
						<IconButton onClick={() => setOpenPaymentModal(false)}
							sx={{
								backgroundColor: theme.palette.neutral[300],
								borderRadius: "50%",
								padding: ".315rem",
								position: "absolute",
								top: "10px",
								right: "10px",
								svg: {
									fontSize: "1.2rem !important",
								}
							}}
						>
							<CloseIcon />
						</IconButton>

						<PaymentMethod
							setPaymentMethod={setPaymentMethod}
							paymentMethod={paymentMethod}
							paidBy={paidBy}
							isLoading={isLoading}
							orderPlace={orderPlace}
							zoneData={{ data: zoneData }}
							configData={configData}
							storeZoneId={currentZoneId}
							parcel="true"
							offlinePaymentOptions={offlinePaymentOptions}
							getParcelPayment={getParcelPayment}
							setOpen={setOpenPaymentModal}
							setSelectedPaymentMethod={setSelectedPaymentMethod}
						/>
					</Box>
				</Modal>
			)}
		</Card>
	);
};

export default DeliveryInfo;
