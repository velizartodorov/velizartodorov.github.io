import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { AccordionProvider } from '../components/common/accordion_provider';
import { Timeline, TimelineEntry } from '../components/common/timeline';

// Renders children inside a real Timeline > TimelineEntry, which TimelineRow/TimelineRail require
// as their EntryIdContext provider - a row's accordion path is [entryId, rowId], which has no
// meaning without a parent entry. Also wraps in a real AccordionProvider, which TimelineEntry's
// (and TimelineRow's) useTimelineNode requires.
export function renderInTimelineEntry(children: ReactNode) {
    return render(
        <AccordionProvider>
            <Timeline>
                <TimelineEntry id="entry" icon={{ src: '/icon.png', alt: 'icon' }} header="entry header">
                    {children}
                </TimelineEntry>
            </Timeline>
        </AccordionProvider>,
    );
}
