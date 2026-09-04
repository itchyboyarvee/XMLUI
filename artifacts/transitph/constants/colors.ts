/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#14213d',
    tint: '#ff7a45',
    background: '#f5f7f6',
    foreground: '#14213d',
    card: '#ffffff',
    cardForeground: '#14213d',
    primary: '#ff7a45',
    primaryForeground: '#ffffff',
    secondary: '#e7f4ee',
    secondaryForeground: '#1c6b59',
    muted: '#e7ecec',
    mutedForeground: '#6f7e83',
    accent: '#b8e9d5',
    accentForeground: '#145c4a',
    destructive: '#d94c55',
    destructiveForeground: '#ffffff',
    border: '#d8e2e1',
    input: '#d8e2e1',
  },
  dark: {
    text: '#f7faf8',
    tint: '#ff8a55',
    background: '#0d1b2a',
    foreground: '#f7faf8',
    card: '#142b3d',
    cardForeground: '#f7faf8',
    primary: '#ff8a55',
    primaryForeground: '#17202d',
    secondary: '#173f43',
    secondaryForeground: '#a8f0d5',
    muted: '#193044',
    mutedForeground: '#a6b7bb',
    accent: '#41c99a',
    accentForeground: '#071b1d',
    destructive: '#f16b72',
    destructiveForeground: '#ffffff',
    border: '#244356',
    input: '#2a4a5c',
  },
  radius: 8,
};

export default colors;
