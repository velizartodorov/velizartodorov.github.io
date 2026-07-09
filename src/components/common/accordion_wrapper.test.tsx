import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccordionWrapper from './accordion_wrapper';

describe('AccordionWrapper', () => {
    it('renders the title and children open by default', () => {
        render(
            <AccordionWrapper title="My Section">
                <p>section content</p>
            </AccordionWrapper>,
        );

        expect(screen.getByRole('heading', { level: 4, name: 'My Section' })).toBeInTheDocument();
        expect(screen.getByText('section content')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses and re-expands when the header is clicked', async () => {
        render(
            <AccordionWrapper title="My Section">
                <p>section content</p>
            </AccordionWrapper>,
        );

        const button = screen.getByRole('button');
        await userEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'false');

        await userEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
    });
});
