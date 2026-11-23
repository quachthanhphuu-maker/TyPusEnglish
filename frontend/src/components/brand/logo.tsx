'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
  className?: string;
}

export function Logo({
  size = 'md',
  showText = true,
  href,
  className,
}: LogoProps) {
  const [imageError, setImageError] = React.useState(false);

  const sizeDimensions = {
    sm: { box: 'h-7 w-7', px: 28, text: 'text-base font-bold' },
    md: { box: 'h-9 w-9', px: 36, text: 'text-xl font-extrabold' },
    lg: { box: 'h-12 w-12', px: 48, text: 'text-2xl font-black' },
  }[size];

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <div className={cn('relative flex-shrink-0 flex items-center justify-center', sizeDimensions.box)}>
        {!imageError ? (
          <Image
            src="/brand/logo-penguin.svg"
            alt="TyPusEnglish Penguin Logo"
            width={sizeDimensions.px}
            height={sizeDimensions.px}
            className="h-full w-full object-contain"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          // Graceful fallback SVG icon if image is missing
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <rect width="40" height="40" rx="8" fill="#EAF4FC" />
            <path
              d="M20 7C14 7 9 12 9 18C9 24 10.5 30 13.5 35C15.5 36 24.5 36 26.5 35C29.5 30 31 24 31 18C31 12 26 7 20 7Z"
              fill="#1B2A38"
            />
            <ellipse cx="20" cy="24" rx="6" ry="9" fill="#F8FBFF" />
            <circle cx="16.5" cy="16" r="1.5" fill="#FFFFFF" />
            <circle cx="23.5" cy="16" r="1.5" fill="#FFFFFF" />
            <path d="M20 18L17.5 21H22.5L20 18Z" fill="#FF7A00" />
            <path d="M20 4L10 9L20 14L30 9L20 4Z" fill="#0EA5E9" />
          </svg>
        )}
      </div>

      {showText && (
        <span className={cn('tracking-tight text-arctic-slate transition-colors', sizeDimensions.text)}>
          TyPus<span className="text-arctic-orange">English</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
