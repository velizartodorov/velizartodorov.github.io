import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChevronToggleButton from './chevron_toggle_button';

describe('ChevronToggleButton', () => {
    it('reflects the closed state and calls onToggle when clicked', async () => {
        const onToggle = vi.fn();
        render(<ChevronToggleButton open={false} onToggle={onToggle} />);

        const button = screen.getByRole('button', { name: 'Expand' });
        expect(button).toHaveAttribute('aria-expanded', 'false');

        await userEvent.click(button);
        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('reflects the open state', () => {
        render(<ChevronToggleButton open={true} onToggle={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Collapse' })).toHaveAttribute('aria-expanded', 'true');
    });
});
