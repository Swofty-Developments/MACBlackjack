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
import { ProfilePill } from '@/components/profile-pill';

type MenuState = 'menu' | 'loading' | 'ready' | 'game' | 'history' | 'profile';

export function GameMenu() {
  const { signOut } = useAuth();
  const [menuState, setMenuState] = useState<MenuState>('menu');
  const [isMobile, setIsMobile] = useState(false);
  const [isShortHeight, setIsShortHeight] = useState(false);
  const [isVeryShortHeight, setIsVeryShortHeight] = useState(false);
  const [isExtremelyShortHeight, setIsExtremelyShortHeight] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [hideExitDoor, setHideExitDoor] = useState(false);

  useEffect(() => {
    // Initialize sound manager
    soundManager.init();
  }, []);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsShortHeight(window.innerHeight < 750);
      setIsVeryShortHeight(window.innerHeight < 850);
      setIsExtremelyShortHeight(window.innerHeight < 700);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleMenuClick = (state: MenuState) => {
    soundManager.play('click_forward');
    if (state === 'game') {
      setMenuState('loading');
      setTimeout(() => {
        setMenuState('ready');
        setTimeout(() => setMenuState('game'), 1000);
      }, 1500);
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
          <MusicPlayer musicType="menu" externalOpen={isMusicOpen} onOpenChange={setIsMusicOpen} />
        </main>
        <BottomBar showShortHeight={isMobile} onMusicClick={() => setIsMusicOpen(!isMusicOpen)} />
      </>
    );
  }

  if (menuState === 'ready') {
    return (
      <>
        <TopBar title="READY?" variant="game" />
        <main className="flex min-h-screen items-center justify-center bg-background pt-20 pb-12 animate-fade-in">
          <div className="text-8xl text-white font-black animate-pulse" style={{ fontWeight: 900 }}>
            Ready?
          </div>
          <MusicPlayer musicType="game" externalOpen={isMusicOpen} onOpenChange={setIsMusicOpen} />
        </main>
        <BottomBar variant="game" showShortHeight={isShortHeight} onMusicClick={() => setIsMusicOpen(!isMusicOpen)} />
      </>
    );
  }

  if (menuState === 'game') {
    return (
      <>
        <TopBar title="BLACKJACK" showProfilePill variant="game" inGame />
        <main className="fixed inset-0 poker-table-bg lg:poker-table-bg bg-black animate-fade-in-slow pt-24 pb-16 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex items-center justify-center overflow-y-auto">
            <BlackjackGame isShortHeight={isShortHeight} onExit={handleBack} />
          </div>

          <MusicPlayer musicType="game" externalOpen={isMusicOpen} onOpenChange={setIsMusicOpen} />
        </main>
        <BottomBar
          variant="game"
          showShortHeight={isMobile}
          onMusicClick={() => setIsMusicOpen(!isMusicOpen)}
        />
      </>
    );
  }

  if (menuState === 'history') {
    return (
      <>
        <TopBar title="GAME HISTORY" showProfilePill />
        <main className="fixed inset-0 bg-background animate-fade-in pt-24 pb-20">
          <div className="container mx-auto h-full px-4">
            <GameHistory
              onExitOverlap={setHideExitDoor}
              showExitButton={hideExitDoor}
              onExitClick={handleBack}
            />
          </div>

          {/* Desktop EXIT Button - hide when content overlaps */}
          {!isMobile && !hideExitDoor && (
            <button
              onClick={handleBack}
              className="hidden lg:flex fixed left-6 z-[60] flex-col items-center gap-2 group transition-all duration-300 hover:scale-110 bottom-24"
            >
              <div className="relative w-20 h-24 bg-gradient-to-b from-red-700 to-red-900 rounded-xl border-3 border-red-800 shadow-2xl transition-all duration-300 group-hover:shadow-red-500/50">
                <div className="absolute inset-2 border-2 border-red-950 rounded"></div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-3 bg-yellow-600 rounded-sm"></div>
                <div className="absolute top-3 left-3 right-3 h-[2px] bg-red-950/50"></div>
                <div className="absolute bottom-3 left-3 right-3 h-[2px] bg-red-950/50"></div>
              </div>
              <span className="text-red-500 text-xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-300 group-hover:text-red-400 font-black" style={{ fontWeight: 900 }}>
                EXIT
              </span>
            </button>
          )}

          <MusicPlayer musicType="menu" externalOpen={isMusicOpen} onOpenChange={setIsMusicOpen} />
        </main>
        <BottomBar showShortHeight={isMobile} onMusicClick={() => setIsMusicOpen(!isMusicOpen)} />
      </>
    );
  }

  if (menuState === 'profile') {
    return (
      <>
        <TopBar title="PROFILE" showProfilePill />
        <main className="min-h-screen p-4 bg-background animate-fade-in pt-24 pb-16">
          <div className="container mx-auto max-w-2xl">
            <UserProfile />
          </div>

          {/* Desktop EXIT Button */}
          {!isMobile && (
            <button
              onClick={handleBack}
              className="hidden lg:flex fixed left-6 z-[60] flex-col items-center gap-3 group transition-all duration-300 hover:scale-110 bottom-24"
            >
              <div className="relative w-24 h-28 bg-gradient-to-b from-red-700 to-red-900 rounded-xl border-4 border-red-800 shadow-2xl transition-all duration-300 group-hover:shadow-red-500/50">
                <div className="absolute inset-3 border-2 border-red-950 rounded"></div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-4 bg-yellow-600 rounded-sm"></div>
                <div className="absolute top-4 left-4 right-4 h-[2px] bg-red-950/50"></div>
                <div className="absolute bottom-4 left-4 right-4 h-[2px] bg-red-950/50"></div>
              </div>
              <span className="text-red-500 text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-300 group-hover:text-red-400 font-black" style={{ fontWeight: 900 }}>
                EXIT
              </span>
            </button>
          )}

          <MusicPlayer musicType="menu" externalOpen={isMusicOpen} onOpenChange={setIsMusicOpen} />
        </main>
        <BottomBar showShortHeight={isMobile} onMusicClick={() => setIsMusicOpen(!isMusicOpen)} onBackClick={isMobile ? handleBack : undefined} />
      </>
    );
  }

  return (
    <>
      <TopBar title="MENU" showProfilePill />

      {/* Desktop Layout */}
      <main className="hidden lg:flex min-h-screen items-center justify-start bg-background p-4 pt-20 pb-12 overflow-hidden">
        <div className="relative flex items-center w-full">
          {/* Menu Buttons */}
          <div className="flex flex-col gap-8 w-full pl-[280px] lg:pl-[320px]">
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
          <div className="absolute -left-8 lg:left-0 z-20">
            <div
              className="bg-background rounded-full flex items-center justify-center"
              style={{
                width: '488px',
                height: '488px'
              }}
            >
              <PlayButton onClick={() => handleMenuClick('game')} size="large" />
            </div>
          </div>
        </div>
        <MusicPlayer musicType="menu" />
      </main>

      {/* Mobile Layout */}
      <main className="flex lg:hidden min-h-screen flex-col items-center justify-center bg-background pt-24 pb-12 gap-8 overflow-hidden">
        {/* Play Button - Smaller for mobile, centered */}
        <div className="flex items-center justify-center">
          <PlayButton onClick={() => handleMenuClick('game')} size={isExtremelyShortHeight ? 'tiny' : 'small'} />
        </div>

        {/* Menu Buttons - Left aligned */}
        <div className="flex flex-col gap-4 w-full">
          <MenuButton
            onClick={() => handleMenuClick('profile')}
            title="Profile"
            color="blue"
            textOffset={60}
            heightLevel={isExtremelyShortHeight ? 'tiny' : isVeryShortHeight ? 'short' : 'normal'}
          />
          <MenuButton
            onClick={() => handleMenuClick('history')}
            title="Game History"
            color="green"
            textOffset={60}
            heightLevel={isExtremelyShortHeight ? 'tiny' : isVeryShortHeight ? 'short' : 'normal'}
          />
          <MenuButton
            onClick={handleSignOut}
            title="Log Out"
            color="red"
            textOffset={60}
            heightLevel={isExtremelyShortHeight ? 'tiny' : isVeryShortHeight ? 'short' : 'normal'}
          />
        </div>

        {/* Profile Pill - Mobile version */}
        <div className="w-full px-4">
          <ProfilePill />
        </div>

        <MusicPlayer musicType="menu" externalOpen={isMusicOpen} onOpenChange={setIsMusicOpen} />
      </main>

      <BottomBar showShortHeight={isMobile} onMusicClick={() => setIsMusicOpen(!isMusicOpen)} />
    </>
  );
}

function PlayButton({ onClick, size = 'large' }: { onClick: () => void; size?: 'small' | 'large' | 'tiny' }) {
  const [isHovered, setIsHovered] = useState(false);

  const dimensions = size === 'tiny'
    ? { outer: 160, lines: 160, lineLength: 80, circle: 140, inner: 120, fontSize: 'text-3xl' }
    : size === 'small'
    ? { outer: 200, lines: 200, lineLength: 100, circle: 180, inner: 160, fontSize: 'text-4xl' }
    : { outer: 580, lines: 580, lineLength: 290, circle: 480, inner: 432, fontSize: 'text-8xl' };

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
          width: `${dimensions.lines}px`,
          height: `${dimensions.lines}px`,
          animation: isHovered ? 'spin-lines 2s linear infinite' : 'spin-lines 6s linear infinite'
        }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 origin-left"
            style={{
              width: `${dimensions.lineLength}px`,
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
          width: `${dimensions.circle}px`,
          height: `${dimensions.circle}px`,
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
            width: `${dimensions.inner}px`,
            height: `${dimensions.inner}px`
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

          <span className={`text-white font-black ${dimensions.fontSize} tracking-widest relative z-10`}>
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
  heightLevel?: 'normal' | 'short' | 'tiny';
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

function MenuButton({ onClick, title, color, textOffset, heightLevel = 'normal' }: MenuButtonProps) {
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

  // Adjust height and text size/position based on height level
  let buttonHeight: string;
  let textSize: string;
  let adjustedTextOffset: number;

  switch (heightLevel) {
    case 'tiny':
      buttonHeight = '60px';
      textSize = 'text-2xl';
      adjustedTextOffset = Math.max(15, textOffset - 45);
      break;
    case 'short':
      buttonHeight = '80px';
      textSize = 'text-3xl';
      adjustedTextOffset = Math.max(20, textOffset - 40);
      break;
    default:
      buttonHeight = '120px';
      textSize = 'text-5xl';
      adjustedTextOffset = textOffset;
  }

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
        height: buttonHeight,
        filter: `drop-shadow(0 0 20px rgba(${colorScheme.rgb}, 0.6)) drop-shadow(0 0 40px rgba(${colorScheme.rgb}, 0.4))`
      }}
    >
      {/* Text overlay */}
      <div
        className="absolute top-0 bottom-0 flex items-center justify-start z-10 pointer-events-none"
        style={{
          left: `${adjustedTextOffset}px`,
        }}
      >
        <span
          className={`text-white ${textSize} font-black whitespace-nowrap tracking-wide transition-all duration-300`}
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
