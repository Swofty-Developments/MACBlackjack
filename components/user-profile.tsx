'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { LogOut, Coins } from 'lucide-react';

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header with Sign Out */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" style={{ fontWeight: 900 }}>
          PROFILE
        </h1>
        <Button
          onClick={signOut}
          className="h-14 px-6 text-lg font-black bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:scale-105"
          style={{ fontWeight: 900 }}
        >
          <LogOut className="h-5 w-5 mr-2" />
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
          className="bg-neutral-900/90 backdrop-blur-sm border-l-4 border-r-4 border-blue-500/80 py-8 px-8 mt-2 mb-2"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)'
          }}
        >
          <p className="text-sm text-blue-400 font-black mb-2 tracking-wider" style={{ fontWeight: 900 }}>EMAIL ADDRESS</p>
          <p className="text-2xl font-black text-white" style={{ fontWeight: 900 }}>{user.email}</p>
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
          className="bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 backdrop-blur-sm border-l-4 border-r-4 border-yellow-500 py-10 px-8 mt-2 mb-2"
          style={{
            boxShadow: '0 0 30px rgba(250, 204, 21, 0.5), 0 0 60px rgba(250, 204, 21, 0.3)'
          }}
        >
          <div className="flex items-center gap-6">
            <div
              className="relative"
              style={{
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              <Coins className="h-20 w-20 text-yellow-400" />
              <div
                className="absolute inset-0"
                style={{
                  filter: 'blur(20px)',
                  background: 'radial-gradient(circle, rgba(250, 204, 21, 0.6) 0%, transparent 70%)'
                }}
              />
            </div>
            <div>
              <p className="text-lg text-yellow-400 font-black mb-2 tracking-wider" style={{ fontWeight: 900 }}>TOTAL CHIPS</p>
              <p
                className="text-6xl font-black text-yellow-300"
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
