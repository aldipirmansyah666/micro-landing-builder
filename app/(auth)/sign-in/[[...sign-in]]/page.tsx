import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Selamat datang kembali
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Masuk untuk mengelola landing page Anda.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-zinc-500">Memuat...</p>}>
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
        </Suspense>
      </div>
    </main>
  );
}
