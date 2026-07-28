import { RefObject, useEffect } from 'react';

// Fraction of viewport height the entry ramp spans (bottom of viewport upward).
const ENTRY_RATIO = 0.3;
// Fraction of viewport height the exit ramp spans (top of viewport downward).
const EXIT_RATIO = 0.2;
// Mirrors useActiveSection's -96px bias for the sticky nav's height, so an element only starts
// fading out once it's genuinely passing under the nav.
const NAV_OFFSET_PX = 96;

function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}

function computeOpacity(rect: { top: number; bottom: number }, viewportHeight: number): number {
    const entryStart = viewportHeight;
    const entryEnd = viewportHeight * (1 - ENTRY_RATIO);
    const entryProgress = clamp01((entryStart - rect.top) / (entryStart - entryEnd));

    const exitStart = NAV_OFFSET_PX + viewportHeight * EXIT_RATIO;
    const exitEnd = NAV_OFFSET_PX;
    const exitProgress = clamp01((rect.bottom - exitEnd) / (exitStart - exitEnd));

    return Math.min(entryProgress, exitProgress);
}

// Continuously fades an element's opacity in/out based on its position in the viewport. Used only
// by Section now - TimelineEntry/TimelineRow's collapsed-by-default, scroll-driven-accordion
// behavior lives in useTimelineNode instead (see
// docs/superpowers/specs/2026-07-30-timeline-scroll-accordion-design.md), which has no use for a
// continuous ramp.
export function useScrollFade(ref: RefObject<HTMLElement | null>): void {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            el.style.opacity = '1';
            return;
        }

        let frame: number | null = null;
        let scheduled = false;
        let gated = false;

        const recompute = () => {
            scheduled = false;
            frame = null;
            const rect = el.getBoundingClientRect();
            el.style.opacity = String(computeOpacity(rect, window.innerHeight));
        };

        const scheduleRecompute = () => {
            if (scheduled) return;
            scheduled = true;
            frame = requestAnimationFrame(recompute);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const isNear = entries.some((entry) => entry.isIntersecting);
                if (isNear && !gated) {
                    gated = true;
                    window.addEventListener('scroll', scheduleRecompute, { passive: true });
                    window.addEventListener('resize', scheduleRecompute);
                    scheduleRecompute();
                } else if (!isNear && gated) {
                    gated = false;
                    window.removeEventListener('scroll', scheduleRecompute);
                    window.removeEventListener('resize', scheduleRecompute);
                }
            },
            { rootMargin: '100% 0px 100% 0px', threshold: 0 },
        );
        observer.observe(el);
        recompute();

        return () => {
            observer.disconnect();
            if (frame !== null) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', scheduleRecompute);
            window.removeEventListener('resize', scheduleRecompute);
        };
    }, [ref]);
}
