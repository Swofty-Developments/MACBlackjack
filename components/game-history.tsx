'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getGameHistory } from '@/lib/game-history';
import { GameHistory as GameHistoryType } from '@/lib/types';
import { calculateHandValue } from '@/lib/blackjack';

type FilterType = 'all' | 'win' | 'loss' | 'push';

interface GameHistoryProps {
  onExitOverlap?: (isOverlapping: boolean) => void;
  showExitButton?: boolean;
  onExitClick?: () => void;
}

export function GameHistory({ onExitOverlap, showExitButton, onExitClick }: GameHistoryProps = {}) {
  const { user } = useAuth();
  const [history, setHistory] = useState<GameHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getGameHistory(user.uid, 50);
    setHistory(data);
    setLoading(false);
  };

  const getResultColor = (result: GameHistoryType['result']) => {
    switch (result) {
      case 'win':
      case 'blackjack':
        return { text: 'text-green-400', border: 'border-green-500', bg: 'bg-green-500', glow: 'rgba(34, 197, 94, 0.4)' };
      case 'loss':
        return { text: 'text-red-400', border: 'border-red-500', bg: 'bg-red-500', glow: 'rgba(220, 38, 38, 0.4)' };
      case 'push':
        return { text: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-500', glow: 'rgba(250, 204, 21, 0.4)' };
    }
  };

  const getResultText = (result: GameHistoryType['result']) => {
    switch (result) {
      case 'win':
        return 'WIN';
      case 'loss':
        return 'LOSS';
      case 'push':
        return 'PUSH';
      case 'blackjack':
        return 'BJ!';
    }
  };

  const filteredHistory = history.filter(game => {
    if (filter === 'all') return true;
    if (filter === 'win') return game.result === 'win' || game.result === 'blackjack';
    if (filter === 'loss') return game.result === 'loss';
    if (filter === 'push') return game.result === 'push';
    return true;
  });

  // Check for overlap with EXIT button area (left side, bottom of screen)
  useEffect(() => {
    if (!onExitOverlap) return;

    const checkOverlap = () => {
      const gridContainer = document.querySelector('.history-grid-container');
      if (!gridContainer) return;

      const gridRect = gridContainer.getBoundingClientRect();
      // EXIT button is at bottom-left, roughly left: 24px (left-6), bottom: 96px (bottom-24)
      // EXIT button height is about 140px (door + text)
      const exitButtonTop = window.innerHeight - 240; // bottom-24 = 96px + ~144px for button height
      const exitButtonLeft = 24;
      const exitButtonRight = 24 + 96; // ~96px wide

      // Check if grid overlaps with EXIT button area
      const isOverlapping = gridRect.left < exitButtonRight && gridRect.top < exitButtonTop;

      onExitOverlap(isOverlapping);
    };

    checkOverlap();
    window.addEventListener('resize', checkOverlap);

    // Also check on interval in case grid content changes
    const interval = setInterval(checkOverlap, 500);

    return () => {
      window.removeEventListener('resize', checkOverlap);
      clearInterval(interval);
    };
  }, [onExitOverlap, filteredHistory.length]);

  if (!user) return null;

  return (
    <div className="h-full flex flex-col pt-16">
      {/* Filter Buttons and Exit */}
      <div className="flex flex-wrap gap-2 mb-4 justify-end items-center">
        {/* Exit button when door is hidden */}
        {showExitButton && onExitClick && (
          <button
            onClick={onExitClick}
            className="relative group transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0">
              <div className="h-[2px] flex">
                <div className="w-[15%] bg-transparent"></div>
                <div className="flex-1 bg-red-600"></div>
                <div className="w-[15%] bg-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-[2px] flex">
                  <div className="w-[15%] bg-transparent"></div>
                  <div className="flex-1 bg-red-600"></div>
                  <div className="w-[15%] bg-transparent"></div>
                </div>
              </div>
            </div>

            <div
              className="bg-red-600 border-l-2 border-r-2 border-red-500 mt-[2px] mb-[2px] px-6 py-3 font-black text-sm text-white transition-all duration-300"
              style={{
                fontWeight: 900,
                boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)'
              }}
            >
              ← EXIT
            </div>
          </button>
        )}

        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          label="ALL"
          color="purple"
        />
        <FilterButton
          active={filter === 'win'}
          onClick={() => setFilter('win')}
          label="WINS"
          color="green"
        />
        <FilterButton
          active={filter === 'loss'}
          onClick={() => setFilter('loss')}
          label="LOSSES"
          color="red"
        />
        <FilterButton
          active={filter === 'push'}
          onClick={() => setFilter('push')}
          label="PUSHES"
          color="yellow"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-6 py-16">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-8 border-white border-t-transparent"
              style={{
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
              }}
            ></div>
          </div>
          <p className="text-white text-2xl font-black" style={{ fontWeight: 900 }}>LOADING...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-white text-3xl font-black" style={{ fontWeight: 900 }}>
            {filter === 'all' ? 'NO GAMES PLAYED YET' : `NO ${filter.toUpperCase()}S FOUND`}
          </p>
          <p className="text-gray-400 text-lg font-black mt-4" style={{ fontWeight: 900 }}>
            {filter === 'all' ? 'Start playing to see your history!' : 'Try a different filter'}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4 history-grid-container">
            {filteredHistory.map((game, index) => {
              const colors = getResultColor(game.result);
              return (
                <div
                  key={game.id}
                  className="relative animate-fade-in group"
                  style={{ animationDelay: `${index * 0.02}s` }}
                >
                  {/* Animated moving border effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute h-[2px] left-0 right-0 top-0"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${colors.glow.replace('0.4', '0')} 30%, ${colors.glow.replace('0.4', '0.8')} 50%, ${colors.glow.replace('0.4', '0')} 70%, transparent 100%)`,
                        animation: 'slide-horizontal 3s linear infinite',
                        boxShadow: `0 0 10px ${colors.glow}`
                      }}
                    />
                    <div
                      className="absolute w-[2px] top-0 bottom-0 right-0"
                      style={{
                        background: `linear-gradient(180deg, transparent 0%, ${colors.glow.replace('0.4', '0')} 30%, ${colors.glow.replace('0.4', '0.8')} 50%, ${colors.glow.replace('0.4', '0')} 70%, transparent 100%)`,
                        animation: 'slide-vertical 3s linear infinite 0.75s',
                        boxShadow: `0 0 10px ${colors.glow}`
                      }}
                    />
                    <div
                      className="absolute h-[2px] left-0 right-0 bottom-0"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${colors.glow.replace('0.4', '0')} 30%, ${colors.glow.replace('0.4', '0.8')} 50%, ${colors.glow.replace('0.4', '0')} 70%, transparent 100%)`,
                        animation: 'slide-horizontal-reverse 3s linear infinite 1.5s',
                        boxShadow: `0 0 10px ${colors.glow}`
                      }}
                    />
                    <div
                      className="absolute w-[2px] top-0 bottom-0 left-0"
                      style={{
                        background: `linear-gradient(180deg, transparent 0%, ${colors.glow.replace('0.4', '0')} 30%, ${colors.glow.replace('0.4', '0.8')} 50%, ${colors.glow.replace('0.4', '0')} 70%, transparent 100%)`,
                        animation: 'slide-vertical-reverse 3s linear infinite 2.25s',
                        boxShadow: `0 0 10px ${colors.glow}`
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`bg-neutral-900/95 backdrop-blur-sm border-2 ${colors.border} py-2 px-3 transition-all duration-300 hover:scale-105 cursor-pointer`}
                    style={{
                      boxShadow: `0 0 15px ${colors.glow}`
                    }}
                  >
                    {/* Result Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-black text-lg ${colors.text}`}
                        style={{
                          fontWeight: 900,
                          textShadow: `0 0 8px ${colors.glow}`
                        }}
                      >
                        {getResultText(game.result)}
                      </span>
                      <span className="text-gray-500 text-[10px] font-black" style={{ fontWeight: 900 }}>
                        {new Date(game.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Hands */}
                    <div className="space-y-1.5 mb-2">
                      <div>
                        <p className="text-blue-400 font-black text-[9px] mb-0.5" style={{ fontWeight: 900 }}>YOU</p>
                        <p className="font-black text-white text-xs" style={{ fontWeight: 900 }}>
                          {game.playerHand.map((c) => `${c.value}${c.suit[0]}`).join(' ')}
                          <span className="ml-1.5 text-gray-400 text-[10px]">({calculateHandValue(game.playerHand)})</span>
                        </p>
                      </div>

                      <div>
                        <p className="text-red-400 font-black text-[9px] mb-0.5" style={{ fontWeight: 900 }}>DEALER</p>
                        <p className="font-black text-white text-xs" style={{ fontWeight: 900 }}>
                          {game.dealerHand.map((c) => `${c.value}${c.suit[0]}`).join(' ')}
                          <span className="ml-1.5 text-gray-400 text-[10px]">({calculateHandValue(game.dealerHand)})</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <div>
                        <p className="text-gray-500 font-black text-[8px]" style={{ fontWeight: 900 }}>BET</p>
                        <p className="text-yellow-400 font-black text-sm" style={{ fontWeight: 900 }}>{game.betAmount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 font-black text-[8px]" style={{ fontWeight: 900 }}>
                          {game.chipsWon >= 0 ? 'WON' : 'LOST'}
                        </p>
                        <p
                          className={`font-black text-sm ${game.chipsWon >= 0 ? 'text-green-400' : 'text-red-400'}`}
                          style={{ fontWeight: 900 }}
                        >
                          {game.chipsWon >= 0 ? '+' : ''}{game.chipsWon}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6d28d9);
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a78bfa, #8b5cf6);
        }

        @keyframes slide-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slide-horizontal-reverse {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes slide-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes slide-vertical-reverse {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  color: 'purple' | 'green' | 'red' | 'yellow';
}

function FilterButton({ active, onClick, label, color }: FilterButtonProps) {
  const colors = {
    purple: { bg: 'bg-purple-600', border: 'border-purple-500', glow: 'rgba(168, 85, 247, 0.5)' },
    green: { bg: 'bg-green-600', border: 'border-green-500', glow: 'rgba(34, 197, 94, 0.5)' },
    red: { bg: 'bg-red-600', border: 'border-red-500', glow: 'rgba(220, 38, 38, 0.5)' },
    yellow: { bg: 'bg-yellow-600', border: 'border-yellow-500', glow: 'rgba(250, 204, 21, 0.5)' },
  };

  const scheme = colors[color];

  return (
    <button
      onClick={onClick}
      className={`relative group transition-all duration-300 ${active ? 'scale-105' : 'hover:scale-105'}`}
    >
      {/* Pixelated border */}
      {active && (
        <div className="absolute inset-0">
          <div className="h-[2px] flex">
            <div className="w-[15%] bg-transparent"></div>
            <div className={`flex-1 ${scheme.bg}`}></div>
            <div className="w-[15%] bg-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-[2px] flex">
              <div className="w-[15%] bg-transparent"></div>
              <div className={`flex-1 ${scheme.bg}`}></div>
              <div className="w-[15%] bg-transparent"></div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`${active ? `${scheme.bg} border-l-2 border-r-2 ${scheme.border} mt-[2px] mb-[2px]` : 'bg-neutral-800 mt-[2px] mb-[2px]'} px-6 py-3 font-black text-sm text-white transition-all duration-300`}
        style={{
          fontWeight: 900,
          boxShadow: active ? `0 0 20px ${scheme.glow}` : 'none'
        }}
      >
        {label}
      </div>
    </button>
  );
}
