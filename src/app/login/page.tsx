import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login | Takonray Tours",
  description: "Sign in to your Takonray Tours account to manage bookings and more.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <LoginForm />
    </main>
  );
}
