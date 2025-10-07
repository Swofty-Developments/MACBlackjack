'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { LogOut, Coins } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UserProfileProps {
  onExit?: () => void;
}

export function UserProfile({ onExit }: UserProfileProps) {
  const { user, signOut } = useAuth();
  const [isShortHeight, setIsShortHeight] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setIsShortHeight(window.innerHeight < 860);
    };
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fade-in mt-8 sm:mt-12 md:mt-16">
      {/* Header with Sign Out */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" style={{ fontWeight: 900 }}>
          PROFILE
        </h1>
        <Button
          onClick={signOut}
          className="h-10 sm:h-12 md:h-14 px-3 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:scale-105"
          style={{ fontWeight: 900 }}
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          SIGN OUT
        </Button>
      </div>

      {/* Email Section */}
      <div className="relative">
        {/* Pixelated border effect */}
        <div className="absolute inset-0">
          {/* Top border */}
          <div className="h-1 flex">
            <div className="w-[5%] bg-transparent"></div>
            <div className="flex-1 bg-blue-500/80"></div>
            <div className="w-[4%] bg-transparent"></div>
            <div className="flex-1 bg-blue-500/80"></div>
            <div className="w-[3%] bg-transparent"></div>
            <div className="flex-1 bg-blue-500/80"></div>
          </div>
          <div className="h-1 flex">
            <div className="w-[3%] bg-transparent"></div>
            <div className="flex-1 bg-blue-500/80"></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className="flex-1 bg-blue-500/80"></div>
          </div>
          {/* Bottom border */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-1 flex">
              <div className="w-[3%] bg-transparent"></div>
              <div className="flex-1 bg-blue-500/80"></div>
              <div className="w-[2%] bg-transparent"></div>
              <div className="flex-1 bg-blue-500/80"></div>
            </div>
            <div className="h-1 flex">
              <div className="w-[5%] bg-transparent"></div>
              <div className="flex-1 bg-blue-500/80"></div>
              <div className="w-[4%] bg-transparent"></div>
              <div className="flex-1 bg-blue-500/80"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="bg-neutral-900/90 backdrop-blur-sm border-l-4 border-r-4 border-blue-500/80 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 mt-2 mb-2"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)'
          }}
        >
          <p className="text-xs sm:text-sm text-blue-400 font-black mb-1 sm:mb-2 tracking-wider" style={{ fontWeight: 900 }}>EMAIL ADDRESS</p>
          <p className="text-lg sm:text-xl md:text-2xl font-black text-white break-all" style={{ fontWeight: 900 }}>{user.email}</p>
        </div>
      </div>

      {/* Chips Section */}
      <div className="relative">
        {/* Pixelated border effect */}
        <div className="absolute inset-0">
          {/* Top border */}
          <div className="h-1 flex">
            <div className="w-[5%] bg-transparent"></div>
            <div className="flex-1 bg-yellow-500"></div>
            <div className="w-[4%] bg-transparent"></div>
            <div className="flex-1 bg-yellow-500"></div>
            <div className="w-[3%] bg-transparent"></div>
            <div className="flex-1 bg-yellow-500"></div>
          </div>
          <div className="h-1 flex">
            <div className="w-[3%] bg-transparent"></div>
            <div className="flex-1 bg-yellow-500"></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className="flex-1 bg-yellow-500"></div>
          </div>
          {/* Bottom border */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-1 flex">
              <div className="w-[3%] bg-transparent"></div>
              <div className="flex-1 bg-yellow-500"></div>
              <div className="w-[2%] bg-transparent"></div>
              <div className="flex-1 bg-yellow-500"></div>
            </div>
            <div className="h-1 flex">
              <div className="w-[5%] bg-transparent"></div>
              <div className="flex-1 bg-yellow-500"></div>
              <div className="w-[4%] bg-transparent"></div>
              <div className="flex-1 bg-yellow-500"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 backdrop-blur-sm border-l-4 border-r-4 border-yellow-500 py-5 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 mt-2 mb-2"
          style={{
            boxShadow: '0 0 30px rgba(250, 204, 21, 0.5), 0 0 60px rgba(250, 204, 21, 0.3)'
          }}
        >
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <div
              className="relative shrink-0"
              style={{
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              <Coins className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-yellow-400" />
              <div
                className="absolute inset-0"
                style={{
                  filter: 'blur(20px)',
                  background: 'radial-gradient(circle, rgba(250, 204, 21, 0.6) 0%, transparent 70%)'
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm sm:text-base md:text-lg text-yellow-400 font-black mb-1 sm:mb-2 tracking-wider" style={{ fontWeight: 900 }}>TOTAL CHIPS</p>
              <p
                className="text-3xl sm:text-5xl md:text-6xl font-black text-yellow-300"
                style={{
                  fontWeight: 900,
                  textShadow: '0 0 20px rgba(250, 204, 21, 0.8), 0 0 40px rgba(250, 204, 21, 0.6)'
                }}
              >
                {user.chips.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EXIT Button - Always visible below chips */}
      {onExit && (
        <div className="w-full mt-4 sm:mt-6 md:mt-8">
          {isShortHeight ? (
            // Button style for short heights
            <Button
              onClick={onExit}
              className="w-full h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:scale-[1.02]"
              style={{ fontWeight: 900 }}
            >
              EXIT
            </Button>
          ) : (
            // Door style for normal heights - centered in full width container
            <div className="flex justify-center">
              <button
                onClick={onExit}
                className="flex flex-col items-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-110"
              >
                <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-gradient-to-b from-red-700 to-red-900 rounded-xl border-3 sm:border-4 border-red-800 shadow-2xl transition-all duration-300 group-hover:shadow-red-500/50">
                  <div className="absolute inset-2 sm:inset-3 border-2 border-red-950 rounded"></div>
                  <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-3 sm:h-4 bg-yellow-600 rounded-sm"></div>
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 h-[2px] bg-red-950/50"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 h-[2px] bg-red-950/50"></div>
                </div>
                <span className="text-red-500 text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-300 group-hover:text-red-400 font-black" style={{ fontWeight: 900 }}>
                  EXIT
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
