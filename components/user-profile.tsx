'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LogOut, Coins } from 'lucide-react';

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-2 border-accent shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          <span>Profile</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="hover:bg-destructive/20 transition-all"
          >
            <LogOut className="h-6 w-6 text-destructive" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-all duration-300">
          <p className="text-sm text-primary font-semibold mb-1">Email</p>
          <p className="font-medium text-lg text-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-4 p-6 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/50 hover:scale-105 transition-all duration-300 animate-pulse-glow">
          <Coins className="h-12 w-12 text-yellow-400 animate-float" />
          <div>
            <p className="text-sm text-yellow-400 font-semibold">Total Chips</p>
            <p className="text-4xl font-bold text-yellow-300">{user.chips.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
