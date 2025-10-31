"use client";

import { useEffect, useState } from 'react';

export function MobileDebug() {
  const [info, setInfo] = useState<Record<string, unknown>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const mainEl = document.querySelector('main');
      const pageDiv = document.querySelector('.min-h-screen');
      
      setInfo({
        userAgent: navigator.userAgent,
        bodyBgColor: getComputedStyle(document.body).backgroundColor,
        mainBgColor: mainEl ? getComputedStyle(mainEl).backgroundColor : 'not found',
        pageDivBgColor: pageDiv ? getComputedStyle(pageDiv).backgroundColor : 'not found',
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        htmlBgColor: getComputedStyle(document.documentElement).backgroundColor,
      });
    }
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxHeight: '200px',
      overflow: 'auto'
    }}>
      <h3>Mobile Debug Info:</h3>
      <pre>{JSON.stringify(info, null, 2)}</pre>
      <div>Background should be: #1e293b</div>
    </div>
  );
}