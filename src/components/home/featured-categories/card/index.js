import {
  alpha,
  Skeleton,
  Stack,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { getModuleId } from "helper-functions/getModuleId";
import Link from "next/link";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

export const Card = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100px",
  width: "100px",
  borderRadius: "8px",
  padding: "5px",
  "&:hover": {
    boxShadow: "0px 15px 25px rgba(88, 110, 125, 0.1)",
    border: "0px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "110px",
    width: "110px",
  },
}));

const FeaturedItemCard = ({ image, title, id, onlyshimmer }) => {
  const [hover, setHover] = useState(false);
  const { ref: textRef, isEllipsed } = useTextEllipsis(title);
  const classes = textWithEllipsis();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Link
      href={{
        pathname: "/home",
        query: {
          search: "category",
          id: id,
          module_id: `${getModuleId()}`,
          name: title && title,
          data_type: "category",
        },
      }}
      passHref
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          padding: ".5rem",
          cursor: "pointer",
          height: { xs: "130px", md: "155px" },
          width: { xs: "100px", md: "124px" },
          backgroundColor: (theme) => theme.palette.background.paper,
          border: (theme) =>
            `1.5px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
          borderRadius: "10px",
          "&:hover": {
            boxShadow: "0px 10px 20px 0px rgba(88, 110, 125, 0.10)",
            border: (theme) => `.5px solid ${theme.palette.primary.main}`,
            img: {
              transform: "scale(1.04)",
            },
          },
          // ensure flex items can shrink inside
          "& > div": {
            minWidth: 0,
          },
        }}
      >
        <Stack
          sx={{
            position: "relative",
            height: { xs: "95px", md: "110px" },
            width: "100%",
            img: {
              width: "100%",
              height: "100%",
            },
          }}
        >
          {onlyshimmer ? (
            <Skeleton width="100%" height="100%" variant="rectangle" />
          ) : (
            <NextImage
              src={image}
              alt={title}
              height={110}
              width={106}
              objectFit="cover"
              bg="#ddd"
            />
          )}
        </Stack>

        <Tooltip
          title={isEllipsed ? title : ""}
          placement="bottom"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: (theme) => theme.palette.toolTipColor,
                "& .MuiTooltip-arrow": {
                  color: (theme) => theme.palette.toolTipColor,
                },
              },
            },
          }}
        >
          <CustomBoxFullWidth
            sx={{
              px: "10px",
              width: "100%",
              // Ensu"100%",
              // Ensure wrapper in flex can shrink and give a constrained width
              minWidth: 0,
            }}
          >
            <Typography
              // put ref on the exact element that holds the text
              ref={textRef}
              component="h4"
              textAlign="center"
              className={classes.singleLineEllipsis}
              sx={{
                // Force the single-line ellipsis CSS here to be sure
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
              }}
              maxHeight="20px"
              color={hover ? "primary.main" : "text.primary"}
            >
              {onlyshimmer ? (
                <Skeleton width="70px" variant="text" sx={{ mx: "auto" }} />
              ) : (
                title
              )}
            </Typography>
          </CustomBoxFullWidth>
        </Tooltip>
      </Stack>
    </Link>
  );
};

export default FeaturedItemCard;
