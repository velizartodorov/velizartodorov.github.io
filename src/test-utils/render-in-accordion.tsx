import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { AccordionGroup } from '../components/common/accordion';

// Renders children inside a real AccordionGroup, which AccordionItem-based components
// (EmploymentItem, LicenseCertificationItem, EducationItem) require as their context provider.
export function renderInAccordion(children: ReactNode) {
    return render(<AccordionGroup>{children}</AccordionGroup>);
}
