'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';

interface NetworkInformation extends EventTarget {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export default function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Check connection speed on component mount
  const shouldUseVideo = useMemo(() => {
    if (typeof window === 'undefined') return true;
    
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    if (connection && connection.effectiveType) {
      const effectiveType = connection.effectiveType;
      // Use image fallback for slow connections (2g, slow-2g)
      return effectiveType !== 'slow-2g' && effectiveType !== '2g';
    }
    
    return true; // Default to video if connection info unavailable
  }, []);

  const [videoError, setVideoError] = useState(!shouldUseVideo);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      {!videoError && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/assets/hero/hero-video.mp4" type="video/mp4" />
          <source src="/assets/hero/hero-video.webm" type="video/webm" />
        </video>
      )}

      {/* Image Fallback - Solid color background - only shows if video fails */}
      {videoError && (
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black" />
      )}

      {/* Overlay Gradient */}
      {/* <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/70" /> */}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}

