import { FC } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';

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
