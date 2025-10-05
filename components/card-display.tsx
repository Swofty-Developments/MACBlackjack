import { Card } from '@/lib/types';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardDisplayProps {
  card: Card;
  hidden?: boolean;
}

export function CardDisplay({ card, hidden = false }: CardDisplayProps) {
  const getSuitIcon = (suit: Card['suit']) => {
    const iconClass = 'h-6 w-6';
    switch (suit) {
      case 'hearts':
        return <Heart className={`${iconClass} text-red-500 fill-red-500`} />;
      case 'diamonds':
        return <Diamond className={`${iconClass} text-red-500 fill-red-500`} />;
      case 'clubs':
        return <Club className={`${iconClass} fill-black`} />;
      case 'spades':
        return <Spade className={`${iconClass} fill-black`} />;
    }
  };

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  if (hidden) {
    return (
      <div className="relative w-20 h-28 rounded-lg border-2 border-gray-300 bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-4xl font-bold">?</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-20 h-28 rounded-lg border-2 border-gray-300 bg-white shadow-lg">
      <div className="absolute top-1 left-1 flex flex-col items-center">
        <span className={`text-xl font-bold ${isRed ? 'text-red-500' : 'text-black'}`}>
          {card.value}
        </span>
        {getSuitIcon(card.suit)}
      </div>
      <div className="absolute bottom-1 right-1 flex flex-col items-center rotate-180">
        <span className={`text-xl font-bold ${isRed ? 'text-red-500' : 'text-black'}`}>
          {card.value}
        </span>
        {getSuitIcon(card.suit)}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {getSuitIcon(card.suit)}
      </div>
    </div>
  );
}
