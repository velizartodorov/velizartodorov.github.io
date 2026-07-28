import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { Timeline, TimelineEntry } from '../components/common/timeline';
import { TimelineActiveProvider } from '../components/common/timeline_active';

// Renders children inside a real TimelineActiveProvider > Timeline > TimelineEntry, which
// TimelineRow/TimelineRail require as their EntryIdContext provider - a TimelineRow asserts it is
// rendered within a TimelineEntry.
export function renderInTimelineEntry(children: ReactNode) {
    return render(
        <TimelineActiveProvider>
            <Timeline>
                <TimelineEntry id="entry" icon={{ src: '/icon.png', alt: 'icon' }} header="entry header">
                    {children}
                </TimelineEntry>
            </Timeline>
        </TimelineActiveProvider>,
    );
}
