'use client';

import { useState, useEffect } from 'react';
import { notificationManager, type Notification } from '@/lib/notification-manager';

const typeColors = {
  info: { main: 'bg-blue-600/90', dark: 'bg-blue-700/90', glow: 'rgba(59, 130, 246, 0.4)' },
  warning: { main: 'bg-yellow-600/90', dark: 'bg-yellow-700/90', glow: 'rgba(234, 179, 8, 0.4)' },
  error: { main: 'bg-red-600/90', dark: 'bg-red-700/90', glow: 'rgba(220, 38, 38, 0.4)' }
};

const typeLabels = {
  info: 'INFO',
  warning: 'WARN',
  error: 'FAIL'
};

const MAX_NOTIFICATIONS = 5;
const MAX_MOBILE_NOTIFICATIONS = 2;

function NotificationBanner({ notification, index, forceExit, isMobile, onExitComplete }: { notification: Notification; index: number; forceExit: boolean; isMobile: boolean; onExitComplete: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (forceExit) {
      setIsExiting(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 4700);

    return () => clearTimeout(timer);
  }, [notification.id, forceExit]);

  useEffect(() => {
    if (isExiting) {
      // Wait for animation, then mark as invisible, then remove from DOM
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onExitComplete(notification.id);
        }, 50);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isExiting, notification.id, onExitComplete]);

  if (!isVisible) return null;

  const slideInAnimation = isMobile ? 'slideDownNotification' : 'slideInNotification';

  return (
    <div
      style={{
        marginTop: index > 0 ? '12px' : '0',
        animation: `${slideInAnimation} 0.3s ease-out`,
        opacity: isExiting ? 0 : 1,
        transform: isExiting
          ? (isMobile ? 'translateY(-100%) scale(0.95)' : 'translateX(50px) scale(0.95)')
          : (isMobile ? 'translateY(0) scale(1)' : 'translateX(0) scale(1)'),
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, margin-top 0.5s ease-out',
        pointerEvents: isExiting ? 'none' : 'auto'
      }}
    >
      <div className={isMobile ? 'flex flex-col' : 'flex'}>
        {/* Label section - horizontal on mobile, vertical on desktop */}
        <div
          className={`${typeColors[notification.type].dark} flex items-center justify-center ${
            isMobile ? 'px-4 py-2 w-full' : 'px-2 min-w-[40px]'
          }`}
          style={{
            boxShadow: `0 0 10px ${typeColors[notification.type].glow}, 0 0 15px ${typeColors[notification.type].glow}`
          }}
        >
          <span
            className="text-white text-xs tracking-tighter"
            style={{
              fontWeight: 900,
              ...(isMobile ? {} : {
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }),
              letterSpacing: '-0.1em',
              lineHeight: '0.8'
            }}
          >
            {typeLabels[notification.type]}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Pixelated top edge - simplified */}
          <div className="h-1 flex">
            <div className="w-[5%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[4%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[3%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[5%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
          </div>
          <div className="h-1 flex">
            <div className="w-[3%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[3%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
          </div>
          <div className="h-1 flex">
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[3%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
          </div>

          {/* Main notification body - extra padding top to push text down */}
          <div
            className={`${typeColors[notification.type].main} backdrop-blur-sm px-6 pt-6 pb-4 min-h-[60px] flex items-center`}
            style={{
              boxShadow: `0 0 10px ${typeColors[notification.type].glow}, 0 0 15px ${typeColors[notification.type].glow}`
            }}
          >
            <p className="text-white text-lg" style={{ fontWeight: 900 }}>
              {notification.message}
            </p>
          </div>

          {/* Pixelated bottom edge - simplified */}
          <div className="h-1 flex">
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[3%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
          </div>
          <div className="h-1 flex">
            <div className="w-[3%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[3%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[2%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
          </div>
          <div className="h-1 flex">
            <div className="w-[5%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[4%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[3%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
            <div className="w-[5%] bg-transparent"></div>
            <div className={`flex-1 ${typeColors[notification.type].main}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  useEffect(() => {
    const maxNotifs = isMobile ? MAX_MOBILE_NOTIFICATIONS : MAX_NOTIFICATIONS;

    // Add new notifications to display
    const newNotifications = notifications.filter(
      (n) => !displayedNotifications.find((d) => d.id === n.id) && !exitingIds.has(n.id)
    );

    if (newNotifications.length > 0) {
      setDisplayedNotifications((prev) => {
        const updated = [...prev, ...newNotifications];
        const nonExiting = updated.filter(n => !exitingIds.has(n.id));

        // If we exceed max, mark oldest non-exiting ones for exit
        if (nonExiting.length > maxNotifs) {
          const toRemove = nonExiting.slice(0, nonExiting.length - maxNotifs);
          setExitingIds(prevExiting => {
            const newExiting = new Set(prevExiting);
            toRemove.forEach(n => newExiting.add(n.id));
            return newExiting;
          });
        }

        return updated;
      });
    }
  }, [notifications, isMobile]);

  const handleExitComplete = (id: string) => {
    setDisplayedNotifications((prev) => prev.filter((n) => n.id !== id));
    setExitingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <div className={`fixed z-[100] w-full ${
      isMobile
        ? 'top-0 left-0 px-4 pt-4'
        : 'top-24 right-4 max-w-md'
    }`}>
      {displayedNotifications.map((notification, index) => {
        const isGone = !notifications.find((n) => n.id === notification.id);
        const shouldForceExit = exitingIds.has(notification.id) || isGone;
        return (
          <NotificationBanner
            key={notification.id}
            notification={notification}
            index={index}
            forceExit={shouldForceExit}
            isMobile={isMobile}
            onExitComplete={handleExitComplete}
          />
        );
      })}
    </div>
  );
}
