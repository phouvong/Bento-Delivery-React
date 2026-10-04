import React from "react";
import Head from "next/head";
import placeholder from "../../../public/static/no-image-found.png";
const DynamicFavicon = ({ configData }) => {
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={configData?.fav_icon_full_url || placeholder}
      />
      <link rel="icon" href={configData?.fav_icon_full_url || placeholder} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={configData?.fav_icon_full_url || placeholder}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={configData?.fav_icon_full_url || placeholder}
      />
    </Head>
  );
};

DynamicFavicon.propTypes = {};

export default DynamicFavicon;
