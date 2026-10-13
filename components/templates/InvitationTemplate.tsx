"use client";

import { resolveTemplate, type TemplateId } from "@/lib/invitation";
import { ElegantTemplate } from "./ElegantTemplate";
import { FloralTemplate } from "./FloralTemplate";
import { MinimalistTemplate } from "./MinimalistTemplate";
import { RusticTemplate } from "./RusticTemplate";
import type { TemplateProps } from "./types";

export type { TemplateId };

export function InvitationTemplate({
  templateType,
  ...props
}: TemplateProps & { templateType: string }) {
  switch (resolveTemplate(templateType)) {
    case "elegant":
      return <ElegantTemplate {...props} />;
    case "rustic":
      return <RusticTemplate {...props} />;
    case "floral":
      return <FloralTemplate {...props} />;
    case "minimalist":
    default:
      return <MinimalistTemplate {...props} />;
  }
}
