import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register | Takonray Tours",
  description: "Create your Takonray Tours account to start booking adventures in Livingstone.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <RegisterForm />
    </main>
  );
}
