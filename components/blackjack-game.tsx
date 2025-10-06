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

interface BlackjackGameProps {
  isShortHeight?: boolean;
  onExit?: () => void;
}

export function BlackjackGame({ isShortHeight = false, onExit }: BlackjackGameProps = {}) {
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

  // Calculate card scale based on hand size to prevent overflow on mobile
  // Mobile card width is 80px (w-20), gap is 8px (gap-2)
  // Screen width on mobile is ~375px, with padding we have ~340px usable
  const getCardScale = (handSize: number, isMobile: boolean = false) => {
    if (!isMobile || handSize <= 2) return 1;

    // Calculate based on available space: ~340px usable width
    // Each card base width: 80px, gap: 8px
    const availableWidth = 340;
    const cardWidth = 80;
    const gap = 8;
    const totalNeeded = (handSize * cardWidth) + ((handSize - 1) * gap);

    if (totalNeeded > availableWidth) {
      return Math.max(0.5, availableWidth / totalNeeded);
    }
    return 1;
  };

  // Detect mobile (similar to the height detection we already have)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const dealerScale = getCardScale(gameState.dealerHand.length, isMobile);
  const playerScale = getCardScale(gameState.playerHand.length, isMobile);

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
    <div className="w-full max-w-7xl h-[800px] mx-auto p-8 pb-8 relative">
      {/* BET Display - Desktop: Curved, Mobile: Straight */}
      <div className="hidden lg:block absolute top-32 left-20" style={{ pointerEvents: 'none', transform: `rotate(${betRotation}deg)`, transformOrigin: 'left center' }}>
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
      <div className="lg:hidden absolute top-4 left-4 text-yellow-400 font-black text-xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" style={{ fontWeight: 900, pointerEvents: 'none' }}>
        {betText}
      </div>

      {/* CHIPS Display - Desktop: Curved, Mobile: Straight */}
      <div className="hidden lg:block absolute top-32 right-20" style={{ pointerEvents: 'none', transform: `rotate(${chipsRotation}deg)`, transformOrigin: 'right center' }}>
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
      <div className="lg:hidden absolute top-4 right-4 text-green-400 font-black text-xl drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" style={{ fontWeight: 900, pointerEvents: 'none' }}>
        {chipsText}
      </div>

      {/* Game Status Message - Centered in Table - Hide during betting on mobile to avoid overlap */}
      {(gameState.gameStatus !== 'betting' || !isShortHeight) && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:-mt-32 ${typeof window !== 'undefined' && window.innerHeight < 700 ? '-mt-24' : '-mt-16'}`}>
          <p className="text-2xl lg:text-3xl text-white font-black animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ fontWeight: 900 }}>
            {message}
          </p>
        </div>
      )}

      {/* Dealer's hand - stays at top */}
      <div className="lg:mb-12">
        <h3 className="text-lg lg:text-2xl font-black text-white mb-2 lg:mb-4 text-center drop-shadow-lg" style={{ fontWeight: 900 }}>
          DEALER
          {gameState.gameStatus !== 'betting' &&
            gameState.gameStatus !== 'playing' &&
            ` - ${calculateHandValue(gameState.dealerHand)}`}
        </h3>
        <div className="flex gap-2 lg:gap-4 justify-center min-h-[100px] lg:min-h-[180px] items-center">
          {gameState.dealerHand.map((card, index) => (
            <CardDisplay
              key={index}
              card={card}
              hidden={gameState.gameStatus === 'playing' && index === 1}
              animationDelay={index * 0.1}
              scale={dealerScale}
            />
          ))}
        </div>
      </div>

      {/* Player's hand - positioned at bottom on mobile */}
      {gameState.playerHand.length > 0 && (
        <div className={`absolute lg:static left-0 right-0 lg:mb-12 px-4 lg:px-0 ${typeof window !== 'undefined' && window.innerHeight < 700 ? 'top-[42%]' : 'bottom-[200px]'}`}>
          <h3 className="text-lg lg:text-2xl font-black text-white mb-2 lg:mb-4 text-center drop-shadow-lg" style={{ fontWeight: 900 }}>
            YOUR HAND - {getHandValueDisplay(gameState.playerHand)}
          </h3>
          <div className="flex gap-2 lg:gap-4 justify-center min-h-[100px] lg:min-h-[180px] items-center">
            {gameState.playerHand.map((card, index) => (
              <CardDisplay
                key={index}
                card={card}
                animationDelay={(gameState.dealerHand.length + index) * 0.1}
                scale={playerScale}
              />
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`space-y-2 lg:space-y-6 max-w-2xl mx-auto px-4 lg:px-0 absolute left-0 right-0 lg:static ${typeof window !== 'undefined' && window.innerHeight < 700 ? 'top-[30%]' : 'top-[50%]'}`}>
        {gameState.gameStatus === 'betting' && betAmounts.length > 0 && (
          <>
            {/* Deal Button with EXIT inline on mobile */}
            <div className="lg:static lg:left-0 lg:right-0 flex flex-col gap-4 lg:gap-6 animate-fade-in">
              {/* Bet Amount Display */}
              <div className="text-center lg:hidden">
                <p className="text-yellow-400 font-black text-base mb-1" style={{ fontWeight: 900 }}>BET AMOUNT</p>
                <p className="text-white font-black text-3xl" style={{ fontWeight: 900 }}>{betInput || '0'}</p>
              </div>

              {/* Slider */}
              <div className="relative px-2 lg:hidden">
                <input
                  type="range"
                  min="0"
                  max={betAmounts.length - 1}
                  value={sliderValue}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-neutral-800 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-6
                    [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-gradient-to-r
                    [&::-webkit-slider-thumb]:from-yellow-500
                    [&::-webkit-slider-thumb]:to-yellow-600
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-yellow-700
                    [&::-webkit-slider-thumb]:shadow-2xl
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-webkit-slider-thumb]:transition-transform"
                />

                {/* Slider value markers */}
                <div className="flex justify-between mt-1 px-1">
                  {betAmounts.map((amount, index) => (
                    <span
                      key={index}
                      className={`text-[10px] font-black transition-colors ${index === sliderValue ? 'text-yellow-400' : 'text-gray-500'}`}
                      style={{ fontWeight: 900 }}
                    >
                      {amount}
                    </span>
                  ))}
                </div>
              </div>

              {/* Desktop Bet Amount and Slider */}
              <div className="hidden lg:flex flex-col gap-6 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full max-w-2xl px-4">
                <div className="text-center">
                  <p className="text-yellow-400 font-black text-xl mb-2" style={{ fontWeight: 900 }}>BET AMOUNT</p>
                  <p className="text-white font-black text-5xl" style={{ fontWeight: 900 }}>{betInput || '0'}</p>
                </div>

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
              </div>
              <div className="flex gap-2 w-full">
                <Button
                  onClick={startGame}
                  className="w-full h-12 lg:h-16 text-lg lg:text-2xl font-black bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
                  style={{ fontWeight: 900 }}
                >
                  DEAL
                </Button>
              </div>
            </div>

            {/* Desktop EXIT Button */}
            {!isShortHeight && onExit && (
              <button
                onClick={onExit}
                className="hidden lg:flex fixed lg:left-6 z-[60] flex-col items-center gap-3 group transition-all duration-300 hover:scale-110 bottom-24"
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

          </>
        )}

        {gameState.gameStatus === 'playing' && (
          <div className="flex gap-2 lg:gap-4 animate-fade-in px-0">
            <Button
              onClick={playerHit}
              disabled={calculateHandValue(gameState.playerHand) === 21}
              className="flex-1 h-12 lg:h-16 text-lg lg:text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ fontWeight: 900 }}
            >
              HIT
            </Button>
            <Button
              onClick={playerStand}
              className="flex-1 h-12 lg:h-16 text-lg lg:text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              style={{ fontWeight: 900 }}
            >
              STAND
            </Button>
          </div>
        )}

        {gameState.gameStatus === 'finished' && (
          <div className="flex gap-2 lg:gap-0 animate-fade-in">
            {onExit && (
              <Button
                onClick={onExit}
                className="flex-1 h-12 lg:h-16 text-lg lg:text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 lg:hidden"
                style={{ fontWeight: 900 }}
              >
                EXIT
              </Button>
            )}
            <Button
              onClick={resetGame}
              className="flex-1 h-12 lg:h-16 text-lg lg:text-2xl font-black bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              style={{ fontWeight: 900 }}
            >
              NEW GAME
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
