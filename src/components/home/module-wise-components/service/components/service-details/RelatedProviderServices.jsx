import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useGetRelatedProviderServices from "../../service-api-manage/hooks/react-query/related-provider-services/useGetRelatedProviderServices";

const RelatedProviderServices = ({ productDetails }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const serviceId = productDetails?.id ?? router.query.id;
  const { data, isLoading } = useGetRelatedProviderServices(serviceId);
  const items = Array.isArray(data) ? data : (data?.data ?? []);


  if (!isLoading && items.length === 0) return null;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "16px",
        p: { xs: 1.5, md: 2 },
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "18px", md: "24px" },
          color: theme.palette.text.primary,
          mb: 2,
        }}
        component="h2"
      >
        {t("More From Same Store")}
      </Typography>

      {isLoading ? (
        <Stack spacing={1.5}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rounded" width="100%" height={72} />
          ))}
        </Stack>
      ) : (
        <Stack
        >
          {items.map((item) => (
            <NewProductCard
                key={item?.id}
                variant="horizontal"
                item={item}
                horizontalStyle={{
                  p: 0,
                  borderRadius: 0,
                  border: "none",
                  borderBottom: `1px solid ${theme.palette.customColor.tagBg}`,
                  marginBottom: "24px",
                  "&:last-child": {
                    borderBottom: "none",
                    marginBottom: 0,
                  },
                  "&:hover": {
                      boxShadow: "none",
                    },
                 }}
              />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default RelatedProviderServices;
