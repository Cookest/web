"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with personalized meal planning"
      brandingTagline="Create your account and start planning smarter meals in minutes. Personalized to your taste, diet, and goals."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
