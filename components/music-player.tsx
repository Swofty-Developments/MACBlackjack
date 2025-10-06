'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { musicConfig, globalMusicManager } from '@/lib/music-config';
import { soundManager } from '@/lib/sound-manager';
import { notificationManager } from '@/lib/notification-manager';

interface MusicPlayerProps {
  musicType: 'menu' | 'game';
}

// Fade volume helper function
const fadeVolume = (audio: HTMLAudioElement, startVol: number, endVol: number, duration: number): Promise<void> => {
  return new Promise((resolve) => {
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = (endVol - startVol) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newVolume = startVol + (volumeStep * currentStep);
      audio.volume = Math.max(0, Math.min(1, newVolume));

      if (currentStep >= steps) {
        clearInterval(interval);
        resolve();
      }
    }, stepDuration);
  });
};

export function MusicPlayer({ musicType }: MusicPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('musicVolume');
      return saved ? parseFloat(saved) : 0.05;
    }
    return 0.05;
  });
  const [sfxVolume, setSfxVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sfxVolume');
      return saved ? parseFloat(saved) : 0.5;
    }
    return 0.5;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dialRef = useRef<HTMLDivElement | null>(null);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save volume settings to localStorage
  useEffect(() => {
    localStorage.setItem('musicVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('sfxVolume', sfxVolume.toString());
    soundManager.setVolume(sfxVolume);
  }, [sfxVolume]);

  // Get tracks from config
  const tracks = musicConfig[musicType].map(track => ({
    name: track.name,
    path: `/music/${musicType}/${track.filename}`
  }));

  // Initialize global music manager and sound manager
  useEffect(() => {
    soundManager.init();
    globalMusicManager.init(musicType, 0, volume, isMuted);

    // Subscribe to track changes
    const unsubscribe = globalMusicManager.subscribe(() => {
      setCurrentTrackIndex(globalMusicManager.getCurrentTrack());
    });

    return unsubscribe;
  }, []);

  // Handle music type changes
  useEffect(() => {
    const currentType = globalMusicManager.getCurrentType();
    console.log('MusicPlayer type change:', { currentType, newType: musicType });
    if (currentType && currentType !== musicType) {
      globalMusicManager.switchType(musicType, 0);
      setCurrentTrackIndex(0);
    } else if (!currentType) {
      // No current type (e.g., after pause), initialize fresh
      globalMusicManager.switchType(musicType, 0);
      setCurrentTrackIndex(0);
    }
  }, [musicType]);

  // Sync current track from global manager
  useEffect(() => {
    const track = globalMusicManager.getCurrentTrack();
    const type = globalMusicManager.getCurrentType();
    if (type === musicType && track !== currentTrackIndex) {
      setCurrentTrackIndex(track);
    }
  }, []);

  useEffect(() => {
    globalMusicManager.setVolume(volume, isMuted);
  }, [volume, isMuted]);

  const handleDialRotate = (e: React.MouseEvent | React.WheelEvent) => {
    if ('deltaY' in e) {
      // Scroll event
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      const newIndex = (currentTrackIndex + delta + tracks.length) % tracks.length;
      globalMusicManager.changeTrack(newIndex);
      setRotation(rotation + delta * 120);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    const newRotation = angle + 90;
    const diff = newRotation - rotation;

    if (Math.abs(diff) > 30) {
      const direction = diff > 0 ? 1 : -1;
      const newIndex = (currentTrackIndex + direction + tracks.length) % tracks.length;
      globalMusicManager.changeTrack(newIndex);
      setRotation(newRotation);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, rotation, currentTrackIndex]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Auto-rotate when opened
  useEffect(() => {
    if (isOpen) {
      // Start rotating slowly
      rotationIntervalRef.current = setInterval(() => {
        setRotation(prev => prev + 0.5);
      }, 50);
    } else {
      // Stop rotation when closed
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }
    }

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, [isOpen]);

  // Close on outside click (desktop only)
  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.music-player-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile]);

  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startVolume = volume;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY; // Inverted: up is positive
      const volumeChange = deltaY / 100;
      const newVolume = Math.max(0, Math.min(1, startVolume + volumeChange));
      setVolume(newVolume);
      if (newVolume > 0) setIsMuted(false);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleSfxVolumeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startVolume = sfxVolume;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const volumeChange = deltaY / 100;
      const newVolume = Math.max(0, Math.min(1, startVolume + volumeChange));
      setSfxVolume(newVolume);
      // Update sound manager volume for all sounds
      soundManager.setVolume('hover', newVolume);
      soundManager.setVolume('click_forward', newVolume);
      soundManager.setVolume('click_backward', newVolume);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Calculate how many instances needed to fill the visible quarter arc
  const avgTrackNameLength = tracks.reduce((sum, t) => sum + t.name.length, 0) / tracks.length;
  const estimatedTrackWidth = avgTrackNameLength * 6; // ~6px per character (closer together)
  const arcRadius = 380;
  const arcLength = (Math.PI * arcRadius) / 2; // Quarter circle arc length
  const instancesNeeded = Math.ceil(arcLength / estimatedTrackWidth) * 2; // Double for smooth rotation

  return (
    <>
      {/* Background blur overlay when open */}
      {isOpen && !isMobile && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[199] animate-fade-in pointer-events-none" />
      )}

      <div className="fixed bottom-0 right-0 z-[200] music-player-container" style={{ overflow: 'visible' }}>
        {/* Expanded Circle Quarter - Behind button */}
        {!isMobile && isOpen && (
          <div
            className="absolute bottom-0 right-0 pointer-events-auto"
            style={{ width: '800px', height: '800px', overflow: 'visible' }}
          >
            {/* Quarter Circle Background */}
            <div
              className={`absolute bottom-0 right-0 w-[800px] h-[800px] bg-neutral-700/30 backdrop-blur-md`}
              style={{
                borderRadius: '100%',
                transform: 'translate(100%, 100%)',
                animation: isClosing ? 'slideIn 0.4s ease-out forwards' : 'slideOut 0.4s ease-out forwards'
              }}
            >
              {/* Track Names Revolving Around Arc */}
              <div className="absolute inset-0" style={{ overflow: 'visible' }}>
                {Array.from({ length: instancesNeeded }).map((_, i) => {
                  const track = tracks[i % tracks.length];
                  const index = i % tracks.length;
                  const angle = (i * (360 / instancesNeeded)) + (rotation % 360);
                  const normalizedAngle = ((angle % 360) + 360) % 360;

                  // Only render if in the visible quarter (bottom-right quarter: 180-270 degrees)
                  const isVisible = normalizedAngle >= 180 && normalizedAngle <= 270;

                  // Calculate opacity for fade effect at edges
                  let opacity = 1;
                  if (normalizedAngle < 190) {
                    opacity = (normalizedAngle - 180) / 10; // Fade in
                  } else if (normalizedAngle > 260) {
                    opacity = (270 - normalizedAngle) / 10; // Fade out
                  }

                  if (!isVisible) return null;

                  // Calculate position on the arc (circle center is at 400,400)
                  const radians = (normalizedAngle * Math.PI) / 180;
                  const x = 400 + Math.cos(radians) * arcRadius;
                  const y = 400 + Math.sin(radians) * arcRadius;

                  const isActive = index === currentTrackIndex;

                  return (
                    <div
                      key={i}
                      className="absolute transition-all duration-200 cursor-pointer"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)',
                        transformOrigin: 'center',
                        pointerEvents: 'auto',
                        padding: '12px'
                      }}
                      onClick={() => globalMusicManager.changeTrack(index)}
                      onMouseEnter={() => soundManager.play('hover')}
                    >
                      <span
                        className={`text-base whitespace-nowrap transition-all block hover:scale-150 ${
                          isActive ? 'text-white scale-125' : 'text-white/50'
                        }`}
                        style={{ fontWeight: 900, opacity, pointerEvents: 'none' }}
                      >
                        {track.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SFX Volume Control Arc - outer quarter circle */}
            <div className={`absolute ${isClosing ? 'animate-slider-slide-in' : 'animate-slider-slide-out'}`} style={{ bottom: '-22px', right: '-137px', width: '424px', height: '424px', pointerEvents: 'none', zIndex: 10 }}>
              <svg width="424" height="424" viewBox="-22 -22 424 424" style={{ overflow: 'visible', pointerEvents: 'none' }}>
                <defs>
                  <path id="sfxTextPath" d="M 0 380 A 268 268 0 0 1 268 112" fill="none"/>
                </defs>
                {/* Background arc - clickable (wider for easier interaction) */}
                <path
                  d="M 0 380 A 268 268 0 0 1 268 112"
                  fill="none"
                  stroke="rgba(255,255,255,0.0)"
                  strokeWidth="80"
                  strokeLinecap="butt"
                  style={{ cursor: 'ns-resize', pointerEvents: 'stroke' }}
                  onMouseDown={handleSfxVolumeMouseDown}
                  onMouseEnter={() => soundManager.play('hover')}
                />
                {/* Visible background arc */}
                <path
                  d="M 0 380 A 268 268 0 0 1 268 112"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="44"
                  strokeLinecap="butt"
                  style={{ pointerEvents: 'none' }}
                />
                {/* SFX Volume arc */}
                <path
                  d="M 0 380 A 268 268 0 0 1 268 112"
                  fill="none"
                  stroke="rgba(234, 51, 147, 0.8)"
                  strokeWidth="44"
                  strokeLinecap="butt"
                  strokeDasharray={`${sfxVolume * 420} 420`}
                  style={{ pointerEvents: 'none' }}
                />
                {/* Text on path */}
                <text style={{ fontWeight: 900, pointerEvents: 'none' }}>
                  <textPath href="#sfxTextPath" startOffset="50%" textAnchor="middle" fill="white" fontSize="18">
                    SFX VOLUME
                  </textPath>
                </text>
              </svg>
            </div>

            {/* MUSIC Volume Control Arc - inner quarter circle */}
            <div className={`absolute ${isClosing ? 'animate-slider-slide-in' : 'animate-slider-slide-out'}`} style={{ bottom: '-22px', right: '-117px', width: '354px', height: '354px', pointerEvents: 'none', zIndex: 10 }}>
              <svg width="354" height="354" viewBox="-22 -22 354 354" style={{ overflow: 'visible', pointerEvents: 'none' }}>
                <defs>
                  <path id="musicTextPath" d="M 0 310 A 218 218 0 0 1 218 92" fill="none"/>
                </defs>
                {/* Background arc - clickable (wider for easier interaction) */}
                <path
                  d="M 0 310 A 218 218 0 0 1 218 92"
                  fill="none"
                  stroke="rgba(255,255,255,0.0)"
                  strokeWidth="80"
                  strokeLinecap="butt"
                  style={{ cursor: 'ns-resize', pointerEvents: 'stroke' }}
                  onMouseDown={handleVolumeMouseDown}
                  onMouseEnter={() => soundManager.play('hover')}
                />
                {/* Visible background arc */}
                <path
                  d="M 0 310 A 218 218 0 0 1 218 92"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="44"
                  strokeLinecap="butt"
                  style={{ pointerEvents: 'none' }}
                />
                {/* Volume arc */}
                <path
                  d="M 0 310 A 218 218 0 0 1 218 92"
                  fill="none"
                  stroke="rgba(147, 51, 234, 0.8)"
                  strokeWidth="44"
                  strokeLinecap="butt"
                  strokeDasharray={`${(isMuted ? 0 : volume) * 342} 342`}
                  style={{ pointerEvents: 'none' }}
                />
                {/* Text on path */}
                <text style={{ fontWeight: 900, pointerEvents: 'none' }}>
                  <textPath href="#musicTextPath" startOffset="50%" textAnchor="middle" fill="white" fontSize="17">
                    MUSIC VOLUME
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* Main Button - Quarter circle with gradient */}
        <button
          onClick={() => {
            if (isOpen) {
              if (!isMobile) {
                setIsClosing(true);
                setTimeout(() => {
                  setIsOpen(false);
                  setIsClosing(false);
                }, 400);
              } else {
                setIsOpen(false);
              }
            } else {
              setIsOpen(true);
            }
          }}
          onMouseEnter={() => soundManager.play('hover')}
          className="absolute bottom-0 right-0 w-[180px] h-[180px] hover:scale-105 transition-all duration-300 z-[250] overflow-hidden flex items-center justify-center"
          style={{
            borderRadius: '100% 0 0 0',
            background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(99, 102, 241, 0.4)'
          }}
        >
          <div style={{ position: 'absolute', top: '60%', left: '60%', transform: 'translate(-50%, -50%)' }}>
            <Music className="h-12 w-12 text-white" />
          </div>
        </button>
      </div>

      {/* Mobile Modal - Outside container with higher z-index */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm pointer-events-auto">
          <div className="bg-neutral-800/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative z-[10000] pointer-events-auto">
            <h2 className="text-2xl text-white mb-6 text-center" style={{ fontWeight: 900 }}>
              SELECT TRACK
            </h2>

            {/* Track List */}
            <div className="space-y-3 mb-6">
              {tracks.map((track, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    globalMusicManager.changeTrack(index);
                    soundManager.play('click_forward');
                  }}
                  className={`w-full p-4 rounded-xl transition-all ${
                    index === currentTrackIndex
                      ? 'bg-purple-600 text-white scale-105'
                      : 'bg-neutral-700/50 text-white/70 hover:bg-neutral-700'
                  }`}
                  style={{ fontWeight: 900, touchAction: 'manipulation' }}
                >
                  {track.name}
                </button>
              ))}
            </div>

            {/* Volume Controls */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-white text-sm mb-2 block" style={{ fontWeight: 900 }}>
                  MUSIC VOLUME
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (newVolume > 0) setIsMuted(false);
                  }}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600"
                />
              </div>

              <div>
                <label className="text-white text-sm mb-2 block" style={{ fontWeight: 900 }}>
                  SFX VOLUME
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={sfxVolume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setSfxVolume(newVolume);
                  }}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-600"
                />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              style={{ fontWeight: 900 }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
