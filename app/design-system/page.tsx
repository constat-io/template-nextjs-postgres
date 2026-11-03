import type { CSSProperties, ReactNode } from 'react';
import { colour, radius, space, type } from '../../lib/design-system';

// Every component of this app, in every state, drawn from lib/design-system.ts and nothing else. CI
// photographs this page (journeys/the-design-system-page-opens.journey.mjs). A component a screen needs is
// drawn here first; a look this page does not have is added to lib/design-system.ts, never to the screen.

const note: CSSProperties = { fontSize: type.small, color: colour.muted, margin: 0 };

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'grid', gap: space.m }}>
      <h2 style={{ fontSize: type.title, fontWeight: type.strong, margin: 0 }}>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.xl, alignItems: 'flex-start' }}>{children}</div>
    </section>
  );
}

function State({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: space.xs, justifyItems: 'start' }}>
      {children}
      <p style={note}>{name}</p>
    </div>
  );
}

function button(state: 'ready' | 'pressed' | 'disabled'): CSSProperties {
  return {
    font: 'inherit',
    fontSize: type.body,
    fontWeight: type.strong,
    border: 'none',
    borderRadius: radius.control,
    padding: `${space.s}px ${space.l}px`,
    background: state === 'disabled' ? colour.line : state === 'pressed' ? colour.accentPressed : colour.accent,
    color: state === 'disabled' ? colour.muted : colour.onAccent,
  };
}

function chip(selected: boolean): CSSProperties {
  return {
    fontSize: type.small,
    borderRadius: radius.pill,
    padding: `${space.xs}px ${space.m}px`,
    border: `1px solid ${selected ? colour.accent : colour.line}`,
    background: selected ? colour.accentSoft : colour.surface,
    color: selected ? colour.accent : colour.text,
  };
}

function field(wrong: boolean): CSSProperties {
  return {
    font: 'inherit',
    fontSize: type.body,
    color: colour.text,
    background: colour.surface,
    border: `1px solid ${wrong ? colour.danger : colour.line}`,
    borderRadius: radius.control,
    padding: `${space.s}px ${space.m}px`,
    width: 220,
  };
}

const card: CSSProperties = {
  background: colour.surface,
  border: `1px solid ${colour.line}`,
  borderRadius: radius.card,
  padding: space.l,
  display: 'grid',
  gap: space.xs,
  width: 260,
};

export default function DesignSystem() {
  return (
    <main style={{ display: 'grid', gap: space.xxl, padding: space.xl, maxWidth: 880 }}>
      <header style={{ display: 'grid', gap: space.xs }}>
        <h1 style={{ fontSize: type.heading, fontWeight: type.strong, margin: 0 }}>Design system</h1>
        <p style={{ ...note, fontSize: type.body }}>Every component, in every state, from lib/design-system.ts.</p>
      </header>

      <Group title="Header">
        <div style={{ ...card, width: 'min(560px, 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.m }}>
          <strong style={{ fontSize: type.title }}>A screen’s title</strong>
          <button type="button" style={button('ready')}>Its one action</button>
        </div>
      </Group>

      <Group title="Button">
        <State name="Ready"><button type="button" style={button('ready')}>Save</button></State>
        <State name="Pressed"><button type="button" style={button('pressed')}>Save</button></State>
        <State name="Not possible yet"><button type="button" disabled style={button('disabled')}>Save</button></State>
      </Group>

      <Group title="Chip">
        <State name="Not chosen"><span style={chip(false)}>This week</span></State>
        <State name="Chosen"><span style={chip(true)}>This week</span></State>
      </Group>

      <Group title="Field">
        <State name="Empty"><input aria-label="Name, empty" placeholder="Your name" style={field(false)} /></State>
        <State name="Filled"><input aria-label="Name, filled" defaultValue="Ada Lovelace" style={field(false)} /></State>
        <State name="Wrong">
          <input aria-label="Email, wrong" defaultValue="ada@" aria-invalid style={field(true)} />
          <span style={{ fontSize: type.small, color: colour.danger }}>An email has a name after the @.</span>
        </State>
      </Group>

      <Group title="Card">
        <div style={card}>
          <strong style={{ fontSize: type.body }}>A card’s title</strong>
          <span style={note}>One line about what it holds.</span>
        </div>
      </Group>

      <Group title="List row">
        <div style={{ ...card, padding: 0, gap: 0, width: 'min(420px, 100%)' }}>
          {['First row', 'Second row'].map((name, i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: space.m, padding: `${space.m}px ${space.l}px`, borderTop: i ? `1px solid ${colour.line}` : 'none' }}>
              <span style={{ flex: 1, fontSize: type.body }}>{name}</span>
              <span style={note}>Detail</span>
              <span aria-hidden style={{ color: colour.muted }}>›</span>
            </div>
          ))}
        </div>
      </Group>

      <Group title="Tab bar">
        <nav style={{ display: 'flex', gap: space.xs, background: colour.surface, border: `1px solid ${colour.line}`, borderRadius: radius.card, padding: space.xs }}>
          {['Home', 'Search', 'You'].map((name, i) => (
            <span key={name} aria-current={i === 0 ? 'page' : undefined} style={{ fontSize: type.small, fontWeight: i === 0 ? type.strong : type.regular, padding: `${space.s}px ${space.l}px`, borderRadius: radius.control, background: i === 0 ? colour.accentSoft : 'transparent', color: i === 0 ? colour.accent : colour.muted }}>{name}</span>
          ))}
        </nav>
      </Group>
    </main>
  );
}
