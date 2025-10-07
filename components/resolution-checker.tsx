'use client';

import { useEffect, useState } from 'react';
import { notificationManager } from '@/lib/notification-manager';

export function ResolutionChecker() {
  const [hasShownResolutionWarning, setHasShownResolutionWarning] = useState(false);

  // Check for non-standard resolution and show warning - monitors window resize and polls for dev tools changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkResolution = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (height < 750 && width > 1000 && !hasShownResolutionWarning) {
        notificationManager.show('warning', 'You are using a non-standard resolution and the website may be impacted');
        setHasShownResolutionWarning(true);
      }
    };

    // Check immediately
    checkResolution();

    // Check on resize
    window.addEventListener('resize', checkResolution);

    // Poll every second to catch dev tools viewport changes
    const pollInterval = setInterval(checkResolution, 1000);

    return () => {
      window.removeEventListener('resize', checkResolution);
      clearInterval(pollInterval);
    };
  }, [hasShownResolutionWarning]);

  return null;
}
