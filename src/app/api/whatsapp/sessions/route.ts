import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = await axios.post(
    `${process.env.EXTERNAL_API_URL}/whatsapp/session`,
  );
  const sessions = response.data;
  console.log(response, `api response`);
  
  return NextResponse.json({
    ...sessions,
  })
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  console.log(sessionId, 'sessionId');
  
  const response = await axios.get(
    `${process.env.EXTERNAL_API_URL}/whatsapp/session/${sessionId}/qr`,
  );
  const sessions = response.data;
  return NextResponse.json({
    ...sessions,
  })
}