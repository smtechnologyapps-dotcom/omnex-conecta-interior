import { NextResponse } from 'next/server';
import navigationFlow from '@/public/navigation_flow.json';

export async function GET() {
  return NextResponse.json(navigationFlow, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'application/json',
    },
  });
}
