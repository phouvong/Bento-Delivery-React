import { Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import CustomImageContainer from "../../CustomImageContainer";
import Link from "next/link";

const Inner = ({ image, alt, title, info, t, theme }) => (
  <Stack
    alignItems="center"
    gap="24px"
    sx={{
      flex: 1,
      px: "8px",
      cursor: "pointer",
      img: { transition: "all ease 0.5s" },
      "&:hover .info-label": { color: theme.palette.primary.main },
      "&:hover .info-value": { color: theme.palette.primary.main },
    }}
  >
    <CustomImageContainer src={image.src} alt={alt} height={50} width={50} />
    <Stack gap="4px" alignItems="center" sx={{ width: "100%" }}>
      <Typography
        className="info-label"
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: "neutral.1050",
          letterSpacing: "-0.42px",
          lineHeight: 1.2,
          textAlign: "center",
          transition: "color 0.2s ease",
        }}
      >
        {t(title)}
      </Typography>
      <Typography
        className="info-value"
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: "neutral.500",
          letterSpacing: "-0.42px",
          lineHeight: 1.2,
          textAlign: "center",
          transition: "color 0.2s ease",
        }}
      >
        {info}
      </Typography>
    </Stack>
  </Stack>
);

const SomeInfo = ({ image, alt, title, info, t, href }) => {
  const theme = useTheme();

  if (href) {
    return (
      <Link href={href} style={{ flex: 1, textDecoration: "none" }}>
        <Inner image={image} alt={alt} title={title} info={info} t={t} theme={theme} />
      </Link>
    );
  }

  return <Inner image={image} alt={alt} title={title} info={info} t={t} theme={theme} />;
};

SomeInfo.propTypes = {};

export default SomeInfo;
