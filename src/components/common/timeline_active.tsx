'use client';

import {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';

interface TimelineActiveCtx {
    activeKey: string | null;
    register: (key: string, el: HTMLElement) => void;
    unregister: (key: string) => void;
}

const NOOP: TimelineActiveCtx = { activeKey: null, register: () => {}, unregister: () => {} };

const TimelineActiveContext = createContext<TimelineActiveCtx | null>(null);

export function useTimelineActive(): TimelineActiveCtx {
    return useContext(TimelineActiveContext) ?? NOOP;
}

export function useTimelineRegistration() {
    const { activeKey, register, unregister } = useTimelineActive();
    const key = useId();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        register(key, el);
        return () => unregister(key);
    }, [key, register, unregister]);

    return { ref, isActive: activeKey === key };
}

export const TimelineActiveProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const elementsRef = useRef(new Map<string, HTMLElement>());
    const observerRef = useRef<IntersectionObserver | null>(null);

    const updateActive = useCallback(() => {
        const viewportCentre = window.innerHeight / 2;
        let bestKey: string | null = null;
        let bestDistance = Infinity;
        for (const [key, el] of elementsRef.current) {
            const rect = el.getBoundingClientRect();
            if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
            const distance = Math.abs(rect.top + rect.height / 2 - viewportCentre);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestKey = key;
            }
        }
        setActiveKey(bestKey);
    }, []);

    const getObserver = useCallback((): IntersectionObserver => {
        observerRef.current ??= new IntersectionObserver(() => updateActive(), { threshold: 0 });
        return observerRef.current;
    }, [updateActive]);

    const register = useCallback(
        (key: string, el: HTMLElement) => {
            elementsRef.current.set(key, el);
            getObserver().observe(el);
            updateActive();
        },
        [getObserver, updateActive],
    );

    const unregister = useCallback((key: string) => {
        const el = elementsRef.current.get(key);
        if (el) observerRef.current?.unobserve(el);
        elementsRef.current.delete(key);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', updateActive, { passive: true });
        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
            window.removeEventListener('scroll', updateActive);
        };
    }, [updateActive]);

    const value = useMemo<TimelineActiveCtx>(
        () => ({ activeKey, register, unregister }),
        [activeKey, register, unregister],
    );

    return <TimelineActiveContext.Provider value={value}>{children}</TimelineActiveContext.Provider>;
};
