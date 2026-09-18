import { Grid, Stack, Typography } from "@mui/material";
import { FoodHalalHaram } from "components/cards/SpecialCard";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { CustomTypographyEllipsis } from "styled-components/CustomTypographies.style";
import CustomDivider from "../../../CustomDivider";
import CustomImageContainer from "../../../CustomImageContainer";
import PrescriptionOrderSummery from "../prescription-order/PrescriptionOrderSummery";
import SingleOrderAttachment from "../singleOrderAttachment";

const getAddOnsNames = (addOns) => {
  if (!addOns || addOns.length === 0) return "";

  const names = addOns.map(
    (item, index) =>
      `${item.name}(${item.quantity})${index !== addOns.length - 1 ? "," : ""}`,
  );

  return names.join(" ");
};

const OrderInfo = ({ data, summaryData, configData, items, t, isSmall }) => {
  return (
    <Grid item xs={12} sm={12} md={12}>
      {!data?.prescription_order &&
      summaryData?.module_type === "pharmacy" &&
      summaryData?.order_attachment_full_url &&
      summaryData?.order_attachment_full_url?.length &&
      summaryData?.order_attachment ? (
        <SingleOrderAttachment
          title="Prescription"
          trackOrderData={summaryData}
          configData={configData}
        />
      ) : null}
      {data?.prescription_order ? (
        <PrescriptionOrderSummery data={data} />
      ) : null}
      {items &&
        items?.length > 0 &&
        items?.map((product) => (
          <Grid
            container
            alignItems="flex-start"
            md={12}
            xs={12}
            spacing={{ xs: 1 }}
            key={product?.id}
            mb="13px"
            pl={{ xs: "0px", sm: "20px", md: "25px" }}
          >
            <Grid item xs={3} sm={1.2} md={1.2}>
              {product.item_campaign_id ? (
                <CustomImageContainer
                  src={product?.image_full_url}
                  height="63px"
                  maxWidth="63px"
                  width="100%"
                  loading="lazy"
                  smHeight="50px"
                />
              ) : (
                <CustomImageContainer
                  src={product?.image_full_url}
                  height="63px"
                  maxWidth="63px"
                  width="100%"
                  loading="lazy"
                  smHeight="70px"
                  borderRadius=".7rem"
                />
              )}
            </Grid>
            <Grid item md={10.8} xs={9} sm={10.8} align="left">
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                paddingBottom={{ xs: "5px", md: "0px" }}
              >
                <Stack>
                  <CustomTypographyEllipsis fontWeight="500" fontSize="13px">
                    <Stack flexDirection={"row"} gap={"4px"}>
                      {t(product?.item_details?.name)}
                      {product?.item_details?.halal_tag_status &&
                      product?.item_details?.is_halal ? (
                        <FoodHalalHaram position="relative" width={23} />
                      ) : (
                        ""
                      )}
                    </Stack>
                  </CustomTypographyEllipsis>
                  <Typography variant="body2" mt="3px">
                    {t(product?.item_details?.unit_type)}
                  </Typography>
                  <Typography variant="body2" mt="5px">
                    {t("Unit Price")} :{" "}
                    {getAmountWithSign(product?.item_details?.price)}
                  </Typography>
                  {product?.add_ons.length > 0 && (
                    <Typography mt="3px" variant="body2">
                      {t("Addons")}: {getAddOnsNames(product?.add_ons)}
                    </Typography>
                  )}
                </Stack>
                <Stack
                  direction={isSmall ? "column-reverse" : "column"}
                  gap="5px"
                >
                  <Typography fontSize="14px" fontWeight="bold">
                    {getAmountWithSign(product?.item_details?.price)}
                  </Typography>

                  <Typography variant="body2" mt="8px">
                    {t("Qty")}: {product?.quantity}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <CustomDivider border="1px" />
          </Grid>
        ))}
    </Grid>
  );
};

OrderInfo.propTypes = {};

export default OrderInfo;
