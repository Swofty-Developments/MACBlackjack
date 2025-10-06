'use client';

import { useState, useEffect } from 'react';
import { ProfilePill } from '@/components/profile-pill';

interface TopBarProps {
  title: string;
  showProfilePill?: boolean;
}

export function TopBar({ title, showProfilePill = false }: TopBarProps) {
  const [shouldHideTitle, setShouldHideTitle] = useState(false);

  useEffect(() => {
    const checkOverlap = () => {
      setShouldHideTitle(window.innerWidth < 768);
    };

    checkOverlap();
    window.addEventListener('resize', checkOverlap);
    return () => window.removeEventListener('resize', checkOverlap);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main pure gray bar with transparency */}
      <div className="h-20 bg-neutral-700/30">
        <div className="flex items-center h-full px-6">
          {/* Logo with white glow - always in the same position */}
          <div className="flex flex-col items-start absolute left-4 top-1 z-[9999]">
            <img
              src="/header.png"
              alt="Logo"
              className="h-28 w-auto animate-pulse-logo-glow"
            />
            <span className="text-neutral-700/30 text-7xl mt-2" style={{ fontWeight: 900 }}>FOR MAC :)</span>
          </div>

          {/* Title - centered in actual viewport, hidden on small screens */}
          {!shouldHideTitle && (
            <h1 className="text-2xl text-white tracking-wider absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ fontWeight: 900 }}>
              {title}
            </h1>
          )}

          {/* Credits Section - Right side with gold background */}
          {showProfilePill && (
            <div className="absolute right-0 top-0 h-full bg-yellow-500 transition-all duration-300 hover:scale-105 z-[9998]" style={{ filter: 'drop-shadow(0 0 15px rgba(234, 179, 8, 0.4))' }}>
              <div className="h-full flex items-center px-8">
                <ProfilePill />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pixelated bottom edge - multiple layers for depth */}
      <div className="h-1 flex relative z-10">
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[3%] bg-black"></div>
        <div className="flex-1 bg-black"></div>
      </div>
      <div className="h-1 flex relative z-10">
        <div className="w-[4%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[3%] bg-black"></div>
        <div className="flex-1 bg-black"></div>
      </div>
      <div className="h-1 flex relative z-10">
        <div className="w-[6%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[5%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[6%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[4%] bg-black"></div>
        <div className="flex-1 bg-black"></div>
      </div>
      <div className="h-1 flex relative z-10">
        <div className="w-[8%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[7%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[6%] bg-transparent"></div>
        <div className="flex-1 bg-neutral-700/30"></div>
        <div className="w-[8%] bg-black"></div>
        <div className="flex-1 bg-black"></div>
      </div>
    </div>
  );
}
