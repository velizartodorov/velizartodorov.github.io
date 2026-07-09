import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound', () => {
    it('renders a heading and a link back home', () => {
        render(<NotFound />);

        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go back home' })).toHaveAttribute('href', '/');
    });
});
