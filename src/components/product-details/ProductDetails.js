import { Grid } from "@mui/material";
import useGetStoreDetails from "api-manage/hooks/react-query/store/useGetStoreDetails";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import { t } from "i18next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { not_logged_in_message } from "utils/toasterMessages";
import SinglePoster from "../home/module-wise-components/ecommerce/SinglePoster";
import FeaturedStores from "../home/module-wise-components/pharmacy/featured-stores";
import DetailsAndReviews from "./details-and-reviews/DetailsAndReviews";
import ProductDetailsSection from "./product-details-section/ProductDetailsSection";
import ProductsMoreFromTheStore from "./ProductsMoreFromTheStore";
import StoreDetails from "./StoreDetails";

const ProductDetails = ({ productDetailsData, configData }) => {
	const storeImageBaseUrl = configData?.base_urls?.store_image_url;
	const reduxDispatch = useDispatch();
	const [isWishlisted, setIsWishlisted] = useState(false);
	const { mutate: addFavoriteMutation } = useAddToWishlist();
	const { mutate } = useWishListDelete();
	const { data: storeData, refetch } = useGetStoreDetails(
		productDetailsData?.store_id
	);
	useEffect(() => {
		if (productDetailsData?.store_id) {
			refetch();
		}
	}, []);
	const addToWishlistHandler = (e) => {
		e.stopPropagation();
		let token = undefined;
		if (typeof window !== "undefined") {
			token = localStorage.getItem("token");
		}
		if (token) {
			addFavoriteMutation(productDetailsData?.id, {
				onSuccess: (response) => {
					if (response) {
						reduxDispatch(addWishList(productDetailsData));
						setIsWishlisted(true);
						toast.success(response?.message);
					}
				},
				onError: (error) => {
					toast.error(error.response.data.message);
				},
			});
		} else toast.error(t(not_logged_in_message));
	};
	const removeFromWishlistHandler = (e) => {
		e.stopPropagation();
		const onSuccessHandlerForDelete = (res) => {
			reduxDispatch(removeWishListItem(productDetailsData?.id));
			setIsWishlisted(false);
			toast.success(res.message, {
				id: "wishlist",
			});
		};
		mutate(productDetailsData?.id, {
			onSuccess: onSuccessHandlerForDelete,
			onError: (error) => {
				toast.error(error.response.data.message);
			},
		});
	};

	return (
		<CustomStackFullWidth
			spacing={5}
			paddingTop={{ xs: "1.25rem", md: "2.5rem" }}
			paddingBottom="2.5rem"
			sx={{ minHeight: "100vh" }}
		>
			<Grid container spacing={2}>
				<Grid item xs={12} md={8}>
					<CustomStackFullWidth spacing={5}>
						<ProductDetailsSection
							productDetailsData={productDetailsData}
							configData={configData}
							addToWishlistHandler={addToWishlistHandler}
							removeFromWishlistHandler={removeFromWishlistHandler}
							isWishlisted={isWishlisted}
						/>
						<DetailsAndReviews
							configData={configData}
							description={productDetailsData?.description}
							reviews={productDetailsData?.reviews}
							productId={productDetailsData?.id}
							storename={productDetailsData?.store_details?.name}
						/>
						<CustomStackFullWidth>
							<FeaturedStores
								slide="3"
								title="Popular Store"
								configData={configData}
							/>
						</CustomStackFullWidth>
					</CustomStackFullWidth>
				</Grid>
				<Grid item xs={12} md={4}>
					<CustomStackFullWidth spacing={3}>
						<StoreDetails
							storeDetails={
								productDetailsData?.store_details ?? storeData
							}
							storeImageBaseUrl={storeImageBaseUrl}
						/>
						<ProductsMoreFromTheStore
							productDetails={productDetailsData}
						/>
					</CustomStackFullWidth>
				</Grid>

				<Grid item xs={12}>
					<SinglePoster />
				</Grid>
			</Grid>
		</CustomStackFullWidth>
	);
};

export default ProductDetails;
