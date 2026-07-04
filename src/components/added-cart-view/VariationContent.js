import React from "react";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import { getSelectedAddOn } from "../../helper-functions/CardHelpers";
import VisibleVariations from "./FoodVariations";

const VariationContent = ({ cartItem }) => {
  const { t } = useTranslation();
  const handleProduct = () => {
    if (cartItem?.selectedOption?.length > 0) {
      return (
        <>
          {cartItem?.choice_options?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Typography color="customColor.textGray" fontSize="12px">
                  {item?.title}:
                </Typography>
                <Typography color="text.primary" fontSize="12px">
                  {cartItem?.selectedOption?.[0]?.type.split("-")?.[index]}
                </Typography>
                {index < cartItem?.choice_options?.length - 1 && (
                  <Typography color="text.secondary" fontSize="12px">
                    ,
                  </Typography>
                )}
              </React.Fragment>
            );
          })}
        </>
      );
    }
  };
  const handleFood = () => {
    return (
      <>
        <VisibleVariations variations={cartItem?.food_variations} t={t} />
        {(() => {
          const addonText = getSelectedAddOn(cartItem?.selectedAddons);
          return addonText ? (
            <>
              <Typography fontSize="12px" color="text.primary">
                {t("Addon")}:
              </Typography>
              <Typography fontSize="12px" color="text.secondary">
                {addonText}
              </Typography>
            </>
          ) : null;
        })()}
      </>
    );
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      gap="4px"
      sx={{ fontSize: "12px" }}
    >
      {cartItem?.module_type === "food" ? handleFood() : handleProduct()}
    </Stack>
  );
};

VariationContent.propTypes = {};

export default VariationContent;
