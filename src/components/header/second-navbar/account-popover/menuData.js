import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import WalletIcon from "@mui/icons-material/Wallet";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

// `name` is the routing/page key (kebab-case, must stay stable for `page=...`
// query routing and the active-menu highlight check). `label` is the
// translation key shown to the user — keep both in sync when editing.
export const menuData = [
  {
    id: 1,
    name: "profile-settings",
    label: "Profile Settings",
    icon: <AccountCircleIcon />,
    path: "/profile",
  },
  {
    id: 2,
    name: "my-orders",
    label: "My Orders",
    icon: <ShoppingCartCheckoutIcon />,
    path: "/my-orders",
  },
  {
    id: 12,
    name: "monthly-cart-list",
    label: "Monthly Cart List",
    icon: <ShoppingCartCheckoutIcon />,
    path: "/profile?page=monthly-cart-list",
  },
  {
    id: 3,
    name: "my-trips",
    label: "My Trips",
    icon: <LocalTaxiIcon />,
    path: "/my-trips",
  },
  {
    id: 4,
    name: "wallet",
    label: "Wallet",
    icon: <WalletIcon />,
    path: "/wallet",
  },
  {
    id: 11,
    name: "subscription-plan",
    label: "Subscription Plan",
    icon: <EmojiEventsRoundedIcon />,
    path: "/profile?page=subscription-plan",
  },
  {
    id: 5,
    name: "coupons",
    label: "Coupons",
    icon: <ConfirmationNumberIcon />,
    path: "/coupons",
  },
  {
    id: 6,
    name: "loyalty-points",
    label: "Loyalty Points",
    icon: <LoyaltyIcon />,
    path: "/loyalty-points",
  },
  {
    id: 7,
    name: "referral-code",
    label: "Referral Code",
    icon: <SendToMobileIcon />,
    path: "/referral-code",
  },
  {
    id: 8,
    name: "inbox",
    label: "Inbox",
    icon: <SettingsIcon />,
    path: "/settings",
  },
  {
    id: 9,
    name: "settings",
    label: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
  },
  {
    id: 10,
    name: "track-order",
    label: "Track Order",
    icon: <LocalShippingOutlinedIcon />,
    path: "/track-order",
  },
];
