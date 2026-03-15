import { NextRequest, NextResponse } from 'next/server';

import { registerVisitor } from '@/lib/visitor-count';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VISITOR_COOKIE = 'sabith_visitor_id';
const TWO_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 2;

export async function GET(request: NextRequest) {
  const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId = existingVisitorId || crypto.randomUUID();

  try {
    const result = await registerVisitor(visitorId);
    const response = NextResponse.json(
      {
        count: result.count,
        persistent: result.persistent,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );

    if (!existingVisitorId) {
      response.cookies.set({
        name: VISITOR_COOKIE,
        value: visitorId,
        httpOnly: true,
        maxAge: TWO_YEARS_IN_SECONDS,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  } catch (error) {
    console.error('visitor_count_error', error);

    return NextResponse.json(
      { error: 'Unable to load visitor count right now.' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  }
}
