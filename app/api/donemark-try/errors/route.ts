// The strip reads the server's errors here, in try mode only (template 49).
export const dynamic = 'force-dynamic';

export function GET(): Response {
  if (process.env.DONEMARK_TRY !== '1') return new Response(null, { status: 404 });
  return Response.json((globalThis as { __donemarkTryErrors?: unknown[] }).__donemarkTryErrors ?? []);
}
