import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound', () => {
    it('renders a synchronous redirect-to-root script', () => {
        // jsdom doesn't execute scripts inserted via dangerouslySetInnerHTML (per spec, only
        // scripts present in the initial HTML parse run automatically), so this checks the
        // script's content rather than observed navigation - same approach layout.test.tsx uses
        // for its GA scripts.
        const { container } = render(<NotFound />);

        expect(container.querySelector('script')).toHaveTextContent("location.replace('/');");
    });

    it('renders a heading and a link back home as a no-JS fallback', () => {
        render(<NotFound />);

        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go back home' })).toHaveAttribute('href', '/');
    });
});
