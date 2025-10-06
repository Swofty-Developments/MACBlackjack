'use client';

import { useState, useEffect } from 'react';
import { ProfilePill } from '@/components/profile-pill';

interface TopBarProps {
  title: string;
  showProfilePill?: boolean;
  variant?: 'default' | 'game';
  inGame?: boolean;
}

export function TopBar({ title, showProfilePill = false, variant = 'default', inGame = false }: TopBarProps) {
  const [shouldHideTitle, setShouldHideTitle] = useState(false);

  useEffect(() => {
    const checkOverlap = () => {
      setShouldHideTitle(window.innerWidth < 768);
    };

    checkOverlap();
    window.addEventListener('resize', checkOverlap);
    return () => window.removeEventListener('resize', checkOverlap);
  }, []);

  const barColor = variant === 'game' ? 'bg-green-900/40' : 'bg-neutral-700/30';
  const pixelColor = variant === 'game' ? 'bg-green-900/40' : 'bg-neutral-700/30';

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${variant === 'game' ? 'animate-fade-in' : ''}`}>
      {/* Main pure gray bar with transparency */}
      <div className={`h-20 ${barColor}`}>
        <div className="flex items-center h-full px-6">
          {/* Logo with white glow - always in the same position */}
          <div className="flex flex-col items-start absolute left-4 top-1 z-[9999]">
            <img
              src="/header.png"
              alt="Logo"
              className="h-28 w-auto animate-pulse-logo-glow"
            />
            <span className="hidden lg:block text-neutral-700/30 text-7xl mt-2" style={{ fontWeight: 900 }}>FOR MAC :)</span>
          </div>

          {/* Title - centered in actual viewport, hidden on small screens */}
          {!shouldHideTitle && (
            <h1 className="text-2xl text-white tracking-wider absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ fontWeight: 900 }}>
              {title}
            </h1>
          )}

          {/* Credits Section - Right side with gold background - Hidden on mobile for menu page */}
          {showProfilePill && (
            <div className={`hidden lg:block absolute right-0 top-0 h-full ${inGame ? 'bg-gray-600' : 'bg-yellow-500'} transition-all duration-300 ${inGame ? '' : 'hover:scale-105'} z-[9998] overflow-visible`} style={{ filter: inGame ? 'drop-shadow(0 0 15px rgba(107, 114, 128, 0.4))' : 'drop-shadow(0 0 15px rgba(234, 179, 8, 0.4))' }}>
              <div className="h-full flex items-center px-8 overflow-visible">
                <ProfilePill inGame={inGame} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pixelated bottom edge - multiple layers for depth */}
      <div className="h-1 flex relative z-10">
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
      </div>
      <div className="h-1 flex relative z-10">
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
      </div>
      <div className="h-1 flex relative z-10">
        <div className="w-[6%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[5%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[6%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
      </div>
      <div className="h-1 flex relative z-10">
        <div className="w-[8%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[7%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[6%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[8%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
      </div>
    </div>
  );
}
