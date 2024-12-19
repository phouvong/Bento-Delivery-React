import { Skeleton, styled, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { setSelectedModule } from "../../redux/slices/utils";
import CustomImageContainer from "../CustomImageContainer";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getImageUrl } from "utils/CustomFunctions";

const Container = styled(Stack)(({ theme }) => ({
  position: "fixed",
  zIndex: 1000,
  top: 150,
  right: 0,
  boxShadow: "0px 0px 29.7006px rgba(71, 71, 71, 0.1)",
  background: theme.palette.background.paper,
  borderTopLeftRadius: "29px",
  borderBottomLeftRadius: "29px",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
const ModuleContainer = styled(Box)(({ theme, selected }) => ({
  zIndex: 1000,
  cursor: "pointer",
  width: "62px",
  height: "62px",
  borderRadius: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(227, 227, 227, 0.2)",
  border: "2px solid",
  transition: "all ease 0.5s",
  borderColor: selected
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  background:
    selected &&
    "radial-gradient(50% 50% at 50% 50%, rgba(0, 202, 108, 0) 0%, rgba(0, 255, 137, 0.2) 100%)",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    background:
      "radial-gradient(50% 50% at 50% 50%, rgba(0, 202, 108, 0) 0%, rgba(0, 255, 137, 0.2) 100%)",
    "img, svg": {
      transform: "scale(1.1)",
    },
  },
}));

export const zoneWiseModule = (data) => {
  let currentZoneIds = undefined;
  if (typeof window !== "undefined") {
    currentZoneIds = JSON.parse(localStorage.getItem("zoneid"));
  }
  const result = data.filter((moduleItem) => {
    const zoneIds = moduleItem?.zones?.map((zone) => zone.id);
    return currentZoneIds?.some((id) => zoneIds?.includes(id));
  });
  return result;
};

const ModuleSelect = ({
  moduleSelectHandler,
  selectedModule,
  data,
  configData,
  dispatch,
}) => {
  const { interestId, existingModuleId } = useSelector(
    (state) => state.categoryIds
  );
  const router = useRouter();

  const handleModuleSelect = (item) => {
    dispatch(setSelectedModule(item));
    moduleSelectHandler(item);
    const isModuleExist = existingModuleId?.includes(item?.id);
    if (
      interestId?.length > 0 &&
      !isModuleExist &&
      item.module_type !== "parcel"
    ) {
      router.push("/interest", undefined, { shallow: true });
    }
  };
  return (
    <Container p=".8rem" spacing={2}>
      {data ? (
        zoneWiseModule?.(data)?.map((item, index) => {
          return (
            <Tooltip
              title={item?.module_name}
              key={index}
              placement="left-start"
            >
              <ModuleContainer
                selected={
                  item?.module_type === selectedModule?.module_type &&
                  item?.id === selectedModule?.id
                }
                onClick={() => handleModuleSelect(item)}
              >
                <CustomImageContainer
                  src={item?.icon_full_url}
                  width="36px"
                  height="36px"
                  alt="mobile"
                  objectFit="cover"
                />
              </ModuleContainer>
            </Tooltip>
          );
        })
      ) : (
        <>
          {[...Array(5)].map((item, index) => (
            <Skeleton
              key={index}
              width="40px"
              height="40px"
              variant="rectangle"
            />
          ))}
        </>
      )}
    </Container>
  );
};

export default ModuleSelect;
