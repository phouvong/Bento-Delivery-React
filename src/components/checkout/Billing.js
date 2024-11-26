import React from "react";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";
import {
	CustomPaperBigCard,
	CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { t } from "i18next";
import DeliveryFree from "./DeliveryFree";
import DeliveryManTip from "./DeliveryManTip";
import ChangePayBy from "./ChangePayBy";

const Billing = ({
	deliveryTip,
	setDeliveryTip,
	paidBy,
	setPaidBy,
	data,
	parcelDeliveryFree,
	zoneData,
	senderLocation,
	receiverLocation,
	configData,
	extraChargeLoading,
	setGuestUserEmail,
	emailError,
	guestUserEmail,
	handleEmailChange,
}) => {
	return (
		<CustomPaperBigCard>
			<CustomStackFullWidth spacing={4}>
				<Stack align="center">
					<Typography fontWeight={500} fontSize="16px">
						{t("Billing")}
					</Typography>
				</Stack>
				<DeliveryFree
					data={data}
					parcelDeliveryFree={parcelDeliveryFree}
					senderLocation={senderLocation}
					receiverLocation={receiverLocation}
					configData={configData}
					extraChargeLoading={extraChargeLoading}
				/>

				<DeliveryManTip
					parcel="true"
					deliveryTip={deliveryTip}
					setDeliveryTip={setDeliveryTip}
				/>
				<ChangePayBy
					paidBy={paidBy}
					setPaidBy={setPaidBy}
					zoneData={zoneData}
				/>
				{/*{!getToken() ? (*/}
				{/*  <Stack width="100%" spacing={1}>*/}
				{/*    <DeliveryCaption>{t("Guest user email")}</DeliveryCaption>*/}
				{/*    <TextField*/}
				{/*      value={guestUserEmail}*/}
				{/*      type="email"*/}
				{/*      name="email"*/}
				{/*      label={t("Email")}*/}
				{/*      onChange={handleEmailChange}*/}
				{/*      error={Boolean(emailError)}*/}
				{/*      helperText={emailError}*/}
				{/*    />*/}
				{/*  </Stack>*/}
				{/*) : null}*/}
			</CustomStackFullWidth>
		</CustomPaperBigCard>
	);
};

export default Billing;
