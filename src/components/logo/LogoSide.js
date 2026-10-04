import CustomLogo from "./CustomLogo";
import { Stack } from "@mui/system";

const LogoSide = ({ configData, width, height, objectFit }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      width="fit-content"
      justifyContent="flex-start"
    >
      <CustomLogo
        atlText="logo"
        logoImg={configData?.logo_full_url}
        width={width}
        height={height}
        objectFit={objectFit}
      />
    </Stack>
  );
};

LogoSide.propTypes = {};

export default LogoSide;
