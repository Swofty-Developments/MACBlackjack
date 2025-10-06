import { Card, GameState } from './types';

const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
const values: Card['value'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function getCardValue(card: Card, currentTotal: number = 0): number {
  if (card.value === 'A') {
    return currentTotal + 11 > 21 ? 1 : 11;
  }
  if (['J', 'Q', 'K'].includes(card.value)) {
    return 10;
  }
  return parseInt(card.value);
}

export function calculateHandValue(hand: Card[]): number {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 'A') {
      aces++;
      total += 11;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

export function getHandValueDisplay(hand: Card[]): string {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 'A') {
      aces++;
      total += 11;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value);
    }
  }

  const highValue = total;
  const lowValue = total - (aces * 10);

  // If we have aces and both values are valid (<=21), show both
  if (aces > 0 && highValue <= 21 && lowValue !== highValue) {
    return `${highValue}/${lowValue}`;
  }

  // If high value is over 21, use the low value
  if (highValue > 21 && aces > 0) {
    return lowValue.toString();
  }

  // Otherwise just show the total
  return highValue.toString();
}

export function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && calculateHandValue(hand) === 21;
}

export function isBust(hand: Card[]): boolean {
  return calculateHandValue(hand) > 21;
}

export function dealInitialHands(deck: Card[]): {
  deck: Card[];
  playerHand: Card[];
  dealerHand: Card[];
} {
  const newDeck = [...deck];
  const playerHand = [newDeck.pop()!, newDeck.pop()!];
  const dealerHand = [newDeck.pop()!, newDeck.pop()!];

  return {
    deck: newDeck,
    playerHand,
    dealerHand,
  };
}

export function hit(deck: Card[], hand: Card[]): { deck: Card[]; hand: Card[] } {
  const newDeck = [...deck];
  const newHand = [...hand, newDeck.pop()!];

  return {
    deck: newDeck,
    hand: newHand,
  };
}

export function shouldDealerHit(hand: Card[]): boolean {
  return calculateHandValue(hand) < 17;
}

export function determineWinner(
  playerHand: Card[],
  dealerHand: Card[]
): 'win' | 'loss' | 'push' | 'blackjack' {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);
  const playerBlackjack = isBlackjack(playerHand);
  const dealerBlackjack = isBlackjack(dealerHand);

  if (playerBlackjack && !dealerBlackjack) {
    return 'blackjack';
  }

  if (playerValue > 21) {
    return 'loss';
  }

  if (dealerValue > 21) {
    return 'win';
  }

  if (playerValue > dealerValue) {
    return 'win';
  }

  if (playerValue < dealerValue) {
    return 'loss';
  }

  return 'push';
}

export function calculatePayout(
  betAmount: number,
  result: 'win' | 'loss' | 'push' | 'blackjack'
): number {
  switch (result) {
    case 'blackjack':
      return Math.floor(betAmount * 2.5); // 3:2 payout
    case 'win':
      return betAmount * 2; // 1:1 payout
    case 'push':
      return betAmount; // Return bet
    case 'loss':
      return 0; // Lose bet
  }
}
