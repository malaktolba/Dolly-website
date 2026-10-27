import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-display text-center text-4xl tracking-[0.18em]">DOLLY</p>
        <p className="label mt-3 text-center text-cocoa-soft">Admin</p>
        <LoginForm />
      </div>
    </div>
  );
}
