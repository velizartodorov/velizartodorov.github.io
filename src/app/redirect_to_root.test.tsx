import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { REDIRECT_SCRIPT, RedirectToRoot } from './redirect_to_root';

describe('RedirectToRoot', () => {
    it('renders a synchronous redirect-to-root script', () => {
        // jsdom doesn't execute scripts inserted via dangerouslySetInnerHTML (per spec, only
        // scripts present in the initial HTML parse run automatically), so this checks the
        // script's content rather than observed navigation - same approach not-found.test.tsx and
        // layout.test.tsx use for their scripts.
        const { container } = render(<RedirectToRoot>fallback content</RedirectToRoot>);

        expect(container.querySelector('script')).toHaveTextContent(REDIRECT_SCRIPT);
    });

    it('renders the given fallback content for no-JS visitors', () => {
        render(
            <RedirectToRoot>
                <p>fallback content</p>
            </RedirectToRoot>,
        );

        expect(screen.getByText('fallback content')).toBeInTheDocument();
    });

    it('renders a default English redirecting message when no children are given', () => {
        render(<RedirectToRoot />);

        expect(screen.getByText('Redirecting…')).toBeInTheDocument();
    });

    it('renders a Dutch redirecting message when lang is "nl" and no children are given', () => {
        render(<RedirectToRoot lang="nl" />);

        expect(screen.getByText('Omleiden…')).toBeInTheDocument();
    });
});
