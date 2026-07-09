import { FC } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';

// Employment/education body text is authored as markdown (see src/translations/**/*.md); this
// wrapper restores the list/paragraph spacing that Tailwind's preflight otherwise zeroes out, so
// bullet lists and section breaks stay visually distinct like they were before the migration off
// hand-rolled "\n".split()+<br/> rendering.
//
// Defined at module scope (rather than inline in Markdown's body) so this object literal - and
// its renderer functions - aren't recreated on every render.
const components: Components = {
    p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
    ul: ({ node, ...props }) => <ul className="mb-3 list-disc space-y-px pl-5 last:mb-0" {...props} />,
    ol: ({ node, ...props }) => <ol className="mb-3 list-decimal space-y-px pl-5 last:mb-0" {...props} />,
    a: ({ node, ...props }) => <a className="text-app-link hover:text-app-link-hover transition-colors" {...props} />,
};

const Markdown: FC<{ children: string }> = ({ children }) => (
    <ReactMarkdown components={components}>{children}</ReactMarkdown>
);

export default Markdown;
