import { Typography, useTheme } from "@mui/material";
import { getAmountWithSign, getDiscountedAmount } from "helper-functions/CardHelpers";

export default function TotalAmount({ totalPrice, discount, discount_type, store_discount, quantity }) {
    const theme = useTheme();

    const formattedAmount = getAmountWithSign(
        getDiscountedAmount(
            totalPrice ?? 0,
            discount,
            discount_type,
            store_discount,
            quantity ?? 1
        )
    );

    return (
        <Typography
            component="span"
            sx={{
                fontWeight: 700,
                fontSize: { xs: "16px", md: "20px" },
                color: theme.palette.text.primary,
            }}
        >
            {formattedAmount}
        </Typography>
    );
}
