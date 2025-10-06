'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { soundManager } from '@/lib/sound-manager';
import { notificationManager } from '@/lib/notification-manager';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    soundManager.init();
  }, []);

  const validateForm = () => {
    // Email validation
    if (!email) {
      notificationManager.show('error', 'Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notificationManager.show('error', 'Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!password) {
      notificationManager.show('error', 'Password is required');
      return false;
    }

    if (password.length < 6) {
      notificationManager.show('error', 'Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Custom validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        notificationManager.show('info', 'Successfully logged in!');
      } else {
        await signUp(email, password);
        notificationManager.show('info', 'Account created successfully!');
      }
    } catch (err: any) {
      notificationManager.show('error', err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md bg-white rounded-md p-8 shadow-2xl ${animate ? 'animate-pop' : ''}`}>
      <h2 className="text-4xl text-black text-center mb-2" style={{ fontWeight: 900 }}>
        {isLogin ? 'SIGN IN' : 'SIGN UP'}
      </h2>
      <p className="text-center text-gray-600 mb-6 text-sm" style={{ fontWeight: 900 }}>
        {isLogin ? 'Welcome back!' : 'Create an account to start playing'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-black text-lg" style={{ fontWeight: 900 }}>EMAIL</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md bg-gray-100 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all h-12 text-lg border-0"
            style={{ fontWeight: 900, letterSpacing: '0.05em' }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-black text-lg" style={{ fontWeight: 900 }}>PASSWORD</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md bg-gray-100 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all h-12 text-lg border-0"
            style={{ fontWeight: 900, letterSpacing: '0.05em' }}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg h-12 rounded-md shadow-lg hover:shadow-xl transition-all"
          disabled={loading}
          style={{ fontWeight: 900 }}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              LOADING...
            </div>
          ) : isLogin ? 'LOGIN' : 'SIGN UP'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full hover:bg-black hover:text-white text-black transition-colors h-10 rounded-md"
          onClick={() => {
            soundManager.play('click_forward');
            setAnimate(true);
            setTimeout(() => setAnimate(false), 200);
            setIsLogin(!isLogin);
          }}
          style={{ fontWeight: 900, letterSpacing: '0.05em' }}
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </Button>
      </form>
    </div>
  );
}
