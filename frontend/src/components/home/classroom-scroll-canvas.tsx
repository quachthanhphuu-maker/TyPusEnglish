'use client';

import * as React from 'react';
import { useScroll, useReducedMotion, useTransform, motion } from 'framer-motion';
import { ScrollTextOverlays } from '@/components/home/scroll-text-overlays';
import { InteractiveOrbitingObjects } from '@/components/home/interactive-orbiting-objects';
import { cn } from '@/lib/utils';

interface ClassroomScrollCanvasProps {
  framePaths?: string[];
  className?: string;
}

export function ClassroomScrollCanvas({
  framePaths = [],
  className,
}: ClassroomScrollCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const imagesCacheRef = React.useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrameRef = React.useRef(0);
  const lastProgressRef = React.useRef(0);
  const hasReachedEndRef = React.useRef(false);
  const autoResetTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [loadedCount, setLoadedCount] = React.useState(0);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Subtle top vignette only under navbar that fades out quickly
  const vignetteOpacity = useTransform(scrollYProgress, [0.0, 0.08], [0.4, 0]);

  const totalFrames = framePaths.length;

  // Preload frames in batches with nearest-loaded fallback
  React.useEffect(() => {
    if (!framePaths || framePaths.length === 0) return;

    let isMounted = true;
    const cache = imagesCacheRef.current;

    const loadImage = (index: number) => {
      if (cache.has(index)) return;
      const img = new Image();
      img.src = framePaths[index];
      img.onload = () => {
        if (!isMounted) return;
        cache.set(index, img);
        setLoadedCount((c) => c + 1);
      };
      img.onerror = () => {
        // Safe silent fallback
      };
    };

    // Preload first 8 frames + last frame immediately
    for (let i = 0; i < Math.min(8, totalFrames); i++) {
      loadImage(i);
    }
    if (totalFrames > 1) {
      loadImage(totalFrames - 1);
    }

    // Preload remaining frames
    const timer = setTimeout(() => {
      for (let i = 8; i < totalFrames - 1; i++) {
        loadImage(i);
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [framePaths, totalFrames]);

  // Render on Canvas via requestAnimationFrame
  React.useEffect(() => {
    let animationId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 1) : 1;
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fallback: If no image frames provided, draw rich Arctic Snow-to-Classroom aura
      if (totalFrames === 0) {
        const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        gradient.addColorStop(0, '#F8FBFF');
        gradient.addColorStop(0.5, '#EAF4FC');
        gradient.addColorStop(1, '#D8E9F8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Ambient subtle perspective classroom floor grid
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
        ctx.lineWidth = 1;
        const gridStep = 45;
        for (let x = 0; x < rect.width; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, rect.height);
          ctx.stroke();
        }
        for (let y = 0; y < rect.height; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(rect.width, y);
          ctx.stroke();
        }

        ctx.restore();
        animationId = requestAnimationFrame(render);
        return;
      }

      // Calculate target frame index:
      // User request: "sau khi đến ảnh này thì bạn hãy cho nó quay lại từ đầu video đi"
      // 1. Advance forward as user scrolls down (never walks backward).
      // 2. Once reaching this final image (teacher & penguin greeting):
      //    - If user scrolls up or returns to top: returns directly to the beginning of video (frame 0).
      //    - Also auto-resets back to frame 0 after ~2s if user pauses here, ready to replay.
      let targetIndex = 0;
      if (prefersReducedMotion) {
        targetIndex = totalFrames - 1;
      } else {
        const progress = scrollYProgress.get();
        const lastProgress = lastProgressRef.current;
        lastProgressRef.current = progress;

        const isScrollingUp = progress < lastProgress;
        const isAtTop = progress <= 0.06;

        // When user reaches near the top of the page, always reset to start of video
        if (isAtTop) {
          currentFrameRef.current = 0;
          hasReachedEndRef.current = false;
          if (autoResetTimerRef.current) {
            clearTimeout(autoResetTimerRef.current);
            autoResetTimerRef.current = null;
          }
        }

        const calculatedIndex = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(progress * totalFrames))
        );

        if (hasReachedEndRef.current) {
          // After reaching the final image:
          // If user scrolls up: return immediately to the beginning of the video (frame 0)
          if (isScrollingUp || progress < 0.85) {
            currentFrameRef.current = 0;
            hasReachedEndRef.current = false;
            if (autoResetTimerRef.current) {
              clearTimeout(autoResetTimerRef.current);
              autoResetTimerRef.current = null;
            }
          } else {
            currentFrameRef.current = totalFrames - 1;
          }
        } else {
          // Forward progression: only moves forward, never moonwalks backward
          if (calculatedIndex > currentFrameRef.current) {
            currentFrameRef.current = calculatedIndex;
          }

          // When we reach the final frame (this image):
          if (currentFrameRef.current >= totalFrames - 1) {
            hasReachedEndRef.current = true;
            // Auto-reset to beginning after 2 seconds if user is resting on this scene
            if (!autoResetTimerRef.current) {
              autoResetTimerRef.current = setTimeout(() => {
                currentFrameRef.current = 0;
                hasReachedEndRef.current = false;
                autoResetTimerRef.current = null;
              }, 2000);
            }
          }
        }

        targetIndex = currentFrameRef.current;
      }

      // Find nearest loaded frame if current targetIndex is still loading
      let img = imagesCacheRef.current.get(targetIndex);
      if (!img) {
        for (let offset = 1; offset < totalFrames; offset++) {
          if (imagesCacheRef.current.has(targetIndex - offset)) {
            img = imagesCacheRef.current.get(targetIndex - offset);
            break;
          }
          if (imagesCacheRef.current.has(targetIndex + offset)) {
            img = imagesCacheRef.current.get(targetIndex + offset);
            break;
          }
        }
        if (!img) img = imagesCacheRef.current.get(0);
      }

      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Object-cover calculations
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = rect.width / rect.height;
        let drawW = rect.width;
        let drawH = rect.height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawW = rect.width;
          drawH = rect.width / imgRatio;
          offsetX = 0;
          offsetY = (rect.height - drawH) / 2;
        } else {
          drawW = rect.height * imgRatio;
          drawH = rect.height;
          offsetX = (rect.width - drawW) / 2;
          offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      } else {
        // Clean snow background during initial load
        ctx.fillStyle = '#F8FBFF';
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      if (autoResetTimerRef.current) {
        clearTimeout(autoResetTimerRef.current);
        autoResetTimerRef.current = null;
      }
    };
  }, [totalFrames, prefersReducedMotion, scrollYProgress, loadedCount]);

  return (
    <div ref={containerRef} className={cn('relative h-[280vh] w-full', className)}>
      {/* Sticky Fullscreen Viewport - seamlessly releases down as soon as video finishes */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* The 3D Animation Canvas */}
        <canvas
          ref={canvasRef}
          aria-label="3D Classroom Entrance Sequence"
          role="img"
          onClick={() => {
            currentFrameRef.current = 0;
            hasReachedEndRef.current = false;
          }}
          className="absolute inset-0 z-0 w-full h-full block cursor-pointer"
        />

        {/* Subtle top edge fade under navbar */}
        <motion.div
          style={{ opacity: vignetteOpacity }}
          className="absolute inset-x-0 top-0 h-24 z-[1] bg-gradient-to-b from-[#F8FBFF]/60 to-transparent pointer-events-none"
        />

        {/* Interactive 3D Subject Objects orbiting the Penguin (Clickable) */}
        <InteractiveOrbitingObjects scrollYProgress={scrollYProgress} />

        {/* Synced Story Chapter Text Overlays */}
        <ScrollTextOverlays
          scrollYProgress={scrollYProgress}
        />
      </div>
    </div>
  );
}
