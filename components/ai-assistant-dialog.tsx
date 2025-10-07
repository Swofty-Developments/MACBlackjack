'use client';

import { Dialog, DialogContent } from './ui/dialog';
import { Bot } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AIAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: 'HIT' | 'STAND' | null;
  loading: boolean;
  onRecommendationClick?: (action: 'HIT' | 'STAND') => void;
}

export function AIAssistantDialog({ open, onOpenChange, recommendation, loading, onRecommendationClick }: AIAssistantDialogProps) {
  const [isShortHeight, setIsShortHeight] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setIsShortHeight(window.innerHeight < 750);
    };
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  const handleRecommendationClick = () => {
    if (recommendation && onRecommendationClick) {
      onRecommendationClick(recommendation);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-black/90 border-2 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.4)] max-w-md ${isShortHeight ? 'scale-75' : ''}`}>
        <div className={`flex flex-col items-center ${isShortHeight ? 'gap-3 py-2' : 'gap-6 py-4'}`}>
          {/* Animated Robot Icon */}
          <div className="relative">
            <div
              className={`${loading ? 'animate-bounce' : ''}`}
              style={{
                animation: loading ? 'bounce 1s infinite' : 'float 3s ease-in-out infinite'
              }}
            >
              <Bot className={`${isShortHeight ? 'h-14 w-14' : 'h-20 w-20'} text-purple-400`} />
              <div
                className="absolute inset-0"
                style={{
                  filter: 'blur(20px)',
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)'
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h2 className={`${isShortHeight ? 'text-xl' : 'text-2xl'} font-black text-white`} style={{ fontWeight: 900 }}>
            AI ASSISTANT
          </h2>

          {/* Recommendation */}
          {loading ? (
            <p className={`${isShortHeight ? 'text-base' : 'text-lg'} text-gray-400 animate-pulse`}>Analyzing your hand...</p>
          ) : recommendation ? (
            <div className={`flex flex-col items-center ${isShortHeight ? 'gap-2' : 'gap-4'}`}>
              <p className={`${isShortHeight ? 'text-base' : 'text-lg'} text-gray-300`}>I recommend you:</p>
              <button
                onClick={handleRecommendationClick}
                className={`${isShortHeight ? 'px-6 py-3 text-2xl' : 'px-8 py-4 text-3xl'} rounded-lg font-black transition-all duration-300 cursor-pointer hover:scale-105 ${
                  recommendation === 'HIT'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-[0_0_30px_rgba(37,99,235,0.6)] animate-glow-blue'
                    : 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-glow-red'
                }`}
                style={{ fontWeight: 900 }}
              >
                {recommendation}
              </button>
            </div>
          ) : (
            <p className={`${isShortHeight ? 'text-base' : 'text-lg'} text-red-400`}>Unable to get recommendation</p>
          )}
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes glow-blue {
            0%, 100% { box-shadow: 0 0 30px rgba(37, 99, 235, 0.6); }
            50% { box-shadow: 0 0 50px rgba(37, 99, 235, 0.9); }
          }
          @keyframes glow-red {
            0%, 100% { box-shadow: 0 0 30px rgba(220, 38, 38, 0.6); }
            50% { box-shadow: 0 0 50px rgba(220, 38, 38, 0.9); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
