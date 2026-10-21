import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Buat akun baru
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Daftar gratis dan mulai buat landing page pertama Anda.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-zinc-500">Memuat...</p>}>
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
        </Suspense>
      </div>
    </main>
  );
}
