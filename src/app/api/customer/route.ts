import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export default async function POST(request: NextRequest) {
  // Placeholder for signup logic
  return NextResponse.json({ message: 'Signup endpoint' });
}


export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const size = url.searchParams.get('size');

  const params: any = {};
  if (page) params.page = page;
  if (size) params.limit = size;

  const response = await axios.get(`${process.env.EXTERNAL_API_URL}/customer`, {
    params,
  });
  const customers = response.data;
  return NextResponse.json({
    ...customers,
  })
}