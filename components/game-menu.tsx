'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { BlackjackGame } from '@/components/blackjack-game';
import { GameHistory } from '@/components/game-history';
import { UserProfile } from '@/components/user-profile';
import { MusicPlayer } from '@/components/music-player';
import { TopBar } from '@/components/top-bar';
import { BottomBar } from '@/components/bottom-bar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { soundManager } from '@/lib/sound-manager';

type MenuState = 'menu' | 'loading' | 'game' | 'history' | 'profile';

export function GameMenu() {
  const { signOut } = useAuth();
  const [menuState, setMenuState] = useState<MenuState>('menu');

  useEffect(() => {
    // Initialize sound manager
    soundManager.init();
  }, []);

  const handleMenuClick = (state: MenuState) => {
    soundManager.play('click_forward');
    if (state === 'game') {
      setMenuState('loading');
      setTimeout(() => setMenuState('game'), 1500);
    } else {
      setMenuState(state);
    }
  };

  const handleBack = () => {
    soundManager.play('click_backward');
    setMenuState('menu');
  };

  const handleSignOut = async () => {
    soundManager.play('click_forward');
    await signOut();
  };

  if (menuState === 'loading') {
    return (
      <>
        <TopBar title="LOADING" />
        <main className="flex min-h-screen items-center justify-center bg-background pt-20 pb-12">
          <div className="animate-fade-in flex gap-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-primary"></div>
          </div>
        </main>
        <BottomBar />
      </>
    );
  }

  if (menuState === 'game') {
    return (
      <>
        <TopBar title="BLACKJACK" />
        <main className="min-h-screen p-4 bg-background animate-fade-in pt-24 pb-16">
          <div className="container mx-auto">
            <Button
              onClick={handleBack}
              variant="outline"
              className="mb-4 hover:bg-accent transition-all"
            >
              ← Back to Menu
            </Button>
            <BlackjackGame />
          </div>
          <MusicPlayer musicType="game" />
        </main>
        <BottomBar />
      </>
    );
  }

  if (menuState === 'history') {
    return (
      <>
        <TopBar title="GAME HISTORY" />
        <main className="min-h-screen p-4 bg-background animate-fade-in pt-24 pb-16">
          <div className="container mx-auto">
            <Button
              onClick={handleBack}
              variant="outline"
              className="mb-4 hover:bg-accent transition-all"
            >
              ← Back to Menu
            </Button>
            <GameHistory />
          </div>
          <MusicPlayer musicType="menu" />
        </main>
        <BottomBar />
      </>
    );
  }

  if (menuState === 'profile') {
    return (
      <>
        <TopBar title="PROFILE" />
        <main className="min-h-screen p-4 bg-background animate-fade-in pt-24 pb-16">
          <div className="container mx-auto max-w-2xl">
            <Button
              onClick={handleBack}
              variant="outline"
              className="mb-4 hover:bg-accent transition-all"
            >
              ← Back to Menu
            </Button>
            <UserProfile />
          </div>
          <MusicPlayer musicType="menu" />
        </main>
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <TopBar title="MENU" />
      <main className="flex min-h-screen items-center justify-start bg-background p-4 pt-20 pb-12 overflow-hidden">
        <div className="relative flex items-center w-full">
          {/* Menu Buttons */}
          <div className="flex flex-col gap-8 w-full pl-[280px] md:pl-[320px]">
            <MenuButton
              onClick={() => handleMenuClick('profile')}
              title="Profile"
              color="blue"
              textOffset={220}
            />
            <MenuButton
              onClick={() => handleMenuClick('history')}
              title="Game History"
              color="green"
              textOffset={300}
            />
            <MenuButton
              onClick={handleSignOut}
              title="Log Out"
              color="red"
              textOffset={220}
            />
          </div>

          {/* Play Button - Overlays on top with padding, glow can protrude */}
          <div className="absolute -left-8 md:left-0 z-20">
            <div
              className="bg-background rounded-full flex items-center justify-center"
              style={{
                width: '488px',
                height: '488px'
              }}
            >
              <PlayButton onClick={() => handleMenuClick('game')} />
            </div>
          </div>
        </div>
        <MusicPlayer musicType="menu" />
      </main>
      <BottomBar />
    </>
  );
}

function PlayButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => {
        soundManager.play('hover');
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group shrink-0"
    >
      {/* Outer container for rotating lines */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '580px',
          height: '580px',
          animation: isHovered ? 'spin-lines 2s linear infinite' : 'spin-lines 6s linear infinite'
        }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 origin-left"
            style={{
              width: '290px',
              height: '2px',
              background: `linear-gradient(to right,
                transparent 0%,
                rgba(255,255,255,0.7) 20%,
                rgba(255,255,255,0.9) 40%,
                rgba(255,255,255,0.7) 60%,
                transparent 100%)`,
              transform: `rotate(${i * 18}deg)`,
            }}
          />
        ))}
      </div>

      {/* White outline circle */}
      <div
        className="relative rounded-full flex items-center justify-center transition-transform duration-300"
        style={{
          width: '480px',
          height: '480px',
          background: 'white',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {/* Gradient fade layer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 70%, black 85%, black 100%)'
          }}
        />

        {/* Inner black circle */}
        <div
          className="absolute rounded-full bg-black flex items-center justify-center"
          style={{
            width: '432px',
            height: '432px'
          }}
        >
          {/* Pulsing background effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}
          />

          <span className="text-white font-black text-8xl tracking-widest relative z-10">
            PLAY
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-lines {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </button>
  );
}

interface MenuButtonProps {
  onClick: () => void;
  title: string;
  color: 'blue' | 'green' | 'red';
  textOffset: number;
}

// Pre-generate serration patterns outside component to avoid recalculation
const generateSerratedPattern = (colorRgb: string, seed: number) => {
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const totalRows = 40;
  const pixelRows = [];
  const maxWidth = 1400;

  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    const segments = [];
    let x = 0;
    let segmentIndex = 0;

    while (x < maxWidth) {
      const progressRight = x / maxWidth;

      const gapProbability = 0.15 + (progressRight * 0.5);
      const shouldHaveGap = seededRandom(rowIndex * 1000 + segmentIndex) < gapProbability;

      // Larger pixel sizes
      const baseSize = 16 - (progressRight * 10); // 16px -> 6px
      const fillWidth = Math.max(4, Math.floor(seededRandom(rowIndex * 1000 + segmentIndex + 500) * baseSize) + 4);
      const gapWidth = shouldHaveGap ? Math.max(2, Math.floor(seededRandom(rowIndex * 1000 + segmentIndex + 1000) * (5 + progressRight * 12))) : 0;

      const opacity = Math.max(0, 0.95 - (progressRight * 0.95));

      segments.push(
        <div
          key={`${rowIndex}-${x}-fill`}
          style={{
            width: `${fillWidth}px`,
            backgroundColor: `rgba(${colorRgb}, ${opacity})`,
            height: '100%'
          }}
        />
      );

      if (gapWidth > 0) {
        segments.push(
          <div key={`${rowIndex}-${x}-gap`} style={{ width: `${gapWidth}px`, height: '100%' }} className="bg-transparent" />
        );
      }

      x += fillWidth + gapWidth;
      segmentIndex++;
    }

    pixelRows.push(
      <div key={`row-${rowIndex}`} className="h-[3px] flex">
        {segments}
      </div>
    );
  }

  return pixelRows;
};

function MenuButton({ onClick, title, color, textOffset }: MenuButtonProps) {
  const colors = {
    blue: { rgb: '59, 130, 246' },
    green: { rgb: '34, 197, 94' },
    red: { rgb: '220, 38, 38' }
  };

  const colorScheme = colors[color];

  // Generate pattern once (static seed per color)
  const patternSeed = color.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pixelRows = generateSerratedPattern(colorScheme.rgb, patternSeed);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => {
        soundManager.play('hover');
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:brightness-110 w-full relative"
      style={{
        height: '120px',
        filter: `drop-shadow(0 0 20px rgba(${colorScheme.rgb}, 0.6)) drop-shadow(0 0 40px rgba(${colorScheme.rgb}, 0.4))`
      }}
    >
      {/* Text overlay */}
      <div
        className="absolute top-0 bottom-0 flex items-center justify-start z-10 pointer-events-none"
        style={{
          left: `${textOffset}px`,
        }}
      >
        <span
          className="text-white text-5xl font-black whitespace-nowrap tracking-wide transition-all duration-300"
          style={{
            textShadow: isHovered
              ? `0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.45), 0 0 40px rgba(255, 255, 255, 0.4), 0 0 50px rgba(${colorScheme.rgb}, 0.5), 0 0 60px rgba(${colorScheme.rgb}, 0.45), 0 0 80px rgba(${colorScheme.rgb}, 0.4)`
              : `0 0 20px rgba(${colorScheme.rgb}, 1), 0 0 40px rgba(${colorScheme.rgb}, 0.8), 0 0 60px rgba(${colorScheme.rgb}, 0.6)`
          }}
        >
          {title}
        </span>
      </div>

      {/* Entire pixelated/serrated structure */}
      <div className="w-full h-full flex flex-col">
        {pixelRows}
      </div>
    </button>
  );
}
