import type { ReactNode } from 'react';
import { DonemarkTryStrip } from './donemark-try-strip';

// The strip shows only when the app is tried (DONEMARK_TRY=1, set by .devcontainer/compose.yaml).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.DONEMARK_TRY === '1'
          ? <DonemarkTryStrip keyFromServer={process.env.DONEMARK_TRY_KEY || null} baseFromServer={process.env.DONEMARK_URL || null} />
          : null}
      </body>
    </html>
  );
}
