/**
 * Emoji to MDI Icon Mapping
 * Maps emojis used in the project to corresponding MDI icon class names
 */

export const emojiToMdi = {
  // Navigation icons
  '🎯': 'mdi-bullseye',
  '📊': 'mdi-chart-bar',

  // Mode icons
  '⚡': 'mdi-flash',

  // Result icons
  '🎉': 'mdi-party-popper',
  '❌': 'mdi-close-circle',
  '⏰': 'mdi-clock-alert',

  // Training page icons
  '🚀': 'mdi-rocket-launch',
  '📖': 'mdi-book-open-outline',
  '⚠️': 'mdi-alert',
  '⏱️': 'mdi-timer-outline',
  '🔄': 'mdi-refresh',
  '🏠': 'mdi-home',

  // Other icons that might be used
  '✨': 'mdi-star-face',
  '⭐': 'mdi-star',
  '🏆': 'mdi-trophy',
  '🔥': 'mdi-fire',
  '👑': 'mdi-crown',
}

/**
 * Convert emoji to MDI icon class
 * @param {string} emoji - The emoji to convert
 * @returns {string} The MDI icon class name, or the original emoji if not found
 */
export function emojiToIcon(emoji) {
  return emojiToMdi[emoji] || emoji
}
