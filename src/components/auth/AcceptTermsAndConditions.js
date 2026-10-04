import React, { useId } from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import {
  Checkbox,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { CustomTypography } from "../landing-page/hero-section/HeroSection.style";

const AcceptTermsAndConditions = ({
                                    handleCheckbox,
                                    formikType,
                                    handleClick,
                                  }) => {
  const theme = useTheme();
  const descriptionId = useId();
  const id2 = useId();

  return (
    <CustomStackFullWidth>
      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        spacing={{ xs: "0", md: ".5" }}
        sx={{ mt: "-10px" }}

      >
        <Checkbox
          id={descriptionId}
          value="ff"
          color="primary"
          onChange={handleCheckbox}
          checked={formikType.values.tandc}
          name="tandc"
          required
          sx={{ mr: "5px" }}
        />
        <Typography
          id={id2}
          sx={{
            fontSize: { xs: "12px", sm: "14px" },
            color: theme.palette.neutral[1000],
          }}
        >
          {t("You must accept the")}{" "}
          <span
            onClick={handleClick}
            style={{
              color: theme.palette.primary.main,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {t("terms and conditions")}
          </span>
        </Typography>
      </CustomStackFullWidth>

      {formikType.touched.tandc && formikType.errors.tandc && (
        <CustomTypography
          variant="caption"
          sx={{
            fontWeight: "inherit",
            color: theme.palette.error.main,
          }}
        >
          {t("You must accept the terms and conditions")}
        </CustomTypography>
      )}
    </CustomStackFullWidth>
  );
};

export default AcceptTermsAndConditions;
