import OrderForm from "@/components/order/OrderForm";
import { SpeechProvider } from "@/context/SpeechContext";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Order Page | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Order Page TailAdmin Dashboard Template",
};

export default function Order() {
    return <SpeechProvider><OrderForm /></SpeechProvider>;
}
