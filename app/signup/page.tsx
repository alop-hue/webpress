/**
 * Signup page (renders AuthForm in signup mode).
 */
import AuthPage from "@/components/auth-form";

export const metadata = { title: "Create account" };

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}