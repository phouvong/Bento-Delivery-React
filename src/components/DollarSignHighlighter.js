
import React from "react";

const DollarSignHighlighter = ({ theme, text }) => {
  // console.log({ text });

  return (
    <>
      {text &&
        text.split(/\s+/).map((part, index) => {
          // Check if the word contains at least one dollar sign
          const isMatch = part.includes("$");
          // console.log({ part, isMatch });

          const normalizedPart = part.replaceAll("$", "");
          return (
            <span
              key={index}
              style={{
                color: isMatch ? theme.palette.primary.main : "inherit",
                textAlign: "left"
              }}
            >
              {index !== 0 && " "}
              {normalizedPart}
            </span>
          );
        })}
    </>
  );
};

export default DollarSignHighlighter;
