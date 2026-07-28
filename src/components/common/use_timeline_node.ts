import { useState } from 'react';

export interface UseTimelineNodeControls {
    revealed: boolean;
    toggle: () => void;
}

export function useTimelineNode(): UseTimelineNodeControls {
    const [revealed, setRevealed] = useState(false);
    const toggle = () => setRevealed((open) => !open);
    return { revealed, toggle };
}
