import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Chevron } from './chevron';

describe('Chevron', () => {
    it('rotates when open', () => {
        const { container, rerender } = render(<Chevron open={false} />);
        expect(container.querySelector('svg')).not.toHaveClass('rotate-180');

        rerender(<Chevron open={true} />);
        expect(container.querySelector('svg')).toHaveClass('rotate-180');
    });

    it('appends the caller-supplied className', () => {
        const { container } = render(<Chevron open={false} className="text-app-text-muted size-5" />);
        expect(container.querySelector('svg')).toHaveClass('text-app-text-muted', 'size-5');
    });
});
