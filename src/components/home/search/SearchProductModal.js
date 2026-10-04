import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import { not_logged_in_message } from "utils/toasterMessages";
import { closeSearchProductModal } from "redux/slices/searchProductModal";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const FoodDetailModal = dynamic(() =>
  import("../../food-details/foodDetail-modal/FoodDetailModal"),
);
const ModuleModal = dynamic(() => import("../../cards/ModuleModal"));

const SearchProductModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOpen, selectedItem } = useSelector((s) => s.searchProductModal);
  const { wishLists } = useSelector((s) => s.wishList);
  const { configData } = useSelector((s) => s.configData);

  const [openLocationAlert, setOpenLocationAlert] = useState(false);

  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate: wishlistDeleteMutate } = useWishListDelete();

  if (!isOpen || !selectedItem) return null;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isWishlisted =
    !!token && !!wishLists?.item?.find((w) => w.id === selectedItem?.id);

  const toggleWishlist = (e) => {
    e?.stopPropagation?.();
    if (!token) {
      toast.error(t(not_logged_in_message));
      return;
    }
    if (isWishlisted) {
      wishlistDeleteMutate(selectedItem?.id, {
        onSuccess: (res) => {
          dispatch(removeWishListItem(selectedItem?.id));
          toast.success(res.message, { id: "wishlist" });
        },
        onError: (err) => toast.error(err?.response?.data?.message),
      });
    } else {
      addFavoriteMutation(selectedItem?.id, {
        onSuccess: (res) => {
          dispatch(addWishList(selectedItem));
          toast.success(res?.message);
        },
        onError: (err) => toast.error(err?.response?.data?.message),
      });
    }
  };

  const handleModalClose = () => {
    dispatch(closeSearchProductModal());
  };

  const moduleType = selectedItem?.module_type ?? getCurrentModuleType();
  const isFood = moduleType === "food";
  console.log({isFood});
  

  if (isFood) {
    return (
      <FoodDetailModal
        product={selectedItem}
        imageBaseUrl={configData?.base_urls?.item_image_url}
        open={isOpen}
        handleModalClose={handleModalClose}
        setOpen={(v) => {
          if (!v) handleModalClose();
        }}
        addToWishlistHandler={toggleWishlist}
        removeFromWishlistHandler={toggleWishlist}
        isWishlisted={isWishlisted}
        setOpenLocationAlert={setOpenLocationAlert}
      />
    );
  }

  return (
    <ModuleModal
      open={isOpen}
      handleModalClose={handleModalClose}
      configData={configData}
      productDetailsData={selectedItem}
      addToWishlistHandler={toggleWishlist}
      removeFromWishlistHandler={toggleWishlist}
      isWishlisted={isWishlisted}
    />
  );
};

export default SearchProductModal;
