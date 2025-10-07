'use client';

import * as React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start pt-24 justify-center lg:items-center lg:pt-0 lg:justify-start lg:pl-32 animate-fade-in pointer-events-none">
      {/* Content */}
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return (
    <div className={`relative rounded-lg p-6 shadow-xl max-w-lg w-full mx-4 ${className}`}>
      {children}
    </div>
  );
}
