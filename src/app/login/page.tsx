import LogInForm from "@/components/auth/LogInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LogIn Page",
  description: "This is Next.js LogIn Page TailAdmin Dashboard Template",
};

export default function LogIn() {
  return <LogInForm />;
}
