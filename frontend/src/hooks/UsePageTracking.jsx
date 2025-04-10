// src/hooks/usePageTracking.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
};
