import { NextResponse } from 'next/server';

interface LoginBody {
  username: string;
  password: string;
  bookingCode?: string | number;
}

interface ExternalLoginResponse {
  token?: string;
}

export async function POST(req: Request) {
  let body: LoginBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_request_body' }, { status: 400 });
  }

  const { username, password, bookingCode } = body;

  if (!username || !password) {
    return NextResponse.json({ ok: false, reason: 'missing_credentials' }, { status: 400 });
  }

  try {
    const externalRes = await fetch(process.env.LOGIN_API_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

      if (!externalRes.ok) {
      return NextResponse.json({ ok: false, reason: 'auth_failed' }, { status: 401 });
    }

    const externalBody: ExternalLoginResponse = await externalRes.json().catch(() => ({}));
    const sessionToken = externalBody.token ?? `session:${username}:${Date.now()}`;

    const res = NextResponse.json({ ok: true, username });

    res.cookies.set({
      name: 'session',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    if (bookingCode) {
      res.cookies.set({
        name: 'booking',
        value: String(bookingCode),
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
    }

    return res;
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    return NextResponse.json({ ok: false, reason: 'network_or_internal_error' }, { status: 503 });
  }
}