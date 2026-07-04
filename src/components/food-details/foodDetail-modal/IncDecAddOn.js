import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getAmountWithSign } from "../../../helper-functions/CardHelpers";

const IncDecAddOn = ({ changeAddOns, add_on, selectedAddons }) => {
  const theme = useTheme();
  const [addOn, setAddOn] = useState({
    name: "",
    isChecked: false,
    quantity: 0,
  });

  useEffect(() => {
    if (selectedAddons?.length > 0) {
      const existedAddOn = selectedAddons?.find(
        (item) => item?.id === add_on?.id && item?.store_id === add_on?.store_id
      );
      if (existedAddOn) {
        setAddOn({ ...existedAddOn });
      } else {
        setAddOn({
          ...add_on,
          quantity: 0,
          isChecked: false,
          name: add_on?.name,
        });
      }
    } else {
      setAddOn({
        ...add_on,
        quantity: 0,
        isChecked: false,
        name: add_on?.name,
      });
    }
  }, [add_on, selectedAddons]);

  const changeCheckedAddOn = (e) => {
    if (e.target.checked) {
      const changedObj = {
        ...addOn,
        quantity: addOn?.quantity + 1,
        isChecked: true,
        name: addOn.name,
      };
      setAddOn(changedObj);
      changeAddOns(changedObj);
    } else {
      const changedObj = {
        ...addOn,
        quantity: 0,
        isChecked: false,
        name: addOn.name,
      };
      setAddOn(changedObj);
      changeAddOns(changedObj);
    }
  };

  const incrementAddOnQty = (e) => {
    e.stopPropagation();
    const changedObj = { ...addOn, quantity: addOn?.quantity + 1 };
    setAddOn(changedObj);
    changeAddOns(changedObj);
  };

  const decrementAddOnQty = (e) => {
    e.stopPropagation();
    const changedObj = { ...addOn, quantity: addOn?.quantity - 1 };
    setAddOn(changedObj);
    changeAddOns(changedObj);
  };

  if (!addOn) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: { xs: 1.5, md: 2 },
        py: { xs: 0.5, md: 0.75 },
        "&:hover": {
          backgroundColor: alpha(theme.palette.text.primary, 0.02),
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ minWidth: 0, flex: 1 }}
      >
        <Checkbox
          checked={!!addOn?.isChecked}
          size="small"
          onChange={changeCheckedAddOn}
          sx={{ p: 0.5 }}
        />
        <Typography
          sx={{
            fontSize: { xs: "13px", md: "14px" },
            fontWeight: 500,
            color: theme.palette.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {addOn?.name}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Typography
          sx={{
            fontSize: { xs: "13px", md: "14px" },
            color: theme.palette.text.secondary,
            whiteSpace: "nowrap",
          }}
        >
          {`+${getAmountWithSign(addOn?.price)}`}
        </Typography>
        {addOn?.isChecked && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.25}
            sx={{
              backgroundColor: alpha(
                theme.palette.neutral?.[400] || theme.palette.text.secondary,
                0.08
              ),
              borderRadius: "8px",
              px: 0.5,
            }}
          >
            <IconButton
              size="small"
              disabled={addOn?.quantity <= 1}
              onClick={decrementAddOnQty}
              sx={{ p: 0.25 }}
            >
              <RemoveIcon sx={{ fontSize: "14px" }} />
            </IconButton>
            <Box
              sx={{
                minWidth: 16,
                textAlign: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {addOn?.quantity}
            </Box>
            <IconButton
              size="small"
              onClick={incrementAddOnQty}
              sx={{ p: 0.25 }}
            >
              <AddIcon sx={{ fontSize: "14px" }} />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default IncDecAddOn;
