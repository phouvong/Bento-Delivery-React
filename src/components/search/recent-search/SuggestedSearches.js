import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const NEAR_ME_MODULES = ["food", "grocery", "pharmacy"];

// ─── Redirect icon ─────────────────────────────────────────────────────────

const RedirectIcon = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      py: "8px",
      flexShrink: 0,
    }}
  >
    <i
      className="fi fi-rs-arrow-up-right-from-square"
      style={{
        fontSize: "16px",
        lineHeight: 1,
        display: "flex",
        color: "neutral.500",
      }}
    />
  </Box>
);

// ─── Single result row ─────────────────────────────────────────────────────

const HighlightedLabel = ({ label, searchValue }) => {
  if (!searchValue || !label) {
    return (
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: "neutral.700",
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
    );
  }
  const lowerLabel = label.toLowerCase();
  const lowerSearch = searchValue.toLowerCase();
  const idx = lowerLabel.indexOf(lowerSearch);
  if (idx === -1) {
    return (
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: "neutral.700",
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
    );
  }
  const before = label.slice(0, idx);
  const match = label.slice(idx, idx + searchValue.length);
  const after = label.slice(idx + searchValue.length);
  return (
    <Typography
      component="span"
      sx={{ fontSize: "14px", color: "neutral.700", lineHeight: 1.3 }}
    >
      {before}
      <Typography
        component="span"
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: "neutral.700",
          lineHeight: 1.3,
        }}
      >
        {match}
      </Typography>
      {after}
    </Typography>
  );
};

const ResultRow = ({ icon, label, searchValue, onClick }) => (
  <Stack
    direction="row"
    alignItems="center"
    gap="12px"
    onClick={onClick}
    sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        width: 16,
        height: 16,
      }}
    >
      {icon}
    </Box>
    <Box
      sx={{
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      <HighlightedLabel label={label} searchValue={searchValue} />
    </Box>
    <RedirectIcon />
  </Stack>
);

// ─── Keyword suggestion row (bold typed part + regular rest) ───────────────

const KeywordRow = ({ suggestion, searchValue, onClick }) => {
  const lowerSuggestion = suggestion.toLowerCase();
  const lowerSearch = searchValue.toLowerCase();
  const idx = lowerSuggestion.indexOf(lowerSearch);

  let content;
  if (idx !== -1 && searchValue) {
    const before = suggestion.slice(0, idx);
    const match = suggestion.slice(idx, idx + searchValue.length);
    const after = suggestion.slice(idx + searchValue.length);
    content = (
      <Typography
        component="span"
        sx={{ fontSize: "14px", color: "neutral.700", lineHeight: 1.3 }}
      >
        {before}
        <Typography
          component="span"
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "neutral.700",
            lineHeight: 1.3,
          }}
        >
          {match}
        </Typography>
        {after}
      </Typography>
    );
  } else {
    content = (
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: "neutral.700",
          lineHeight: 1.3,
        }}
      >
        {suggestion}
      </Typography>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="12px"
      onClick={onClick}
      sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <i
          className="fi fi-rr-search"
          style={{
            fontSize: "16px",
            lineHeight: 1,
            display: "flex",
            color: "neutral.500",
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {content}
      </Box>
      <RedirectIcon />
    </Stack>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────

const SuggestedSearches = ({
  data,
  handleKeyPress,
  isRefetching,
  searchValue,
  keywordSuggestions = [], // backend keyword suggestions e.g. ["Best burger near me"]
  onItemClick,
  onStoreClick,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const moduleType = getCurrentModuleType();
  const showNearMe = !!searchValue && NEAR_ME_MODULES.includes(moduleType);

  const handleNearMeClick = () => {
    if (!searchValue) return;
    router.push({
      pathname: "/search",
      query: {
        ...router.query,
        search: searchValue,
        data_type: "searched",
        quick_action: "nearby",
      },
    });
  };

  const items = data?.items ?? [];
  const stores = data?.stores ?? [];
  const hasResults = items.length > 0 || stores.length > 0;

  if (isRefetching) {
    return (
      <Stack spacing="6px">
        <Skeleton variant="text" width="80px" height={20} />
        {[...Array(4)].map((_, i) => (
          <Stack key={i} direction="row" alignItems="center" gap="12px">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" sx={{ flex: 1 }} height={18} />
            <Skeleton variant="circular" width={16} height={16} />
          </Stack>
        ))}
      </Stack>
    );
  }

  if (!hasResults && !searchValue) return null;

  return (
    <Stack spacing={2}>
      {/* ── Section 1: Suggested items + stores ── */}
      {hasResults && (
        <Stack spacing={2}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "neutral.1050",
              letterSpacing: "-0.54px",
              lineHeight: 1.1,
            }}
          >
            {t("Suggested")}
          </Typography>
          <Stack spacing="6px">
            {items?.slice(0, 2)?.map((item, index) => (
              <ResultRow
                key={`item-${index}`}
                icon={
                  <i
                    className="fi fi-rr-box-open"
                    style={{
                      fontSize: "16px",
                      lineHeight: 1,
                      display: "flex",
                      color: "neutral.500",
                    }}
                  />
                }
                label={item?.name}
                searchValue={searchValue}
                onClick={() =>
                  onItemClick ? onItemClick(item) : handleKeyPress?.(item?.name)
                }
              />
            ))}
            {stores?.slice(0, 2)?.map((store, index) => (
              <ResultRow
                key={`store-${index}`}
                icon={
                  <i
                    className="fi fi-rr-shop"
                    style={{
                      fontSize: "16px",
                      lineHeight: 1,
                      display: "flex",
                      color: "neutral.500",
                    }}
                  />
                }
                label={store?.name}
                searchValue={searchValue}
                onClick={() =>
                  onStoreClick
                    ? onStoreClick(store)
                    : handleKeyPress?.(store?.name)
                }
              />
            ))}
          </Stack>
        </Stack>
      )}

      {/* ── Divider + Section 2: Keyword suggestions + Search For ── */}
      <Stack spacing={2}>
        {hasResults && (
          <Box
            sx={{
              height: "1px",
              backgroundColor: "background.secondary",
              width: "100%",
            }}
          />
        )}
        <Stack spacing="6px">
          {keywordSuggestions.map((suggestion, index) => (
            <KeywordRow
              key={index}
              suggestion={suggestion}
              searchValue={searchValue}
              onClick={() => handleKeyPress?.(suggestion)}
            />
          ))}
          {showNearMe && (
            <Stack
              direction="row"
              alignItems="center"
              gap="12px"
              onClick={handleNearMeClick}
              sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                }}
              >
                <i
                  className="fi fi-rr-search"
                  style={{
                    fontSize: "16px",
                    lineHeight: 1,
                    display: "flex",
                    color: "neutral.500",
                  }}
                />
              </Box>
              <Typography
                component="span"
                sx={{
                  flex: 1,
                  fontSize: "14px",
                  color: "neutral.700",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "neutral.700",
                    lineHeight: 1.3,
                  }}
                >
                  {searchValue}
                </Typography>{" "}
                {t("Near Me")}
              </Typography>
              <RedirectIcon />
            </Stack>
          )}
          {searchValue && (
            <Stack
              direction="row"
              alignItems="center"
              gap="12px"
              onClick={() => handleKeyPress?.(searchValue)}
              sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                }}
              >
                <i
                  className="fi fi-rr-search"
                  style={{
                    fontSize: "16px",
                    lineHeight: 1,
                    display: "flex",
                    color: "neutral.500",
                  }}
                />
              </Box>
              <Typography
                component="span"
                sx={{
                  flex: 1,
                  fontSize: "14px",
                  color: "neutral.700",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t("Search For")}{" "}
                <Typography
                  component="span"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "neutral.700",
                    lineHeight: 1.3,
                  }}
                >
                  {searchValue}
                </Typography>
              </Typography>
              <RedirectIcon />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SuggestedSearches;
