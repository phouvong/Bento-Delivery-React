import React, { useRef } from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import ProductReviewCard from "./product-details-section/ProductReviewCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { t } from "i18next";


const ProductReviews = ({
  reviews,
  configData,
  isExpanded,
  storename,
}) => {

  return (
    <>
      <CustomBoxFullWidth>
        {reviews?.length > 0 ? (
          reviews?.map((review) => {
            return (
              <ProductReviewCard
                key={review?.id}
                review={review}
                configData={configData}
                storename={storename}
              />
            );
          })
        ) : (
          <>{isExpanded === "true" && t("No reviews found")}</>
        )}
      </CustomBoxFullWidth>
    </>
  );
};

export default ProductReviews;
