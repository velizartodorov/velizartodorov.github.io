import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileItem from './profile_item';

describe('ProfileItem', () => {
    it('renders as a link when the link has a url', () => {
        render(<ProfileItem link={{ label: 'GitHub', icon: '/gh.png', width: 40, url: 'https://github.com/x' }} />);

        expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/x');
    });

    it('renders as plain (non-linked) text when the link has no url', () => {
        render(<ProfileItem link={{ label: 'Ghent, Belgium', icon: '/house.png', width: 45 }} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.getByText('Ghent, Belgium')).toBeInTheDocument();
    });
});
