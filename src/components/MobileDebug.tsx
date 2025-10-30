"use client";

import { useEffect, useState } from 'react';

export function MobileDebug() {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    setInfo({
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    });
  }, []);

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
      <div>Current body background: {getComputedStyle(document.body).backgroundColor}</div>
    </div>
  );
}