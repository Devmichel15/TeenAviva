// Metrics shared between the floating bottom navigation bar
// (src/components/navbar/Navbar.jsx) and the screens that must clear it.
export const NAVBAR_BOTTOM_MARGIN = 10;
export const NAVBAR_HEIGHT = 68;
export const NAVBAR_BOTTOM_CLEARANCE =
  NAVBAR_BOTTOM_MARGIN + NAVBAR_HEIGHT + 6;

// Natural gap left between the chat composer and the keyboard while the IME
// is visible. When the keyboard is closed the composer rests on the real
// device safe-area inset instead.
export const COMPOSER_KEYBOARD_GAP = 8;
