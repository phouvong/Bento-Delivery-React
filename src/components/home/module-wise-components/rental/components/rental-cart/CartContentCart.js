import React from "react";
import { CustomRentalCard } from "components/home/module-wise-components/rental/components/global/CustomRentalCard";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import useUpdateBookingCart from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useUpdateBookingCart";
import useDeleteItemFromBooking from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useDeleteItemFromBooking";
import { setCartList } from "redux/slices/cart";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/styles";
import {
	increment,
	removeItemFromCart,
	updateCart,
} from "components/home/module-wise-components/rental/components/rental-cart/helper";
import toast from "react-hot-toast";
import Link from "next/link";
import {t} from "i18next";

const CartContentCart = ({ item, userData ,isPriceShow}) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const { mutate: updateMutate, isLoading: updateIsLoading } =
		useUpdateBookingCart();
	const { mutate } = useDeleteItemFromBooking();
	const handleIncrement = (cartItem) => {
		const updateQuantity = cartItem?.quantity + 1;
		if (item?.vehicle?.total_vehicle_count < updateQuantity) {
			if(item.vehicle?.total_vehicle_count===0){
				toast.error(t("This vehicle is not available in this pick time"));
			}
			else {
				toast.error(t(`You can't add more than ${item.vehicle?.total_vehicle_count} quantities of this vehicle.`));
			}

		} else {
			updateCart(
				cartItem,
				userData,
				dispatch,
				setCartList,
				updateQuantity,
				updateMutate
			);
		}
	};

	const handleDecrement = (cartItem) => {
		const updateQuantity = cartItem?.quantity - 1;
		const tempQuantity = item?.vehicle?.total_vehicle_count>updateQuantity?updateQuantity:item?.vehicle?.total_vehicle_count;
		updateCart(
			cartItem,
			userData,
			dispatch,
			setCartList,
			tempQuantity,
			updateMutate
		);
	};

	const removeItemCart = (cartItem) => {
		removeItemFromCart(cartItem, mutate, dispatch, setCartList);
	};

	return (
		<CustomRentalCard.root
			sx={{
				borderRadius: "0px",
				background: "transparent",
				borderBottom: `1px solid ${(theme) =>
					theme.palette.neutral[200]}`,

				mb: "20px",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "start",
					alignItems: "start",
					gap: "12px",
				}}
			>
				<Link href={`/rental/vehicle/${item?.vehicle?.slug|| item?.vehicle?.id}`} passHref>
				<Stack>
					<CustomRentalCard.image
						itemImage={item?.vehicle?.thumbnail_full_url}
					/>
				</Stack>
				</Link>
				<CustomRentalCard.details item={item} />
			</Box>
			<CustomRentalCard.counter
				isShowPrice={isPriceShow}
				isVerticle={true}
				quantity={item.quantity}
				handleIncrement={handleIncrement}
				itemId={item?.id}
				handleDecrement={handleDecrement}
				updateIsLoading={updateIsLoading}
				removeItemCart={removeItemCart}
				availableQuantity={item?.vehicle?.total_vehicle_count}
				item={item}
			/>
		</CustomRentalCard.root>
	);
};

export default CartContentCart;
