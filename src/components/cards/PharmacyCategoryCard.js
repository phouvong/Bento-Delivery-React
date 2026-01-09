import { Skeleton, styled, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getModuleId } from "helper-functions/getModuleId";
import Link from "next/link";
import { useState } from "react";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

/* ===================== STYLES ===================== */

const Wrapper = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  width: "122px",
  height: "183px",
  backgroundColor: theme.palette.background.default,
  borderRadius: "60px",
  transition: "all ease 0.3s",
  overflow: "hidden",

  "&:hover": {
    boxShadow: "0px 10px 20px rgba(88, 110, 125, 0.1)",
    img: {
      transform: "scale(1.05)",
    },
  },

  [theme.breakpoints.down("md")]: {
    width: "100px",
    height: "150px",
    borderRadius: "45px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "90px",
    height: "140px",
    borderRadius: "40px",
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "122px",
  overflow: "hidden",
  borderRadius: "60px 60px 0 0",

  [theme.breakpoints.down("md")]: {
    height: "80px",
    borderRadius: "45px 45px 0 0",
  },

  [theme.breakpoints.down("sm")]: {
    height: "70px",
    borderRadius: "40px 40px 0 0",
  },
}));

const TextWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "40px",
  padding: "6px 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

/* ===================== COMPONENT ===================== */

const PharmacyCategoryCard = ({ image, title, id, onlyshimmer }) => {
  const [hover, setHover] = useState(false);
  const { ref: textRef, isEllipsed } = useTextEllipsis(title);

  return (
    <Link
      href={{
        pathname: "/home",
        query: {
          search: "category",
          id,
          module_id: `${getModuleId()}`,
          name: title,
          data_type: "category",
        },
      }}
      passHref
      legacyBehavior
    >
      <a style={{ textDecoration: "none" }}>
        <Wrapper
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <ImageWrapper>
            {onlyshimmer ? (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            ) : (
              <NextImage
                src={image}
                alt={title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 600px) 90px, 122px"
                bg="#ddd"
              />
            )}
          </ImageWrapper>

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
            <TextWrapper>
              <Typography
                ref={textRef}
                textAlign="center"
                component="h4"
                noWrap
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  lineHeight: "1.2",
                  maxWidth: "100%",
                  color: hover ? "primary.main" : "text.primary",
                }}
              >
                {onlyshimmer ? <Skeleton width="70px" /> : title}
              </Typography>
            </TextWrapper>
          </Tooltip>
        </Wrapper>
      </a>
    </Link>
  );
};

export default PharmacyCategoryCard;
