import React from 'react';

const REDIRECT_SCRIPT = `location.replace('/');`;

export function RedirectToRoot({ children }: Readonly<{ children?: React.ReactNode }>) {
    return (
        <div className="mx-6 py-16 text-center">
            <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
            {children ?? <p className="text-app-text-muted">Redirecting…</p>}
        </div>
    );
}
