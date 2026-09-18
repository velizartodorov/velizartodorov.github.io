import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { Timeline } from '../components/common/timeline';
import { TimelineActiveProvider } from '../components/common/timeline_active';

// Renders children inside a real TimelineActiveProvider > Timeline, which TimelineEntry-based
// components (EmploymentItem, LicenseCertificationItem, EducationItem) require as their context
// providers - mirroring how App.tsx wraps every section.
export function renderInTimeline(children: ReactNode) {
    return render(
        <TimelineActiveProvider>
            <Timeline>{children}</Timeline>
        </TimelineActiveProvider>,
    );
}
