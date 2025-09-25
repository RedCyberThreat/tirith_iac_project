import React, { useEffect, useState } from 'react';
import './Preloader.css';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [beaconsLit, setBeaconsLit] = useState(0);

  useEffect(() => {
    // Sequence for lighting beacons
    const beaconInterval = setInterval(() => {
      setBeaconsLit((prev) => {
        if (prev < 3) {
          return prev + 1;
        }
        clearInterval(beaconInterval);
        return prev;
      });
    }, 300);

    return () => clearInterval(beaconInterval);
  }, []); // Empty dependency array because onLoadingComplete is not used here

  useEffect(() => {
    // Trigger completion after all beacons are lit
    if (beaconsLit === 3) {
      setTimeout(onLoadingComplete, 800); // Give time for the last beacon pulse
    }
  }, [beaconsLit, onLoadingComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0a09] transition-opacity duration-700 ease-out"
      id="preloader-overlay"
      // Added accessibility attributes to the main container
      role="status"
      aria-live="polite"
    >
      <div className="relative w-full max-w-lg mx-auto">
        {/* Mountain Silhouette - Drawn with SVG */}
        <svg
          className="w-full h-auto text-[#2d110f] opacity-70"
          viewBox="0 0 500 200"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base mountain shape - adjust points for desired look */}
          <path
            d="M0 200 L100 80 L180 150 L250 50 L320 150 L400 80 L500 200 Z"
            fill="currentColor"
            className="stroke-[#652821] stroke-1"
            style={{ filter: 'drop-shadow(0 0 5px rgba(101, 40, 33, 0.5))' }}
          />
          {/* Beacon positions - adjust cx, cy as needed */}
          <circle cx="120" cy="95" r="5" className={`beacon ${beaconsLit >= 1 ? 'lit' : ''}`} />
          <circle cx="250" cy="65" r="5" className={`beacon ${beaconsLit >= 2 ? 'lit' : ''}`} />
          <circle cx="380" cy="95" r="5" className={`beacon ${beaconsLit >= 3 ? 'lit' : ''}`} />
        </svg>

        {/* Optional: Add a text overlay for brand */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-4xl text-sky-400 font-bold font-rajdhani beacon-text opacity-0">IaC - Tirith</h2>
        </div>
      </div>
      
      {/* Hidden text for screen readers */}
      <span className="sr-only">
        Loading... Please wait. Beacons are being lit.
      </span>
    </div>
  );
};

export default Preloader;