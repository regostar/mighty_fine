/**
 * utils/loremGen.js
 *
 * Provides a function to return random "lorem ipsum" text.
 */

const LOREM_TEXTS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.'
];

function generateLoremIpsum() {
  const index = Math.floor(Math.random() * LOREM_TEXTS.length);
  return LOREM_TEXTS[index];
}

module.exports = {
  generateLoremIpsum
};
