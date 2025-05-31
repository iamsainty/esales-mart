import sendOrderEmail from "@/utils/sendOrderEmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, product, quantity, totalPrice } = await req.json();

        const isEmailSent = await sendOrderEmail(name, email, product, quantity, totalPrice);

        if (!isEmailSent) {
            return NextResponse.json({ message: "Email not sent" }, { status: 500 });
        }

        return NextResponse .json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Email not sent" }, { status: 500 });

    }
}