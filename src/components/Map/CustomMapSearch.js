import React from "react";
import { SearchLocationTextField } from "../landing-page/hero-section/HeroSection.style";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
import SearchIcon from "@mui/icons-material/Search";
import { Stack } from "@mui/system";
import AnimationDots from "../spinner/AnimationDots";
import MapIcon from '@mui/icons-material/Map';

const CustomMapSearch = ({
  showCurrentLocation,
  predictions,
  handleChange,
  HandleChangeForSearch,
  handleAgreeLocation,
  currentLocation,
  handleCloseLocation,
  frommap,
  placesIsLoading,
  currentLocationValue,
  fromparcel,
  isLoading,
  noleftborder,
  testLocation,
  borderRadius,
  toReceiver,
  isLanding = false,
  isRefetching,
  searchHeight,
  handleOpen
}) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {!showCurrentLocation ? (
        <Autocomplete
          fullWidth
          options={predictions}
          getOptionLabel={(option) => option?.description}
          onChange={(event, value) => handleChange(event, value)}
          value={currentLocationValue}
          clearOnBlur={false}
          loading={frommap === "true" ? placesIsLoading : null}
          // open={true}
          loadingText={
            frommap === "true" ? t("Search suggestions are loading...") : ""
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              padding: searchHeight ? '0px' : '9px', // Adjust these values as needed
            },
          }}

          PaperComponent={(props) => (
            <Paper
              sx={{
                borderRadius: "0 0 5px px",

              }}
              {...props}

            >
              {props.children}
              <Box textAlign="center" p={1}>
                <Button
                  variant="text"
                  size="small"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleOpen?.();
                  }}
                  sx={{
                    width: '100%',
                    backgroundColor: theme.palette.neutral[300],
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <MapIcon />
                  <Typography variant="body1" color={theme.palette.text.main}>{t("Set from map")}</Typography>
                </Button>
              </Box>
            </Paper>
          )}
          renderInput={(params) => (
            <SearchLocationTextField
              searchHeight={searchHeight}
              noleftborder={noleftborder}
              frommap={frommap}
              fromparcel={fromparcel}
              id="outlined-basic"
              {...params}
              placeholder={t("Search location here...")}
              isLanding
              isXSmall
              onChange={(event) => HandleChangeForSearch?.(event)}
              InputProps={{
                ...params.InputProps,
                endAdornment:
                  frommap === "true" ? (
                    <IconButton
                      sx={{
                        mr: "-31px",
                        borderRadius: borderRadius ? borderRadius : "0px",
                        padding: "7px 10px",
                      }}
                    // onClick={() => handleAgreeLocation()}
                    >
                      <SearchIcon />
                    </IconButton>
                  ) : currentLocationValue?.description ? (
                    <IconButton
                      sx={{
                        mr: "-61px",
                        padding: "5px",
                      }}
                    >
                      <CloseIcon
                        style={{
                          cursor: "pointer",
                          height: "20px",
                        }}
                        onClick={() => handleCloseLocation?.()}
                      />
                    </IconButton>
                  ) : (
                    <>
                      {toReceiver === "true" ? null : (
                        <IconButton
                          sx={{
                            mr: fromparcel === "true" ? "-61px" : "-31px",
                            padding: "5px",
                            display: fromparcel !== "true" && "none",
                            marginTop: { xs: "3px", sm: "0px" }
                          }}
                          onClick={() => handleAgreeLocation?.()}
                        >
                          <GpsFixedIcon color="primary" />
                        </IconButton>
                        // )
                        // }
                        // </>
                      )}
                    </>
                  ),
              }}
              required={true}
            />
          )}
        />
      ) : (
        <SearchLocationTextField
          margin_top="true"
          size="small"
          variant="outlined"
          id="outlined-basic"
          placeholder={t("Search location here...")}
          value={testLocation ? testLocation : currentLocation}
          onChange={(event) => HandleChangeForSearch(event)}
          required={true}
          isLanding
          isXSmall
          frommap={frommap}
          fromparcel={fromparcel}
          showCurrentLocation={showCurrentLocation}
          InputProps={{
            endAdornment: !showCurrentLocation ? (
              <IconButton onClick={() => handleAgreeLocation()}>
                <GpsFixedIcon color="primary" />
              </IconButton>
            ) : (
              <Stack mr={isLanding ? "8px" : "0"}>
                {isLoading || isRefetching ? (
                  <IconButton sx={{
                    padding: "7px",

                  }}>
                    <AnimationDots />
                  </IconButton>

                ) : (
                  <IconButton
                    sx={{
                      padding: "9px",

                    }}
                  >
                    <CloseIcon
                      sx={{
                        cursor: "pointer",
                        fontSize: isXSmall ? "16px" : "24px",
                      }}
                      onClick={() => handleCloseLocation()}
                    />
                  </IconButton>
                )}
              </Stack>
            ),
          }}
        />
      )}
    </>
  );
};

export default CustomMapSearch;
