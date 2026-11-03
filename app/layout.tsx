import type { ReactNode } from 'react';
import { colour, type } from '../lib/design-system';
import { DonemarkTryStrip } from './donemark-try-strip';

// The strip shows only when the app is tried (DONEMARK_TRY=1, set by .devcontainer/compose.yaml).
// Every page sits on the design system's ground, in its type (lib/design-system.ts).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: colour.background, color: colour.text, fontFamily: type.family }}>
        {children}
        {process.env.DONEMARK_TRY === '1'
          ? <DonemarkTryStrip keyFromServer={process.env.DONEMARK_TRY_KEY || null} baseFromServer={process.env.DONEMARK_URL || null} />
          : null}
      </body>
    </html>
  );
}
