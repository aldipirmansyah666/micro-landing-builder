"use client";

import { useRouter } from "next/navigation";
import { InvitationWizard } from "@/components/wizard";

/**
 * Wrapper klien untuk halaman demo wizard — diperlukan karena Server
 * Component tidak boleh meneruskan closure fungsi (mis. `onSaved`)
 * ke Client Component; hanya data serializable yang sah lewat props.
 * Callback navigasi didefinisikan di sini, di sisi klien.
 */
export function WizardDemoClient({
  initialTemplate,
}: {
  initialTemplate?: string;
}) {
  const router = useRouter();
  return (
    <InvitationWizard
      initialMeta={{ templateType: initialTemplate ?? "aruna" }}
      onSaved={(result) => {
        router.push(`/p/${result.slug}`);
      }}
    />
  );
}
