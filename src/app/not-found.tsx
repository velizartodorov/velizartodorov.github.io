'use client';

import { useEffect } from 'react';

export default function NotFound() {
    useEffect(() => {
        // GitHub Pages serves this static file for any request path with no matching file (e.g.
        // a stale /en/ bookmark - English lives at the root, not /en/). There's no server to
        // rewrite the request, so redirect client-side instead.
        globalThis.location.replace('/');
    }, []);

    return (
        <div className="mx-6 py-16 text-center">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-app-text-muted mt-2">
                <a href="/" className="text-app-link hover:text-app-link-hover transition-colors">
                    Go back home
                </a>
            </p>
        </div>
    );
}
