'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ChevronDown, Coins } from 'lucide-react';
import { soundManager } from '@/lib/sound-manager';

export function ProfilePill() {
  const { user, updateChips } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  if (!user) return null;

  // Extract username from email (part before @)
  const username = user.email.split('@')[0];

  const chipPackages = [
    { amount: 500, label: '500 CHIPS' },
    { amount: 1000, label: '1,000 CHIPS' },
    { amount: 5000, label: '5,000 CHIPS' },
    { amount: 10000, label: '10,000 CHIPS' },
  ];

  const handlePurchase = async (amount: number) => {
    soundManager.play('click_forward');
    await updateChips(user.chips + amount);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside and set width
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Get the gold box width with a slight delay to ensure it's rendered
      setTimeout(() => {
        const goldBox = document.querySelector('.bg-yellow-500') as HTMLElement;
        if (goldBox) {
          setDropdownWidth(goldBox.offsetWidth);
        }
      }, 10);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          soundManager.play('hover');
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => soundManager.play('hover')}
        className="flex items-center gap-3 transition-all duration-300 hover:brightness-110"
      >
        {/* Username */}
        <span className="text-white font-black text-lg tracking-wide">
          {username.toUpperCase()}
        </span>

        {/* Divider */}
        <div className="h-8 w-[2px] bg-white/50" />

        {/* Chips */}
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-white" />
          <span className="text-white font-black text-lg">
            {user.chips.toLocaleString()}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`h-4 w-4 text-white transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="fixed top-20 right-0 z-[9999] min-w-[300px]"
          style={dropdownWidth > 0 ? { width: `${dropdownWidth}px` } : {}}
        >
          <div className="p-4 space-y-3 bg-neutral-900 backdrop-blur-md overflow-hidden">
            {chipPackages.map((pkg, index) => (
              <button
                key={index}
                onClick={() => handlePurchase(pkg.amount)}
                onMouseEnter={() => soundManager.play('hover')}
                className="w-full flex items-center justify-between p-4 bg-neutral-800/50 hover:bg-neutral-700/50 transition-all duration-300 hover:brightness-110"
              >
                <div className="flex items-center gap-3">
                  <Coins className="h-8 w-8 text-yellow-400" />
                  <span className="text-white font-black text-xl">
                    {pkg.label}
                  </span>
                </div>
                <div className="px-4 py-2 bg-green-600 rounded">
                  <span className="text-white font-black text-lg">FREE</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
