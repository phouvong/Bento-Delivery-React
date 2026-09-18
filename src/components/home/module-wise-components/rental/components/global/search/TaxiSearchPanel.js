import CustomContainer from "components/container";
import { Box, Stack } from "@mui/system";
import {
  alpha,
  Button,
  Chip,
  Radio,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import NavigationOutlinedIcon from "@mui/icons-material/NavigationOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import DateTimePicker from "components/home/module-wise-components/rental/components/global/DateTimePicker";
import React, { useEffect, useRef, useState } from "react";
import { CustomTextField } from "styled-components/CustomStyles.style";
import RentalSearchLocation from "components/home/module-wise-components/rental/components/global/search/RentalSearchLocation";
import useGetAutocompletePlace from "api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import useGetPlaceDetails from "api-manage/hooks/react-query/google-api/useGetPlaceDetails";
import { useRouter } from "next/router";
import { setRentalSearch } from "redux/slices/rentalSearch";
import useGetDistance from "api-manage/hooks/react-query/google-api/useGetDistance";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import { t } from "i18next";
import { toast } from "react-hot-toast";
import {
  buildDestinationLocationKey,
  updateDestinationLocations,
} from "components/home/module-wise-components/rental/components/utils/bookingHepler";
import MapModal from "components/Map/MapModal";

const TaxiSearchPanel = ({
  isSticky,
  height,
  position,
  mt,
  top = "auto",
  bottom = 0,
  showSearch = true,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const mode = "DRIVE";
  const [openMap, setOpenMap] = useState(false);
  const { configData } = useSelector((state) => state.configData);
  const { rentalSearch } = useSelector((state) => state?.rentalSearch);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const customerId = profileInfo?.id;
  const [open, setOpen] = useState(false);
  const [tripType, setTripType] = useState("distance_wise");
  const [duration, setDuration] = useState(rentalSearch?.duration || "");
  const [selectedDate, setSelectedDate] = useState(dayjs);
  // Destination Location
  const [locations, setLocations] = useState({
    ...configData?.default_location,
  });
  const [searchKey, setSearchKey] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [expand, setExpand] = useState(false);
  const [showArrowButton, setShowArrowButton] = useState(false);
  const formControlRef = useRef(null);
  const inputRef = useRef(null);
  const visitedScrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = visitedScrollRef.current;
    if (!el) return;
    const update = () => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setCanScrollRight(overflow && !atEnd);
    };
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
      Array.from(el.children).forEach((child) => ro.observe(child));
    }
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [pathname]);

  const handleVisitedScrollRight = () => {
    const el = visitedScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.7, behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        formControlRef.current &&
        !formControlRef.current.contains(event.target)
      ) {
        if (
          tripType === "hourly" ||
          rentalSearch?.tripType === "hourly" ||
          tripType === "day_wise" ||
          rentalSearch?.tripType === "day_wise"
        ) {
          if (inputRef.current && !inputRef.current.contains(event.target)) {
            setOpen(false);
          }
        } else {
          if (tripType === "distance_wise") {
            setOpen(false);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tripType]);

  // Scroll event listener to show/hide arrow button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Change 100 to your desired scroll threshold
        setShowArrowButton(true);
      } else {
        setShowArrowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pickup_location =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("currentLatLng"))
      : false;
  const location_name =
    typeof window !== "undefined"
      ? window.localStorage.getItem("location")
      : false;

  let recentlyAddress = undefined;
  if (typeof window !== "undefined") {
    try {
      const key = buildDestinationLocationKey(customerId);
      recentlyAddress = key ? JSON.parse(localStorage.getItem(key)) : undefined;
    } catch (e) {
      recentlyAddress = undefined;
    }
  }

  const { data: places } = useGetAutocompletePlace(searchKey, !!searchKey);
  const { data: placeDetails } = useGetPlaceDetails(placeId, !!placeId);
  const { data: distanceData, refetch } = useGetDistance(
    pickup_location,
    locations,
    mode
  );

  useEffect(() => {
    if (places) {
      const tempData = places?.suggestions?.map((item) => ({
        place_id: item?.placePrediction?.placeId,
        description: `${item?.placePrediction?.structuredFormat?.mainText?.text}, ${item?.placePrediction?.structuredFormat?.secondaryText?.text}`,
      }));

      setPredictions(tempData);
    }
  }, [places]);

  useEffect(() => {
    if (placeDetails?.location) {
      setLocations((prev) => ({
        location_name: placeDetails?.formattedAddress,
        lat: placeDetails?.location?.latitude,
        lng: placeDetails?.location?.longitude,
      }));
    }
  }, [placeDetails]);

  useEffect(() => {
    refetch();
  }, [locations]);

  const handleLocationChange = (field, value) => {
    if (value) {
      setPlaceId(value.place_id);
    }
  };

  const handleSearchChange = (event) => setSearchKey(event.target.value);
  useEffect(() => {
    dispatch(
      setRentalSearch({
        ...rentalSearch,
        destination_location: locations,
      })
    );
    setSearchKey(rentalSearch?.destination_location?.location_name);
  }, [locations, rentalSearch?.destination_location?.location_name]);

  useEffect(() => {
    if (
      rentalSearch?.distanceData?.destination_addresses &&
      router.pathname !== "/home"
    ) {
      setSearchKey(rentalSearch.distanceData.destination_addresses[0]);
      setDuration(rentalSearch.duration);
    }
  }, [rentalSearch, router.pathname]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  //Date
  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };
  useEffect(() => {
    dispatch(
      setRentalSearch({
        ...rentalSearch,
        selectedDate,
      })
    );
  }, [selectedDate]);

  // Trip Type
  const handleTripTypeChange = (e) => {
    setTripType(e.target.value);
    // Duration is meaningful only for hourly / day_wise — clear it on any
    // switch so a stale value never leaks across trip types.
    setDuration("");
  };
  useEffect(() => {
    dispatch(
      setRentalSearch({
        ...rentalSearch,
        tripType,
      })
    );
  }, [tripType]);
  const handleOpen = () => setOpen(true);

  //Duration
  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };
  useEffect(() => {
    dispatch(
      setRentalSearch({
        ...rentalSearch,
        duration,
      })
    );
  }, [duration]);

  //Search Button Click
  const handleSearchClick = (eventOrOverrides) => {
    // Allow callers (e.g. quick-pick chips) to pass overrides directly so
    // they don't have to wait for setState to flush before running search.
    const overrides =
      eventOrOverrides && !eventOrOverrides.nativeEvent ? eventOrOverrides : {};
    const effectiveLocations = overrides.locations ?? locations;
    const effectiveSearchKey =
      overrides.searchKey ?? effectiveLocations?.location_name ?? searchKey;

    if (!effectiveSearchKey) {
      toast.error("Please Add Destination Address!");
      return;
    }
    if (!selectedDate) {
      toast.error("Please Select the Date!");
      return;
    }
    if (!tripType) {
      toast.error("Please Select a Trip Type!");
      return;
    }
    if (tripType === "hourly" || tripType === "day_wise") {
      if (!duration || isNaN(duration) || Number(duration) <= 0) {
        toast.error(
          !duration
            ? "Please Add Duration!"
            : isNaN(duration)
            ? "Duration must be a valid number!"
            : "Please Add a Valid Duration!"
        );
        return;
      }
    }
    updateDestinationLocations(effectiveLocations, customerId);

    dispatch(
      setRentalSearch({
        selectedDate,
        destination_location: effectiveLocations,
        pickup_location: { location_name, ...pickup_location },
        tripType,
        duration,
        distanceData,
      })
    );
    router.push({
      pathname: "/rental/vehicle-search",
      query: {
        from: "from_search",
        ...(router.query.module ? { module: router.query.module } : {}),
      },
    });
  };

  useEffect(() => {
    if (router.pathname === "/home") {
      setTripType("distance_wise");
      setDuration("");
      dispatch(setRentalSearch(null));
    }
  }, [router.pathname]);

  const handleClick = (e, type) => {
    e.stopPropagation();
    // Any trip-type switch wipes the duration — it's only meaningful for
    // hourly / day_wise and must start empty when crossing between modes.
    setDuration("");
    if (type === "distance_wise") {
      setTripType("distance_wise");
      if (rentalSearch) {
        dispatch(
          setRentalSearch({
            ...rentalSearch,
            tripType: "distance_wise",
            duration: "",
          })
        );
      }

      setOpen(false);
    }
    if (type === "hourly") {
      setTripType("hourly");
      if (rentalSearch) {
        dispatch(
          setRentalSearch({
            ...rentalSearch,
            tripType: "hourly",
            duration: "",
          })
        );
      }
      setOpen(true);
    }
    if (type === "day_wise") {
      setTripType("day_wise");
      if (rentalSearch) {
        dispatch(
          setRentalSearch({
            ...rentalSearch,
            tripType: "day_wise",
            duration: "",
          })
        );
      }
      setOpen(true);
    }
  };
  const pickLocationFormAddress = (value) => {
    setSearchKey(value?.address);
    setLocations({
      lat: value.latitude,
      lng: value.longitude,
      location_name: value?.address,
    });
  };
  const isSearchPage = router.pathname === "/vehicle-search";
  const handleLocation = (location, locationName) => {
    setLocations({
      lat: location.lat,
      lng: location.lng,
      location_name: locationName,
    });
  };

  return (
    <Box sx={{ position: "relative" }}>
      {pathname !== "/home" && showArrowButton && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            display: { xs: "flex", sm: "none" },
            justifyContent: "center",
            textAlign: "center",
            bottom: "-38px",
            left: "50%",
            zIndex: 1000,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Button
            onClick={() => {
              setExpand(!expand);
            }}
            variant="contained"
            sx={{
              "&:hover": {
                backgroundColor: theme.palette.background.paper,
              },
              backgroundColor: theme.palette.background.paper,
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              minWidth: "unset",
              padding: 0,
            }}
          >
            <KeyboardArrowDownIcon
              sx={{
                color: theme.palette.primary.main,
                transform: expand ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </Button>
        </Box>
      )}
      <Box
        sx={{
          width: "100%",
          px:
            pathname === "/home"
              ? { xs: "16px", md: "12px" }
              : { xs: "12px", md: "12px" },
          py:
            pathname === "/home"
              ? { xs: 0, md: "12px" }
              : { xs: "12px", md: "12px" },
          mt: isSticky ? 0 : mt,
          height: height,
          position: position || "relative",
          top: isSticky ? 0 : top,
          zIndex: 50,
          // boxShadow: (theme) => {
          //   return {
          //     xs: "none",
          //     md: isSticky
          //       ? "none"
          //       : `0px 15px 30px 0px ${alpha(
          //           theme.palette.neutral[1000],
          //           theme.palette.mode === "dark" ? 0 : 0.06
          //         )}`,
          //   };
          // },

          bottom: bottom,
          left: !showSearch && "0%",
          right: !showSearch && "0%",
          marginTop:
            isSearchPage && !isSticky ? { xs: "-120px", sm: "-180px" } : 0,
          maxWidth: {
            xs: "100%",
            sm: isSticky ? "1300px" : "fit-content",
          },
          marginInline: !isSticky ? "auto" : 0,
          backgroundColor:
            pathname === "/home"
              ? { xs: "transparent", md: theme.palette.background.secondary }
              : theme.palette.background.secondary,
          borderRadius:
            pathname === "/home"
              ? { xs: 0, md: "9999px" }
              : { xs: "20px", md: "9999px" },
          borderTopLeftRadius: isSticky ? "0px" : { xs: "20px", md: "9999px" },
          borderTopRightRadius: isSticky ? "0px" : { xs: "20px", md: "9999px" },
        }}
      >
        <Stack
          direction="row"
          flexWrap={{ xs: "wrap", md: "nowrap" }}
          gap={{ xs: 1.5, md: "12px" }}
          alignItems="center"
          justifyContent={!showSearch && "center"}
          sx={{
            width: "100%",
            "> *": {
              flexBasis: { xs: "100%", sm: "48%", md: "auto" },
            },
            "> *:first-of-type": {
              flex: { md: isSticky ? "1 1 0%" : "none" },
              minWidth: { md: 0 },
              "& .MuiAutocomplete-root": {
                width: { xs: "100%", md: isSticky ? "100%" : "590px" },
                maxWidth: "100%",
              },
            },
            "& .MuiOutlinedInput-root": {
              height: "44px !important",
              minHeight: "44px",
              maxHeight: "44px",
              boxSizing: "border-box",
              borderRadius: "9999px !important",
              backgroundColor: {
                xs: theme.palette.background.secondary,
                md: theme.palette.background.paper,
              },
              fontSize: "16px",
              fontFamily: "'DM Sans', sans-serif",
              color: theme.palette.text.primary,
              lineHeight: 1.3,
              paddingLeft: "16px !important",
              paddingRight: { xs: "44px !important", md: "16px !important" },
              paddingTop: "0 !important",
              paddingBottom: "0 !important",
              gap: "8px",
              "& fieldset": {
                border: {
                  xs: "none",
                  md: `1px solid ${theme.palette.neutral[200]}`,
                },
                top: 0,
              },
              "&:hover fieldset": {
                borderColor: alpha(theme.palette.primary.main, 0.4),
              },
              "& fieldset>legend": {
                display: "none",
              },
            },
            "& .MuiOutlinedInput-input": {
              padding: "0 !important",
              height: "44px",
              boxSizing: "border-box",
              fontSize: "16px",
              color: theme.palette.text.primary,
              lineHeight: "44px",
            },
            "& .MuiInputLabel-root": {
              display: "none",
            },
            "& .MuiInputAdornment-root": {
              margin: 0,
              height: "auto",
              maxHeight: "none",
            },
          }}
        >
          <RentalSearchLocation
            key={router.pathname}
            setOpenMap={setOpenMap}
            fromHome
            getCurrentLocation={pickLocationFormAddress}
            pickLocationFormAddress={pickLocationFormAddress}
            predictions={predictions}
            handleChange={(event, value) =>
              handleLocationChange("destination", value)
            }
            HandleChangeForSearch={handleSearchChange}
            onEnterKey={() => handleSearchClick()}
            label={t("Where To Go?")}
            height="44px"
            onFocus={handleFocus}
            disabled={!locations.pickup}
            value={{
              description: searchKey,
            }}
            width={isSticky ? "70%" : 420}
            isFocused={isFocused}
            focusedField="destination"
            startIcon={
              <NavigationOutlinedIcon
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "18px",
                  transform: "rotate(45deg)",
                }}
              />
            }
          />

          <DateTimePicker
            value={dayjs(rentalSearch?.selectedDate)}
            handleDateChange={handleDateChange}
            label="Pickup Time"
            sx={{
              display:
                pathname === "/home"
                  ? { xs: "none", sm: "flex" }
                  : {
                      xs:
                        (!showArrowButton && "flex") || expand
                          ? "flex"
                          : "none" || showArrowButton
                          ? "none"
                          : "flex",
                      sm: "flex",
                    },
              width: { xs: "100%", md: "240px" },
              "& .MuiOutlinedInput-root": {
                height: "44px !important",
                minHeight: "44px",
                maxHeight: "44px",
                boxSizing: "border-box",
                borderRadius: "9999px !important",
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "16px !important",
                paddingRight: "16px !important",
                paddingTop: "0 !important",
                paddingBottom: "0 !important",
                gap: "8px",
                overflow: "hidden",
                "& fieldset": {
                  border: `1px solid ${theme.palette.neutral[200]}`,
                  top: 0,
                },
                "&.Mui-focused fieldset": {
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                },
              },
              "& .MuiInputBase-input": {
                padding: "0 !important",
                height: "44px",
                boxSizing: "border-box",
                fontSize: "16px",
                fontWeight: 400,
                color: theme.palette.text.primary,
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: "44px",
                letterSpacing: 0,
              },
              "& .MuiInputAdornment-root": {
                marginLeft: "0 !important",
                marginRight: 0,
                height: "16px",
                width: "16px",
              },
              "& .MuiIconButton-root": {
                padding: 0,
                margin: 0,
                width: "16px",
                height: "16px",
                "&:hover": { backgroundColor: "transparent" },
              },
              "& .MuiSvgIcon-root": {
                fontSize: "16px",
                width: "16px",
                height: "16px",
                color: theme.palette.text.primary,
              },
            }}
          />

          <FormControl
            ref={formControlRef}
            sx={{
              display:
                pathname === "/home"
                  ? { xs: "none", sm: "flex" }
                  : {
                      xs:
                        (!showArrowButton && "flex") || expand
                          ? "flex"
                          : "none" || showArrowButton
                          ? "none"
                          : "flex",
                      sm: "flex",
                    },
              width: { xs: "100%", md: 230 },
              "& .MuiOutlinedInput-root": {
                height: "44px !important",
                minHeight: "44px",
                maxHeight: "44px",
                boxSizing: "border-box",
                borderRadius: "9999px !important",
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "16px !important",
                paddingRight: "16px !important",
                paddingTop: "0 !important",
                paddingBottom: "0 !important",
                gap: "8px",
                overflow: "hidden",
                "& fieldset": {
                  border: `1px solid ${theme.palette.neutral[200]}`,
                  top: 0,
                },
                "& fieldset>legend": {
                  display: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "1px solid",
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiSelect-select": {
                padding: "0 !important",
                paddingRight: "0 !important",
                height: "44px !important",
                minHeight: "44px !important",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                fontFamily: "'DM Sans', sans-serif",
                color: theme.palette.text.primary,
                lineHeight: 1.3,
                fontWeight: 400,
              },
              "& .MuiSelect-icon": {
                fontSize: "16px",
                width: "16px",
                height: "16px",
                color: theme.palette.text.primary,
                position: "static",
                marginLeft: "8px",
                flexShrink: 0,
                pointerEvents: "none",
              },
            }}
          >
            <Select
              labelId="demo-checkbox-label"
              id="demo-checkbox"
              value={
                rentalSearch?.tripType
                  ? t(rentalSearch.tripType.replaceAll("_", " "))
                  : t(tripType?.replaceAll("_", " "))
              }
              sx={{
                textTransform: "capitalize",
                fontSize: "16px",
                fontFamily: "'DM Sans', sans-serif",
                color: theme.palette.text.primary,
                lineHeight: 1.3,
                fontWeight: 400,
                letterSpacing: 0,
              }}
              onChange={(e) => {
                handleTripTypeChange(e);
              }}
              open={open}
              onOpen={handleOpen}
              input={<OutlinedInput notched={false} label="" />}
              renderValue={(selected) => selected}
              IconComponent={KeyboardArrowDownIcon}
            >
              <MenuItem
                value="hourly"
                onClick={(e) => handleClick(e, "hourly")}
              >
                <Radio checked={rentalSearch?.tripType === "hourly"} />
                <ListItemText primary={t("Hourly")} />
              </MenuItem>
              <MenuItem
                value="day_wise"
                onClick={(e) => handleClick(e, "day_wise")}
              >
                <Radio checked={rentalSearch?.tripType === "day_wise"} />
                <ListItemText primary={t("Per Day")} />
              </MenuItem>

              <MenuItem
                value="distance_wise"
                onClick={(e) => handleClick(e, "distance_wise")}
              >
                <Radio
                  checked={
                    rentalSearch?.tripType === "distance_wise" ||
                    !rentalSearch?.tripType
                  }
                />
                <ListItemText primary={t("Distance Wise")} />
              </MenuItem>
              {(rentalSearch?.tripType === "hourly" ||
                rentalSearch?.tripType === "day_wise") && (
                <Box
                  ref={inputRef}
                  sx={{
                    px: "10px",
                    mt: "20px",
                    pb: "10px",
                  }}
                >
                  <CustomTextField
                    label={t("Duration")}
                    value={duration}
                    onChange={handleDurationChange}
                    sx={{ width: "100%" }}
                  />
                </Box>
              )}
            </Select>
          </FormControl>

          {showSearch && pathname === "/home" && (
            <IconButton
              onClick={handleSearchClick}
              aria-label={t("Search")}
              sx={{
                display: { xs: "inline-flex", sm: "none" },
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "32px",
                height: "32px",
                padding: 0,
                color: theme.palette.text.primary,
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
                zIndex: 2,
              }}
            >
              <i
                className="fi fi-rr-search"
                style={{ fontSize: "18px", display: "flex" }}
              />
            </IconButton>
          )}
          {showSearch && (
            <Button
              variant="contained"
              onClick={handleSearchClick}
              sx={{
                display:
                  pathname === "/home"
                    ? { xs: "none", sm: "inline-flex" }
                    : "inline-flex",
                borderRadius: "9999px",
                height: "44px",
                px: "24px",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "-0.48px",
                textTransform: "capitalize",
                minWidth: { xs: "100%", sm: "108px" },
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              {t("Search")}
            </Button>
          )}
        </Stack>
      </Box>
      {pathname === "/home" &&
        Array.isArray(recentlyAddress) &&
        recentlyAddress.length > 0 &&
        (() => {
          const lastVisitedPlaces = recentlyAddress
            .filter(
              (a, i, self) =>
                a?.location_name &&
                i ===
                  self.findIndex((b) => b?.location_name === a?.location_name)
            )
            .slice(0, 8)
            .map((address, idx) => {
              const icons = [
                HomeOutlinedIcon,
                LocationOnOutlinedIcon,
                LocationOnOutlinedIcon,
                LocationOnOutlinedIcon,
                EventOutlinedIcon,
                HomeOutlinedIcon,
              ];
              return {
                label:
                  address?.location_name?.toString()?.split(",")[0]?.trim() ||
                  "",
                icon: icons[idx % icons.length],
                address,
              };
            });

          if (lastVisitedPlaces.length === 0) return null;

          return (
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={{ xs: 0.75, md: 2 }}
              sx={{
                mt: { xs: 1.5, md: 2 },
                pl: { xs: "16px", md: 0 },
                pr: { xs: 0, md: 0 },
                maxWidth: { xs: "100%", md: "fit-content" },
                marginInline: "auto",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "13px", md: "14px" },
                  fontFamily: "'DM Sans', sans-serif",
                  color: alpha(theme.palette.text.primary, 0.6),
                  whiteSpace: "nowrap",
                  fontWeight: 400,
                  flexShrink: 0,
                }}
              >
                {t("Last Visited Place")}
              </Typography>
              <Box
                ref={visitedScrollRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  overflowX: "auto",
                  flex: 1,
                  width: "100%",
                  minWidth: 0,
                  flexWrap: "nowrap",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {lastVisitedPlaces.map((place, idx) => {
                  const Icon = place.icon;
                  return (
                    <Chip
                      key={`${place.label}-${idx}`}
                      onClick={() => {
                        if (!place.address) return;
                        const addr = place.address;
                        const nextLocations = {
                          lat: addr.latitude || addr.lat,
                          lng: addr.longitude || addr.lng,
                          location_name: addr.location_name,
                        };
                        pickLocationFormAddress({
                          address: addr.location_name,
                          latitude: nextLocations.lat,
                          longitude: nextLocations.lng,
                        });
                        handleSearchClick({
                          locations: nextLocations,
                          searchKey: addr.location_name,
                        });
                      }}
                      icon={
                        <Icon
                          sx={{
                            fontSize: "14px !important",
                            color: `${theme.palette.text.primary} !important`,
                          }}
                        />
                      }
                      label={place.label}
                      sx={{
                        height: "32px",
                        borderRadius: "9999px",
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08
                        ),
                        color: theme.palette.text.primary,
                        fontSize: "13px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        px: 0.5,
                        flexShrink: 0,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.12
                        )}`,
                        "& .MuiChip-label": { px: 1 },
                        "& .MuiChip-icon": { ml: "8px", mr: "-4px" },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.15
                          ),
                        },
                      }}
                    />
                  );
                })}
              </Box>
              {canScrollRight && (
                <Box
                  onClick={handleVisitedScrollRight}
                  sx={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.neutral[200]}`,
                    cursor: "pointer",
                    flexShrink: 0,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ChevronRightIcon
                    sx={{
                      fontSize: "16px",
                      color: theme.palette.text.primary,
                    }}
                  />
                </Box>
              )}
            </Stack>
          );
        })()}
      {openMap && (
        <MapModal
          handleLocation={handleLocation}
          open={openMap}
          handleClose={() => setOpenMap(false)}
          toparcel="1"
          fromReceiver="1"
        />
      )}
    </Box>
  );
};

export default TaxiSearchPanel;
