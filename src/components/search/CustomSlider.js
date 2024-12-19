import React, { useState } from "react";
import { Slider, Stack, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { useIsMount } from "../first-render-useeffect-controller/useIsMount";

const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-rail": {
    height: "5px",
    marginLeft: "10px",
    backgroundColor: theme.palette.neutral[600],
  },
  "& .MuiSlider-thumb": {
    backgroundColor: theme.palette.neutral[100],
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: "0px 2px 4px rgba(9, 87, 203, 0.15)",
  },
}));

const CustomSlider = ({
  handleChangePrice,
  minMax,
  priceFilterRange,
  store,
}) => {
  const { filterData } = useSelector((state) => state.searchFilterStore);
  const [value, setValue] = useState(minMax);
  const minDistance = 1;
  const isMount = useIsMount();

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
  };

  const handleChangeCommitted = (event, newValue) => {
    handleChangePrice(newValue);
  };

  // useEffect(() => {
  //   if (!isMount) {
  //     handleChangePrice(value);
  //   }
  // }, [value]);

  return (
    <Stack
      direction="row"
      sx={{ mb: 1, ml: 1 }}
      alignItems="center"
      spacing={1}
      px=".7rem"
    >
      <StyledSlider
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        disabled={
          store
            ? priceFilterRange?.min_price === priceFilterRange?.max_price
            : priceFilterRange[0] === priceFilterRange[1]
        }
        min={0}
        max={20000}
        marks={[{ value: 0 }, { value: 100 }]}
        disableSwap
      />
    </Stack>
  );
};

export default CustomSlider;
