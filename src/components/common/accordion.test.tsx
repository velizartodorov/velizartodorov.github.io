import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccordionGroup, AccordionItem } from './accordion';

describe('AccordionGroup / AccordionItem', () => {
    function renderTwoItems() {
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
        const [a, b] = screen.getAllByRole('button');
        return { a: a!, b: b! };
    }

    it.each([
        { name: 'closed by default (no clicks)', clicks: [], expected: { a: 'false', b: 'false' } },
        { name: 'opening item A opens it and leaves B closed', clicks: ['a'], expected: { a: 'true', b: 'false' } },
        {
            name: 'opening item B closes A and opens B',
            clicks: ['a', 'b'],
            expected: { a: 'false', b: 'true' },
        },
        {
            name: 'clicking the open item again closes it',
            clicks: ['a', 'a'],
            expected: { a: 'false', b: 'false' },
        },
    ])('$name', async ({ clicks, expected }) => {
        const buttons = renderTwoItems();

        for (const key of clicks as Array<'a' | 'b'>) {
            await userEvent.click(buttons[key]);
        }

        expect(buttons.a).toHaveAttribute('aria-expanded', expected.a);
        expect(buttons.b).toHaveAttribute('aria-expanded', expected.b);
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
