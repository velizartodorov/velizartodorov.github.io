import { RefObject, useEffect } from 'react';
import { STICKY_NAV_OFFSET_PX } from './nav_metrics';

const ENTRY_RAMP_FRACTION = 0.3;
const EXIT_RAMP_FRACTION = 0.2;

function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}

function computeOpacity(rect: { top: number; bottom: number }, viewportHeight: number): number {
    const entryRampStart = viewportHeight;
    const entryRampEnd = viewportHeight * (1 - ENTRY_RAMP_FRACTION);
    const entryProgress = clamp01((entryRampStart - rect.top) / (entryRampStart - entryRampEnd));

    const exitRampStart = STICKY_NAV_OFFSET_PX + viewportHeight * EXIT_RAMP_FRACTION;
    const exitRampEnd = STICKY_NAV_OFFSET_PX;
    const exitProgress = clamp01((rect.bottom - exitRampEnd) / (exitRampStart - exitRampEnd));

    return Math.min(entryProgress, exitProgress);
}

export function useScrollFade(ref: RefObject<HTMLElement | null>): void {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.style.opacity = '1';
            return;
        }

        let frame: number | null = null;
        let scheduled = false;

        const recompute = () => {
            scheduled = false;
            frame = null;
            el.style.opacity = String(computeOpacity(el.getBoundingClientRect(), window.innerHeight));
        };

        const scheduleRecompute = () => {
            if (scheduled) return;
            scheduled = true;
            frame = requestAnimationFrame(recompute);
        };

        let listening = false;
        const startListening = () => {
            if (listening) return;
            listening = true;
            window.addEventListener('scroll', scheduleRecompute, { passive: true });
            window.addEventListener('resize', scheduleRecompute);
            scheduleRecompute();
        };
        const stopListening = () => {
            if (!listening) return;
            listening = false;
            window.removeEventListener('scroll', scheduleRecompute);
            window.removeEventListener('resize', scheduleRecompute);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) startListening();
                else stopListening();
            },
            { rootMargin: '100% 0px 100% 0px', threshold: 0 },
        );
        observer.observe(el);
        recompute();

        return () => {
            observer.disconnect();
            if (frame !== null) cancelAnimationFrame(frame);
            stopListening();
        };
    }, [ref]);
}
