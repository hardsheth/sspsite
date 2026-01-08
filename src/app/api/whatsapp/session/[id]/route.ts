import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
type Params = {
    params: {
        id: string;
    };
};

export async function POST(request: NextRequest,
    { params }: Params) {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.getAll("files") as File[] | null;
    const contactNumbers = formData.getAll("contactNumbers");
    const message = formData.getAll("message");
    console.log(file, `file received in api`, formData, `contactNumbers`, contactNumbers);

    const formDataToSend = new FormData();
    if (file) {
        for (const element of file) {
            console.log(element, `file info`);            
            formDataToSend.append("file", element);
        }
        // formDataToSend.append("file", file as Blob);
    }
    if (message) {
        formDataToSend.append("message", message as unknown as Blob);
    }
    for (const element of contactNumbers) {
        formDataToSend.append("to", element);
    }
    const response = await axios.post(
        `${process.env.EXTERNAL_API_URL}/whatsapp/session/${id}/send`,
        formDataToSend,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    const sessions = response.data;
    console.log(sessions, `api response`);

    return NextResponse.json({
        // ...sessions,
        id
    })
}

export async function DELETE(request: NextRequest,
    { params }: Params) {
    const { id } = await params;
    const response = await axios.get(
        `${process.env.EXTERNAL_API_URL}/whatsapp/session/${id}/logout`,
    );
    const sessions = response.data;
    return NextResponse.json({
        ...sessions,
    })
}