import React, { forwardRef } from "react";

import { styled } from "@mui/material/styles";
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";

const ScrollbarRoot = styled(SimpleBar)`
  // Targeting the scrollbar thumb

  .simplebar-scrollbar:before {
    width: 4px !important; // Adjust the width as needed
    background-color: darkgrey; // Example to change the scrollbar color
  }

  // Ensuring the scrollbar thumb is always visible (if desired)

  .simplebar-scrollbar.simplebar-visible:before {
    opacity: 1;
  }

  // Optionally, adjust other scrollbar styles here

  .simplebar-track.simplebar-vertical {
    width: 7px; // Match the width of the scrollbar thumb for consistency
  }
`;

// eslint-disable-next-line react/display-name
export const Scrollbar = forwardRef((props, ref) => {
  return <ScrollbarRoot ref={ref} {...props} />;
});
