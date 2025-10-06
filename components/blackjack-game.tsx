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
  getHandValueDisplay,
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
  const [sliderValue, setSliderValue] = useState(0);
  const [message, setMessage] = useState('Place your bet to start!');

  // Exponential bet amounts: 50, 100, 200, 300, 500, 1000, 2000, etc.
  const getBetAmounts = () => {
    const maxChips = user?.chips || 0;
    const amounts = [];

    // Add initial increments if they fit
    if (maxChips >= 50) amounts.push(50);
    if (maxChips >= 100) amounts.push(100);
    if (maxChips >= 200) amounts.push(200);
    if (maxChips >= 300) amounts.push(300);
    if (maxChips >= 500) amounts.push(500);

    // Add exponential amounts (1000, 2000, 4000, 8000, etc.)
    let current = 1000;
    while (current <= maxChips) {
      amounts.push(current);
      current *= 2;
    }

    // If user's max chips doesn't exactly match, add it as the final option
    if (amounts.length > 0 && amounts[amounts.length - 1] < maxChips) {
      amounts.push(maxChips);
    }

    return amounts;
  };

  const betAmounts = getBetAmounts();

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setBetInput(betAmounts[value]?.toString() || '0');
  };

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

    // Deduct chips immediately when bet is placed
    const newChips = (user?.chips || 0) - bet;
    updateChips(newChips);

    const deck = createDeck();
    const { deck: newDeck, playerHand, dealerHand } = dealInitialHands(deck);

    const newGameState: GameState = {
      deck: newDeck,
      playerHand,
      dealerHand,
      bet,
      chips: newChips,
      gameStatus: 'playing',
    };

    setGameState(newGameState);
    setMessage(''); // Hide message during card animation

    // Wait for card animations to complete before checking for blackjack or showing messages
    const totalCards = playerHand.length + dealerHand.length;
    const animationDuration = totalCards * 100 + 400; // 100ms delay per card + 400ms animation

    setTimeout(() => {
      // Check for immediate blackjack
      if (isBlackjack(playerHand)) {
        const result = determineWinner(playerHand, dealerHand);
        const payout = calculatePayout(bet, result);
        const finalChips = newChips + payout;
        setGameState(prev => ({
          ...prev,
          gameStatus: 'finished',
          result,
          chips: finalChips,
        }));
        setMessage(result === 'blackjack' ? 'BLACKJACK! You win!' : 'Push!');
        updateChips(finalChips);
        saveGameHistory(user!.uid, bet, playerHand, dealerHand, result, payout - bet);
      } else {
        setMessage('Hit or Stand?');
      }
    }, animationDuration);
  };

  const playerHit = () => {
    const { deck: newDeck, hand: newHand } = hit(gameState.deck, gameState.playerHand);

    // Update state immediately
    setGameState({
      ...gameState,
      deck: newDeck,
      playerHand: newHand,
    });

    const handValue = calculateHandValue(newHand);

    if (handValue > 21) {
      // Player busts - chips already deducted, no payout
      const result = 'loss';
      const payout = 0;

      // Wait for card animation before showing result
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          gameStatus: 'finished',
          result,
        }));
        setMessage('Bust! You lose.');
        saveGameHistory(user!.uid, gameState.bet, newHand, gameState.dealerHand, result, payout - gameState.bet);
      }, 400);
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
    await new Promise((resolve) => setTimeout(resolve, 200));

    while (shouldDealerHit(currentDealerHand)) {
      const { deck: newDeck, hand: newHand } = hit(currentDeck, currentDealerHand);
      currentDeck = newDeck;
      currentDealerHand = newHand;
      await new Promise((resolve) => setTimeout(resolve, 300));
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
    // Set bet input to current slider value instead of clearing it
    setBetInput(betAmounts[sliderValue]?.toString() || '0');
    setMessage('Place your bet to start!');
  };

  if (!user) return null;

  // Calculate curve radius based on text length (more digits = less curve)
  const betText = `BET: ${gameState.bet}`;
  const chipsText = `CHIPS: ${user.chips}`;
  const betDigits = betText.length;
  const chipsDigits = chipsText.length;

  // Base radius 250, increase by 100 for each extra character beyond 6 (flatter curve)
  const betRadius = 250 + Math.max(0, (betDigits - 6) * 100);
  const chipsRadius = 250 + Math.max(0, (chipsDigits - 6) * 100);

  // Calculate SVG width based on text length
  const betWidth = 220 + Math.max(0, (betDigits - 6) * 15);
  const chipsWidth = 220 + Math.max(0, (chipsDigits - 6) * 15);

  // Base rotation -8deg, become more anti-clockwise (more negative) per extra digit (reduced by 70%)
  const betRotation = -8 - Math.max(0, (betDigits - 6) * 0.6);
  // Base rotation 8deg, become more clockwise (more positive) per extra digit (reduced by 70%)
  const chipsRotation = 8 + Math.max(0, (chipsDigits - 6) * 0.6);

  return (
    <div className="w-full max-w-7xl h-[800px] mx-auto p-8 relative">
      {/* BET Display - Top Left Curved Along Table Edge */}
      <div className="absolute top-32 left-20" style={{ pointerEvents: 'none', transform: `rotate(${betRotation}deg)`, transformOrigin: 'left center' }}>
        <svg width={betWidth} height="60" viewBox={`0 0 ${betWidth} 60`} style={{ overflow: 'visible' }}>
          <defs>
            <path id="betCurve" d={`M 10 50 A ${betRadius} ${betRadius} 0 0 1 ${betWidth - 80} 10`} fill="none"/>
          </defs>
          <text style={{ fontWeight: 900, fontSize: '28px', letterSpacing: '0.1em' }}>
            <textPath href="#betCurve" startOffset="0%" fill="#facc15" style={{ filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.8))' }}>
              {betText}
            </textPath>
          </text>
        </svg>
      </div>

      {/* CHIPS Display - Top Right Curved Along Table Edge */}
      <div className="absolute top-32 right-20" style={{ pointerEvents: 'none', transform: `rotate(${chipsRotation}deg)`, transformOrigin: 'right center' }}>
        <svg width={chipsWidth} height="60" viewBox={`0 0 ${chipsWidth} 60`} style={{ overflow: 'visible' }}>
          <defs>
            <path id="chipsCurve" d={`M 80 10 A ${chipsRadius} ${chipsRadius} 0 0 1 ${chipsWidth - 20} 50`} fill="none"/>
          </defs>
          <text style={{ fontWeight: 900, fontSize: '28px', letterSpacing: '0.1em' }}>
            <textPath href="#chipsCurve" startOffset="0%" fill="#4ade80" style={{ filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.8))' }}>
              {chipsText}
            </textPath>
          </text>
        </svg>
      </div>

      {/* Game Status Message - Centered in Table */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-32">
        <p className="text-3xl text-white font-black animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ fontWeight: 900 }}>
          {message}
        </p>
      </div>

      {/* Dealer's hand */}
      <div className="mb-12">
        <h3 className="text-2xl font-black text-white mb-4 text-center drop-shadow-lg" style={{ fontWeight: 900 }}>
          DEALER
          {gameState.gameStatus !== 'betting' &&
            gameState.gameStatus !== 'playing' &&
            ` - ${calculateHandValue(gameState.dealerHand)}`}
        </h3>
        <div className="flex gap-4 flex-wrap justify-center min-h-[180px] items-center">
          {gameState.dealerHand.map((card, index) => (
            <CardDisplay
              key={index}
              card={card}
              hidden={gameState.gameStatus === 'playing' && index === 1}
              animationDelay={index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Player's hand */}
      {gameState.playerHand.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-black text-white mb-4 text-center drop-shadow-lg" style={{ fontWeight: 900 }}>
            YOUR HAND - {getHandValueDisplay(gameState.playerHand)}
          </h3>
          <div className="flex gap-4 flex-wrap justify-center min-h-[180px] items-center">
            {gameState.playerHand.map((card, index) => (
              <CardDisplay
                key={index}
                card={card}
                animationDelay={(gameState.dealerHand.length + index) * 0.1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {gameState.gameStatus === 'betting' && betAmounts.length > 0 && (
          <div className="flex flex-col gap-6 animate-fade-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 w-full max-w-2xl">
            {/* Bet Amount Display */}
            <div className="text-center">
              <p className="text-yellow-400 font-black text-xl mb-2" style={{ fontWeight: 900 }}>BET AMOUNT</p>
              <p className="text-white font-black text-5xl" style={{ fontWeight: 900 }}>{betInput || '0'}</p>
            </div>

            {/* Slider */}
            <div className="relative px-4">
              <input
                type="range"
                min="0"
                max={betAmounts.length - 1}
                value={sliderValue}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="w-full h-4 bg-neutral-800 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-8
                  [&::-webkit-slider-thumb]:h-8
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-gradient-to-r
                  [&::-webkit-slider-thumb]:from-yellow-500
                  [&::-webkit-slider-thumb]:to-yellow-600
                  [&::-webkit-slider-thumb]:border-4
                  [&::-webkit-slider-thumb]:border-yellow-700
                  [&::-webkit-slider-thumb]:shadow-2xl
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-webkit-slider-thumb]:transition-transform"
              />

              {/* Slider value markers */}
              <div className="flex justify-between mt-2 px-1">
                {betAmounts.map((amount, index) => (
                  <span
                    key={index}
                    className={`text-xs font-black transition-colors ${index === sliderValue ? 'text-yellow-400' : 'text-gray-500'}`}
                    style={{ fontWeight: 900 }}
                  >
                    {amount}
                  </span>
                ))}
              </div>
            </div>

            {/* Deal Button */}
            <Button
              onClick={startGame}
              className="h-16 text-2xl font-black bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              style={{ fontWeight: 900 }}
            >
              DEAL
            </Button>
          </div>
        )}

        {gameState.gameStatus === 'playing' && (
          <div className="flex gap-4 animate-fade-in">
            <Button
              onClick={playerHit}
              className="flex-1 h-16 text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              style={{ fontWeight: 900 }}
            >
              HIT
            </Button>
            <Button
              onClick={playerStand}
              className="flex-1 h-16 text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              style={{ fontWeight: 900 }}
            >
              STAND
            </Button>
          </div>
        )}

        {gameState.gameStatus === 'finished' && (
          <Button
            onClick={resetGame}
            className="w-full h-16 text-2xl font-black bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 animate-fade-in"
            style={{ fontWeight: 900 }}
          >
            NEW GAME
          </Button>
        )}
      </div>
    </div>
  );
}
