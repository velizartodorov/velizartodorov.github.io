import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Markdown from './markdown';

describe('Markdown', () => {
    it('renders a paragraph and a link', () => {
        render(<Markdown>{'Hello [world](https://example.com)'}</Markdown>);

        expect(screen.getByText(/Hello/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'world' })).toHaveAttribute('href', 'https://example.com');
    });

    it('renders an unordered list', () => {
        render(<Markdown>{'- one\n- two'}</Markdown>);

        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('renders an ordered list', () => {
        render(<Markdown>{'1. first\n2. second'}</Markdown>);

        const list = screen.getByRole('list');
        expect(list.tagName).toBe('OL');
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
});
