import { Box, Stack, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactElement } from "react";
import BogoOfferCardImpl from "components/bogo-list/BogoOfferCard";
import type { ChatBogoOffer } from "./types";

// The chat's `bogo_offers` rows are byte-identical to a GET /bogo/offers
// row, so the BOGO list page's own card renders them as-is — no parallel
// design to keep in step. It is a plain JS component, hence the explicit
// (loose) prop shape.
const BogoOfferCard = BogoOfferCardImpl as unknown as (props: {
  data: ChatBogoOffer;
  onClick?: () => void;
}) => ReactElement;

interface ChatBogoOfferChipsProps {
  offers: ChatBogoOffer[];
  onSelect?: (offer: ChatBogoOffer) => void;
}

const ChatBogoOfferChips = ({ offers, onSelect }: ChatBogoOfferChipsProps) => {
  const theme = useTheme();
  if (!offers?.length) return null;

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.text.primary, 0.15),
          borderRadius: 2,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ pt: 1, pb: 0.5, pr: 1, minWidth: "min-content" }}
      >
        {offers.map((offer) => (
          <Box key={offer.id} sx={{ width: 220, flexShrink: 0 }}>
            <BogoOfferCard
              data={offer}
              onClick={onSelect ? () => onSelect(offer) : undefined}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ChatBogoOfferChips;
