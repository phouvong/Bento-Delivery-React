import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Drawer,
  Grid,
  Modal,
  Skeleton,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { handleProductVariationRequirementsToaster } from "./SomeHelperFuctions";
import AddUpdateOrderToCart from "./AddUpdateOrderToCart";
import AddOrderToCart from "./AddOrderToCart";
import AddOnsManager from "./AddOnsManager";
import VariationsManager from "./VariationsManager";
import FoodDetailsManager from "./FoodDetailsManager";
import { handleDiscountChip } from "./helper-functions/handleDiscountChip";
import { handleInitialTotalPriceVarPriceQuantitySet } from "./helper-functions/handleDataOnFirstMount";
import {
  calculateItemBasePrice,
  getIndexFromArrayByComparision,
  isAvailable,
} from "utils/CustomFunctions";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import {
  setBuyNowItemList,
  setCampaignItemList,
  setCart,
  setClearCart,
  setUpdateVariationToCart,
} from "redux/slices/cart";
import { FoodDetailModalStyle } from "./foodDetailModal.style";
import IconButton from "@mui/material/IconButton";
import CartClearModal from "../../product-details/product-details-section/CartClearModal";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import CustomModal from "../../modal";
import { not_logged_in_message, out_of_limits } from "utils/toasterMessages";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { Stack } from "@mui/system";
import useAddCartItem from "../../../api-manage/hooks/react-query/add-cart/useAddCartItem";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { handleValuesFromCartItems } from "../../product-details/product-details-section/helperFunction";
import useCartItemUpdate from "../../../api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import { getGuestId } from "helper-functions/getToken";
import { useGetItemDetails } from "api-manage/hooks/react-query/product-details/useGetItemDetails";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";

const FoodDetailModal = ({
  product: fromCard,
  handleModalClose,
  imageBaseUrl,
  open,
  setOpen,
  productUpdate,
  addToWishlistHandler,
  removeFromWishlistHandler,
  isWishlisted,
  setOpenLocationAlert,
}) => {
  console.log({ fromCard });
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [product, setProduct] = useState(fromCard);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const [varPrice, setVarPrice] = useState(null);
  const [totalWithoutDiscount, setTotalWithoutDiscount] = useState(null);
  const [selectedAddons, setSelectedAddOns] = useState([]);
  const { cartList: allCartList } = useSelector((state) => state.cart);
  const { configData } = useSelector((state) => state.configData);
  const [quantity, setQuantity] = useState(1);
  const [clearCartModal, setClearCartModal] = React.useState(false);
  const [otherSelectedOption, setOtherSelectedOption] = useState([]);
  const cartList = getCartListModuleWise(allCartList);
  const handleClearCartModalOpen = () => setClearCartModal(true);
  const { wishLists } = useSelector((state) => state.wishList);
  const [modalData, setModalData] = useState([]);
  const { mutate: updateMutate, updateIsLoading } = useCartItemUpdate();
  const { mutate, isLoading } = useAddCartItem();
  const guestId = getGuestId();
  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  let location = undefined;
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
  }
  const handleSuccessItem = (resData) => {};
  console.log({ fromCard, imageBaseUrl });
  const params = {
    id: fromCard?.id,
  };
  const {
    data,
    isLoading: cardDataIsLoading,
    error: itemDetailsError,
    isError: itemDetailsIsError,
  } = useGetItemDetails(params, handleSuccessItem, productUpdate);
  // Treat a 404 (or missing/deleted item payload) as "not found" so the
  // modal can render the empty-state UI instead of the regular shimmer or
  // a half-broken detail layout.
  const itemNotFound =
    itemDetailsIsError &&
    (itemDetailsError?.response?.status === 404 ||
      itemDetailsError?.response?.status === 410);

  useEffect(() => {
    if (productUpdate) {
      handleInitialTotalPriceVarPriceQuantitySet(
        fromCard,
        setModalData,
        productUpdate,
        setTotalPrice,
        setVarPrice,
        setQuantity,
        setSelectedOptions,
        setTotalWithoutDiscount,
        setSelectedAddOns,
        setOtherSelectedOption
      );
    } else {
      if (data) {
        console.log({ data });
        handleInitialTotalPriceVarPriceQuantitySet(
          data,
          setModalData,
          productUpdate,
          setTotalPrice,
          setVarPrice,
          setQuantity,
          setSelectedOptions,
          setTotalWithoutDiscount,
          setSelectedAddOns,
          setOtherSelectedOption
        );
      }
    }

    //initially setting these states to use further
  }, [product, data]);

  console.log({ totalPrice });

  const notify = (i) => toast(i);
  const itemValuesHandler = (itemIndex, variationValues) => {
    const isThisValExistWithinSelectedValues = selectedOptions.filter(
      (sItem) => sItem.choiceIndex === itemIndex
    );
    if (variationValues.length > 0) {
      let newVariation = variationValues.map((vVal, vIndex) => {
        let exist =
          isThisValExistWithinSelectedValues.length > 0 &&
          isThisValExistWithinSelectedValues.find(
            (item) => item.optionIndex === vIndex
          );
        if (exist) {
          return exist;
        } else {
          return { ...vVal, isSelected: false };
        }
      });
      return newVariation;
    } else {
      return variationValues;
    }
  };
  const getNewVariationForDispatch = () => {
    const newVariations =
      modalData?.[0]?.food_variations.length > 0
        ? modalData?.[0]?.food_variations?.map((item, index) => {
            if (selectedOptions.length > 0) {
              return {
                ...item,
                values:
                  item.values.length > 0
                    ? itemValuesHandler(index, item.values)
                    : item.values,
              };
            } else {
              return item;
            }
          })
        : modalData?.[0]?.food_variations;
    return newVariations;
  };

  // Add-ons are billed at their row price and are NOT eligible for the item
  // discount. Strip them out before applying discount, then add them back.
  const computeAddOnsTotal = () =>
    selectedAddons?.reduce((sum, addOn) => {
      const addOnQty = Number(addOn?.quantity) || 0;
      if (productUpdate && addOnQty <= 0) return sum;
      const effectiveQty = addOnQty > 0 ? addOnQty : 1;
      return sum + (Number(addOn?.price) || 0) * effectiveQty;
    }, 0) || 0;

  const getNewObj = () => {
    const addOnsTotal = computeAddOnsTotal();
    const discountableSubtotal = (Number(totalPrice) || 0) - addOnsTotal;
    return {
      ...modalData[0],
      totalPrice:
        getDiscountedAmount(
          discountableSubtotal,
          product?.discount,
          product?.discount_type,
          product?.store_discount,
          quantity
        ) + addOnsTotal,
      quantity: quantity,
      food_variations: getNewVariationForDispatch(),
      selectedAddons: selectedAddons,
      itemBasePrice: getDiscountedAmount(
        calculateItemBasePrice(modalData[0], selectedOptions),
        product?.discount,
        product?.discount_type,
        product?.store_discount,
        quantity
      ),
    };
  };
  const handleSuccess = (res) => {
    if (res) {
      let product = {};
      res?.forEach((item) => {
        product = {
          ...item?.item,
          cartItemId: item?.id,
          totalPrice: item?.price,
          quantity: item?.quantity,
          food_variations: item?.item?.food_variations,
          selectedAddons: selectedAddons,
          selectedOption: selectedOptions,
          itemBasePrice: item?.item?.price,
        };
      });
      dispatch(setCart(product));
      toast.success(t("Item added to cart successfully"));
      handleClose();
    }
  };
  const updateCartSuccessHandler = (res) => {
    if (res && res.length > 0) {
      const updatedProducts = res.map((item) => {
        const indexNumber = getIndexFromArrayByComparision(
          cartList,
          item?.item
        ); // use current item
        return {
          product: {
            ...item?.item,
            cartItemId: item?.id,
            totalPrice: item?.price,
            quantity: item?.quantity,
            food_variations: item?.item?.food_variations,
            selectedAddons: selectedAddons,
            selectedOption: selectedOptions,
            itemBasePrice: item?.item?.price,
          },
          indexNumber,
        };
      });

      updatedProducts.forEach(({ product, indexNumber }) => {
        dispatch(
          setUpdateVariationToCart({
            newObj: product,
            indexNumber,
          })
        );
      });

      toast.success(t("Item updated successfully"));
      handleModalClose?.();
    }
  };

  const variationSigOf = (opts) =>
    (opts ?? [])
      .filter((o) => o?.isSelected)
      .map((o) => String(o?.label ?? ""))
      .sort()
      .join("|");

  const addOrUpdateToCartByDispatch = () => {
    // We should hit the update API whenever the item is already in the
    // user's cart for this store — not only when the modal was opened from
    // the cart (productUpdate=true). Without this branch the "Update to
    // Cart" button silently called the add API when the modal was opened
    // from a product card.
    const targetItemId = modalData?.[0]?.id ?? product?.id;
    const targetStoreId =
      product?.store_id ??
      product?.store?.id ??
      modalData?.[0]?.store_id ??
      modalData?.[0]?.store?.id;

    const hasVariations = modalData?.[0]?.food_variations?.length > 0;
    const currentSig = variationSigOf(selectedOptions);

    const existingCartRow = cartList?.find((item) => {
      if (item?.id !== targetItemId) return false;
      if (
        targetStoreId != null &&
        String(item?.store_id) !== String(targetStoreId)
      ) {
        return false;
      }
      if (!hasVariations) return true;
      if (!currentSig) return false;
      return variationSigOf(item?.selectedOption) === currentSig;
    });
    const shouldUpdate = productUpdate || !!existingCartRow;

    if (shouldUpdate) {
      //for updating

      let totalQty = 0;
      const itemObject = {
        cart_id: product?.cart_id ?? existingCartRow?.cartItemId,
        guest_id: getGuestId(),
        // /cart/update validator requires store_id; pull it from whichever
        // shape the source payload exposes so the request never goes out
        // without it.
        store_id: targetStoreId,
        model: product?.available_date_starts ? "ItemCampaign" : "Item",
        add_on_ids:
          selectedAddons?.length > 0
            ? selectedAddons?.map((add) => {
                return add.id;
              })
            : [],
        add_on_qtys:
          selectedAddons?.length > 0
            ? selectedAddons.map((add) => add.quantity)
            : [],
        item_id: targetItemId,
        price: totalPrice,
        quantity: quantity,
        variation:
          getNewVariationForDispatch()?.length > 0
            ? getNewVariationForDispatch()?.map((variation) => {
                return {
                  name: variation.name,
                  values: {
                    label: handleValuesFromCartItems(variation.values),
                  },
                };
              })
            : [],
      };

      updateMutate(itemObject, {
        onSuccess: updateCartSuccessHandler,
        onError: onErrorResponse,
      });
    } else {
      let totalQty = 0;
      const itemObject = {
        guest_id: guestId,
        model: modalData[0]?.available_date_starts ? "ItemCampaign" : "Item",
        add_on_ids:
          selectedAddons?.length > 0
            ? selectedAddons?.map((add) => {
                return add.id;
              })
            : [],
        add_on_qtys:
          selectedAddons?.length > 0
            ? selectedAddons.map((add) => add.quantity)
            : [],
        item_id: modalData[0]?.id,
        price: totalPrice,
        quantity: quantity,
        variation:
          getNewVariationForDispatch()?.length > 0
            ? getNewVariationForDispatch()?.map((variation) => {
                return {
                  name: variation.name,
                  values: {
                    label: handleValuesFromCartItems(variation.values),
                  },
                };
              })
            : [],
      };
      mutate(
        { postData: itemObject, store_id: modalData[0]?.store_id },
        {
          onSuccess: handleSuccess,
          onError: onErrorResponse,
        }
      );
    }
  };
  const handleBuyOrOrderNow = (status) => {
    const product = getNewObj();
    if (status === "buy_now") {
      dispatch(setBuyNowItemList(product));
      router.push(`/checkout?page=buy_now`, undefined, { shallow: true });
    } else {
      dispatch(setCampaignItemList(product));
      router.push(`/checkout?page=campaign`, undefined, { shallow: true });
    }
  };

  const handleProductAddUpdate = (checkingFor) => {
    if (checkingFor === "cart") {
      addOrUpdateToCartByDispatch();
    } else if (checkingFor === "campaign") {
      handleBuyOrOrderNow(checkingFor);
    } else if (checkingFor === "buy_now") {
      handleBuyOrOrderNow(checkingFor);
    }
  };

  const handleRequiredItemsToaster = (itemsArray, selectedOptions) => {
    itemsArray?.forEach((item) => {
      if (selectedOptions.length > 0) {
        selectedOptions?.forEach((sOption) => {
          if (sOption.choiceIndex !== item.indexNumber) {
            const text = item.name;
            let checkingQuantity = false;
            handleProductVariationRequirementsToaster(
              text,
              checkingQuantity,
              t
            );
          }
        });
      } else {
        const text = item.name;
        let checkingQuantity = false;
        handleProductVariationRequirementsToaster(text, checkingQuantity, t);
      }
    });
  };
  const optionalVariationSelectionMinMax = () => {
    const selectedValues = selectedOptions.filter(
      (item) => item.type === "optional"
    );
    let isTrue = false;
    if (selectedValues.length > 0) {
      const selectedIndexCount = [];
      selectedValues.forEach((item) =>
        selectedIndexCount.push(item.choiceIndex)
      );
      const indexWithoutDuplicates = [...new Set(selectedIndexCount)];
      if (indexWithoutDuplicates.length > 0) {
        indexWithoutDuplicates.forEach((itemIndex) => {
          let optionalItemIndex = modalData?.[0]?.food_variations?.find(
            (mItem, index) => index === itemIndex
          );

          if (optionalItemIndex) {
            if (optionalItemIndex.type === "multi") {
              let indexNum = modalData[0]?.food_variations?.findIndex(
                (mItem) => mItem.name === optionalItemIndex.name
              );
              let count = 0;
              selectedIndexCount.forEach((indexN) => {
                if (indexN === indexNum) {
                  count += 1;
                }
              });

              if (
                count >= Number.parseInt(optionalItemIndex.min) &&
                count <= Number.parseInt(optionalItemIndex.max)
              ) {
                isTrue = true;
              } else {
                const text = {
                  name: optionalItemIndex.name,
                  min: optionalItemIndex.min,
                  max: optionalItemIndex.max,
                };
                let checkingQuantity = true;
                isTrue = false;
                let id = true;
                handleProductVariationRequirementsToaster(
                  text,
                  checkingQuantity,
                  t,
                  id
                );
              }
            } else {
              isTrue = true;
            }
          } else {
            isTrue = true;
          }
        });
      } else {
        isTrue = true;
      }
    } else {
      isTrue = true;
    }

    return isTrue;
  };

  const handleAddToCartOnDispatch = (checkingFor) => {
    let requiredItemsList = [];
    if (modalData?.[0]?.food_variations?.length > 0) {
      modalData?.[0]?.food_variations?.forEach((item, index) => {
        if (item.required === "on") {
          const itemObj = {
            indexNumber: index,
            type: item.type,
            max: item.max,
            min: item.min,
            name: item.name,
          };
          requiredItemsList.push(itemObj);
        }
      });
    }
    if (requiredItemsList.length > 0) {
      if (selectedOptions.length === 0) {
        handleRequiredItemsToaster(requiredItemsList, selectedOptions);
      } else {
        let itemCount = 0;

        requiredItemsList?.forEach((item, index) => {
          // if(item)
        });

        requiredItemsList?.forEach((item, index) => {
          const isExistInSelection = selectedOptions?.find(
            (sitem) => sitem.choiceIndex === item.indexNumber
          );
          if (isExistInSelection) {
            if (item.type === "single") {
              //call add/update to cart functionalities
              itemCount += 1;
            } else {
              //check based on min max for multiple selection
              let selectedOptionCount = 0;
              selectedOptions?.forEach((item) => {
                if (item.choiceIndex === isExistInSelection?.choiceIndex) {
                  selectedOptionCount += 1;
                }
              });
              if (
                selectedOptionCount >= Number.parseInt(item.min) &&
                selectedOptionCount <= Number.parseInt(item.max)
              ) {
                //call add/update to cart functionalities
                itemCount += 1;
              } else {
                const text = {
                  name: item.name,
                  min: item.min,
                  max: item.max,
                };
                let checkingQuantity = true;

                handleProductVariationRequirementsToaster(
                  text,
                  checkingQuantity,
                  t
                );
              }
            }
            if (
              itemCount === requiredItemsList.length &&
              optionalVariationSelectionMinMax(selectedOptions, modalData)
            ) {
              handleProductAddUpdate(checkingFor);
            }
          } else {
            handleRequiredItemsToaster(requiredItemsList, selectedOptions);
          }
        });
      }
    } else {
      handleProductAddUpdate(checkingFor);
    }
  };
  const addToCard = (status) => {
    if (location) {
      let checkingFor = status ? status : "cart";
      if (cartList?.length > 0) {
        //checking same restaurant items already exist or not
        // Multi-store carts allowed — always proceed with add.
        const isRestaurantExist = true;
        if (isRestaurantExist) {
          if (productUpdate) {
            handleAddToCartOnDispatch(checkingFor);
          } else {
            //add the same product based on variations
            handleAddToCartOnDispatch(checkingFor);
          }
        } else {
          if (cartList.length !== 0) {
            handleClearCartModalOpen();
          }
        }
      } else {
        handleAddToCartOnDispatch(checkingFor);
      }
    } else {
      setOpenLocationAlert?.(true);
    }
  };
  const clearCartAlert = () => {
    dispatch(setClearCart());
    setClearCartModal(false);
    toast.success(
      t(
        "Previously added restaurant foods have been removed from cart. Now, try again."
      ),
      {
        duration: 6000,
      }
    );
  };
  const handleClose = () => setOpen?.(false);

  const changeChoices = (
    e,
    option,
    optionIndex,
    choiceIndex,
    isRequired,
    choiceType,
    checked
  ) => {
    if (choiceType === "single") {
      if (checked) {
        //selected or checked variation handling
        if (selectedOptions.length > 0) {
          const isExist = selectedOptions.find(
            (item) =>
              item.choiceIndex === choiceIndex &&
              item.optionIndex === optionIndex
          );
          if (isExist) {
            const newSelectedOptions = selectedOptions.filter(
              (sOption) =>
                sOption.choiceIndex === choiceIndex &&
                sOption.label !== isExist.label
            );
            setSelectedOptions(newSelectedOptions);
            setTotalPrice(
              (prevState) =>
                prevState - Number.parseInt(option.optionPrice) * quantity
            );
            setVarPrice(
              (prevPrice) =>
                prevPrice - Number.parseInt(option.optionPrice) * quantity
            );
          } else {
            const isItemExistFromSameVariation = selectedOptions.find(
              (item) => item.choiceIndex === choiceIndex
            );
            if (isItemExistFromSameVariation) {
              const newObjs = selectedOptions.map((item) => {
                if (item.choiceIndex === choiceIndex) {
                  return {
                    choiceIndex: choiceIndex,
                    ...option,
                    optionIndex: optionIndex,
                    isSelected: true,
                    type: isRequired === "on" ? "required" : "optional",
                  };
                } else {
                  return item;
                }
              });
              setSelectedOptions(newObjs);
              //changing total price by removing previous ones price and adding new selection options price
              setTotalPrice(
                (prevState) =>
                  prevState -
                  Number.parseInt(isItemExistFromSameVariation.optionPrice) *
                    quantity +
                  Number.parseInt(option.optionPrice) * quantity
              );
              setVarPrice(
                (prevPrice) =>
                  prevPrice -
                  Number.parseInt(isItemExistFromSameVariation.optionPrice) *
                    quantity +
                  Number.parseInt(option.optionPrice) * quantity
              );
            } else {
              const newObj = {
                choiceIndex: choiceIndex,
                ...option,
                optionIndex: optionIndex,
                isSelected: true,
                type: isRequired === "on" ? "required" : "optional",
              };
              setSelectedOptions([...selectedOptions, newObj]);
              setTotalPrice(
                (prevState) =>
                  prevState + Number.parseInt(option.optionPrice) * quantity
              );
              setVarPrice(
                (prevPrice) =>
                  prevPrice + Number.parseInt(option.optionPrice) * quantity
              );
            }
          }
        } else {
          // for a new selected variation
          const newObj = {
            choiceIndex: choiceIndex,
            ...option,
            optionIndex: optionIndex,
            isSelected: true,
            type: isRequired === "on" ? "required" : "optional",
          };
          setSelectedOptions([newObj]);
          setTotalPrice(
            (prevState) =>
              prevState + Number.parseInt(option.optionPrice) * quantity
          );
          setVarPrice(
            (prevPrice) =>
              prevPrice + Number.parseInt(option.optionPrice) * quantity
          );
        }
      } else {
        // uncheck or unselect variation handle
        const filtered = selectedOptions.filter((item) => {
          if (item.choiceIndex === choiceIndex) {
            if (item.label !== option.label) {
              return item;
            }
          } else {
            return item;
          }
        });
        setSelectedOptions(filtered);

        setTotalPrice(
          (prevState) =>
            prevState - Number.parseInt(option.optionPrice) * quantity
        );
        setVarPrice(
          (prevPrice) =>
            prevPrice - Number.parseInt(option.optionPrice) * quantity
        );
      }
    } else {
      //for multiple optional variation selection
      if (e.target.checked) {
        setSelectedOptions((prevState) => [
          ...prevState,
          {
            choiceIndex: choiceIndex,
            ...option,
            optionIndex: optionIndex,
            isSelected: true,
            type: isRequired === "on" ? "required" : "optional",
          },
        ]);
        setTotalPrice(
          (prevState) =>
            prevState + Number.parseInt(option.optionPrice) * quantity
        );
        setVarPrice(
          (prevPrice) =>
            prevPrice + Number.parseInt(option.optionPrice) * quantity
        );
      } else {
        const filtered = selectedOptions.filter((item) => {
          if (item.choiceIndex === choiceIndex) {
            if (item.label !== option.label) {
              return item;
            }
          } else {
            return item;
          }
        });
        setSelectedOptions(filtered);
        setTotalPrice(
          (prevState) =>
            prevState - Number.parseInt(option.optionPrice) * quantity
        );
        setVarPrice(
          (prevPrice) =>
            prevPrice - Number.parseInt(option.optionPrice) * quantity
        );
      }
    }
  };
  const radioCheckHandler = useCallback(
    (choiceIndex, option, optionIndex) => {
      const isExist = selectedOptions.find(
        (sOption) =>
          sOption.choiceIndex === choiceIndex &&
          sOption.optionIndex === optionIndex
      );
      return !!isExist;
    },
    [selectedOptions]
  );
  const changeAddOns = (addOn) => {
    if (addOn?.isChecked && addOn?.quantity > 0) {
      let newArray = [];
      if (selectedAddons?.length > 0) {
        newArray = [...selectedAddons];
        const existIndex = newArray.findIndex((item) => item.id === addOn.id);
        if (existIndex !== -1) {
          newArray[existIndex] = addOn;
        } else {
          newArray.push(addOn);
        }
      } else {
        newArray.push(addOn);
      }
      setSelectedAddOns(newArray);
    } else {
      let filter = selectedAddons.filter((item) => item.id !== addOn.id);
      setSelectedAddOns(filter);
    }
  };
  const handleTotalPrice = () => {
    let price;
    if (productUpdate) {
      if (modalData.length > 0) {
        price = modalData?.[0]?.price;
      }
    } else {
      // price = product?.price;
      price = (data || product)?.price;
    }
    if (selectedOptions?.length > 0) {
      selectedOptions?.forEach(
        (item) => (price += Number.parseInt(item?.optionPrice))
      );
    }
    const addOnsTotal =
      selectedAddons?.reduce((sum, addOn) => {
        const addOnQty = Number(addOn?.quantity) || 0;
        // In edit mode the cart can hand back addons with quantity 0 (the
        // user has effectively unselected them). Only count addons with a
        // positive quantity; for fresh selections default to 1.
        if (productUpdate && addOnQty <= 0) return sum;
        const effectiveQty = addOnQty > 0 ? addOnQty : 1;
        return sum + (Number(addOn?.price) || 0) * effectiveQty;
      }, 0) || 0;
    setTotalPrice(price * quantity + addOnsTotal);
  };
  useEffect(() => {
    if (product) {
      handleTotalPrice();
    }
  }, [quantity, modalData, selectedAddons, selectedOptions]);
  const decrementPrice = () => {
    setQuantity((prevQty) => prevQty - 1);
  };

  const incrementPrice = () => {
    if (modalData[0]?.maximum_cart_quantity) {
      if (modalData[0]?.maximum_cart_quantity <= modalData[0]?.quantity) {
        toast.error(t(out_of_limits), { id: "out-of-limits" });
      } else {
        setQuantity((prevQty) => prevQty + 1);
      }
    } else {
      setQuantity((prevQty) => prevQty + 1);
    }
  };
  const { mutate: addFavoriteMutation } = useAddToWishlist();

  const isInCart = (id) => {
    if (productUpdate) return true;

    const storeIdToMatch = product?.store_id;
    const hasVariations = modalData?.[0]?.food_variations?.length > 0;
    const currentSig = variationSigOf(selectedOptions);

    return !!cartList?.find((item) => {
      if (item?.id !== id) return false;
      if (
        storeIdToMatch != null &&
        String(item?.store_id) !== String(storeIdToMatch)
      ) {
        return false;
      }
      if (!hasVariations) return true;
      if (!currentSig) return false;
      return variationSigOf(item?.selectedOption) === currentSig;
    });
  };

  const isInList = (id) => {
    return !!wishLists?.food?.find((wishFood) => wishFood.id === id);
  };

  const orderNow = () => {
    let checkingFor = "campaign";
    if (token) {
      handleAddToCartOnDispatch(checkingFor);
    } else {
      toast.error(not_logged_in_message);
    }
  };
  const cartResetHandler = () => {
    setClearCartModal(false);
  };

  const handleRouteToStore = () => {
    if (router.pathname !== `/store/[id]`) {
      handleStoreRedirect(modalData[0]?.store_details, router);
    }
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {
    noSsr: true,
  });

  const requiresSelection = useMemo(() => {
    const item = modalData?.[0];
    if (!item?.food_variations?.length) return false;
    return item.food_variations.some((v, idx) => {
      if (v?.required !== "on") return false;
      return !selectedOptions?.some((s) => s.choiceIndex === idx);
    });
  }, [modalData, selectedOptions]);

  const itemIsAvailable =
    modalData?.length > 0 &&
    isAvailable(
      modalData[0].available_time_starts,
      modalData[0].available_time_ends
    );
  const hasCampaignSchedule = !!modalData?.[0]?.available_date_starts;
  const showScheduleNotAvailable =
    modalData?.length > 0 && !itemIsAvailable && !hasCampaignSchedule;

  const hasVariations = modalData?.[0]?.food_variations?.length > 0;
  const hasAddOns = modalData?.[0]?.add_ons?.length > 0;
  const hasOptions = hasVariations || hasAddOns;

  const safeTotalPrice = Number(totalPrice) || 0;
  const safeAddOnsTotal = computeAddOnsTotal();
  const safeDiscountableSubtotal = safeTotalPrice - safeAddOnsTotal;
  const discountedTotalPrice =
    getDiscountedAmount(
      safeDiscountableSubtotal,
      product?.discount ?? modalData?.[0]?.discount,
      product?.discount_type ?? modalData?.[0]?.discount_type,
      product?.store_discount ?? modalData?.[0]?.store_discount,
      quantity
    ) + safeAddOnsTotal;
  const totalHasDiscount = discountedTotalPrice < safeTotalPrice;

  // Best-effort guess during loading shimmer so the modal width and
  // shimmer layout already match the eventual content.
  const guessedHasOptions =
    modalData?.length > 0
      ? hasOptions
      : Boolean(
          fromCard?.food_variations?.length > 0 ||
            fromCard?.add_ons?.length > 0 ||
            data?.food_variations?.length > 0 ||
            data?.add_ons?.length > 0
        );

  const closeButton = (
    <IconButton
      onClick={handleModalClose}
      sx={{
        zIndex: 99,
        position: "absolute",
        top: { xs: 8, md: 6 },
        right: { xs: 8, md: 6 },
        width: 24,
        height: 24,
        padding: 0,
        display: { xs: "none", md: "flex" },
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <i
        className="fi fi-rr-cross-circle"
        style={{
          fontSize: "16px",
          display: "flex",
          color: theme.palette.text.primary,
        }}
      />
    </IconButton>
  );

  const leftShimmer = (
    <Stack spacing={1.25}>
      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{
          borderRadius: "12px",
          height: { xs: 282, md: 282 },
        }}
      />
      <Stack direction="row" spacing={0.75}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            width={48}
            height={48}
            sx={{ borderRadius: "10px", flexShrink: 0 }}
          />
        ))}
      </Stack>
      <Skeleton variant="text" width="50%" height={22} />
      <Skeleton variant="text" width="80%" height={28} />
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width={120} height={32} />
    </Stack>
  );

  const rightShimmer = (
    <Stack spacing={2}>
      {Array.from({ length: 2 }).map((_, idx) => (
        <Box
          key={idx}
          sx={{
            p: 2,
            borderRadius: "12px",
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Skeleton variant="text" width="30%" height={22} />
              <Skeleton variant="text" width={60} height={20} />
            </Stack>
            {Array.from({ length: 3 }).map((__, j) => (
              <Stack
                key={j}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width={50} height={20} />
              </Stack>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );

  const shimmer = guessedHasOptions ? (
    <Box sx={{ p: { xs: 1.5, md: 2 }, width: "100%" }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{ flexWrap: { md: "nowrap" } }}
      >
        <Grid item xs={12} md={5}>
          {leftShimmer}
        </Grid>
        <Grid item xs={12} md={7}>
          {rightShimmer}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Box sx={{ p: { xs: 1.5, md: 2 }, width: "100%" }}>{leftShimmer}</Box>
  );

  const detailsLeft = (
    <FoodDetailsManager
      configData={configData}
      handleDiscountChip={handleDiscountChip}
      imageBaseUrl={imageBaseUrl}
      modalData={modalData}
      product={data || fromCard}
      t={t}
      router={router}
      isInList={isInList}
      theme={theme}
      addToWishlistHandler={addToWishlistHandler}
      removeFromWishlistHandler={removeFromWishlistHandler}
      isWishlisted={isWishlisted}
      handleRouteToStore={handleRouteToStore}
      onClose={handleModalClose}
    />
  );

  const bodyContent = hasOptions ? (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      sx={{
        p: { xs: 0, md: 2 },
        flex: { md: 1 },
        minHeight: 0,
        overflow: { md: "hidden" },
        flexWrap: { md: "nowrap" },
        m: 0,
        width: "100%",
      }}
    >
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          minHeight: 0,
          maxHeight: { md: "100%" },
          overflowY: { xs: "visible", md: "auto" },
          overflowX: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {detailsLeft}
      </Grid>
      <Grid
        item
        xs={12}
        md={7}
        sx={{
          minHeight: 0,
          maxHeight: { md: "100%" },
          overflowY: { xs: "visible", md: "auto" },
          overflowX: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack
          spacing={1.5}
          sx={{ px: { xs: 1.5, md: 0 }, mb: { xs: 2, md: 0 } }}
        >
          {hasVariations && (
            <VariationsManager
              t={t}
              modalData={modalData}
              radioCheckHandler={radioCheckHandler}
              changeChoices={changeChoices}
              selectedOptions={selectedOptions}
            />
          )}
          {hasAddOns && (
            <AddOnsManager
              t={t}
              modalData={modalData}
              changeAddOns={changeAddOns}
              selectedAddons={selectedAddons}
            />
          )}
        </Stack>
      </Grid>
    </Grid>
  ) : (
    <Box
      sx={{
        p: { xs: 0, md: 2 },
        flex: { md: 1 },
        minHeight: 0,
        overflowY: { md: "auto" },
        overflowX: "hidden",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {detailsLeft}
    </Box>
  );

  const qtyStepper = (
    <Stack
      direction="row"
      alignItems="center"
      gap="8px"
      sx={{
        flexShrink: 0,
        height: "44px",
        backgroundColor: theme.palette.background.secondary,
        borderRadius: "8px",
        px: "12px",
      }}
    >
      <IconButton
        onClick={decrementPrice}
        disabled={quantity <= 1}
        sx={{
          width: 36,
          height: 36,
          p: "6px",
          borderRadius: "8px",
          color: "neutral.1050",
          flexShrink: 0,
          "&:hover": { backgroundColor: "action.hover" },
          "&.Mui-disabled": { opacity: 0.35 },
        }}
      >
        <i
          className="fi fi-rr-minus-small"
          style={{ fontSize: 16, display: "flex", lineHeight: 1 }}
        />
      </IconButton>
      <Box
        sx={{
          width: 32,
          textAlign: "center",
          fontSize: "18px",
          fontWeight: 700,
          color: "neutral.1050",
          letterSpacing: "-0.54px",
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
        }}
      >
        {quantity}
      </Box>
      <IconButton
        onClick={incrementPrice}
        sx={{
          width: 36,
          height: 36,
          p: "6px",
          borderRadius: "8px",
          color: "neutral.1050",
          flexShrink: 0,
          "&:hover": { backgroundColor: "action.hover" },
        }}
      >
        <i
          className="fi fi-rr-plus-small"
          style={{ fontSize: 16, display: "flex", lineHeight: 1 }}
        />
      </IconButton>
    </Stack>
  );

  const addToCartButton = (
    <Button
      onClick={() => addToCard()}
      disabled={isLoading || updateIsLoading}
      sx={{
        height: 44,
        minWidth: { xs: 120, md: 160 },
        px: 3,
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 700,
        fontSize: { xs: "13px", md: "14px" },
        whiteSpace: "nowrap",
        boxShadow: "none",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
        "&:hover": {
          boxShadow: "none",
          backgroundColor: theme.palette.primary.dark,
        },
        "&.Mui-disabled": {
          color: theme.palette.background.paper,
          backgroundColor: alpha(theme.palette.primary.main, 0.55),
        },
      }}
    >
      {isLoading || updateIsLoading
        ? "..."
        : isInCart?.(product?.id)
        ? t("Update to Cart")
        : t("Add To Cart")}
    </Button>
  );

  const renderActionButtons = () => {
    if (showScheduleNotAvailable) {
      return (
        <AddOrderToCart
          isLoading={isLoading}
          isInCart={isInCart}
          product={product}
          t={t}
          addToCard={addToCard}
          orderNow={orderNow}
          router={router}
          isScheduled={modalData[0]?.schedule_order ? "true" : "false"}
          updateIsLoading={updateIsLoading}
          requiresSelection={requiresSelection}
        />
      );
    }
    // Campaign items can be ordered directly — checkout goes to
    // `?page=campaign` (handled by `orderNow`). Detect them by the
    // presence of `available_date_starts` on the source modal data,
    // matching the same signal already used by `hasCampaignSchedule`.
    if (hasCampaignSchedule) {
      return (
        <Button
          onClick={orderNow}
          disabled={isLoading || updateIsLoading || requiresSelection}
          sx={{
            height: 44,
            minWidth: { xs: 120, md: 160 },
            px: 3,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: { xs: "13px", md: "14px" },
            whiteSpace: "nowrap",
            boxShadow: "none",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.paper,
            "&:hover": {
              boxShadow: "none",
              backgroundColor: theme.palette.primary.dark,
            },
            "&.Mui-disabled": {
              color: theme.palette.background.paper,
              backgroundColor: alpha(theme.palette.primary.main, 0.55),
            },
          }}
        >
          {t("Order Now")}
        </Button>
      );
    }
    return addToCartButton;
  };

  const focusNextRequiredVariation = () => {
    const variations = modalData?.[0]?.food_variations ?? [];
    const firstMissingIdx = variations.findIndex((v, idx) => {
      if (v?.required !== "on") return false;
      return !selectedOptions?.some((s) => s.choiceIndex === idx);
    });
    if (firstMissingIdx === -1) return;
    if (typeof document === "undefined") return;
    const node = document.getElementById(`food-variation-${firstMissingIdx}`);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    const highlightColor = alpha(theme.palette.error.main, 0.45);
    node.style.boxShadow = `0 0 0 2px ${highlightColor}`;
    node.style.borderColor = theme.palette.error.main;
    window.setTimeout(() => {
      node.style.boxShadow = "";
      node.style.borderColor = "";
    }, 1400);
  };

  const requiredCta = (
    <Button
      fullWidth
      disableElevation
      onClick={focusNextRequiredVariation}
      sx={{
        height: 48,
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 700,
        fontSize: { xs: "14px", md: "15px" },
        boxShadow: "none",
        backgroundColor: alpha(theme.palette.text.primary, 0.06),
        color: theme.palette.text.secondary,
        "&:hover": {
          backgroundColor: alpha(theme.palette.text.primary, 0.1),
          boxShadow: "none",
        },
      }}
    >
      {t("Choose Required Option")}
    </Button>
  );

  const stickyBar = !cardDataIsLoading && modalData.length > 0 && (
    <Box
      sx={{
        flexShrink: 0,
        px: { xs: 1.5, md: 2 },
        py: { xs: 1.25, md: 1.5 },
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        zIndex: 2,
      }}
    >
      {showScheduleNotAvailable ? (
        renderActionButtons()
      ) : requiresSelection ? (
        requiredCta
      ) : hasOptions && !isMobile ? (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {t("Total")}
              </Typography>
              {/* <Typography
                sx={{
                  fontSize: { xs: "11px", md: "12px" },
                  color: theme.palette.text.secondary,
                }}
              >
                {t("(Inc. VAT/TAX)")}
              </Typography> */}
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "16px", md: "18px" },
                  color: theme.palette.text.primary,
                  whiteSpace: "nowrap",
                }}
              >
                {getAmountWithSign(discountedTotalPrice)}
              </Typography>
              {totalHasDiscount && (
                <Typography
                  sx={{
                    fontSize: { xs: "12px", md: "13px" },
                    color: theme.palette.text.secondary,
                    textDecoration: "line-through",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getAmountWithSign(safeTotalPrice)}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {qtyStepper}
            <Box sx={{ flex: { xs: 1, sm: "0 0 auto" } }}>
              {renderActionButtons()}
            </Box>
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={1} sx={{ width: "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {t("Total")}
              </Typography>
              {/* <Typography
                sx={{ fontSize: "11px", color: theme.palette.text.secondary }}
              >
                {t("(Inc. VAT/TAX)")}
              </Typography> */}
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={0.75}>
              {totalHasDiscount && (
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.text.secondary,
                    textDecoration: "line-through",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getAmountWithSign(safeTotalPrice)}
                </Typography>
              )}
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: theme.palette.text.primary,
                  whiteSpace: "nowrap",
                }}
              >
                {getAmountWithSign(discountedTotalPrice)}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1.5}
          >
            {qtyStepper}
            {renderActionButtons()}
          </Stack>
        </Stack>
      )}
    </Box>
  );

  const notFoundContent = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.25}
      sx={{
        px: 3,
        py: { xs: 6, md: 8 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(theme.palette.error.main, 0.12),
          color: theme.palette.error.main,
          fontSize: 32,
          lineHeight: 1,
        }}
        aria-hidden
      >
        <i className="fi fi-rr-utensils" style={{ display: "flex" }} />
      </Box>
      <Typography fontSize="18px" fontWeight={700} color="text.primary">
        {t("Food not found")}
      </Typography>
      <Typography fontSize="14px" color="text.secondary" sx={{ maxWidth: 320 }}>
        {t(
          "This item is no longer available. It may have been removed or replaced by the store."
        )}
      </Typography>
    </Stack>
  );

  const scrollableBody = (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: { xs: "auto", md: "hidden" },
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        display: { xs: "block", md: "flex" },
        flexDirection: { md: "column" },
      }}
    >
      {cardDataIsLoading
        ? shimmer
        : itemNotFound
        ? notFoundContent
        : bodyContent}
    </Box>
  );

  const clearCart = clearCartModal && (
    <CustomModal
      openModal={clearCartModal}
      handleClose={() => cartResetHandler()}
    >
      <CartClearModal
        handleClose={() => cartResetHandler()}
        dispatchRedux={dispatch}
      />
    </CustomModal>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleModalClose}
          sx={{ zIndex: (t) => t.zIndex.modal + 10 }}
          PaperProps={{
            sx: {
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              maxHeight: "70vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {closeButton}
          {scrollableBody}
          {stickyBar}
        </Drawer>
        {clearCart}
      </>
    );
  }

  return (
    <>
      <Modal open={open} onClose={handleModalClose} disableAutoFocus={true}>
        <FoodDetailModalStyle
          foodmodal={!guessedHasOptions ? "true" : undefined}
          sx={{
            bgcolor: "background.paper",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: { md: "560px" },
            maxHeight: { md: "560px" },
            boxShadow: "0 24px 56px rgba(17,24,39,0.16)",
          }}
        >
          {closeButton}
          {scrollableBody}
          {stickyBar}
          {clearCart}
        </FoodDetailModalStyle>
      </Modal>
    </>
  );
};

export default FoodDetailModal;
