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
