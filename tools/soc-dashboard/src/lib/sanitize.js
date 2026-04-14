// XSS Sanitization — DOMPurify wrapper
// Behavioral Rule #8: All user text inputs must be sanitized
import DOMPurify from 'dompurify';

/**
 * Sanitize user input text to prevent XSS attacks
 * @param {string} dirty - Raw user input
 * @returns {string} Sanitized string safe for rendering
 */
export function sanitize(dirty) {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip ALL HTML tags
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize but allow basic formatting (bold, italic, links)
 * For rendered notes/descriptions
 */
export function sanitizeRich(dirty) {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
