import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Radio,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { getAmountWithSign } from "../../../helper-functions/CardHelpers";

export const ChoiceValues = (props) => {
  const {
    choice,
    t,
    radioCheckHandler,
    choiceIndex,
    changeChoices,
    selectedOptions,
  } = props;
  const theme = useTheme();
  const [radioData, setRadioData] = useState({ isChecked: false });

  useEffect(() => {
    radioData?.option &&
      changeChoices(
        radioData.e,
        radioData.option,
        radioData.index,
        radioData.choiceIndex,
        radioData.choiceRequired,
        radioData.choiceType,
        radioData.isChecked
      );
  }, [radioData]);

  const handleRadioData = (
    e,
    option,
    index,
    choiceIndex,
    choiceRequired,
    choiceType
  ) => {
    if (radioData?.choiceIndex === choiceIndex && radioData?.index === index) {
      setRadioData({
        ...radioData,
        isChecked: !radioData.isChecked,
        e,
        option,
        index,
        choiceIndex,
        choiceRequired,
        choiceType,
      });
    } else {
      setRadioData({
        ...radioData,
        isChecked: true,
        e,
        option,
        index,
        choiceIndex,
        choiceRequired,
        choiceType,
      });
    }
  };

  const isRequired = choice?.required === "on";
  const isMulti = choice?.type === "multi";
  const min = Number.parseInt(choice?.min) || 1;
  const max = Number.parseInt(choice?.max) || 1;
  const selectionCount = Array.isArray(selectedOptions)
    ? selectedOptions.filter((s) => s?.choiceIndex === choiceIndex).length
    : 0;
  const isCompleted = isRequired
    ? isMulti
      ? selectionCount >= min
      : selectionCount >= 1
    : false;
  const subtitle = isMulti
    ? `${t("Select any of")} ${max}${isRequired ? "" : ` (${t("Optional")})`}`
    : `${t("Select any of")} ${min}${isRequired ? "" : ` (${t("Optional")})`}`;

  return (
    <Box
      id={`food-variation-${choiceIndex}`}
      sx={{
        borderRadius: "12px",
        border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
        scrollMarginTop: "8px",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 1.5, md: 2 },
          py: { xs: 1.25, md: 1.5 },
          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
        }}
      >
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "15px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {choice?.name}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "11px", md: "12px" },
              color: theme.palette.text.secondary,
            }}
          >
            {subtitle}
          </Typography>
        </Stack>
        {isRequired && (
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: "999px",
              backgroundColor: isCompleted
                ? alpha(theme.palette.success.main, 0.12)
                : alpha(theme.palette.error.main, 0.12),
              color: isCompleted
                ? theme.palette.success.main
                : theme.palette.error.main,
              fontSize: "11px",
              fontWeight: 600,
              flexShrink: 0,
              ml: 1,
              transition: "background-color 0.2s ease, color 0.2s ease",
            }}
          >
            {isCompleted ? t("Completed") : t("Required")}
          </Box>
        )}
      </Stack>

      <Stack divider={null}>
        {choice?.values?.map((option, index) => {
          const checked = radioCheckHandler(choiceIndex, option, index);
          return (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              onClick={(e) => {
                if (choice?.type === "single") {
                  handleRadioData(
                    e,
                    option,
                    index,
                    choiceIndex,
                    choice.required,
                    choice?.type
                  );
                } else {
                  changeChoices(
                    { target: { checked: !checked } },
                    option,
                    index,
                    choiceIndex,
                    choice.required,
                    choice?.type,
                    !checked
                  );
                }
              }}
              sx={{
                px: { xs: 1.5, md: 2 },
                py: { xs: 0.5, md: 0.75 },
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.text.primary, 0.02),
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "13px", md: "14px" },
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                {option?.label}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", md: "14px" },
                    color: theme.palette.text.secondary,
                  }}
                >
                  {option?.optionPrice === "0" ||
                  Number(option?.optionPrice) === 0
                    ? t("Free")
                    : `+${getAmountWithSign(option?.optionPrice)}`}
                </Typography>
                {choice?.type === "single" ? (
                  <Radio
                    checked={checked}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleRadioData(
                        e,
                        option,
                        index,
                        choiceIndex,
                        choice.required,
                        choice?.type
                      )
                    }
                    sx={{ p: 0.5 }}
                  />
                ) : (
                  <Checkbox
                    checked={!!option?.isSelected || checked}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      changeChoices(
                        e,
                        option,
                        index,
                        choiceIndex,
                        choice.required,
                        choice?.type,
                        e.target.checked
                      )
                    }
                    sx={{ p: 0.5 }}
                  />
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};
