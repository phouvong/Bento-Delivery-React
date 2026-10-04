import { useSelector } from "react-redux";
import isVerifiedStoreEnabled from "helper-functions/isVerifiedStoreEnabled";

const useIsVerifiedStoreEnabled = (): boolean => {
  const configData = useSelector(
    (state: any) => state.configData?.configData,
  );
  return isVerifiedStoreEnabled(configData);
};

export default useIsVerifiedStoreEnabled;
