'use client';

import { useState, useEffect } from 'react';

export default function ClientLoader({
  children
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 400);
    
      document.body.style.overflow = 'auto';

    return () => {
      clearTimeout(timer);
      // clearTimeout(overflowTimer);
    };
  }, []);

  return (
    <>
      {children}
      {visible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f2f2f2',
            zIndex: 9999,
            opacity: mounted ? 0 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: mounted ? 'none' : 'all',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '4px solid #79BED9',
              borderTopColor: '#1462A6',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}
    </>
  );
}
