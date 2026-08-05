import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../firebase.js"; // Adjust the import based on
// your file
// structure

const useFirebasePhoneAuth = () => {
  const [verificationId, setVerificationId] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      // Firebase v9+ modular signature: (auth, containerOrId, parameters).
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {},
          "expired-callback": () => {
            window.recaptchaVerifier?.reset();
          },
        }
      );
    } else {
      window.recaptchaVerifier?.clear();
      setUpRecaptcha();
    }
  };

  const sendOTP = (phoneNumber) => {
    setError(null);
    setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setIsOtpSent(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return {
    sendOTP,
    verificationId,
    isOtpSent,
    error,
  };
};

export default useFirebasePhoneAuth;
