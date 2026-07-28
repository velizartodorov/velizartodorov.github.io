import { afterEach, describe, expect, it } from 'vitest';
import { isOnOpenPath, pathKey, pickAdvanceCandidate } from './timeline_accordion';

describe('pathKey', () => {
    it('produces equal keys for equal paths and distinct keys for distinct paths', () => {
        expect(pathKey(['a'])).toBe(pathKey(['a']));
        expect(pathKey(['a'])).not.toBe(pathKey(['b']));
        expect(pathKey(['a'])).not.toBe(pathKey(['a', 'b']));
    });
});

describe('isOnOpenPath', () => {
    it('is false when nothing is open', () => {
        expect(isOnOpenPath(['a'], null)).toBe(false);
    });

    it('is true for the open node itself', () => {
        expect(isOnOpenPath(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    it('is true for an ancestor of the open node', () => {
        expect(isOnOpenPath(['a'], ['a', 'b'])).toBe(true);
    });

    it('is false for a sibling of the open node', () => {
        expect(isOnOpenPath(['a', 'c'], ['a', 'b'])).toBe(false);
    });

    it('is false for a descendant of the open node', () => {
        expect(isOnOpenPath(['a', 'b', 'c'], ['a', 'b'])).toBe(false);
    });

    it('is false for an unrelated top-level node', () => {
        expect(isOnOpenPath(['z'], ['a', 'b'])).toBe(false);
    });
});

describe('pickAdvanceCandidate', () => {
    function makeEls(count: number): HTMLElement[] {
        const els: HTMLElement[] = [];
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            document.body.appendChild(el);
            els.push(el);
        }
        return els;
    }

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('returns null when there are no candidates', () => {
        expect(pickAdvanceCandidate([], null)).toBeNull();
    });

    it('picks the earliest candidate in document order when nothing is open yet', () => {
        const [first, second] = makeEls(2);
        const result = pickAdvanceCandidate(
            [
                { path: ['b'], el: second! },
                { path: ['a'], el: first! },
            ],
            null,
        );
        expect(result?.path).toEqual(['a']);
    });

    it('ignores candidates at or before the currently open element', () => {
        // makeEls appends in creation order, so destructuring order IS document order here -
        // before/openEl/after are genuinely in that sequence in the DOM.
        const [before, openEl, after] = makeEls(3);
        const result = pickAdvanceCandidate(
            [
                { path: ['before'], el: before! },
                { path: ['open'], el: openEl! },
                { path: ['after'], el: after! },
            ],
            openEl!,
        );
        expect(result?.path).toEqual(['after']);
    });

    it('returns null when every candidate is at or before the currently open element', () => {
        const [before, openEl] = makeEls(2);
        const result = pickAdvanceCandidate([{ path: ['before'], el: before! }], openEl!);
        expect(result).toBeNull();
    });

    it('picks the earliest of several candidates that all follow the open element', () => {
        const els = makeEls(4);
        const openEl = els[0]!;
        const second = els[2]!;
        const third = els[3]!;
        const result = pickAdvanceCandidate(
            [
                { path: ['third'], el: third },
                { path: ['second'], el: second },
            ],
            openEl,
        );
        expect(result?.path).toEqual(['second']);
    });
});
