# SOP: Input Sanitization (XSS)

## Goal
Ensure zero possibility of executable cross-site scripting (XSS) payloads being rendered into the DOM, particularly within Incident Descriptions and Analyst Notes (Behavioral Rule #8).

## Technique & Library
We utilize `DOMPurify`, an industry-standard DOM-only, super-fast XSS sanitizer.

### Mode 1: Strict Sanitization (`sanitize`)
- **Usage**: Titles, simple text inputs.
- **Config**: `{ ALLOWED_TAGS: [], ALLOWED_ATTR: [] }`
- **Result**: Strips out absolutely every HTML tag securely.

### Mode 2: Rich Text Sanitization (`sanitizeRich`)
- **Usage**: Analyst Notes, Incident Descriptions where basic readability formatting is required.
- **Config**: `{ ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'], ALLOWED_ATTR: ['href', 'target', 'rel'] }`
- **Result**: Permits `<b>` and `<a>` while completely nullifying `<script>`, `<style>`, `<iframe>`, `onload` attributes, etc.

## Edge Cases
- **Null states**: Wrappers protect against `null` and `undefined` by explicitly returning an empty string `""` before routing through DOMPurify.
- **React injection**: Text sanitized via `sanitizeRich` is injected via `dangerouslySetInnerHTML`. Because DOMPurify evaluates the sanitized string immediately prior to insertion, React’s built-in parsing warnings are actively acknowledged and mitigated safely.
