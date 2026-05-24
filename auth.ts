import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('lbs_admin_token')?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
}
