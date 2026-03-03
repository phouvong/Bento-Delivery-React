import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import {
	getAmountWithSign,
	getDiscountedAmount,
} from "../../../helper-functions/CardHelpers";

const PricePreviewWithStock = (props) => {
	const { state, theme, productDetailsData } = props;

	const priceWithOrWithoutDiscount = (price) => {
		return (
			<Typography
				marginTop="5px !important"
				display="flex"
				alignItems="center"
				fontWeight="700"
				color={theme.palette.primary.main}
				sx={{
					fontSize: { xs: "15px", sm: "24px" },
				}}
				component="h2"
			>
				{price ===
				getDiscountedAmount(
					price,
					state.modalData[0]?.discount,
					state.modalData[0]?.discount_type,
					state.modalData[0]?.store_discount
				) ? (
					<>{getAmountWithSign(price)}</>
				) : (
					<>
						{
							<>
								{getAmountWithSign(
									getDiscountedAmount(
										price,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)}
								<Typography
									variant="body1"
									marginLeft="8px"
									fontWeight="400"
									color={theme.palette.customColor.textGray}
									sx={{ fontSize: { xs: "13px", sm: "16px" } }}
								>
									<del>{getAmountWithSign(price)}</del>
								</Typography>
							</>
						}
					</>
				)}
			</Typography>
		);
	};
	const handlePriceRange = (priceOne, priceTwo) => {
		const minPrice = Math.min(Number(priceOne), Number(priceTwo));
		const maxPrice = Math.max(Number(priceOne), Number(priceTwo));
		return (
			<Typography
				marginTop="5px !important"
				display="flex"
				alignItems="center"
				fontWeight="700"
				color={theme.palette.primary.main}
				sx={{
					fontSize: { xs: "15px", sm: "24px" },
				}}
			>
				{Number(state?.modalData?.[0]?.discount ?? 0) === 0 ? (
					<>
						{`${getAmountWithSign(
							getDiscountedAmount(
								minPrice,
								state.modalData[0]?.discount,
								state.modalData[0]?.discount_type,
								state.modalData[0]?.store_discount
							)
						)} - ${getAmountWithSign(
							getDiscountedAmount(
								maxPrice,
								state.modalData[0]?.discount,
								state.modalData[0]?.discount_type,
								state.modalData[0]?.store_discount
							)
						)} `}
					</>
				) : (
					<>
						{`${getAmountWithSign(
							getDiscountedAmount(
								minPrice,
								state.modalData[0]?.discount,
								state.modalData[0]?.discount_type,
								state.modalData[0]?.store_discount
							)
						)} - ${getAmountWithSign(
							getDiscountedAmount(
								maxPrice,
								state.modalData[0]?.discount,
								state.modalData[0]?.discount_type,
								state.modalData[0]?.store_discount
							)
						)} `}

						<Typography
							variant="body1"
							marginLeft="8px"
							fontWeight="400"
							color={theme.palette.customColor.textGray}
							sx={{ fontSize: { xs: "13px", sm: "16px" } }}
						>
							<del>
								{`${getAmountWithSign(minPrice)} - ${getAmountWithSign(
									maxPrice
								)}`}
							</del>
						</Typography>
					</>
				)}
			</Typography>
		);
	};
	const handlePrice = () => {
		if (state?.modalData[0]?.variations?.length > 0) {
			const variationPrices = state?.modalData[0]?.variations
				?.map((variation) => Number(variation?.price))
				?.filter((price) => Number.isFinite(price));
			if (!variationPrices?.length) {
				return <>{priceWithOrWithoutDiscount(state?.modalData[0]?.price)}</>;
			}
			const minVariationPrice = Math.min(...variationPrices);
			const maxVariationPrice = Math.max(...variationPrices);

			if (minVariationPrice === maxVariationPrice) {
				return <>{priceWithOrWithoutDiscount(minVariationPrice)}</>;
			} else {
				return (
					<Stack direction="row" alignItems="center">
						{handlePriceRange(
							minVariationPrice,
							maxVariationPrice
						)}
					</Stack>
				);
			}
		} else {
			return <>{priceWithOrWithoutDiscount(state?.modalData[0]?.price)}</>;
		}
	};

	return <>{handlePrice()}</>;
};

PricePreviewWithStock.propTypes = {};

export default PricePreviewWithStock;
