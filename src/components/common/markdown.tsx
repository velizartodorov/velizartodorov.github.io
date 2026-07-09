import { FC } from 'react';
import ReactMarkdown from 'react-markdown';

// Employment/education body text is authored as markdown (see src/translations/**/*.md); this
// wrapper restores the list/paragraph spacing that Tailwind's preflight otherwise zeroes out, so
// bullet lists and section breaks stay visually distinct like they were before the migration off
// hand-rolled "\n".split()+<br/> rendering.
const Markdown: FC<{ children: string }> = ({ children }) => (
    <ReactMarkdown
        components={{
            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
            ul: ({ node, ...props }) => <ul className="mb-3 list-disc space-y-px pl-5 last:mb-0" {...props} />,
            ol: ({ node, ...props }) => <ol className="mb-3 list-decimal space-y-px pl-5 last:mb-0" {...props} />,
            a: ({ node, ...props }) => (
                <a className="text-app-link hover:text-app-link-hover transition-colors" {...props} />
            ),
        }}
    >
        {children}
    </ReactMarkdown>
);

export default Markdown;
