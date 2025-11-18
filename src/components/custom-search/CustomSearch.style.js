import { alpha, InputBase, styled } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

export const Search = styled(CustomStackFullWidth)(({ theme, type2 }) => ({
  backgroundColor: theme.palette.neutral[100],
  color: theme.palette.neutral[600],
  height: "40px",
  border:
    type2 &&
    `1px solid ${alpha(
      getCurrentModuleType() === ModuleTypes.FOOD
        ? theme.palette.moduleTheme.food
        : theme.palette.primary.main,
      0.4
    )}`,
  borderRadius: "5px",
  transition: theme.transitions.create(['box-shadow', 'border-color'], {
    duration: theme.transitions.duration.short,
  }),
  "&:focus-within": {
    border: `1px solid ${
      getCurrentModuleType() === ModuleTypes.FOOD
        ? theme.palette.moduleTheme.food
        : theme.palette.primary.main
    }`,
    boxShadow: `0 4px 12px ${alpha(
      getCurrentModuleType() === ModuleTypes.FOOD
        ? theme.palette.moduleTheme.food
        : theme.palette.primary.main,
      0.25
    )}, 0 0 0 1px ${alpha(
      getCurrentModuleType() === ModuleTypes.FOOD
        ? theme.palette.moduleTheme.food
        : theme.palette.primary.main,
      0.1
    )}`,
  },
}));

export const StyledInputBase = styled(InputBase)(
  ({ theme, language_direction }) => ({
    color:
      getCurrentModuleType() === ModuleTypes.FOOD
        ? theme.palette.moduleTheme.food
        : "primary.main",
    width: "100%",

    "& .MuiInputBase-input": {
      padding: "10px 17px",
      transition: theme.transitions.create("width"),
      width: "100%",
    },
  })
);
