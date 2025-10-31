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
      const firstCard = document.querySelector('[class*="bg-white"]');
      const overlay = document.querySelector('[class*="bg-slate-800"]');
      
      setInfo({
        userAgent: navigator.userAgent.split(' ')[2], // Show browser
        bodyBg: getComputedStyle(document.body).backgroundColor,
        mainBg: mainEl ? getComputedStyle(mainEl).backgroundColor : 'not found',
        pageDivBg: pageDiv ? getComputedStyle(pageDiv).backgroundColor : 'not found',
        firstCardBg: firstCard ? getComputedStyle(firstCard).backgroundColor : 'no white cards',
        overlayBg: overlay ? getComputedStyle(overlay).backgroundColor : 'no overlay',
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
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