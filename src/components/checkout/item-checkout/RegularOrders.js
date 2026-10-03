import { Box, Divider, Stack, Typography, alpha } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import { getAmountWithSign } from "../../../helper-functions/CardHelpers";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import {
	handleProductValueWithOutDiscount,
	getConvertDiscountNew,
	selectedAddonsTotal,
} from "../../../utils/CustomFunctions";
import CustomImageContainer from "../../CustomImageContainer";
import VariationContent from "../../added-cart-view/VariationContent";
import CartBundleItem from "../../added-cart-view/CartBundleItem";
import { isBundleCartRow, getBundleDetails } from "../../../helper-functions/bundleCartRow";
import BogoCartItemCard from "../../added-cart-view/BogoCartItemCard";
import { isBogoCartRow, getBogoDetails } from "../../../helper-functions/bogoCartRow";

export const VegNonveg = ({ theme, item, t }) => {
	return (
		<Stack
			sx={{
				position: "absolute",
				bottom: 0,
				left: 0,
				width: "100%",
				background: (theme) => theme.palette.primary.overLay,
				opacity: "0.6",
				padding: "10px",
				height: "30%",
				alignItems: "center",
				justifyContent: "center",
				borderBottomRightRadius: "10px",
				borderBottomLeftRadius: "10px",
			}}
		>
			<Typography align="center" color={theme.palette.neutral[100]}>
				{item?.veg === 0 ? t("Non-Veg") : t("Veg")}
			</Typography>
		</Stack>
	);
};

const RegularOrders = (props) => {
	const { configData, cartList, t, isSmall } = props;
	const theme = useTheme();
	const neutralBase =
		theme.palette.neutral?.[400] || theme.palette.text.secondary;

	if (!cartList || cartList.length === 0) {
		return (
			<CustomStackFullWidth
				direction="row"
				alignItems="flex-start"
				spacing={2}
			>
				<Skeleton variant="rectangular" height="90px" width="95px" />
				<Stack>
					<Skeleton variant="text" width="50px" />
					<Skeleton variant="text" width="50px" />
					<Skeleton variant="text" width="50px" />
				</Stack>
			</CustomStackFullWidth>
		);
	}

	return (
		<Stack width="100%" divider={<Divider flexItem />}>
			{cartList.map((item, index) => {
				if (isBogoCartRow(item)) {
					return (
						<BogoCartItemCard
							key={index}
							bogoDetails={getBogoDetails(item)}
							quantity={item?.quantity}
							showStepper={false}
							disableGutters
						/>
					);
				}
				if (isBundleCartRow(item)) {
					return (
						<CartBundleItem
							key={index}
							bundleDetails={getBundleDetails(item)}
							quantity={item?.quantity}
							showStepper={false}
							disableGutters
						/>
					);
				}
				return (
				<Stack
					key={index}
					direction="row"
					alignItems="flex-start"
					spacing={1.5}
					py={{ xs: 1, md: 1.25 }}
				>
					<Box
						sx={{
							width: { xs: 48, md: 56 },
							height: { xs: 48, md: 56 },
							borderRadius: "8px",
							overflow: "hidden",
							flexShrink: 0,
							backgroundColor: alpha(neutralBase, 0.08),
						}}
					>
						<CustomImageContainer
							height="100%"
							width="100%"
							src={item?.image_full_url}
							objectFit="cover"
							borderRadius="8px"
							loading="lazy"
						/>
					</Box>

					<Stack flex={1} minWidth={0} spacing={0.25}>
						<Typography
							sx={{
								fontWeight: 600,
								fontSize: { xs: "13px", md: "14px" },
								color: theme.palette.text.primary,
								lineHeight: 1.25,
							}}
						>
							{item.name}
						</Typography>
						{(() => {
							// Addons are never discounted (mirrors the order-details API,
							// which always keeps `addon_discount` separate from the item's
							// own discount) — so the % / fixed discount applies only to the
							// base item price, and the addon total is added back afterward.
							const baseOriginalPrice = handleProductValueWithOutDiscount(item);
							const addonTotal = selectedAddonsTotal(item?.selectedAddons);
							const hasDiscount = Number(item?.discount) > 0;
							const discountedBasePrice = hasDiscount
								? getConvertDiscountNew(
										item.discount,
										item.discount_type,
										baseOriginalPrice,
									)
								: baseOriginalPrice;
							const originalPrice = baseOriginalPrice + addonTotal;
							const discountedPrice = discountedBasePrice + addonTotal;
							return (
								<Stack direction="row" alignItems="baseline" spacing={0.75}>
									<Typography
										sx={{
											fontWeight: 700,
											fontSize: { xs: "13px", md: "14px" },
											color: theme.palette.text.primary,
										}}
									>
										{getAmountWithSign(discountedPrice)}
									</Typography>
									{hasDiscount && (
										<Typography
											sx={{
												fontSize: { xs: "11px", md: "12px" },
												color: theme.palette.text.secondary,
												textDecoration: "line-through",
											}}
										>
											{getAmountWithSign(originalPrice)}
										</Typography>
									)}
								</Stack>
							);
						})()}
						{/* `!== 0` was true for `undefined` too, and cart items carry the
						    list-shaped payload which omits this flag entirely — so the
						    label showed on every product, pharmacy or not. Only show it
						    when the API explicitly says it is required. */}
						{item?.is_prescription_required === 1 && (
							<Typography
								sx={{
									fontSize: "10px",
									color: theme.palette.error.main,
								}}
							>
								{t("Prescription Required")}
							</Typography>
						)}
						<VariationContent cartItem={item} />
					</Stack>

					<Box
						sx={{
							minWidth: 32,
							height: 32,
							px: 1,
							borderRadius: "8px",
							backgroundColor: alpha(neutralBase, 0.12),
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: { xs: "13px", md: "14px" },
								color: theme.palette.text.primary,
							}}
						>
							{item.quantity}
						</Typography>
					</Box>
				</Stack>
				);
			})}
		</Stack>
	);
};

RegularOrders.propTypes = {};

export default RegularOrders;
