'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LogOut, Coins } from 'lucide-react';

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Profile</span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Chips</p>
            <p className="text-2xl font-bold">{user.chips.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
