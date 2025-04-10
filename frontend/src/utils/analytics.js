// src/utils/analytics.js
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-MMRSSD145V';

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = ({ category, action, label, value }) => {
  ReactGA.event({ category, action, label, value });
};


export const trackARViewStart = (productId) => {
    trackEvent({
      category: 'AR',
      action: 'ar_view_start',
      label: productId,
    });
  };
  
export const trackModelLoaded = (loadTimeMs) => {
    trackEvent({
        category: 'AR',
        action: 'model_loaded',
        value: loadTimeMs,
    });
};

export const trackCameraPermission = (granted) => {
    trackEvent({
        category: 'AR',
        action: 'camera_permission',
        label: granted ? 'granted' : 'denied',
    });
};



export const trackARSessionEnd = (durationSec) => {
    trackEvent({
        category: 'AR',
        action: 'ar_session_end',
        value: durationSec,
    });
};

export const trackARVTOSessionEnd = (durationSec) => {
  trackEvent({
      category: 'AR',
      action: 'vto_session_end',
      value: durationSec,
  });
};