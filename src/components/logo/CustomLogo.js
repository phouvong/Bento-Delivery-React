import { useRouter } from "next/router";
import { styled } from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import NextImage from "components/NextImage";
import { getModuleId } from "helper-functions/getModuleId";

export const Logo = styled("div")(({ height, width }) => ({
  maxWidth: width,
  height: height,

  position: "relative",
  cursor: "pointer",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
}));
const CustomLogo = ({ logoImg, atlText, height, width, objectFit }) => {
  const router = useRouter();
  let location = undefined;
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
  }
  const handleClick = () => {
    const queryModule = router?.query?.module || router?.query?.module_id;
    const moduleValue = Array.isArray(queryModule)
      ? queryModule[0]
      : queryModule || getModuleId();
    const homeHref = moduleValue
      ? { pathname: "/home", query: { module: String(moduleValue) } }
      : "/home";
    if (router.pathname === "/") {
      if (location) {
        router.replace(homeHref, undefined, { shallow: true });
      } else {
        router.push("/", undefined, { shallow: true });
      }
    } else {
      router.replace(homeHref, undefined, { shallow: true }).then();
    }
  };
  return (

    <Logo height={height} width={width} onClick={() => handleClick()}>
      <NextImage
        src={logoImg}
        alt={atlText}
        objectFit={objectFit ? objectFit : "contain"}
        loading="eager"
        width={100}
        height={70}
      />
    </Logo>
  );
};
export default CustomLogo;
