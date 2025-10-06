'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ChevronDown, Coins, X } from 'lucide-react';
import { soundManager } from '@/lib/sound-manager';

export function ProfilePill() {
  const { user, updateChips } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside and set width (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedButton = buttonRef.current && buttonRef.current.contains(target);
      const clickedDropdown = dropdownRef.current && dropdownRef.current.contains(target);

      if (!clickedButton && !clickedDropdown) {
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
  }, [isOpen, isMobile]);

  return (
    <>
      <div>
        <button
          ref={buttonRef}
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
      </div>

      {/* Desktop Dropdown - positioned fixed to escape parent overflow */}
      {!isMobile && isOpen && (
        <div
          ref={dropdownRef}
          className="fixed top-20 right-0 z-[10000] min-w-[300px]"
          style={dropdownWidth > 0 ? { width: `${dropdownWidth}px` } : {}}
        >
          <div className="p-4 space-y-3 bg-neutral-900 shadow-2xl">
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

      {/* Mobile Modal - Full screen */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-neutral-800/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative z-[10000] pointer-events-auto">
            <h2 className="text-2xl text-white mb-6 text-center" style={{ fontWeight: 900 }}>
              GET CHIPS
            </h2>

            {/* Chip Packages */}
            <div className="space-y-3 mb-6">
              {chipPackages.map((pkg, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(pkg.amount);
                  }}
                  className="w-full p-4 rounded-xl transition-all bg-neutral-700/50 hover:bg-neutral-700 active:scale-95"
                  style={{ fontWeight: 900, touchAction: 'manipulation' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Coins className="h-8 w-8 text-yellow-400" />
                      <span className="text-white font-black text-xl">
                        {pkg.label}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-green-600 rounded">
                      <span className="text-white font-black text-lg">FREE</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              style={{ fontWeight: 900 }}
            >
              <X className="h-5 w-5" />
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
