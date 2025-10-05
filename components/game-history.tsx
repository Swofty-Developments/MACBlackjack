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
        return 'text-green-600';
      case 'loss':
        return 'text-red-600';
      case 'push':
        return 'text-yellow-600';
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
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Game History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-muted-foreground">No games played yet</p>
        ) : (
          <div className="space-y-4">
            {history.map((game) => (
              <div key={game.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${getResultColor(game.result)}`}>
                    {getResultText(game.result)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(game.timestamp).toLocaleDateString()}{' '}
                    {new Date(game.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Your Hand</p>
                    <p className="font-medium">
                      {game.playerHand.map((c) => `${c.value}${c.suit[0]}`).join(', ')}
                      <span className="ml-2">({calculateHandValue(game.playerHand)})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dealer's Hand</p>
                    <p className="font-medium">
                      {game.dealerHand.map((c) => `${c.value}${c.suit[0]}`).join(', ')}
                      <span className="ml-2">({calculateHandValue(game.dealerHand)})</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span>Bet: {game.betAmount}</span>
                  <span className={game.chipsWon >= 0 ? 'text-green-600' : 'text-red-600'}>
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
