import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { AccordionProvider } from '../components/common/accordion_provider';
import { Timeline } from '../components/common/timeline';

// Renders children inside a real Timeline, which TimelineEntry-based components
// (EmploymentItem, LicenseCertificationItem, EducationItem) require as their context provider.
// Also wraps in a real AccordionProvider, which TimelineEntry's useTimelineNode requires.
export function renderInTimeline(children: ReactNode) {
    return render(
        <AccordionProvider>
            <Timeline>{children}</Timeline>
        </AccordionProvider>,
    );
}
