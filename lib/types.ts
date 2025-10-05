export interface User {
  uid: string;
  email: string;
  displayName?: string;
  chips: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameHistory {
  id: string;
  userId: string;
  betAmount: number;
  playerHand: Card[];
  dealerHand: Card[];
  result: 'win' | 'loss' | 'push' | 'blackjack';
  chipsWon: number;
  timestamp: Date;
}

export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
}

export interface GameState {
  deck: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  bet: number;
  chips: number;
  gameStatus: 'betting' | 'playing' | 'dealer-turn' | 'finished';
  result?: 'win' | 'loss' | 'push' | 'blackjack';
}
