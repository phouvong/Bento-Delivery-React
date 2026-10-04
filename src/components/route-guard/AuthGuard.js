import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const AuthGuard = (props) => {
  const { children, from, requireToken = false } = props;
  const router = useRouter();
  const {orderId}=router.query;
  const [checked, setChecked] = useState(false);
  const { configData } = useSelector((state) => state.configData);
  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }
      const token = localStorage.getItem("token");
      const guest = localStorage.getItem("guest_id");
      // requireToken=true → only a real JWT token grants access (e.g. profile page).
      // Guest IDs must not bypass login-only routes.
      const isAuthenticated = requireToken
        ? !!token
        : !!(token || guest);
      if (isAuthenticated) {
        setChecked(true);
      } else {
        router.push(
          {
            pathname: "/home",
            query: { from: from },
          },
          undefined,
          { shallow: true }
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

export default AuthGuard;
