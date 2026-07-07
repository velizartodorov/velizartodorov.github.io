// Shared hover/focus treatment for clickable rows in the presentation/license/language lists.
// Padding is left to each caller since it differs slightly between them.
export const HOVER_ROW = 'hover:bg-app-surface-alt rounded-lg transition-colors';
export const HOVER_ROW_LINK = `${HOVER_ROW} focus:bg-app-surface-alt block hover:no-underline focus:no-underline text-app-link hover:text-app-link-hover`;
