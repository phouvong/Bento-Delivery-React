import usFlag from "./assets/us.svg";
import loFlag from "./assets/lo.png";
import arabicFlag from "./assets/arabic-flag-svg.svg";
import spain from "./assets/spain.png";
import bangladesh from "./assets/bangladesh.png";
export const languageList = [
  {
    languageName: "English",
    languageCode: "en",
    countryCode: "US",
    countryFlag: usFlag.src,
  },
  {
    languageName: "Lao",
    languageCode: "lo",
    countryCode: "LA",
    countryFlag: loFlag.src,
  },
  // {
  //   languageName: "Spanish",
  //   languageCode: "es",
  //   countryCode: "es",
  //   countryFlag: spain.src,
  // },
  {
    languageName: "Arabic",
    languageCode: "ar",
    countryCode: "SA",
    countryFlag: arabicFlag.src,
  },
  // {
  //   languageName: "Bengali",
  //   languageCode: "bn",
  //   countryCode: "BN",
  //   countryFlag: bangladesh.src,
  // },
];
