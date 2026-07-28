// GitHub Pages serves this static file for any request path with no matching file (e.g. a
// stale /en/ bookmark - English lives at the root, not /en/). There's no server to rewrite the
// request, so redirect via a plain synchronous script instead of a useEffect: it runs while the
// browser is still parsing this HTML, before the "Page not found" content below ever paints
// (same trick layout.tsx's THEME_INIT_SCRIPT uses to avoid a flash of the wrong theme) - a
// useEffect only fires after React hydrates, which is late enough to be visible as a flash.
const REDIRECT_SCRIPT = `location.replace('/');`;

export default function NotFound() {
    return (
        <div className="mx-6 py-16 text-center">
            <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-app-text-muted mt-2">
                <a href="/" className="text-app-link hover:text-app-link-hover transition-colors">
                    Go back home
                </a>
            </p>
        </div>
    );
}
