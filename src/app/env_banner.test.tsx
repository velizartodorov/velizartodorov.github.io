import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EnvBanner from './env_banner';

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('EnvBanner', () => {
    it('renders the development banner outside production', () => {
        vi.stubEnv('NODE_ENV', 'test');

        render(<EnvBanner />);

        expect(screen.getByText('Local Development Environment')).toBeInTheDocument();
    });

    it('renders nothing in production', () => {
        vi.stubEnv('NODE_ENV', 'production');

        const { container } = render(<EnvBanner />);

        expect(container).toBeEmptyDOMElement();
    });
});
