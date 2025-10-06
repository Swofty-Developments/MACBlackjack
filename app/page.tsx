'use client';

import { useAuth } from '@/lib/auth-context';
import { AuthForm } from '@/components/auth-form';
import { GameMenu } from '@/components/game-menu';
import { TopBar } from '@/components/top-bar';
import { BottomBar } from '@/components/bottom-bar';
import { MusicPlayer } from '@/components/music-player';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <TopBar title="LOADING" />
        <main className="flex min-h-screen items-center justify-center bg-background pt-20 pb-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </main>
        <BottomBar />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <TopBar title="LOGIN" />
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background pt-20 pb-12">
          <AuthForm />
        </main>
        <BottomBar />
        <MusicPlayer musicType="menu" />
      </>
    );
  }

  return <GameMenu />;
}
