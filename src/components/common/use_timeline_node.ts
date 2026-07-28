import { RefObject, useContext, useEffect, useState } from 'react';
import { AccordionContext } from './accordion_provider';
import { isOnOpenPath, NodePath, pathKey } from './timeline_accordion';

export interface UseTimelineNodeControls {
    // Whether the caller should render this node at its natural height/opacity: true while it's
    // on the shared Timeline accordion's open path (itself or an ancestor of the actual open leaf
    // node), until a chevron click hands permanent, independent ownership to a manual pin.
    revealed: boolean;
    // Toggles based on the node's *current* visible state (`revealed`), not a separate pinned
    // flag - so clicking a chevron on content that's already open (whether via the accordion or
    // an earlier pin) closes it on that very first click. The first call also hands this node's
    // revealed state over to the pin permanently - every toggle after that is a real, independent
    // open/close, unaffected by where the accordion pointer goes from then on.
    togglePin: () => void;
}

// Registers `ref`'s element with the shared Timeline accordion under `path` ([entryId] for a
// TimelineEntry, [entryId, rowId] for a nested TimelineRow), and drives that node's open/closed
// state - see docs/superpowers/specs/2026-07-30-timeline-scroll-accordion-design.md. `ref` must be
// the node's own always-full-height root (marker/header/chevron never collapse), never a wrapper
// that's itself clipped to zero size while collapsed - such an element could never report
// intersecting, and could never trigger its own reveal.
export function useTimelineNode(path: NodePath, ref: RefObject<HTMLElement | null>): UseTimelineNodeControls {
    const ctx = useContext(AccordionContext);
    if (!ctx) throw new Error('useTimelineNode must be used within an AccordionProvider');
    const { registerNode, unregisterNode, openPath } = ctx;

    const [hasBeenToggled, setHasBeenToggled] = useState(false);
    const [manuallyPinned, setManuallyPinned] = useState(false);

    const pathDepKey = pathKey(path);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        registerNode(path, el);
        return () => unregisterNode(path);
        // path is represented below by pathDepKey (a stable string), not the array itself - a
        // fresh array literal each render would otherwise tear the registration down and rebuild
        // it on every re-render. (No eslint-disable needed: this repo's eslint config doesn't
        // load eslint-plugin-react-hooks, so exhaustive-deps isn't enforced here.)
    }, [pathDepKey, ref, registerNode, unregisterNode]);

    const onOpenPath = isOnOpenPath(path, openPath);
    const revealed = hasBeenToggled ? manuallyPinned : onOpenPath;

    const togglePin = () => {
        setHasBeenToggled(true);
        setManuallyPinned(!revealed);
    };

    return { revealed, togglePin };
}
