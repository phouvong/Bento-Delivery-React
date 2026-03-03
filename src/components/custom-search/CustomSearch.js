import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import LoadingButton from "@mui/lab/LoadingButton";
import { CloseIconWrapper } from "styled-components/CustomStyles.style";
import { Search, StyledInputBase } from "./CustomSearch.style";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import VoiceSearchModal from "./VoiceSearchModal";

const CustomSearch = ({
  handleSearchResult,
  label,
  isLoading,
  selectedValue,
  setIsEmpty,
  setSearchValue,
  type2,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  let language_direction = undefined;
  if (typeof window !== "undefined") {
    language_direction = localStorage.getItem("direction");
  }
  const [openVoiceModal, setOpenVoiceModal] = useState(false);

  const handleVoiceModalOpen = () => {
    setOpenVoiceModal(true);
  };
  const handleVoiceModalClose = () => {
    setOpenVoiceModal(false);
  };

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue);
    } else {
      setValue("");
    }
  }, [selectedValue]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchResult(e.target.value);
      e.preventDefault();
    }
  };
  const remove = "true";
  const handleReset = () => {
    setValue("");
    handleSearchResult?.("", remove);
    setIsEmpty?.(true);
  };
  const handleChange = (value) => {
    console.log({ value });
    if (value === "") {
      handleSearchResult?.("");
      setIsEmpty?.(true);
    } else {
      setIsEmpty?.(false);
    }
    setValue(value);
    setSearchValue?.(value);
  };

  const getTypeWiseChanges = () => {
    if (type2) {
      return (
        <>
          <SearchIcon
            sx={{
              color: (theme) =>
                getCurrentModuleType() === ModuleTypes.FOOD
                  ? theme.palette.moduleTheme.food
                  : "primary.main",
              marginInlineStart: "15px",
              marginInlineEnd: "-8px",
            }}
          />
          <StyledInputBase
            placeholder={t(label)}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e)}
            language_direction={language_direction}
          // onFocus={() => handleOnFocus?.(value)}
          />
        </>
      );
    } else {
      return (
        <>
          <SearchIcon sx={{ marginInlineStart: "12px" }} />
          <StyledInputBase
            id="search-input"
            placeholder={t(label)}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e)}
            language_direction={language_direction}
          // onFocus={() => handleOnFocus?.(value)}
          />
          <IconButton onClick={handleVoiceModalOpen} sx={{ padding: "5px"}}>
            <MicIcon
              sx={{
                color: (theme) => theme.palette.primary.main,
              }}
            />
          </IconButton>
          {value === "" ? (
            null
          ) : (
            <>
              {isLoading ? (
                <CloseIconWrapper
                  right={-1}
                  language_direction={language_direction}
                >
                  <LoadingButton
                    loading
                    variant="text"
                    sx={{ width: "10px" }}
                  />
                </CloseIconWrapper>
              ) : (
                <CloseIconWrapper
                  onClick={() => handleReset()}
                  language_direction={language_direction}
                  right="27px"
                >
                  <IconButton sx={{ marginRight: "-4px !important" }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </CloseIconWrapper>
              )}
            </>
          )}
        </>
      );
    }
  };

  return (
    <form onSubmit={handleKeyPress}>
      <Search direction="row" alignItems="center" type2={type2}>
        {getTypeWiseChanges()}
      </Search>
      <VoiceSearchModal
        open={openVoiceModal}
        handleClose={handleVoiceModalClose}
        onResult={(result) => {
          handleChange(result);
          handleSearchResult(result);
        }}
      />
    </form>
  );
};

CustomSearch.propTypes = {};

export default CustomSearch;
