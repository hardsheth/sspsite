import { auth } from '@/auth';
import axios from 'axios';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth() as Session;
    const body = await request.json();
    const response = await axios.post(`${process.env.EXTERNAL_API_URL}/order`,
      body,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const orderResponse = response.data;
    return NextResponse.json({
      ...orderResponse,
    });
  } catch (error) {
    console.log(`API ERROR:-`, error,);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          message: error.response?.data?.message || "External API error",
          error: error.response?.data,
        },
        {
          status: error.response?.status || 500,
        }
      );
    }

    // ✅ Generic fallback error
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}


export async function GET(request: NextRequest) {
  console.log(`over here I have get operation of customer`);

  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const size = url.searchParams.get('size');
  console.log(`checking the params start`);
  const params: any = {};
  if (page) params.page = page;
  if (size) params.limit = size;

  const response = await axios.get(`${process.env.EXTERNAL_API_URL}/order`, {
    params,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  const customers = response.data;
  return NextResponse.json({
    ...customers,
  })
}
