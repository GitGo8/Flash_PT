// words.js — generates a pool of 500 Portuguese words (placeholders) with English translations
// You can replace this with real words/translations if you prefer.
const WORDS = Array.from({length: 500}, (_, i) => ({
  pt: `palavra ${i + 1}`,
  en: `word ${i + 1}`
}));

// Make available for other scripts when loaded via <script>
window.WORDS = WORDS;
