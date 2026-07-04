import React from "react";
import ClosedNowOverlay from "./ClosedNowOverlay";

const ClosedNow = ({ active, open, borderRadius }) => {
  if (active && open !== 0) return null;
  return <ClosedNowOverlay borderRadius={borderRadius} />;
};

ClosedNow.propTypes = {};

export default ClosedNow;
