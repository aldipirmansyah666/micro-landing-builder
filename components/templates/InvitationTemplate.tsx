"use client";

import { resolveTemplate, type TemplateId } from "@/lib/invitation";
import { ArunaTemplate } from "./ArunaTemplate";
import { AzzahraTemplate } from "./AzzahraTemplate";
import { ElanTemplate } from "./ElanTemplate";
import { ElegantTemplate } from "./ElegantTemplate";
import { FloralTemplate } from "./FloralTemplate";
import { KalaTemplate } from "./KalaTemplate";
import { LuxuryTemplate } from "./LuxuryTemplate";
import { MahardikaTemplate } from "./MahardikaTemplate";
import { MinimalistTemplate } from "./MinimalistTemplate";
import { PuspaningratTemplate } from "./PuspaningratTemplate";
import { RusticTemplate } from "./RusticTemplate";
import { SageTemplate } from "./SageTemplate";
import { SenjaTemplate } from "./SenjaTemplate";
import { SeruniTemplate } from "./SeruniTemplate";
import { VerdantGlassTemplate } from "./VerdantGlassTemplate";
import { RusticTerraTemplate } from "./RusticTerraTemplate";
import { SurabayaHeritageTemplate } from "./SurabayaHeritageTemplate";
import { CelestialNightTemplate } from "./CelestialNightTemplate";
import { ParisianEditorialTemplate } from "./ParisianEditorialTemplate";
import { BlossomSageTemplate } from "./BlossomSageTemplate";
import { RoyalBalineseTemplate } from "./RoyalBalineseTemplate";
import { MinimalistMonoTemplate } from "./MinimalistMonoTemplate";
import { ArabesqueSakralTemplate } from "./ArabesqueSakralTemplate";
import { RetroSunsetTemplate } from "./RetroSunsetTemplate";
import type { TemplateProps } from "./types";

export type { TemplateId };

export function InvitationTemplate({
  templateType,
  ...props
}: TemplateProps & { templateType: string }) {
  switch (resolveTemplate(templateType)) {
    case "aruna":
      return <ArunaTemplate {...props} />;
    case "mahardika":
      return <MahardikaTemplate {...props} />;
    case "puspaningrat":
      return <PuspaningratTemplate {...props} />;
    case "azzahra":
      return <AzzahraTemplate {...props} />;
    case "seruni":
      return <SeruniTemplate {...props} />;
    case "elan":
      return <ElanTemplate {...props} />;
    case "kala":
      return <KalaTemplate {...props} />;
    case "senja":
      return <SenjaTemplate {...props} />;
    case "verdant":
      return <VerdantGlassTemplate {...props} />;
    case "terra":
      return <RusticTerraTemplate {...props} />;
    case "heritage":
      return <SurabayaHeritageTemplate {...props} />;
    case "celestial":
      return <CelestialNightTemplate {...props} />;
    case "parisian":
      return <ParisianEditorialTemplate {...props} />;
    case "blossom":
      return <BlossomSageTemplate {...props} />;
    case "balinese":
      return <RoyalBalineseTemplate {...props} />;
    case "mono":
      return <MinimalistMonoTemplate {...props} />;
    case "arabesque":
      return <ArabesqueSakralTemplate {...props} />;
    case "retro":
      return <RetroSunsetTemplate {...props} />;
    case "elegant":
      return <ElegantTemplate {...props} />;
    case "rustic":
      return <RusticTemplate {...props} />;
    case "floral":
      return <FloralTemplate {...props} />;
    case "luxury":
      return <LuxuryTemplate {...props} />;
    case "sage":
      return <SageTemplate {...props} />;
    case "minimalist":
    default:
      return <MinimalistTemplate {...props} />;
  }
}
