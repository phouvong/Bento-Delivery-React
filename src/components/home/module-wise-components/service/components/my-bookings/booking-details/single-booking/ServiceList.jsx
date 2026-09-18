import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";

const getVariationNames = (variations) => {
  if (!variations || variations.length === 0) return "";

  return variations
    .map((variation) => variation?.name ?? variation?.type)
    .filter(Boolean)
    .join(", ");
};

const ServiceList = ({ items, t }) => {
  const theme = useTheme();

  if (!items || items.length === 0) return null;

  return (
    <Box
      sx={{
        border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
        borderRadius: "8px",
        padding: { xs: "14px", md: "16px" },
        width: "100%",
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "0.5px",
          color: theme.palette.text.primary,
          mb: "14px",
        }}
      >
        {t("Service List")}
      </Typography>

      <Stack
        divider={
          <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }} />
        }
        gap="14px"
      >
        {items.map((product) => {
          const details = product?.item_details;
          const originalPrice = Number(details?.price) || 0;
          const calculatedPrice = Number(details?.calculated_price ?? originalPrice) || originalPrice;
          const showStrike = calculatedPrice < originalPrice;
          const currentPrice = showStrike ? calculatedPrice : originalPrice;
          const variationText = getVariationNames(
            product?.item_details?.variations,
          );

          return (
            <Stack key={product?.id} gap="6px">
              <Stack direction="row" gap="8px" alignItems="flex-start">
                <CustomImageContainer
                  src={product?.image_full_url}
                  width="44px"
                  height="44px"
                  maxWidth="44px"
                  borderRadius="8px"
                  loading="lazy"
                />

                <Stack
                  direction="row"
                  flex={1}
                  gap="8px"
                  alignItems="flex-start"
                  sx={{ minWidth: 0 }}
                >
                  <Stack flex={1} gap="4px" sx={{ minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: { xs: "12px", md: "14px" },
                        fontWeight: 400,
                        color: theme.palette.text.primary,
                        letterSpacing: "-0.42px",
                      }}
                    >
                      {t(product?.item_details?.name)}
                    </Typography>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      alignItems="baseline"
                      gap="8px"
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "14px", md: "16px" },
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          letterSpacing: "-0.48px",
                        }}
                      >
                        {getAmountWithSign(currentPrice)}
                      </Typography>
                      {showStrike && (
                        <Typography
                          sx={{
                            fontSize: { xs: "12px", md: "14px" },
                            fontWeight: 400,
                            color: theme.palette.text.disabled,
                            textDecoration: "line-through",
                          }}
                        >
                          {getAmountWithSign(originalPrice)}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>

                  <Box
                    sx={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: theme.palette.background.secondary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      alignSelf: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        letterSpacing: "-0.48px",
                      }}
                    >
                      {product?.quantity}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {variationText && (
                <Typography
                  sx={{
                    fontSize: { xs: "12px", md: "14px" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "inherit",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("Variations")} :
                  </Typography>{" "}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "inherit",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {variationText}
                  </Typography>
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

ServiceList.propTypes = {};

export default ServiceList;
