import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Details = ({ description }) => {
  const theme = useTheme();
  const formattedText = description?.split(/\r\n/)
    .map(line => {
      if (line.match(/^\d+\./)) {
        return `<br/>${line}`; 
      } else if (line.trim() === '') {
        return '<br/><br/>';
      }
      return line;
    })
    .join('');

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: formattedText
        }}
        style={{
          color: theme.palette.neutral[400],
      
          fontSize: "12px",
         
        }}
      />
    </div>
  );
};

Details.propTypes = {};

export default Details;
