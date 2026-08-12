/**
 * Login page (renders AuthForm in login mode).
 */
import AuthPage from "@/components/auth-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return <AuthPage mode="login" />;
}