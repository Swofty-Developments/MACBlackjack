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
    <Card className="w-full max-w-4xl bg-card/50 backdrop-blur-sm border-2 border-accent shadow-2xl">
      <CardHeader className="space-y-4">
        <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Blackjack
        </CardTitle>
        <p className="text-center text-lg text-primary font-semibold animate-pulse">{message}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dealer's hand */}
        <div className="space-y-2 p-4 rounded-lg bg-accent/20 transition-all duration-300 hover:bg-accent/30">
          <h3 className="text-lg font-semibold text-primary">
            Dealer's Hand
            {gameState.gameStatus !== 'betting' &&
              gameState.gameStatus !== 'playing' &&
              ` (${calculateHandValue(gameState.dealerHand)})`}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {gameState.dealerHand.map((card, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardDisplay
                  card={card}
                  hidden={gameState.gameStatus === 'playing' && index === 1}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Player's hand */}
        <div className="space-y-2 p-4 rounded-lg bg-accent/20 transition-all duration-300 hover:bg-accent/30">
          <h3 className="text-lg font-semibold text-primary">
            Your Hand
            {gameState.playerHand.length > 0 &&
              ` (${calculateHandValue(gameState.playerHand)})`}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {gameState.playerHand.map((card, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardDisplay card={card} />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {gameState.gameStatus === 'betting' && (
            <div className="flex gap-2 animate-fade-in">
              <Input
                type="number"
                placeholder="Enter bet amount"
                value={betInput}
                onChange={(e) => setBetInput(e.target.value)}
                min="1"
                max={user.chips}
                className="border-accent focus:border-primary transition-all"
              />
              <Button onClick={startGame} className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                Deal
              </Button>
            </div>
          )}

          {gameState.gameStatus === 'playing' && (
            <div className="flex gap-2 animate-fade-in">
              <Button onClick={playerHit} className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                Hit
              </Button>
              <Button onClick={playerStand} variant="secondary" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl text-white">
                Stand
              </Button>
            </div>
          )}

          {gameState.gameStatus === 'finished' && (
            <Button onClick={resetGame} className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in">
              New Game
            </Button>
          )}
        </div>

        {/* Game info */}
        <div className="flex justify-between text-sm font-medium border-t-2 border-accent pt-4">
          <span className="text-blue-400">Current Bet: {gameState.bet}</span>
          <span className="text-green-400">Chips: {user.chips}</span>
        </div>
      </CardContent>
    </Card>
  );
}
