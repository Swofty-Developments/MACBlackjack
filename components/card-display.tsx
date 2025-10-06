import { Card } from '@/lib/types';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardDisplayProps {
  card: Card;
  hidden?: boolean;
  animationDelay?: number;
}

export function CardDisplay({ card, hidden = false, animationDelay = 0 }: CardDisplayProps) {
  const getSuitIcon = (suit: Card['suit'], size: 'small' | 'large' = 'small') => {
    const iconClass = size === 'small' ? 'h-8 w-8' : 'h-16 w-16';
    switch (suit) {
      case 'hearts':
        return <Heart className={`${iconClass} text-red-600 fill-red-600`} />;
      case 'diamonds':
        return <Diamond className={`${iconClass} text-red-600 fill-red-600`} />;
      case 'clubs':
        return <Club className={`${iconClass} text-black fill-black`} />;
      case 'spades':
        return <Spade className={`${iconClass} text-black fill-black`} />;
    }
  };

  const getSuitSymbol = (suit: Card['suit']) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
    }
  };

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  if (hidden) {
    return (
      <div
        className="relative w-32 h-44 rounded-xl border-4 border-blue-700 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl animate-deal-card"
        style={{ animationDelay: `${animationDelay}s` }}
      >
        <div className="absolute inset-2 border-2 border-blue-400 rounded-lg opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-6xl font-black opacity-50">?</div>
        </div>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-4 h-4 border-2 border-white rounded-full"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-2 border-white rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-32 h-44 rounded-xl border-4 border-gray-800 bg-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl animate-deal-card"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Top-left corner */}
      <div className="absolute top-2 left-2 flex flex-col items-center gap-1">
        <span className={`text-3xl font-black leading-none ${isRed ? 'text-red-600' : 'text-black'}`} style={{ fontWeight: 900 }}>
          {card.value}
        </span>
        <span className={`text-2xl leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {getSuitSymbol(card.suit)}
        </span>
      </div>

      {/* Bottom-right corner (rotated) */}
      <div className="absolute bottom-2 right-2 flex flex-col items-center gap-1 rotate-180">
        <span className={`text-3xl font-black leading-none ${isRed ? 'text-red-600' : 'text-black'}`} style={{ fontWeight: 900 }}>
          {card.value}
        </span>
        <span className={`text-2xl leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {getSuitSymbol(card.suit)}
        </span>
      </div>

      {/* Center suit icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        {getSuitIcon(card.suit, 'large')}
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-200/30 rounded-xl pointer-events-none"></div>
    </div>
  );
}
