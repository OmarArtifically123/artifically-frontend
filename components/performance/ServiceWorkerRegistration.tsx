"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Service Worker Registration Component
 * Registers SW with intelligent caching and prefetching
 */
export default function ServiceWorkerRegistration() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Only register in production and if supported
    if (
      typeof window === 'undefined' ||
      process.env.NODE_ENV !== 'production' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    let newWorker: ServiceWorker | null = null;

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[App] Service Worker registered:', reg.scope);
        setRegistration(reg);

        // Check for updates
        reg.addEventListener('updatefound', () => {
          newWorker = reg.installing;
          console.log('[App] Service Worker update found');

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker?.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                console.log('[App] New Service Worker available');
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Prefetch important routes after registration
        setTimeout(() => {
          reg.active?.postMessage({
            type: 'PREFETCH_ROUTES',
            routes: ['/marketplace', '/pricing', '/docs', '/about'],
          });
        }, 2000);
      })
      .catch((error) => {
        console.error('[App] Service Worker registration failed:', error);
      });

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[App] Service Worker controller changed');
      // Optionally reload the page
      if (!updateAvailable) {
        window.location.reload();
      }
    });

    // Cleanup
    return () => {
      // No cleanup needed
    };
  }, []);

  // Show update notification
  const handleUpdate = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  }, [registration]);

  // Render update notification if available
  if (updateAvailable) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 10000,
          maxWidth: '320px',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        <div style={{ marginBottom: '12px', fontWeight: 600 }}>
          🚀 Update Available!
        </div>
        <div style={{ fontSize: '14px', marginBottom: '16px', opacity: 0.95 }}>
          A new version is available. Refresh to get the latest features and improvements.
        </div>
        <button
          onClick={handleUpdate}
          style={{
            background: 'white',
            color: '#667eea',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            fontSize: '14px',
          }}
        >
          Update Now
        </button>
        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

