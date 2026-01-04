import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export default async function POST(request: NextRequest) {
  // Placeholder for signup logic
  return NextResponse.json({ message: 'Signup endpoint' });
}


export async function GET(request: NextRequest) {
  const response = await axios.get(
    `${process.env.EXTERNAL_API_URL}/customer`,
  );
  const customers = response.data;
  return NextResponse.json({
    ...customers,
  })
}