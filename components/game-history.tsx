'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getGameHistory } from '@/lib/game-history';
import { GameHistory as GameHistoryType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { calculateHandValue } from '@/lib/blackjack';

export function GameHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<GameHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getGameHistory(user.uid, 20);
    setHistory(data);
    setLoading(false);
  };

  const getResultColor = (result: GameHistoryType['result']) => {
    switch (result) {
      case 'win':
      case 'blackjack':
        return 'text-green-400';
      case 'loss':
        return 'text-red-400';
      case 'push':
        return 'text-yellow-400';
    }
  };

  const getResultText = (result: GameHistoryType['result']) => {
    switch (result) {
      case 'win':
        return 'Win';
      case 'loss':
        return 'Loss';
      case 'push':
        return 'Push';
      case 'blackjack':
        return 'Blackjack!';
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-4xl bg-card/50 backdrop-blur-sm border-2 border-accent shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Game History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : history.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No games played yet</p>
        ) : (
          <div className="space-y-4">
            {history.map((game, index) => (
              <div
                key={game.id}
                className="border-2 border-accent rounded-lg p-4 space-y-2 bg-accent/10 hover:bg-accent/20 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-bold text-lg ${getResultColor(game.result)}`}>
                    {getResultText(game.result)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(game.timestamp).toLocaleDateString()}{' '}
                    {new Date(game.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-primary font-semibold">Your Hand</p>
                    <p className="font-medium text-foreground">
                      {game.playerHand.map((c) => `${c.value}${c.suit[0]}`).join(', ')}
                      <span className="ml-2 text-muted-foreground">({calculateHandValue(game.playerHand)})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-primary font-semibold">Dealer's Hand</p>
                    <p className="font-medium text-foreground">
                      {game.dealerHand.map((c) => `${c.value}${c.suit[0]}`).join(', ')}
                      <span className="ml-2 text-muted-foreground">({calculateHandValue(game.dealerHand)})</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm border-t-2 border-accent pt-2 font-medium">
                  <span className="text-blue-400">Bet: {game.betAmount}</span>
                  <span className={game.chipsWon >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {game.chipsWon >= 0 ? '+' : ''}
                    {game.chipsWon}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
