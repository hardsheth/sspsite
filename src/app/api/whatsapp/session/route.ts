import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = await axios.post(
    `${process.env.EXTERNAL_API_URL}/whatsapp/session`,
  );
  const sessions = response.data;
  console.log(sessions, `api response`);

  return NextResponse.json({
    ...sessions,
  })
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  const setQr = request.nextUrl.searchParams.get('setSession') || undefined;
  if (!setQr) {
    console.log(`${process.env.EXTERNAL_API_URL}/whatsapp/session/${sessionId}/qr`, sessionId, 'sessionId');

    const response = await axios.get(
      `${process.env.EXTERNAL_API_URL}/whatsapp/session/${sessionId}/qr`,
    );
    const sessions = response.data;
    return NextResponse.json({
      ...sessions,
    })
  } else {
    console.log(`${process.env.EXTERNAL_API_URL}/whatsapp/session/${sessionId}/set ------------------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`,);

    const response = await axios.get(
      `${process.env.EXTERNAL_API_URL}/whatsapp/session/${sessionId}/set`,
    );
    const sessions = response.data;
    return NextResponse.json({
      ...sessions,
    })
  }
}

export async function DELETE(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');

  const response = await axios.delete(
    `${process.env.EXTERNAL_API_URL}/whatsapp/session/${sessionId}`,
  );
  const sessions = response.data;
  return NextResponse.json({
    ...sessions,
  })
}