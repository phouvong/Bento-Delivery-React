import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const THEME_COOKIE_KEY = "themeMode";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const initialSettings = {
  direction: "ltr",
  responsiveFontSizes: true,
  theme: "light",
};

const getThemeFromCookie = (cookieString = "") => {
  if (!cookieString) return null;

  const match = cookieString.match(
    new RegExp(`(?:^|;\\s*)${THEME_COOKIE_KEY}=(dark|light)(?:;|$)`)
  );
  return match?.[1] || null;
};

const getPreferredTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const restoreSettings = (serverSettings = null) => {
  if (typeof window === "undefined") {
    return serverSettings || initialSettings;
  }

  let settings = null;

  try {
    const storedData = window.localStorage.getItem("settings");
    if (storedData) {
      settings = JSON.parse(storedData);
    }
  } catch (err) {
    // If stored data is not a stringified JSON this will fail,
    // that's why we catch the error
  }

  const cookieTheme = getThemeFromCookie(document.cookie);
  const resolvedTheme =
    cookieTheme || settings?.theme || getPreferredTheme() || "light";

  return {
    ...initialSettings,
    ...(serverSettings || {}),
    ...(settings || {}),
    theme: resolvedTheme === "dark" ? "dark" : "light",
  };
};

export const storeSettings = (settings) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("settings", JSON.stringify(settings));
  }

  if (typeof document !== "undefined") {
    const theme = settings?.theme === "dark" ? "dark" : "light";
    document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
  }
};

export const SettingsContext = createContext({
  settings: initialSettings,
  saveSettings: () => {},
});

export const SettingsProvider = (props) => {
  const { children, initialSettings: initialSettingsFromServer } = props;
  const [settings, setSettings] = useState(() =>
    restoreSettings(initialSettingsFromServer)
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const mode = settings?.theme === "dark" ? "dark" : "light";
    const pageBackground = mode === "dark" ? "#0B0F19" : "#FFFFFF";

    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;
    document.documentElement.style.backgroundColor = pageBackground;
    if (document.body) {
      document.body.style.backgroundColor = pageBackground;
    }
  }, [settings?.theme]);

  useEffect(() => {
    storeSettings(settings);
  }, [settings]);

  const saveSettings = (updatedSettings) => {
    setSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialSettings: PropTypes.shape({
    direction: PropTypes.string,
    responsiveFontSizes: PropTypes.bool,
    theme: PropTypes.oneOf(["light", "dark"]),
  }),
};

export const SettingsConsumer = SettingsContext.Consumer;
