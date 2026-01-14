import { auth } from "@/auth";
import { Session } from 'next-auth';
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
type Params = {
    params: {
        orderId: string;
    };
};

// export async function POST(request: NextRequest,
//     { params }: Params) {
//     const { id } = await params;
//     const formData = await request.formData();
//     const file = formData.getAll("files") as File[] | null;
//     const contactNumbers = formData.getAll("contactNumbers");
//     const message = formData.getAll("message");
//     console.log(file, `file received in api`, formData, `contactNumbers`, contactNumbers);

//     const formDataToSend = new FormData();
//     if (file) {
//         for (const element of file) {
//             console.log(element, `file info`);            
//             formDataToSend.append("file", element);
//         }
//         // formDataToSend.append("file", file as Blob);
//     }
//     if (message) {
//         formDataToSend.append("message", message as unknown as Blob);
//     }
//     for (const element of contactNumbers) {
//         formDataToSend.append("to", element);
//     }
//     const response = await axios.post(
//         `${process.env.EXTERNAL_API_URL}/whatsapp/session/${id}/send`,
//         formDataToSend,
//         {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         }
//     );
//     const sessions = response.data;
//     console.log(sessions, `api response`);

//     return NextResponse.json({
//         // ...sessions,
//         id
//     })
// }

// export async function DELETE(request: NextRequest,
//     { params }: Params) {
//     const { id } = await params;
//     const response = await axios.get(
//         `${process.env.EXTERNAL_API_URL}/whatsapp/session/${id}/logout`,
//     );
//     const sessions = response.data;
//     return NextResponse.json({
//         ...sessions,
//     })
// }

export async function GET(request: NextRequest,
    { params }: Params) {
    const { orderId } = await params;
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const response = await axios.get(`${process.env.EXTERNAL_API_URL}/order/${orderId}`, {
        params,
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });
    const orderDetail = response.data;

    return NextResponse.json({
        ...orderDetail,
    })
}

export async function POST(request: NextRequest,
    { params }: Params) {
    try {
        const session = await auth() as Session;
        const { orderId } = await params;
        const body = await request.json();
        const response = await axios.patch(`${process.env.EXTERNAL_API_URL}/order/${orderId}`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
        const orderResponse = response.data;
        // const orderResponse = body;
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