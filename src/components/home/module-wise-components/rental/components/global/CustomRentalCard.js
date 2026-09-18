import { Typography, useTheme } from "@mui/material";
import { alpha, Box, maxHeight, Stack } from "@mui/system";
import CustomImageContainer from "components/CustomImageContainer";
import H3 from "components/typographies/H3";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import RentWithIncrementDecrement from "./RentWithIncrementDecrement";
import { t } from "i18next";
import GroupIcon from "@mui/icons-material/Group";
import AirIcon from "@mui/icons-material/Air";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import EvStationIcon from "@mui/icons-material/EvStation";
import { getAmountWithSign, getDiscountedAmount } from "helper-functions/CardHelpers";
import { useSelector } from "react-redux";
import {
  calculateTotalDiscount,
  cartItemDiscount,
  cartItemPrice,
} from "components/home/module-wise-components/rental/components/rental-checkout/checkoutHeplerFunction";
import { mainPrice } from "../utils/bookingHepler";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";

const Price = ({ price, item }) => {
  const { cartList } = useSelector((state) => state.cart);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: "5px",
      }}
    >
      {(cartItemDiscount(
        item,
        cartList?.user_data?.rental_type,
        cartList?.user_data?.estimated_hours,
        cartList?.user_data?.distance
      ) > 0 ) &&(
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            textDecoration: "line-through",
            color: (theme) => theme.palette.neutral[400],
          }}
        >
          {getAmountWithSign(
            cartItemPrice(
              item,
              cartList?.user_data?.rental_type,
              cartList?.user_data?.estimated_hours,
              cartList?.user_data?.distance
            )
          )}
        </Typography>
      )}
      <Typography
        sx={{
          display: "flex",
          fontWeight: "600",
          alignItems: "center",
          fontSize: "16px",
        }}
      >
        {getAmountWithSign(
          Math.max(
            cartItemPrice(
              item,
              cartList?.user_data?.rental_type,
              cartList?.user_data?.estimated_hours,
              cartList?.user_data?.distance
            ) -
            cartItemDiscount(
              item,
              cartList?.user_data?.rental_type,
              cartList?.user_data?.estimated_hours,
              cartList?.user_data?.distance
            ),
            0
          )
        )}
        <Typography
          component="span"
          sx={{
            color: (theme) => theme.palette.neutral[400],
            fontSize: "12px",
          }}
        ></Typography>{" "}
      </Typography>
    </Box>
  );
};

const Image = ({ imgWidth = "80px", imgHeight = "80px", itemImage }) => {
  return (
    <CustomImageContainer
      src={itemImage}
      width={imgWidth}
      height={imgHeight}
      sx={{
        border: (theme) =>
          `1px solid ${alpha(theme.palette.neutral[400], 0.4)} !important`,
        borderRadius: "5px",
      }}
    />
  );
};

const CardDetailsSection = ({
  gap = "15px",
  showIcons = true,
  quantity,
  item,
  showPrice
}) => {
  const { cartList } = useSelector((state) => state.cart);
  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: (theme) => theme.palette.neutral[500],
          }}
        >
          {item?.provider?.name}
        </Typography>
        <VerifiedStoreBadge verified={item?.provider?.verified_seller} fontSize="14px" />
      </Stack>
      <H3
        text={item?.vehicle?.name}
        sx={{
          color: (theme) => alpha(theme.palette.neutral[1000], 0.8),
          maxHeight: "none",
        }}
      />
      {showIcons ? (
        <Stack
          direction="row"
          flexWrap="wrap"
          rowGap={0.5}
          columnGap={2}
          sx={{
            mt: "4px",
            color: (theme) => theme.palette.neutral[400],
            svg: { fontSize: "16px", marginBottom: "2px" },
            marginInlineEnd: "10px",
          }}
        >
          {item?.vehicle?.seating_capacity && (
            <Stack direction="row" spacing={1} alignItems="center">
              <GroupIcon />
              <Typography variant="body2" component="div">
                {item?.vehicle?.seating_capacity} {t("Seats")}
              </Typography>
            </Stack>
          )}
          {item?.vehicles?.type && (
            <Stack direction="row" spacing={1} alignItems="center">
              <DirectionsCarFilledIcon />
              <Typography variant="body2" component="div" mt={1}>
                {item?.vehicles?.type}
              </Typography>
            </Stack>
          )}
          {item?.vehicle?.air_condition > 0 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <AirIcon />
              <Typography variant="body2" component="div" mt={1} sx={{textTransform:"capitalize"}}>
                {t("ac")}
              </Typography>
            </Stack>
          )}
          {item?.vehicle?.air_condition===0 && (
            <Stack direction="row" spacing={1} alignItems="center">
             <AirIcon />
              <Typography variant="body2" component="div" mt={1} sx={{textTransform:"capitalize"}}>
                {t("non ac")}
              </Typography>
            </Stack>
          )}

          {item?.vehicle?.transmission_type && (
            <Stack direction="row" spacing={1} alignItems="center">
              <ManageHistoryIcon />
              <Typography variant="body2" component="div" mt={1} sx={{textTransform:"capitalize"}}>
                {item?.vehicle?.transmission_type.replace("_"," ")}
              </Typography>
            </Stack>
          )}

          {item?.vehicle?.fuel_type && (
            <Stack direction="row" spacing={1} alignItems="center">
              <EvStationIcon />
              <Typography variant="body2" component="div" mt={1} sx={{textTransform:"capitalize"}}>
                {item?.vehicle?.fuel_type.replace("_"," ")}
              </Typography>
            </Stack>
          )}
         
        </Stack>
      ) : (
        <Typography
          sx={{
            mt: "5px",
            color: (theme) => theme.palette.neutral[500],
            fontWeight: "400",
            fontSize: "14px",
              whiteSpace: "nowrap",
          }}
        >
          {t("Quantity")}:{" "}
          <Typography
            component="span"
            sx={{
              fontWeight: "700",
              fontSize: "14px",
              color: (theme) => theme.palette.neutral[500],
            }}
          >
            {item?.quantity}
          </Typography>
        </Typography>
      )}
      {showPrice ? (
        <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="baseline"
        columnGap={0.5}
      >
         {item?.vehicle?.discount_price > 0 ||
         item?.vehicle?.provider?.discount?.discount > 0 ? (
          <Typography
            className="original-price"
            sx={{
              fontSize:item?.vehicle?.discount_type === "amount"? "18px":"13px",
              fontWeight:item?.vehicle?.discount_type === "amount"?"600": "400",
              textDecoration:item?.vehicle?.discount_type === "amount" ?"none": "line-through",
              color: (theme) => item?.vehicle?.discount_type === "amount" ?theme.palette.neutral[1000]:theme.palette.neutral[400],
            }}
          >
            {getAmountWithSign(mainPrice(item?.vehicle,cartList?.user_data?.rental_type))}
          </Typography>
        ) : null}
          { item?.vehicle?.discount_type === "amount" ?null:(
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "600",
                color: (theme) => theme.palette.neutral[1000],
              }}
            >
              {getAmountWithSign(
                getDiscountedAmount(
                  mainPrice(item?.vehicle,cartList?.user_data?.rental_type),
                  item?.vehicle?.discount_price,
                  item?.vehicle?.discount_type,
                  item?.provider?.discount,
                  1,
                )
              )}{" "}
            </Typography>
          )}

          {cartList?.user_data?.rental_type === "hourly" ? (
            <Typography>{t("/hr")}</Typography>
          ) : cartList?.user_data?.rental_type === "day_wise" ? (
            <Typography>{t("/day")}</Typography>
          ) : (
            <Typography>{t("/km")}</Typography>
          )}

        </Stack>
      ):null}
        
       {/* <Typography>{mainPrice(item?.vehicle,cartList?.user_data?.rental_type)}</Typography> */}
    </Box>
  );
};
const Counter = ({
  isVerticle,
  isShowPrice = true,
  quantity,
  handleIncrement,
  itemId,
  handleDecrement,
  updateIsLoading,
  removeItemCart,
  price,
  item,

}) => {
  return (
    <Stack
      direction={{ xs: "row", sm: "column" }}
      sx={{ gap: "15px", alignItems: "flex-end" }}
      justifyContent={{ xs: "space-between", md: "flex-end" }}
    >
      {isShowPrice && <Price price={price} item={item} />}

      <RentWithIncrementDecrement
        isProductExist={true}
        isVerticle={isVerticle}
        count={quantity}
        handleIncrement={handleIncrement}
        itemId={itemId}
        handleDecrement={handleDecrement}
        updateLoading={updateIsLoading}
        removeItemCart={removeItemCart}
        availableQuantity={item?.vehicle?.total_vehicle_count}
        item={item}
      />
    </Stack>
  );
};

const CustomRentalCardWrapper = ({ children, sx, ...rest }) => {
  return (
    <CustomBoxFullWidth
      sx={{
        display: "flex",
        background: (theme) => alpha(theme.palette.neutral[200], 0.2),
        gap: { xs: "10px", md: "0px" },
        borderRadius: "10px",
        justifyContent: "space-between",
        alignItems: "center",

        ...sx,
      }}
      {...rest}
    >
      {children}
    </CustomBoxFullWidth>
  );
};

const LicenseNumber = ({ sx, licensesNumber }) => {
  return (
    <Box sx={sx}>
      <Typography
        sx={{
          fontWeight: "400",
          fontSize: "14px",
          color: (theme) => theme.palette.neutral[400],
        }}
      >
        {t("Vehicle License Number")}
      </Typography>
      <Stack
        direction="row"
        spacing={{
          xs:0,md:1
        }}
        alignItems="center"
        // justifyContent="center"
         flexWrap="wrap"
      >
        {licensesNumber?.map((license, index) => (
          <Typography
            key={license}
            sx={{
              fontWeight: "500",
              fontSize: "14px",

              color: (theme) => theme.palette.neutral[500],
            }}
          >
            {license}
            {index < licensesNumber.length - 1 ? "," : ""}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
};

export const CustomRentalCard = {
  root: CustomRentalCardWrapper,
  image: Image,
  price: Price,
  counter: Counter,
  details: CardDetailsSection,
  licenseNumber: LicenseNumber,
};
