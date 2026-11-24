'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { InteractivePenguinProps } from './auth-types';

export function InteractivePenguin({
  state = 'idle',
  className,
  showDecorations = true,
}: InteractivePenguinProps) {
  const shouldReduceMotion = useReducedMotion();

  // Left flipper motion variants
  const leftFlipperVariants: Variants = {
    initial: {
      rotate: [0, -12, 2, -8, 0],
      y: [0, -3, 1, -2, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
    },
    idle: {
      rotate: [0, -8, 2, -6, 0],
      y: [0, -3, 1, -2, 0],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    },
    username_focus: { rotate: 8, x: -3, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    password_focus: { rotate: -115, x: 20, y: -28, transition: { duration: 0.35, ease: 'backOut' } },
    password_visible: { rotate: -95, x: 14, y: -22, transition: { duration: 0.3, ease: 'easeOut' } },
    loading: { rotate: [-10, 5, -10], y: [0, -4, 0], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } },
    success: {
      rotate: [-130, -145, -130],
      x: -10,
      y: [-22, -30, -22],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    },
    register_mode: { rotate: -40, x: 8, y: -12, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  // Right flipper motion variants (Autonomous waving "Hi!" and breathing)
  const rightFlipperVariants: Variants = {
    initial: {
      rotate: [0, 42, 12, 38, 0],
      y: [0, -12, -4, -10, 0],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
    },
    idle: {
      rotate: [0, 24, 6, 20, 0],
      y: [0, -7, -2, -6, 0],
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
    },
    username_focus: { rotate: -5, x: -2, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    password_focus: { rotate: 115, x: -20, y: -28, transition: { duration: 0.35, ease: 'backOut' } },
    password_visible: { rotate: 30, x: -6, y: -4, transition: { duration: 0.35, ease: 'backOut' } },
    loading: { rotate: [5, -10, 5], y: [0, -4, 0], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } },
    success: {
      rotate: [130, 145, 130],
      x: 10,
      y: [-22, -30, -22],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    },
    register_mode: { rotate: 40, x: -8, y: -12, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  // Pupils gaze offset variants (Autonomously looking around and focusing)
  const pupilVariants: Variants = {
    initial: { x: [-1, 2, -1], y: [0, -1, 0], transition: { duration: 2.5, repeat: Infinity } },
    idle: { x: [0, -2, 0, 2, 0], y: [0, 1, 0, -1, 0], transition: { duration: 4, repeat: Infinity } },
    username_focus: { x: -4, y: 1, transition: { duration: 0.25 } },
    password_focus: { x: 0, y: 0 },
    password_visible: { x: -3.5, y: 0.5 },
    loading: { x: [0, 2, -2, 0], y: [-1, 1, -1, 0], transition: { duration: 1.5, repeat: Infinity } },
    success: { x: 0, y: -1 },
    register_mode: { x: 0, y: 0 },
  };

  // Blinking animation
  const eyeBlinkVariants: Variants = {
    idle: {
      scaleY: [1, 1, 0.1, 1, 1, 1, 1, 0.1, 1],
      transition: { duration: 4.5, repeat: Infinity, times: [0, 0.45, 0.48, 0.52, 0.78, 0.81, 0.84, 0.87, 1] },
    },
    success: { scaleY: 0.2, transition: { duration: 0.2 } },
  };

  // Whole character body breathing / joyful bouncing
  const bodyVariants: Variants = {
    initial: { y: [0, -6, 0], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } },
    idle: {
      y: [0, -6, 0],
      rotate: [-0.8, 0.8, -0.8],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    },
    username_focus: { y: 0, rotate: -2, transition: { duration: 0.35 } },
    password_focus: { y: 2, rotate: 0, transition: { duration: 0.3 } },
    password_visible: { y: 1, rotate: -1.5, transition: { duration: 0.3 } },
    loading: { y: [0, -4, 0], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } },
    success: {
      y: [0, -20, 0, -14, 0],
      scale: [1, 1.05, 1, 1.03, 1],
      transition: { duration: 0.75, repeat: Infinity, ease: 'easeInOut' },
    },
    register_mode: { y: [0, -5, 0], transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } },
  };

  const isHappyEyes = state === 'success';

  return (
    <div className={cn('relative flex flex-col items-center justify-center select-none w-full max-w-lg mx-auto', className)}>
      {/* Educational Floating Cards Background */}
      {showDecorations && (
        <>
          {/* 1. Floating Vocab Flashcard (Top Right) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: [0, -8, 0],
                    rotate: [-1, 1.5, -1],
                  }
            }
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 right-2 sm:right-6 z-10 rounded-2xl border border-white/60 bg-white/85 p-3.5 shadow-lg shadow-sky-900/5 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0EA5E9]/15 text-xs text-[#0EA5E9] font-bold">
                EN
              </span>
              <div>
                <p className="text-xs font-bold text-[#1B2A38]">Eloquent</p>
                <p className="text-[10px] text-slate-500">/ˈel.ə.kwənt/ • Hùng biện</p>
              </div>
            </div>
          </motion.div>

          {/* 2. Floating Milestone / Goal Card (Bottom Left) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: [0, 8, 0],
                    rotate: [1, -1.5, 1],
                  }
            }
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-4 left-0 sm:left-4 z-10 rounded-2xl border border-white/60 bg-white/85 p-3 shadow-lg shadow-sky-900/5 backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF7A00]/15 text-sm">
                🎓
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1B2A38]">IELTS Target</span>
                  <span className="rounded bg-[#FF7A00] px-1.5 py-0.5 text-[9px] font-extrabold text-white">7.5+</span>
                </div>
                <p className="text-[10px] text-slate-500">TyPus Bilingual Academic Track</p>
              </div>
            </div>
          </motion.div>

          {/* 3. Floating Daily Streak Badge (Bottom Right) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: [0, -6, 0],
                  }
            }
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-12 -right-2 sm:right-4 z-10 hidden sm:flex items-center gap-2 rounded-xl border border-white/60 bg-white/90 px-3 py-2 shadow-md backdrop-blur-md"
          >
            <span className="text-sm">🔥</span>
            <div className="text-left leading-none">
              <span className="text-[11px] font-bold text-[#1B2A38]">7-Day Streak</span>
              <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Tiến độ vượt bậc</p>
            </div>
          </motion.div>
        </>
      )}

      {/* Interactive Penguin Mascot SVG Container */}
      <motion.div
        variants={shouldReduceMotion ? undefined : bodyVariants}
        animate={shouldReduceMotion ? 'idle' : state}
        className="relative w-64 h-64 sm:w-80 sm:h-80 z-20"
      >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full overflow-visible drop-shadow-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Soft Glow Shadow */}
          <ellipse cx="120" cy="216" rx="68" ry="14" fill="#0EA5E9" fillOpacity="0.12" />
          <ellipse cx="120" cy="216" rx="46" ry="9" fill="#1B2A38" fillOpacity="0.1" />

          {/* Feet (Orange #FF7A00) */}
          <g id="feet">
            <ellipse cx="94" cy="208" rx="18" ry="8" fill="#FF7A00" />
            <ellipse cx="146" cy="208" rx="18" ry="8" fill="#FF7A00" />
          </g>

          {/* Dark Slate Penguin Body (#1B2A38) */}
          <path
            d="M120 32C85 32 58 60 58 96C58 132 66 174 80 204C92 208 148 208 160 204C174 174 182 132 182 96C182 60 155 32 120 32Z"
            fill="#1B2A38"
          />

          {/* White Belly (Arctic Snow #F8FBFF) */}
          <path
            d="M120 78C98 78 84 102 84 136C84 168 96 198 120 198C144 198 156 168 156 136C156 102 142 78 120 78Z"
            fill="#F8FBFF"
          />

          {/* Left Wing / Flipper */}
          <motion.g
            style={{ transformOrigin: '68px 112px' }}
            variants={shouldReduceMotion ? undefined : leftFlipperVariants}
            animate={shouldReduceMotion ? undefined : state}
          >
            <path
              d="M68 108C52 114 36 136 34 162C33 174 44 178 52 166C62 152 74 132 74 116Z"
              fill="#1B2A38"
            />
          </motion.g>

          {/* Right Wing / Flipper */}
          <motion.g
            style={{ transformOrigin: '172px 112px' }}
            variants={shouldReduceMotion ? undefined : rightFlipperVariants}
            animate={shouldReduceMotion ? undefined : state}
          >
            <path
              d="M172 108C188 114 204 136 206 162C207 174 196 178 188 166C178 152 166 132 166 116Z"
              fill="#1B2A38"
            />
          </motion.g>

          {/* Penguin Face Elements */}
          <g id="face">
            {/* Left Eye */}
            <g id="left-eye" className="origin-[100px_94px]">
              {isHappyEyes ? (
                <path d="M92 97C95 91 105 91 108 97" stroke="#1B2A38" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              ) : (
                <motion.g
                  variants={shouldReduceMotion ? undefined : eyeBlinkVariants}
                  animate={shouldReduceMotion ? undefined : isHappyEyes ? 'success' : 'idle'}
                  style={{ transformOrigin: '100px 94px' }}
                >
                  <ellipse cx="100" cy="94" rx="8" ry="11" fill="#FFFFFF" />
                  <ellipse cx="100" cy="94" rx="7.5" ry="10" stroke="#E2E8F0" strokeWidth="1" fill="#FFFFFF" />
                  <motion.circle
                    cx="100"
                    cy="94"
                    r="4"
                    fill="#1B2A38"
                    variants={shouldReduceMotion ? undefined : pupilVariants}
                    animate={shouldReduceMotion ? undefined : state}
                  />
                  <circle cx="98" cy="91" r="1.5" fill="#FFFFFF" />
                </motion.g>
              )}
            </g>

            {/* Right Eye */}
            <g id="right-eye" className="origin-[140px_94px]">
              {isHappyEyes ? (
                <path d="M132 97C135 91 145 91 148 97" stroke="#1B2A38" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              ) : (
                <motion.g
                  variants={shouldReduceMotion ? undefined : eyeBlinkVariants}
                  animate={shouldReduceMotion ? undefined : isHappyEyes ? 'success' : 'idle'}
                  style={{ transformOrigin: '140px 94px' }}
                >
                  <ellipse cx="140" cy="94" rx="8" ry="11" fill="#FFFFFF" />
                  <ellipse cx="140" cy="94" rx="7.5" ry="10" stroke="#E2E8F0" strokeWidth="1" fill="#FFFFFF" />
                  <motion.circle
                    cx="140"
                    cy="94"
                    r="4"
                    fill="#1B2A38"
                    variants={shouldReduceMotion ? undefined : pupilVariants}
                    animate={shouldReduceMotion ? undefined : state}
                  />
                  <circle cx="138" cy="91" r="1.5" fill="#FFFFFF" />
                </motion.g>
              )}
            </g>

            {/* Orange Beak (#FF7A00) */}
            <path
              d="M120 106L106 119C106 125 134 125 134 119L120 106Z"
              fill="#FF7A00"
            />
            <path d="M116 112L120 108L124 112" stroke="#FFB066" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Rosy Cheeks */}
            <circle cx="86" cy="108" r="5" fill="#FDA4AF" fillOpacity="0.45" />
            <circle cx="154" cy="108" r="5" fill="#FDA4AF" fillOpacity="0.45" />
          </g>

          {/* Mascot Book in Register Mode */}
          {state === 'register_mode' && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: 'backOut' }}
              className="origin-[120px_155px]"
            >
              <rect x="96" y="140" width="48" height="32" rx="4" fill="#0EA5E9" />
              <path d="M120 140V172" stroke="#0284C7" strokeWidth="2" />
              <path d="M102 148H115M102 154H115M102 160H112" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M125 148H138M125 154H138M125 160H135" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
          )}

          {/* Graduation Cap */}
          <g id="graduation-cap">
            <path d="M84 48V62C84 70 156 70 156 62V48" fill="#0284C7" />
            <path d="M120 22L70 42L120 62L170 42L120 22Z" fill="#0EA5E9" />
            <path d="M120 25L76 42L120 59L164 42L120 25Z" fill="#38BDF8" fillOpacity="0.3" />
            <circle cx="120" cy="42" r="3.5" fill="#FF7A00" />
            <path
              d="M120 42C136 44 158 52 162 66"
              stroke="#FF7A00"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="162" cy="67" r="3" fill="#FF7A00" />
          </g>
        </svg>
      </motion.div>

      {/* Dynamic Status Caption */}
      <div className="mt-4 text-center z-20">
        <p className="text-sm font-semibold font-heading text-[#1B2A38]">
          {state === 'password_focus' && '🙈 Tôi không nhìn đâu, mật khẩu của bạn luôn bảo mật!'}
          {state === 'password_visible' && '👀 Ồ, bạn đang kiểm tra lại mật khẩu đúng không?'}
          {state === 'username_focus' && '✍️ Chào mừng bạn! Hãy nhập thông tin đăng nhập.'}
          {state === 'loading' && '⏳ Đang xác thực thông tin tài khoản...'}
          {state === 'success' && '🎉 Tuyệt vời! Xác thực thành công!'}
          {state === 'register_mode' && '📖 Chào mừng thành viên mới đến với TyPusEnglish!'}
          {(state === 'idle' || state === 'initial') && '👋 Chào bạn! Hãy đăng nhập để tiếp tục hành trình học tiếng Anh.'}
        </p>
      </div>
    </div>
  );
}
