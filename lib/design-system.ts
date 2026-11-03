// THIS APP'S DESIGN SYSTEM, v1: the template's own starting look, plain on purpose. Make it yours.
// Every colour, type size and corner the screens use is defined here once, and nowhere else: every
// screen takes its values from this file, and app/design-system draws every component in every state.
// DoneMark reads this file. Each change to it is a new version of the design system, a tweak included.
// Keep each value a plain `name: value` pair; a value computed some other way is not shown on DoneMark.

export const colour = {
  background: '#F6F6F4',
  surface: '#FFFFFF',
  text: '#1B1B19',
  muted: '#66665F',
  line: '#DCDCD5',
  accent: '#2E5BD8',
  accentPressed: '#2349B3',
  accentSoft: '#E6ECFB',
  onAccent: '#FFFFFF',
  danger: '#B3261E',
} as const;

export const type = {
  family: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  small: 13,
  body: 15,
  title: 20,
  heading: 28,
  regular: '400',
  strong: '600',
} as const;

export const space = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  control: 8,
  card: 12,
  pill: 999,
} as const;
