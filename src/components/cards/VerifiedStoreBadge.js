import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const VerifiedStoreBadge = ({ verified, fontSize = "14px", sx, color }) => {
  if (!verified) return null;
  return (
    <VerifiedUserIcon
      {...(color ? { htmlColor: color } : {})}
      sx={{
        fontSize,
        ...(!color && { color: (theme) => theme.palette.primary.main }),
        flexShrink: 0,
        display: "inline-flex",
        alignSelf: "center",
        verticalAlign: "middle",
        marginInlineStart: "4px",
        ...sx,
      }}
    />
  );
};

export default VerifiedStoreBadge;