import { RedirectToRoot } from './redirect_to_root';

export default function NotFound() {
    return (
        <RedirectToRoot>
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-app-text-muted mt-2">
                <a href="/" className="text-app-link hover:text-app-link-hover transition-colors">
                    Go back home
                </a>
            </p>
        </RedirectToRoot>
    );
}
