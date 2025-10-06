'use client';

interface BottomBarProps {
  variant?: 'default' | 'game';
}

export function BottomBar({ variant = 'default' }: BottomBarProps) {
  const barColor = variant === 'game' ? 'bg-green-900/40' : 'bg-neutral-700/30';
  const pixelColor = variant === 'game' ? 'bg-green-900/40' : 'bg-neutral-700/30';

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${variant === 'game' ? 'animate-fade-in' : ''}`}>
      {/* Pixelated top edge - multiple layers for depth */}
      <div className="h-1 flex">
        <div className="w-[8%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[7%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[6%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[8%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
      </div>
      <div className="h-1 flex">
        <div className="w-[6%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[5%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[6%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
      </div>
      <div className="h-1 flex">
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
      </div>
      <div className="h-1 flex">
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[4%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[2%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
        <div className="w-[3%] bg-transparent"></div>
        <div className={`flex-1 ${pixelColor}`}></div>
      </div>

      {/* Main pure gray bar with transparency */}
      <div className={`h-12 ${barColor}`}>
        <div className="flex items-center justify-start h-full px-6">
          <div className="text-left">
            <p className="text-xs text-gray-400 leading-tight" style={{ fontWeight: 900 }}>Made with love</p>
            <p className="text-sm text-white leading-tight" style={{ fontWeight: 900 }}>SWOFTY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
