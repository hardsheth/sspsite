import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {  
  const response = await axios.get(
    `${process.env.EXTERNAL_API_URL}/whatsapp`,
  );
  const sessions = response.data;
  return NextResponse.json({
    ...sessions,
  })
}