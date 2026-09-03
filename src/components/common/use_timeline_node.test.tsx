import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTimelineNode } from './use_timeline_node';

describe('useTimelineNode', () => {
    it('starts collapsed', () => {
        const { result } = renderHook(() => useTimelineNode());
        expect(result.current.revealed).toBe(false);
    });

    it('toggles revealed open, then closed again', () => {
        const { result } = renderHook(() => useTimelineNode());

        act(() => result.current.toggle());
        expect(result.current.revealed).toBe(true);

        act(() => result.current.toggle());
        expect(result.current.revealed).toBe(false);
    });

    it('tracks each node independently', () => {
        const { result } = renderHook(() => ({
            first: useTimelineNode(),
            second: useTimelineNode(),
        }));

        act(() => result.current.first.toggle());

        expect(result.current.first.revealed).toBe(true);
        expect(result.current.second.revealed).toBe(false);
    });
});
