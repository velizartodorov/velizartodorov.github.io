const matter = require('gray-matter');

// Strips exactly the one structural newline gray-matter leaves right after the closing `---`
// and the one trailing newline at EOF - NOT a general .trim(), which would also eat a
// meaningful trailing blank line (e.g. a blank spacer before a "References" section).
function stripStructuralNewlines(content) {
    return content.replace(/^\n/, '').replace(/\n$/, '');
}

module.exports = function markdownFrontmatterLoader(source) {
    const { data, content } = matter(source);
    return `export default ${JSON.stringify({ ...data, body: stripStructuralNewlines(content) })};`;
};

module.exports.stripStructuralNewlines = stripStructuralNewlines;
