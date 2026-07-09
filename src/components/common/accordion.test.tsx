import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccordionGroup, AccordionItem } from './accordion';

describe('AccordionGroup / AccordionItem', () => {
    it('renders all items closed by default', () => {
        render(
            <AccordionGroup>
                <AccordionItem eventKey="a" header="Item A">
                    content A
                </AccordionItem>
                <AccordionItem eventKey="b" header="Item B">
                    content B
                </AccordionItem>
            </AccordionGroup>,
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
        expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');
    });

    it('opening one item closes any other open item', async () => {
        render(
            <AccordionGroup>
                <AccordionItem eventKey="a" header="Item A">
                    content A
                </AccordionItem>
                <AccordionItem eventKey="b" header="Item B">
                    content B
                </AccordionItem>
            </AccordionGroup>,
        );

        const [buttonA, buttonB] = screen.getAllByRole('button');

        await userEvent.click(buttonA!);
        expect(buttonA).toHaveAttribute('aria-expanded', 'true');
        expect(buttonB).toHaveAttribute('aria-expanded', 'false');

        await userEvent.click(buttonB!);
        expect(buttonA).toHaveAttribute('aria-expanded', 'false');
        expect(buttonB).toHaveAttribute('aria-expanded', 'true');
    });

    it('clicking the open item closes it', async () => {
        render(
            <AccordionGroup>
                <AccordionItem eventKey="a" header="Item A">
                    content A
                </AccordionItem>
            </AccordionGroup>,
        );

        const button = screen.getByRole('button');
        await userEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');

        await userEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('throws when an AccordionItem is rendered outside an AccordionGroup', () => {
        // Suppress React's expected error-boundary console noise for this intentionally-thrown case.
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() =>
            render(
                <AccordionItem eventKey="a" header="Item A">
                    content
                </AccordionItem>,
            ),
        ).toThrow('AccordionItem must be used within an AccordionGroup');

        consoleError.mockRestore();
    });
});
