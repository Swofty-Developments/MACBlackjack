'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { CardDisplay } from './card-display';
import { GameState } from '@/lib/types';
import {
  createDeck,
  dealInitialHands,
  hit,
  calculateHandValue,
  shouldDealerHit,
  determineWinner,
  calculatePayout,
  isBlackjack,
} from '@/lib/blackjack';
import { saveGameHistory } from '@/lib/game-history';

export function BlackjackGame() {
  const { user, updateChips } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    deck: createDeck(),
    playerHand: [],
    dealerHand: [],
    bet: 0,
    chips: user?.chips || 0,
    gameStatus: 'betting',
  });
  const [betInput, setBetInput] = useState('');
  const [message, setMessage] = useState('Place your bet to start!');

  const startGame = () => {
    const bet = parseInt(betInput);
    if (!bet || bet <= 0) {
      setMessage('Please enter a valid bet amount');
      return;
    }
    if (bet > (user?.chips || 0)) {
      setMessage('Insufficient chips!');
      return;
    }

    const deck = createDeck();
    const { deck: newDeck, playerHand, dealerHand } = dealInitialHands(deck);

    const newGameState: GameState = {
      deck: newDeck,
      playerHand,
      dealerHand,
      bet,
      chips: (user?.chips || 0) - bet,
      gameStatus: 'playing',
    };

    // Check for immediate blackjack
    if (isBlackjack(playerHand)) {
      const result = determineWinner(playerHand, dealerHand);
      const payout = calculatePayout(bet, result);
      newGameState.gameStatus = 'finished';
      newGameState.result = result;
      newGameState.chips += payout;
      setMessage(result === 'blackjack' ? 'BLACKJACK! You win!' : 'Push!');
      updateChips(newGameState.chips);
      saveGameHistory(user!.uid, bet, playerHand, dealerHand, result, payout - bet);
    } else {
      setMessage('Hit or Stand?');
    }

    setGameState(newGameState);
  };

  const playerHit = () => {
    const { deck: newDeck, hand: newHand } = hit(gameState.deck, gameState.playerHand);
    const handValue = calculateHandValue(newHand);

    if (handValue > 21) {
      // Player busts
      const result = 'loss';
      const payout = 0;
      setGameState({
        ...gameState,
        deck: newDeck,
        playerHand: newHand,
        gameStatus: 'finished',
        result,
      });
      setMessage('Bust! You lose.');
      updateChips(gameState.chips);
      saveGameHistory(user!.uid, gameState.bet, newHand, gameState.dealerHand, result, payout - gameState.bet);
    } else {
      setGameState({
        ...gameState,
        deck: newDeck,
        playerHand: newHand,
      });
    }
  };

  const playerStand = async () => {
    let currentDeck = [...gameState.deck];
    let currentDealerHand = [...gameState.dealerHand];

    setGameState({
      ...gameState,
      gameStatus: 'dealer-turn',
    });
    setMessage('Dealer is playing...');

    // Simulate dealer turn with delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    while (shouldDealerHit(currentDealerHand)) {
      const { deck: newDeck, hand: newHand } = hit(currentDeck, currentDealerHand);
      currentDeck = newDeck;
      currentDealerHand = newHand;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const result = determineWinner(gameState.playerHand, currentDealerHand);
    const payout = calculatePayout(gameState.bet, result);
    const finalChips = gameState.chips + payout;

    setGameState({
      ...gameState,
      deck: currentDeck,
      dealerHand: currentDealerHand,
      gameStatus: 'finished',
      result,
      chips: finalChips,
    });

    updateChips(finalChips);
    saveGameHistory(user!.uid, gameState.bet, gameState.playerHand, currentDealerHand, result, payout - gameState.bet);

    switch (result) {
      case 'win':
        setMessage('You win!');
        break;
      case 'loss':
        setMessage('Dealer wins!');
        break;
      case 'push':
        setMessage('Push! Bet returned.');
        break;
      case 'blackjack':
        setMessage('Blackjack! You win!');
        break;
    }
  };

  const resetGame = () => {
    setGameState({
      deck: createDeck(),
      playerHand: [],
      dealerHand: [],
      bet: 0,
      chips: user?.chips || 0,
      gameStatus: 'betting',
    });
    setBetInput('');
    setMessage('Place your bet to start!');
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Blackjack</CardTitle>
        <p className="text-center text-muted-foreground">{message}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dealer's hand */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Dealer's Hand
            {gameState.gameStatus !== 'betting' &&
              gameState.gameStatus !== 'playing' &&
              ` (${calculateHandValue(gameState.dealerHand)})`}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {gameState.dealerHand.map((card, index) => (
              <CardDisplay
                key={index}
                card={card}
                hidden={gameState.gameStatus === 'playing' && index === 1}
              />
            ))}
          </div>
        </div>

        {/* Player's hand */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Your Hand
            {gameState.playerHand.length > 0 &&
              ` (${calculateHandValue(gameState.playerHand)})`}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {gameState.playerHand.map((card, index) => (
              <CardDisplay key={index} card={card} />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {gameState.gameStatus === 'betting' && (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter bet amount"
                value={betInput}
                onChange={(e) => setBetInput(e.target.value)}
                min="1"
                max={user.chips}
              />
              <Button onClick={startGame}>Deal</Button>
            </div>
          )}

          {gameState.gameStatus === 'playing' && (
            <div className="flex gap-2">
              <Button onClick={playerHit}>Hit</Button>
              <Button onClick={playerStand} variant="secondary">
                Stand
              </Button>
            </div>
          )}

          {gameState.gameStatus === 'finished' && (
            <Button onClick={resetGame} className="w-full">
              New Game
            </Button>
          )}
        </div>

        {/* Game info */}
        <div className="flex justify-between text-sm text-muted-foreground border-t pt-4">
          <span>Current Bet: {gameState.bet}</span>
          <span>Chips: {user.chips}</span>
        </div>
      </CardContent>
    </Card>
  );
}
