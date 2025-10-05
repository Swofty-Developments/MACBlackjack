'use client';

import { useAuth } from '@/lib/auth-context';
import { AuthForm } from '@/components/auth-form';
import { UserProfile } from '@/components/user-profile';
import { BlackjackGame } from '@/components/blackjack-game';
import { GameHistory } from '@/components/game-history';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-green-800 to-green-950">
        <h1 className="text-5xl font-bold mb-8 text-white">MAC Blackjack</h1>
        <AuthForm />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-green-800 to-green-950">
      <div className="container mx-auto space-y-6">
        <h1 className="text-5xl font-bold text-center text-white mb-8">MAC Blackjack</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UserProfile />
          </div>
          <div className="lg:col-span-2">
            <BlackjackGame />
          </div>
        </div>
        <GameHistory />
      </div>
    </main>
  );
}
