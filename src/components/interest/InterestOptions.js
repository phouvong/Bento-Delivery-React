import React, { useEffect, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";

import { useTranslation } from "react-i18next";

import { Grid, Typography } from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import Router from "next/router";
import { toast } from "react-hot-toast";
import InterestShimmer from "./InterestShimmer";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { usePostSelectedCategory } from "api-manage/hooks/react-query/all-category/usePostSelectedCategory";
import { CustomTypography } from "../landing-page/hero-section/HeroSection.style";
import H1 from "../typographies/H1";
import { useDispatch } from "react-redux";
import { setExistingModuleIds, setInterestId } from "redux/slices/categoryIds";
import { useGetCategoryVehicleLists } from "api-manage/hooks/react-query/useGetCategoryVehicleLists";
import { getModule } from "helper-functions/getLanguage";

const InterestOptions = ({ configData }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedId, setSelectedId] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const onSuccessHandler = (response) => {
    setCategoryList(response?.data);
  };
  let searchKey = "";
  let queryKey = "";
  const { data: categories, isFetching,isLoading:rentalLoading } = useGetCategoryVehicleLists();
  const { refetch } = useGetCategories(searchKey, onSuccessHandler, queryKey);

  useEffect(() => {
    getModule()?.module_type !== "rental" && refetch();
  }, []);

  useEffect(() => {
    if (getModule()?.module_type === "rental") {
      setCategoryList(categories?.vehicles);
    }
  }, [categories]);
  const handleItemClick = (item) => {
    //state manipulation with select deselect
    const isItemAlreadyExist = selectedId.find((id) => id === item.id);
    if (isItemAlreadyExist) {
      const newArray = selectedId.filter((id) => id !== item.id);
      setSelectedId(newArray);
    } else {
      setSelectedId((prevState) => [...prevState, item.id]);
    }
  };
  const handleBorder = (itemId) => {
    const isExist = selectedId.find((item) => item === itemId);
    return !!isExist;
  };

  //post handle
  const { mutate, isLoading } = usePostSelectedCategory();
  const handleSubmit = () => {
    mutate(
      { interest: selectedId },
      {
        onSuccess: (response) => {
          toast.success(response?.message);
          dispatch(setInterestId(selectedId));
          dispatch(setExistingModuleIds(categoryList[0]?.module_id));
          Router.push("/home", undefined, { shallow: true });
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message);
        },
      }
    );
  };


  return (
    <CustomStackFullWidth
      spacing={1}
      alignItems="center"
      justifyContent="center"
      mt="2rem"
    >
      <H1 text="Choose Your Interests" />
      <Typography variant="h6" color="customColor.textGray">
        {t("Get personalized food recommendations.")}
      </Typography>
      <Grid container spacing={2}>
        {!isLoading || !rentalLoading ? (
          categoryList?.length > 0 ? (
            categoryList?.map((item, index) => {
              return (
                <Grid
                  key={index}
                  onClick={() => handleItemClick(item)}
                  item
                  xs={6}
                  sm={3}
                  md={2}
                  lg={2}
                  align="center"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <CustomPaperBigCard
                    padding=".5rem"
                    sx={{
                      border: handleBorder(item.id) && "2px solid",
                      borderColor: handleBorder(item.id) && "primary.main",
                      div: {
                        borderRadius: "8px",
                        overflow: "hidden",
                      },
                      "&:hover": {
                        img: {
                          transform: "scale(1.14)",
                        },
                      },
                    }}
                  >
                    <CustomStackFullWidth spacing={1}>
                      <CustomImageContainer
                        height={isSmall ? "100px" : "150px"}
                        width="100%"
                        src={item.image_full_url}
                      />
                      <CustomTypography>{item.name}</CustomTypography>
                    </CustomStackFullWidth>
                  </CustomPaperBigCard>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12} align="center">
              <Typography>No categories found</Typography>
            </Grid>
          )
        ) : (
          <InterestShimmer />
        )}
        <Grid item xs={12} md={12} align="center">
          <LoadingButton
            disabled={selectedId.length === 0}
            loading={isLoading}
            variant="contained"
            sx={{
              marginTop: "1rem",
              width: { xs: "auto", sm: "200px" },
            }}
            onClick={() => handleSubmit()}
          >
            {t("Save")}
          </LoadingButton>
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

InterestOptions.propTypes = {};

export default InterestOptions;
