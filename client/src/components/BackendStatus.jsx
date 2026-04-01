/**
 * BackendStatus Component
 *
 * This component checks if the backend API is available and shows a simple
 * warning banner if it's still waking up (cold start). Unlike the old
 * BackendWakeup which blocked the entire app, this allows the user to
 * see the page while waiting for the backend to become available.
 *
 * The banner appears at the top of the page when the backend is not ready.
 */

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Checks if the backend API is responding
 * @returns {Promise<boolean>} - true if backend is awake, false otherwise
 */
const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_URL}/health`);
    return res.ok;
  } catch {
    // If fetch fails (network error), backend is not available
    return false;
  }
};

const BackendStatus = () => {
  // State to track if backend is awake
  // - null = still checking
  // - true = backend is awake
  // - false = backend is waking up/down
  const [isBackendAwake, setIsBackendAwake] = useState(null);

  useEffect(() => {
    // Immediately check backend status when component mounts
    const checkStatus = async () => {
      const isAwake = await checkBackendHealth();
      setIsBackendAwake(isAwake);

      // If backend is not awake, keep checking periodically
      if (!isAwake) {
        // Check every 3 seconds while backend is waking up
        const interval = setInterval(async () => {
          const status = await checkBackendHealth();
          if (status) {
            setIsBackendAwake(true);
            clearInterval(interval);
          }
        }, 3000);

        // Clean up interval when component unmounts or backend wakes up
        return () => clearInterval(interval);
      }
    };

    checkStatus();
  }, []);

  // Don't show anything while checking (avoids flash of banner)
  if (isBackendAwake === null) {
    return null;
  }

  // If backend is awake, don't show any banner
  if (isBackendAwake) {
    return null;
  }

  // Backend is still waking up - show the warning banner
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 backdrop-blur-sm text-black px-4 py-2 text-center text-sm font-medium shadow-lg">
      <span className="inline-block animate-pulse mr-2">⚠️</span>
      Wait, the backend is waking up...
    </div>
  );
};

export default BackendStatus;
