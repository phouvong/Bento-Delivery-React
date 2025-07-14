import { AlertTitle } from "@mui/lab";
import {
  Alert,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useGetModule from "../../../../api-manage/hooks/react-query/useGetModule";
import { setModules } from "../../../../redux/slices/configData";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import {
  module_bottom,
  module_header,
} from "../../../../utils/toasterMessages";
import CustomImageContainer from "../../../CustomImageContainer";
import CustomAlert from "../../../alert/CustomAlert";
import CustomModal from "../../../modal";
import { zoneWiseModule } from "../../../module-select/ModuleSelect"; 
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import { setSelectedModule } from "redux/slices/utils";
import { setCartList } from "redux/slices/cart";
import useGetBookingList from "api-manage/hooks/react-query/useGetBookingList";
import useGetAllCartList from "api-manage/hooks/react-query/add-cart/useGetAllCartList";
import { handleProductValueWithOutDiscount } from "utils/CustomFunctions";
import { getSelectedVariations } from "components/header/second-navbar/SecondNavbar";
import { getGuestId } from "helper-functions/getToken";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import useDeleteAllCarts from "api-manage/hooks/react-query/useDeleteAllCarts";
import toast from "react-hot-toast";

export const CustomPaper = styled(Paper)(({ theme }) => ({
  //minWidth: "500px",
  borderRadius: "4px",
  padding: "2rem",
  background: theme.palette.neutral[100],
  [theme.breakpoints.down("sm")]: {
    padding: ".6rem",
    // minWidth: "320px",
  },
}));

const CustomChildPaper = styled(Paper)(({ theme, is_previously_selected }) => ({
  cursor: "pointer",
  padding: "1rem",

  boxShadow:
    is_previously_selected &&
    `0px 0px 2px rgba(145, 158, 171, 0.2), 0px 0px 10px ${theme.palette.primary.main}`,
  "&:hover": {
    "& img": {
      transform: "scale(1.1)",
      transition: "all 0.3s ease-in-out",
    },
  },
}));

const Shimmer = () => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {[...Array(5)]?.map((item, index) => {
        return (
          <Grid item xs={4} sm={4} md={4} key={index}>
            <CustomChildPaper elevation={10}>
              <CustomStackFullWidth
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <Skeleton
                  variant="rectangle"
                  height={isXSmall ? "40px" : "100px"}
                  width={isXSmall ? "40px" : "100px"}
                />
                <Skeleton variant="text" height="20px" width="30px" />
              </CustomStackFullWidth>
            </CustomChildPaper>
          </Grid>
        );
      })}
    </>
  );
};
export const ModuleSelection = ({
  location,
  closeModal,
  isSelected,
  fromsignup,
  disableAutoFocus,
  setOpenModuleSelection,
  zoneId
}) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(location);
  const { configData } = useSelector((state) => state.configData);
  const { cartList } = useSelector((state) => state.cart);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { t } = useTranslation();
  const { data, refetch, isRefetching, isFetched } = useGetModule();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {mutate} = useDeleteAllCarts();
  const moduleType = getCurrentModuleType();
  const cartListSuccessHandler = (res) => {
    if (res) {
      const tempCartLists = res?.map((item) => ({
        ...item?.item,
        cartItemId: item?.id,
        totalPrice:
          handleProductValueWithOutDiscount(item?.item) * item?.quantity,
        selectedAddons: item?.item?.addons,
        quantity: item?.quantity,
        food_variations: item?.item?.food_variations,
        itemBasePrice: item?.item?.price,
        selectedOption:
          moduleType !== "food"
            ? item?.variation
            : getSelectedVariations(item?.item?.food_variations),
      }));
      dispatch(setCartList(tempCartLists));
    }
    router.push("/home");
      setOpenModal(false);
      closeModal?.();
  };

  const {
    data: cartListData,
    refetch: cartListRefetch,
    isLoading,
  } = useGetAllCartList(getGuestId(),cartListSuccessHandler);

  const bookingSuccess = (res) => {
    dispatch(setCartList(res));
    router.push("/home");
    setOpenModal(false);
    closeModal?.(selectedModule);
  };
  const {
    data: bookingLists,
    isLoading: bookingListsIsLoading,
    refetch: bookingRefetch,
  } = useGetBookingList(getGuestId(), bookingSuccess);



  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    location && refetch();
  }, []);
  useEffect(() => {
    if (data?.length > 0) {
      dispatch(setModules(data));
    }
  }, [data]);
  const handleCloseModal = () => {
    setOpenModal(false);
    closeModal?.(selectedModule);
  };

  const handleItemOnClick = (item) => {
    localStorage.setItem("module", JSON.stringify(item));
    dispatch(setSelectedModule(item));
    if(cartList?.carts?.length > 0 && item?.module_type === "rental"){
      const pickupZoneIds = cartList?.carts[0]?.provider?.pickup_zone_id;
      const targetZoneIds = Array.isArray(zoneId) ? zoneId : JSON.parse(zoneId);
      const inZone = targetZoneIds.some(id => pickupZoneIds?.includes(id.toString()));
      if(inZone) {
        toast.success(t("Location set successfully"));
        router.push("/home");
            setOpenModal(false);
            closeModal?.(item);
      }else{
        mutate(null, {
          onSuccess: (res) => {
            dispatch(setCartList(res));
            toast.error(t("Your cart has been cleared as the selected zone does not support the previous pickup point."));
            router.push("/home");
            setOpenModal(false);
            closeModal?.();
          },
          onError: (error) => {
            toast.error(error.response.data.message);
          }
        })
      }
    }else{
    router.push("/home");
    setOpenModal(false);
    closeModal?.(item);
    }
    
    // if (item?.module_type === "rental") {
    //  bookingRefetch();
    // } else {
    //    cartListRefetch();
    // }
   
  };
  const handleSingleModule = (data) => {
    dispatch(setSelectedModule(data));
    localStorage.setItem("module", JSON.stringify(data));
    setOpenModuleSelection?.(false);
    router.push("/home");
  };
  const innerContent = () => {
    if (isFetched) {
      if (data?.length === 0) {
        return (
          <CustomModal openModal={openModal} handleClose={handleCloseModal}>
            <CustomPaper sx={{ position: "relative" }}>
              <IconButton
                onClick={() => handleCloseModal?.()}
                sx={{ position: "absolute", top: 5, right: 8 }}
              >
                <CloseIcon />
              </IconButton>
              <CustomStackFullWidth
                alignItems="center"
                justifyContent="center"
                spacing={{ xs: 2, sm: 2 }}
              >
                <ErrorIcon sx={{ fontSize: "70px", color: "red" }} />
                <Alert severity="error">
                  <AlertTitle>{t("No module found")}</AlertTitle>
                  {t("Contact with the site owner to activate modules.")}
                </Alert>
              </CustomStackFullWidth>
            </CustomPaper>
          </CustomModal>
        );
      }  else {
        return (
          <CustomModal
            openModal={openModal}
            handleClose={handleCloseModal}
            disableAutoFocus={disableAutoFocus}
          >
            <CustomPaper>
              <CustomStackFullWidth spacing={2}>
                <Typography variant="h6" textAlign="center">
                  {t(module_header)}
                </Typography>
                <Grid container spacing={isXSmall ? 1 : 2} width="98%">
                  {data &&
                    (data?.length > 0 ? (
                      zoneWiseModule?.(data)?.map((item, index) => {
                        return (
                          <Grid item xs={4} sm={4} md={4} key={index}>
                            <CustomChildPaper
                              elevation={10}
                              onClick={() => handleItemOnClick(item)}
                              is_previously_selected={
                                isSelected?.module_type === item?.module_type &&
                                isSelected?.id === item?.id
                              }
                            >
                              <CustomStackFullWidth
                                alignItems="center"
                                justifyContent="center"
                                spacing={1}
                              >
                                <CustomImageContainer
                                  src={item?.icon_full_url}
                                  alt="mobile"
                                  height={isXSmall ? "40px" : "100px"}
                                  width={isXSmall ? "40px" : "100px"}
                                  objectFit="cover"
                                />
                                <Typography
                                  fontSize={{ xs: "13px", sm: "16px" }}
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: "1",
                                    WebkitBoxOrient: "vertical",
                                
                                  }}
                                >
                                  {item?.module_name}
                                </Typography>
                              </CustomStackFullWidth>
                            </CustomChildPaper>
                          </Grid>
                        );
                      })
                    ) : (
                      <p>deactivated module handle</p>
                    ))}
                  <Grid item xs={12}>
                    <CustomAlert type="info" text={module_bottom} />
                  </Grid>
                </Grid>
              </CustomStackFullWidth>
            </CustomPaper>
          </CustomModal>
        );
      }
    } else {
      return (
        <CustomModal openModal={openModal} handleClose={handleCloseModal}>
          <CustomPaper>
            <Grid container spacing={isXSmall ? 0.5 : 2}>
              <Shimmer />
            </Grid>
          </CustomPaper>
        </CustomModal>
      );
    }
  };

  return <>{innerContent()}</>;
};
