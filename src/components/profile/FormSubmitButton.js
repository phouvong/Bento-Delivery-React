import React from "react";
import { SaveButton } from "./basic-information/Profile.style";
import { ResetButton } from "./basic-information/BasicInformationForm";

const FormSubmitButton = ({ handleReset, isLoading, reset, submit }) => {
  return (
    <>
      <ResetButton variant="outlined" onClick={handleReset}>
        {reset}
      </ResetButton>
      <SaveButton
        variant="contained"
        type="submit"
        loading={isLoading}
        sx={{ minWidth: "100px" }}
      >
        {submit}
      </SaveButton>
    </>
  );
};

export default FormSubmitButton;
