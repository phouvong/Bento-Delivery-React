import { useEffect } from "react";
import { useRouter } from "next/router";

const useScrollRestoration = () => {
  const router = useRouter();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";

      const saveScrollPosition = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY);
      };

      const restoreScrollPosition = () => {
        const savedPosition = sessionStorage.getItem("scrollPosition");
        if (savedPosition !== null) {
          window.scrollTo(0, parseInt(savedPosition));
        }
      };

      router.events.on("routeChangeStart", saveScrollPosition);
      router.events.on("routeChangeComplete", restoreScrollPosition);

      return () => {
        router.events.off("routeChangeStart", saveScrollPosition);
        router.events.off("routeChangeComplete", restoreScrollPosition);
        window.history.scrollRestoration = "auto";
      };
    }
  }, [router]);
};

export default useScrollRestoration;
