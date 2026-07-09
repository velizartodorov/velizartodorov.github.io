const matter = require('gray-matter');

// Strips exactly the one structural newline gray-matter leaves right after the closing `---`
// and the one trailing newline at EOF - NOT a general .trim(), which would also eat a
// meaningful trailing blank line (e.g. a blank spacer before a "References" section).
function stripStructuralNewlines(content) {
    return content.replace(/^\n/, '').replace(/\n$/, '');
}

// Shared by both the webpack/Turbopack loader below and vitest.config.ts's mirrored transform,
// so the two can't silently diverge (as happened when only one side normalized CRLF - see the
// comment below). On Windows checkouts (core.autocrlf) these *.md files have \r\n on disk, which
// would otherwise break the LF-only POSITION_DELIMITER split in build-resources.ts.
function parseFrontmatter(source) {
    return matter(source.replaceAll('\r\n', '\n'));
}

module.exports = function markdownFrontmatterLoader(source) {
    const { data, content } = parseFrontmatter(source);
    return `export default ${JSON.stringify({ ...data, body: stripStructuralNewlines(content) })};`;
};

module.exports.stripStructuralNewlines = stripStructuralNewlines;
module.exports.parseFrontmatter = parseFrontmatter;
