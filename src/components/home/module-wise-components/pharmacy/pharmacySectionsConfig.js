import { Box } from "@mui/system";
import OffersSectionPage from "components/home/section-page/OffersSectionPage";
import TabbedSectionPage from "components/home/section-page/TabbedSectionPage";

export const SECTION_GAP = 3;

export const getPharmacySections = () => [
  {
    id: "offers",
    label: "Offers",
    icon: (
      <Box sx={{ color: "warning.dark", display: "flex" }}>
        <i
          className="fi fi-rr-badge-percent"
          style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
        />
      </Box>
    ),
    content: <OffersSectionPage />,
    mobileContent: <OffersSectionPage />,
  },
  {
    id: "free-delivery",
    label: "Free Delivery",
    icon: (
      <Box sx={{ color: "info.main", display: "flex" }}>
        <i
          className="fi fi-rs-biking-mountain"
          style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
        />
      </Box>
    ),
    content: <TabbedSectionPage sectionType="free-delivery" />,
    mobileContent: <TabbedSectionPage sectionType="free-delivery" />,
  },
  {
    id: "top-rated",
    label: "Top Rated",
    icon: (
      <Box sx={{ color: "warning.dark", display: "flex" }}>
        <i
          className="fi fi-rr-star"
          style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
        />
      </Box>
    ),
    content: <TabbedSectionPage sectionType="top-rated" />,
    mobileContent: <TabbedSectionPage sectionType="top-rated" />,
  },
  {
    id: "nearby",
    label: "Nearby",
    icon: (
      <Box sx={{ color: "primary.dark", display: "flex" }}>
        <i
          className="fi fi-rs-marker"
          style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
        />
      </Box>
    ),
    content: <TabbedSectionPage sectionType="nearby" />,
    mobileContent: <TabbedSectionPage sectionType="nearby" />,
  },
];
