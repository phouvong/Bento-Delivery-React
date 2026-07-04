import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Typography, useTheme, alpha } from "@mui/material";
import { t } from "i18next";
import { Stack } from "@mui/system";
import { CustomSizeBox } from "../ProductDetails.style";

const getSelectedIndex = (options, selectedOptions) => {
  let index = 0;
  options?.forEach((option, indexNumber) => {
    if (selectedOptions?.type?.split("-")?.includes(option.trim())) {
      index = indexNumber;
    }
  });
  return index;
};

const VariationsManager = ({ productDetailsData, handleChoices }) => {
  const theme = useTheme();
  const [choice, setChoice] = useState(null);
  const [value, setValue] = useState(
    productDetailsData?.choice_options?.map((i) => ({
      type: i?.title,
      value:
        i?.options[
          getSelectedIndex(i?.options, productDetailsData?.selectedOption?.[0])
        ],
    }))
  );

  const handleClick = (values, index, choice) => {
    setValue((prev) => {
      prev[index].value = values;
      return [...prev];
    });
    setChoice(choice);
  };

  useEffect(() => {
    handleChoice(value);
  }, [value]);

  const handleChoice = (value) => {
    let finalVariation = "";
    value.forEach((item) => (finalVariation += item.value));
    let option = productDetailsData?.variations?.filter(
      (item) =>
        item.type.replaceAll("-", "").replaceAll(" ", "") ===
        finalVariation.replaceAll("-", "").replaceAll(" ", "")
    );

    if (choice && option?.length > 0) {
      handleChoices(option[0], choice);
    }
  };

  return (
    <CustomStackFullWidth
      spacing={2}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: "12px",
        border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {productDetailsData?.choice_options?.map((choiceItem, choiceIndex) => {
        const selectedValue = value?.[choiceIndex]?.value;

        return (
          <CustomStackFullWidth spacing={1} key={choiceIndex}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "13px", md: "14px" },
                  color: theme.palette.text.primary,
                }}
              >
                {choiceItem?.title}
              </Typography>
              {selectedValue && (
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "13px", md: "14px" },
                    color: theme.palette.primary.main,
                  }}
                >
                  ({selectedValue})
                </Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {choiceItem?.options?.map((item, index) => (
                <CustomSizeBox
                  key={index}
                  onClick={() => handleClick(item, choiceIndex, choiceItem)}
                  size={item}
                  productsize={selectedValue}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "inherit",
                      letterSpacing: "-0.42px",
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                      textTransform: "capitalize",
                    }}
                  >
                    {item}
                  </Typography>
                </CustomSizeBox>
              ))}
            </Stack>
          </CustomStackFullWidth>
        );
      })}

      {productDetailsData?.selectedOption?.length > 0 &&
        productDetailsData?.selectedOption?.[0]?.stock == 0 && (
          <Typography
            sx={{
              color: theme.palette.error.main,
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            *{t("This variation is out of stock")}
          </Typography>
        )}
    </CustomStackFullWidth>
  );
};

export default VariationsManager;
