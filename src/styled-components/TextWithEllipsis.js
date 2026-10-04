import { makeStyles } from "@mui/styles";

const LINES_TO_SHOW = 1;

export const textWithEllipsis = makeStyles({
  multiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": LINES_TO_SHOW,
    "-webkit-box-orient": "vertical",
  },
  singleLineEllipsis: {
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 1,
    "-webkit-box-orient": "vertical",
  },
});
