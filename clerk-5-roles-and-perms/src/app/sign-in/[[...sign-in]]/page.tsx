import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-screen justify-center items-center align-middle">
      <SignIn path="/sign-in" />
    </div>
  );
}
