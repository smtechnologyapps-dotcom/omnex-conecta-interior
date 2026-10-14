'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UpdateState {
  updateAvailable: boolean;
  applyUpdate: () => void;
  dismiss: () => void;
  versionName: string;
}

export function useServiceWorkerUpdate(): UpdateState {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [versionName] = useState('v2.4.2 Táctico');
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);
  const refreshingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let reg: ServiceWorkerRegistration;

    const onUpdateFound = () => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          waitingWorkerRef.current = newWorker;
          setUpdateAvailable(true);
        }
      });
    };

    navigator.serviceWorker
      .register('/sw.js')
      .then((r) => {
        reg = r;

        if (r.waiting && navigator.serviceWorker.controller) {
          waitingWorkerRef.current = r.waiting;
          setUpdateAvailable(true);
        }

        r.addEventListener('updatefound', onUpdateFound);

        // Sondeo periódico de versión cada 60s
        const interval = setInterval(() => {
          r.update().catch(() => {});
        }, 60000);

        const onOnline = () => {
          r.update().catch(() => {});
        };
        window.addEventListener('online', onOnline);

        return () => {
          clearInterval(interval);
          window.removeEventListener('online', onOnline);
        };
      })
      .catch((err) => {
        console.warn('OMNEX SW register note:', err);
      });

    const onControllerChange = () => {
      if (refreshingRef.current) return;
      refreshingRef.current = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (waitingWorkerRef.current) {
      waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }, []);

  const dismiss = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  return { updateAvailable, applyUpdate, dismiss, versionName };
}
