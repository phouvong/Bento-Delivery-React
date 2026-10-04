import React from "react";

import {
	CustomListItem,
	CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import ListItemText from "@mui/material/ListItemText";
import { Skeleton, Typography } from "@mui/material";
import Radio from "@mui/material/Radio";

import { useTheme } from "@mui/material/styles";

import { Stack } from "@mui/system";

import { CustomTypographyEllipsis } from "../../../styled-components/CustomTypographies.style";

// Placeholder rows shown while address list is loading
const AddressSkeletonItem = () => (
	<Stack direction="row" alignItems="center" gap={1} px={0.5}>
		<Skeleton variant="circular" width={20} height={20} sx={{ flexShrink: 0 }} />
		<Stack flex={1} spacing={0.5}>
			<Skeleton variant="text" width="40%" height={18} />
			<Skeleton variant="text" width="80%" height={14} />
		</Stack>
	</Stack>
);

const AddressSelectionList = (props) => {
	const theme = useTheme();
	const {
		data,
		allAddress,
		handleLatLng,
		t,
		address,
		isRefetching,
		refetch,
		configData,
		setSelectedAddress,
		renderOnNavbar,
		isLoading,
	} = props;

	if (isLoading) {
		return (
			<Stack gap="15px" py={1}>
				{[1, 2, 3].map((i) => (
					<AddressSkeletonItem key={i} />
				))}
			</Stack>
		);
	}

	return (
		<>
			<Stack gap="15px">
				{data &&
					allAddress?.length > 0 &&
					data?.addresses?.map((item, index) => (
						<Stack key={item.id}>
							<CustomListItem
								border={
									item.id === address?.id
										? `1px solid ${theme.palette.primary.main}`
										: `1px solid ${theme.palette.neutral[200]}`
								}
								onClick={() => handleLatLng(item)}
								alignItems="flex-start"
								selected={item.id === address?.id}
								cursor="pointer"
								// className="selected"
							>
								<CustomStackFullWidth
									direction="row"
									alignItems="flex-start"
								>
									<Radio
										checked={item.id === address?.id}
										row
										aria-labelledby="demo-row-radio-buttons-group-label"
										name="row-radio-buttons-group"
										sx={{ marginTop: "-2px" }}
									/>
									<ListItemText
										primary={
											<Typography
												textTransform="capitalize"
												fontSize={{
													xs: "13px",
													sm: "14px",
													md: "16px",
												}}
												fontWeight={
													item.id === address?.id
														? "600"
														: "600"
												}
											>
												{t(item.address_type)}
											</Typography>
										}
										secondary={
											<CustomTypographyEllipsis
												sx={{
													fontSize: {
														xs: "10px",
														md: "12px",
														maxWidth:
															renderOnNavbar ===
															"true"
																? "220px"
																: "100%",
													},
												}}
											>
												{item.address}
											</CustomTypographyEllipsis>
										}
									/>
								</CustomStackFullWidth>
							</CustomListItem>
						</Stack>
					))}

				{/* Empty state */}
				{!isLoading && data && data?.addresses?.length === 0 && (
					<Stack alignItems="center" spacing={1.5} py={1.5}>
						<Stack
							alignItems="center"
							justifyContent="center"
							sx={{
								width: 52,
								height: 52,
								borderRadius: "50%",
								bgcolor: theme.palette.primary.main + "14",
							}}
						>
							<i
								className="fi fi-rr-map-marker"
								style={{
									fontSize: "22px",
									display: "flex",
									lineHeight: 1,
									color: theme.palette.primary.main,
								}}
							/>
						</Stack>
						<Stack alignItems="center" spacing={0.5}>
							<Typography
								fontSize="14px"
								fontWeight={600}
								color="text.primary"
							>
								{t("No saved addresses yet")}
							</Typography>
							<Typography
								fontSize="12px"
								color="text.secondary"
								textAlign="center"
								sx={{ maxWidth: "200px", lineHeight: 1.5 }}
							>
								{t("Add a new address to get started")}
							</Typography>
						</Stack>
					</Stack>
				)}
				{/*{!data && <CustomCheckOutShimmer />}*/}
			</Stack>
		</>
	);
};

AddressSelectionList.propTypes = {};

export default AddressSelectionList;
