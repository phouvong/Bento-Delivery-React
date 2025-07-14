import React, { useState } from "react";
import { alpha, Box } from "@mui/system";
import { Card, Chip, FormControlLabel, Grid, IconButton, List, ListItem, ListItemText, Popover, RadioGroup, Stack, styled, Typography, useTheme } from "@mui/material";

import { useSelector } from "react-redux";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import GroupButtons from "../GroupButtons";
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import useMediaQuery from "@mui/material/useMediaQuery";
import StoreCard from "../cards/StoreCard";
import CustomSearch from "components/custom-search/CustomSearch";
import { t } from "i18next";
import Radio from '@mui/material/Radio'
import EmptyBoxSvg from "components/chat/EmptyBoxSvg";
import EmptySearchResults from "components/EmptySearchResults";
import {getModule} from "helper-functions/getLanguage";
export const CustomChip = styled(Chip)(({ theme, query, value, isSticky, color }) => ({
  padding: '10px 10px',
  alignItems: 'center',
  color: theme.palette.neutral[1000],
  fontSize: '14px',
  fontWeight: '400',
  height: '38px',
  cursor: 'pointer',
  background: value ? theme.palette.primary.main : 'transparent',
  borderRadius: '10px',
  transition: `all ease .3s`,
  '&:hover': {
    color: theme.palette.neutral[100],
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  '& .MuiChip-label': {
    paddingLeft: '8px',
    paddingRight: '8px',
    maxWidth: '145px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    padding: '4px',
    height: '31px',
  },
}));


const StoreList = ({ storeType, type, setType, data,sortby,setSortby,searchKey,setSearchKey }) => {
  const { selectedModule } = useSelector((state) => state.utilsData);
  const matchesXs = useMediaQuery("(max-width:470px)");
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const store_image_url = `${configData?.base_urls?.store_image_url}`;
  const [anchorEl, setAnchorEl] = useState(null)
 
  const iconColor = theme.palette.neutral[1000]
  const handlePopOverOpen = (event) => {
    setAnchorEl(event.currentTarget)
}
const handlePopOverClose = () => {
  
    setAnchorEl(null)
}
const handleDropClick = (event) => {
  setAnchorElCard(event.currentTarget)
}
const handleSortChange = (event) => {
  setSortby(event.target.value)
}
const handleSearchResult = (value) => {
  setSearchKey(value)
}

  const sortLabel =
    sortby === "desc" ? t("Z to A") :
      sortby === "asc" ? t("A to Z") :
        t("Default")
  const handleFilter=(value)=>{

  }

  return (
    <Box marginTop="20px" minHeight="36vh">
     <Grid
  container
  spacing={{ xs: 2, md: 3 }}
  justifyContent="flex-start"
  // alignItems="center"
>
  {selectedModule?.module_type === "food" && storeType !== 'top_offer_near_me' && (
    <Grid item xs={12} sm={12} md={12} align="center">
      <CustomStackFullWidth alignItems="center" justifyContent="center">
        <GroupButtons setType={setType} type={type} />
      </CustomStackFullWidth>
    </Grid>
  )}
  {storeType === "top_offer_near_me" && (
    <Grid item xs={12} sm={12} md={12}>
      <Stack direction={{xs:"colum",sm:"row",md:"row"}} spacing={2} justifyContent="space-between" alignItems="center">
        <Stack sx={{overflowX:{xs:"scroll",md:"hidden"},}} direction="row" spacing={{xs:1,sm:2,md:2}} justifyContent="flex-start" alignItems="center" width="100%"
         marginBottom={{xs: "1rem", sm: "1rem",md:"0rem"}}
        >
          <CustomChip
            variant="outlined" 
            value={sortby}
            label={<Box display="flex" alignItems="center">
              Sort by ({sortLabel})
              <IconButton
                size="small"
                sx={{ padding: 0, ml: 0.5 }}
              >
                <KeyboardArrowDownIcon style={{ color: iconColor }} />
              </IconButton>
            </Box>}
            onClick={(event) => handlePopOverOpen(event)}
          />
          {getModule()?.module_type==="food" && <>
            <CustomChip
              variant="outlined"
              value={type === 'halal'}
              label="Only Halal"
              onClick={() => setType(type === 'halal' ? '' : 'halal')}
            />

            <CustomChip
              variant="outlined"
              value={type === 'veg'}
              label="Only Veg"
              onClick={() => setType(type === 'veg' ? '' : 'veg')}
            />

            <CustomChip
              variant="outlined"
              value={type === 'non_veg'}
              label="Only Non Veg"
              onClick={() => setType(type === 'non_veg' ? '' : 'non_veg')}
            />

          </>}
        </Stack>
        <Stack width="100%" marginTop={{xs: "1rem", sm: "1rem",md:"0rem"}}>
          <CustomSearch
            label={t("Search for stores...")}
            selectedValue={searchKey}
            handleSearchResult={handleSearchResult}
            type2
          />
        </Stack>
      </Stack>
    </Grid>
  )}
  
  {data && data.length > 0 ? (
    data.map((store) => {
      return (
        <Grid key={store?.id} item xs={matchesXs ? 12 : 6} sm={6} md={3}>
          <StoreCard item={store} imageUrl={store?.cover_photo_full_url} />
        </Grid>
      );
    })
  ) : (
    <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
      <EmptySearchResults text="Stores not found!" />
    </Grid>
  )}
</Grid>

      <Popover
        open={Boolean(anchorEl)}
        onClose={handlePopOverClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <List>
          <RadioGroup value={sortby} onChange={handleSortChange}>
            <ListItem
              sx={{
                fontSize: '13px',
                paddingInline: '1rem',
                cursor: 'pointer',
                color: (theme) => theme.palette.neutral[600],
                borderBottom: '1px solid',
                borderBottomColor: (theme) => alpha(theme.palette.neutral[300], 0.3),
                paddingTop: '4px',
                paddingBottom: '4px',
              }}
            >
              <FormControlLabel
                value=""
                control={<Radio />}
                label={
                  <ListItemText
                    primary={
                      <Typography fontSize="13px">
                        {t('Sort by: Default')}
                      </Typography>
                    }
                  />
                }
              />
            </ListItem>
            <ListItem
              sx={{
                fontSize: '13px',
                paddingInline: '1rem',
                cursor: 'pointer',
                color: (theme) => theme.palette.neutral[600],
                borderBottom: '1px solid',
                borderBottomColor: (theme) => alpha(theme.palette.neutral[300], 0.3),
                paddingTop: '4px',
                paddingBottom: '4px',
              }}
            >
              <FormControlLabel
                    value="asc"
                control={<Radio />}
                label={
                  <ListItemText
                  primary={
                    <Typography fontSize="13px">
                        {t('Sort by: A to Z')}
                    </Typography>
                }
                  />
                }
              />
            </ListItem>
            <ListItem
              sx={{
                fontSize: '13px',
                paddingInline: '1rem',
                cursor: 'pointer', 
                color: (theme) => theme.palette.neutral[600],
                paddingTop: '4px',
                paddingBottom: '4px',
              }}
            >
              <FormControlLabel
                value="desc"
                control={<Radio />}
                label={
                  <ListItemText
                  primary={
                    <Typography fontSize="13px">
                        {t('Sort by: Z to A')}
                    </Typography>
                }
                  />
                }
              />
            </ListItem>
          </RadioGroup>
        </List>
      </Popover>
    </Box>
  );
};

export default StoreList;
