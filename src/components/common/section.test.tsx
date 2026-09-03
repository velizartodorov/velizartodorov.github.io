import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import Section from './section';

describe('Section', () => {
    it('renders the title and children, with no toggle button', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        render(
            <Section title="My Section">
                <p>section content</p>
            </Section>,
        );

        expect(screen.getByRole('heading', { level: 4, name: 'My Section' })).toBeInTheDocument();
        expect(screen.getByText('section content')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders with the given id', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        const { container } = render(
            <Section title="My Section" id="my-section">
                <p>section content</p>
            </Section>,
        );

        expect(container.querySelector('#my-section')).not.toBeNull();
    });
});
