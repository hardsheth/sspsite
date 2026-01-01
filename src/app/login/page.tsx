import LogInForm from "@/components/auth/LogInForm";
import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js LogIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js LogIn Page TailAdmin Dashboard Template",
};

export default function LogIn() {
  return <LogInForm />;
}
