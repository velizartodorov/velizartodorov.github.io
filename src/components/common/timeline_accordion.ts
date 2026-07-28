// A collapsible node's identity in the shared accordion: [entryId] for a TimelineEntry, or
// [entryId, rowId] for a nested TimelineRow.
export type NodePath = string[];

export function pathKey(path: NodePath): string {
    return JSON.stringify(path);
}

// True when `path` is on the currently open path - either the open node itself, or one of its
// ancestors. A branch entry (one with nested rows) needs this to stay "revealed" (structurally
// expanded) while one of its own rows is the actual open leaf, since the row can't be visible at
// all unless its parent's own grid-template-rows wrapper is expanded.
export function isOnOpenPath(path: NodePath, openPath: NodePath | null): boolean {
    if (!openPath || path.length > openPath.length) return false;
    return path.every((segment, i) => segment === openPath[i]);
}

export interface AccordionCandidate {
    path: NodePath;
    el: Element;
}

// Among the candidates that entered the accordion band on this observer tick, pick the single
// node to advance the open pointer to: the earliest one in document order that comes after
// `openEl` (or, if nothing is open yet, the earliest of all candidates). Returns null when no
// candidate qualifies - every candidate is at or before the currently open node, which is exactly
// what keeps scrolling back up from reopening anything already passed.
export function pickAdvanceCandidate(
    candidates: AccordionCandidate[],
    openEl: Element | null,
): AccordionCandidate | null {
    let best: AccordionCandidate | null = null;
    for (const candidate of candidates) {
        if (openEl) {
            const relation = openEl.compareDocumentPosition(candidate.el);
            const follows = Boolean(relation & Node.DOCUMENT_POSITION_FOLLOWING);
            if (!follows) continue;
        }
        if (!best) {
            best = candidate;
            continue;
        }
        const relation = best.el.compareDocumentPosition(candidate.el);
        const candidatePrecedesBest = Boolean(relation & Node.DOCUMENT_POSITION_PRECEDING);
        if (candidatePrecedesBest) best = candidate;
    }
    return best;
}
