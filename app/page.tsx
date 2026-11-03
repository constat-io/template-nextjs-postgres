import { colour, space, type } from '../lib/design-system';
import { productName } from './product';

export default function Home() {
  return (
    <main style={{ display: 'grid', gap: space.s, padding: space.xl }}>
      <h1 style={{ fontSize: type.heading, fontWeight: type.strong, margin: 0 }}>{productName()}</h1>
      <p style={{ fontSize: type.body, color: colour.muted, margin: 0 }}>Nothing here is yours yet. The first requirement on the record says what to do about that.</p>
    </main>
  );
}
