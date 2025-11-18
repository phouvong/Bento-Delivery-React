import React, { useState } from "react";

import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import DialogContent from "@mui/material/DialogContent";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";
import { Button, Stack, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { WrapperForCustomDialogConfirm } from "../../custom-dialog/confirm/CustomDialogConfirm.style";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import toast from "react-hot-toast";

const CancelOrder = ({
  cancelReason,
  orderLoading,
  setCancelReason,
  cancelReasonsData,
  setModalOpen,
  handleOnSuccess,
  additionalInfo,
  setAdditionalInfo,
  isParcel,
  orderStatus,
  setReturnFareOpenModal,
  configData,
                       loading
}) => {
  const [value, setValue] = useState();
  const handleChange = (newValue) => {
    if (typeof newValue === 'object' && newValue.target) {
      // For radio buttons
      setCancelReason(newValue.target.value);
    } else {
      // For multi-select arrays
      setCancelReason(newValue);
    }
  };
  const onClose = () => {
    setModalOpen(false);
  };

  const hanleClick=()=>{
    setReturnFareOpenModal(true)
    setModalOpen(false)
  }
  return (
    <>
     {isParcel ? (
       <WrapperForCustomDialogConfirm width="27rem">
       <CustomStackFullWidth spacing={1}>
        
         <DialogContent sx={{ padding: "10px 24px" }}>
           <CustomStackFullWidth>
             <FormControl component="fieldset">
               <Typography fontWeight="500" fontSize="14px" paddingY=".5rem">
                 {t("Please select cancellation reason")}
               </Typography>
               <Stack spacing={1}>
                 {cancelReasonsData &&
                   cancelReasonsData?.data?.length > 0 &&
                   cancelReasonsData?.data?.map((reason) => {
                     return (
                       <FormControlLabel
                         key={reason?.id}
                         checked={
                           Array.isArray(cancelReason) 
                             ? cancelReason.includes(reason.reason)
                             : cancelReason === reason.reason
                         }
                         onChange={(event) => {
                           const isChecked = event.target.checked;
                           const reasonValue = reason.reason;
                           
                           if (Array.isArray(cancelReason)) {
                             // Multi-select mode
                             if (isChecked) {
                               setCancelReason([...cancelReason, reasonValue]);
                             } else {
                               setCancelReason(cancelReason.filter(r => r !== reasonValue));
                             }
                           } else {
                             // Convert to array for multi-select
                             if (isChecked) {
                               setCancelReason(cancelReason ? [cancelReason, reasonValue] : [reasonValue]);
                             } else {
                               setCancelReason([]);
                             }
                           }
                         }}
                         control={<Checkbox />}
                         label={reason.reason}
                         labelPlacement="start"
                         sx={{
                           justifyContent: "space-between",
                           marginLeft: 0,
                           marginRight: 0,
                           border: (Array.isArray(cancelReason) 
                             ? cancelReason.includes(reason.reason)
                             : cancelReason === reason.reason) 
                             ? "none" 
                             : "1px solid #F3F3F3",
                           borderRadius: "8px",
                           padding: "0px 10px",
                           transition: "all 0.2s ease-in-out",
                           boxShadow: (Array.isArray(cancelReason) 
                             ? cancelReason.includes(reason.reason)
                             : cancelReason === reason.reason) 
                             ? "0 2px 8px rgba(0, 0, 0, 0.1)" 
                             : "none",
                           backgroundColor: (Array.isArray(cancelReason) 
                             ? cancelReason.includes(reason.reason)
                             : cancelReason === reason.reason) 
                             ? "rgba(174, 175, 175, 0.04)" 
                             : "transparent",
                           "& .MuiFormControlLabel-label": {
                             color: (Array.isArray(cancelReason) 
                               ? cancelReason.includes(reason.reason)
                               : cancelReason === reason.reason) 
                               ? "#000000" 
                               : "inherit",
                             fontWeight: (Array.isArray(cancelReason) 
                               ? cancelReason.includes(reason.reason)
                               : cancelReason === reason.reason) 
                               ? "500" 
                               : "normal"
                           },
                           "&:hover": {
                             backgroundColor: "rgba(210, 215, 220, 0.02)"
                           }
                         }}
                       />
                     );
                   })}
               </Stack>
             </FormControl>
             <Typography mt="10px" fontWeight="600" fontSize="14px">{t("Comments")}</Typography>
             <TextField
             sx={{marginTop:".5rem"}}
               id="outlined-multiline-static"
               label="Type here your cancel reason..."
               multiline
               fullWidth
               rows={4}
               variant="outlined"
               value={additionalInfo}
               onChange={(e) => setAdditionalInfo(e.target.value)}
             />
           </CustomStackFullWidth>
         </DialogContent>
         <DialogActions sx={{ paddingX: "20px" }}>
           <Stack
             direction="column"
             alignItems="center"
             justifyContent="center"
             width="100%"
             spacing={2}
           >
             {orderStatus === "pending"  || (configData?.parcel_cancellation_basic_setup && configData?.parcel_cancellation_basic_setup?.return_fee_status !=="1") ? (
               <LoadingButton
               loading={orderLoading}
               onClick={handleOnSuccess}
               variant="contained"
               sx={{ width: "100%" }}
             >
               {t("Submit")}
             </LoadingButton>
             ):(
              <LoadingButton
              loading={orderLoading}
              onClick={hanleClick}
              variant="contained"
              sx={{ width: "100%" }}
            >
              {t("Next")}
            </LoadingButton>
             )}
            
             <Typography onClick={()=>setModalOpen(false)} fontWeight="600" sx={{textDecoration:"underline",cursor:"pointer",color:"#000"}} variant="body2" >{t("Continue Delivery")}</Typography>
           </Stack>
           
         </DialogActions>
       </CustomStackFullWidth>
     </WrapperForCustomDialogConfirm>
     ):(
      <WrapperForCustomDialogConfirm width="22rem">
      <CustomStackFullWidth spacing={1}>
        <DialogTitle id="alert-dialog-title" sx={{ padding: "10px 24px" }}>
          <Typography textAlign="center" variant="h6">
            {t("What’s Wrong With This Order?")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ padding: "10px 24px" }}>
          <CustomStackFullWidth>
            <FormControl component="fieldset">
              {cancelReasonsData?.data?.length > 0 && (
                <Typography fontWeight="600" variant="h6" paddingY=".5rem">
                  {t("Cancel Reason")}
                </Typography>
              )}

              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={cancelReason}
                onChange={handleChange}
              >
                {cancelReasonsData &&
                  cancelReasonsData?.data?.length > 0 &&
                  cancelReasonsData?.data?.map((reason) => {
                    return (
                      <FormControlLabel
                        key={reason?.id}
                        value={reason.reason}
                        checked={
                          reason.reason == cancelReason ? cancelReason : false
                        }
                        editable={true}
                        control={<Radio />}
                        label={reason.reason}
                      />
                    );
                  })}
              </RadioGroup>
            </FormControl>
            <Typography mt="10px" fontWeight="600" fontSize="14px">{t("Comments")}</Typography>
            <TextField
              sx={{marginTop:".5rem"}}
              id="outlined-multiline-static"
              label="Type here your cancel reason..."
              multiline
              fullWidth
              rows={4}
              variant="outlined"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />

          </CustomStackFullWidth>
        </DialogContent>
        <DialogActions sx={{ paddingX: "20px" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            width="100%"
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                width: "100%",
                backgroundColor: (theme) => theme.palette.neutral[300],
                color: (theme) => theme.palette.neutral[1000],

                "&:hover": {
                  backgroundColor: (theme) => theme.palette.neutral[400],
                },
              }}
            >
              {t("Back")}
            </Button>
            <LoadingButton
              loading={orderLoading}
              onClick={handleOnSuccess}
              variant="contained"
              sx={{ width: "100%" }}
            >
              {t("Submit")}
            </LoadingButton>
          </Stack>
        </DialogActions>
      </CustomStackFullWidth>
    </WrapperForCustomDialogConfirm>
     )}
    </>
  );
};

export default CancelOrder;
