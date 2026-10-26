import type {
  CatalogTemplateId,
  InvitationContent,
} from "./invitation";
import { TEMPLATE_PALETTES, paletteSwatches } from "./palettes";

export interface TemplateMeta {
  id: CatalogTemplateId;
  /** Nama tampilan, mis. "Aruna". */
  name: string;
  /** Kategori gaya, mis. "Minimalist Elegant". */
  category: string;
  /** Satu kalimat karakter desain. */
  tagline: string;
  /** Tiga warna khas untuk swatch katalog — berasal dari palet (lib/palettes.ts). */
  swatches: [string, string, string];
}

/** Metadata kedelapan belas template katalog — satu sumber untuk katalog UI. */
const TEMPLATE_META: Omit<TemplateMeta, "swatches">[] = [
  {
    id: "aruna",
    name: "Aruna",
    category: "Minimalist Elegant",
    tagline: "Ivory bersih, aksen champagne gold, bingkai arch yang timeless.",
  },
  {
    id: "mahardika",
    name: "Mahardika",
    category: "Luxury Classic",
    tagline: "Emerald pekat, bingkai emas klasik, dan monogram inisial.",
  },
  {
    id: "puspaningrat",
    name: "Puspaningrat",
    category: "Traditional Modern — Jawa",
    tagline: "Krem sogan hangat dengan motif kawung yang anggun.",
  },
  {
    id: "azzahra",
    name: "Azzahra",
    category: "Islamic Elegant",
    tagline: "Teal sakral, pola geometris arabesque, bingkai lengkung.",
  },
  {
    id: "seruni",
    name: "Seruni",
    category: "Romantic Floral",
    tagline: "Blush dan dusty rose lembut dengan bunga watercolor.",
  },
  {
    id: "elan",
    name: "Élan",
    category: "Modern Editorial",
    tagline: "Hitam-putih tegas, tipografi majalah, grid asimetris.",
  },
  {
    id: "kala",
    name: "Kala",
    category: "Modern Playful",
    tagline: "Terracotta ceria, bentuk geometris, sudut membulat.",
  },
  {
    id: "senja",
    name: "Senja",
    category: "Nature & Rustic",
    tagline: "Olive dan earthy brown, hero foto alam yang lapang.",
  },
  {
    id: "verdant",
    name: "Verdant Glass",
    category: "Glassmorphism & Nature",
    tagline: "Deep emerald dengan kartu frosted-glass dan blur lembut.",
  },
  {
    id: "terra",
    name: "Rustic Terra",
    category: "Boho & Warm Earthy",
    tagline: "Terracotta hangat, linen krem, dan lengkung boho.",
  },
  {
    id: "heritage",
    name: "Surabaya Heritage",
    category: "Peranakan Jawa Minimalis",
    tagline: "Navy pekat dan krem gading bergaris kawung emas.",
  },
  {
    id: "celestial",
    name: "Celestial Night",
    category: "Dark Mode Luxury",
    tagline: "Midnight blue dan taburan bintang emas berkilau.",
  },
  {
    id: "parisian",
    name: "Parisian Editorial",
    category: "Luxury Fashion Magazine",
    tagline: "Monokrom tegas, grid asimetris, tipografi raksasa.",
  },
  {
    id: "blossom",
    name: "Blossom Sage",
    category: "Pastel Watercolor Botanical",
    tagline: "Sage lembut dan pink pastel dengan kaligrafi manis.",
  },
  {
    id: "balinese",
    name: "Royal Balinese",
    category: "Traditional Ethnic Bali",
    tagline: "Marun agung berukir emas dan bingkai simetris.",
  },
  {
    id: "mono",
    name: "Minimalist Mono",
    category: "Ultra Clean Typography",
    tagline: "Charcoal dan putih, struktur rapi tanpa ornamen.",
  },
  {
    id: "arabesque",
    name: "Arabesque Sakral",
    category: "Islamic Architecture Gold",
    tagline: "Mihrab melengkung dan mozaik emas di atas emerald.",
  },
  {
    id: "retro",
    name: "Retro Sunset",
    category: "Warm Terracotta 90s",
    tagline: "Sunburst arch mustard dan peach yang ceria.",
  },
];

/**
 * Registri template katalog.
 *
 * `swatches` DITURUNKAN dari `TEMPLATE_PALETTES` — bukan ditulis manual.
 * Sebelumnya 54 hex dicatat tangan dan harus dicocokkan dengan isi file
 * template satu per satu; 12 di antaranya ternyata hanya aproksimasi yang
 * tidak sama dengan warna yang benar-benar dipakai template. Sekarang
 * mustahil melenceng: katalog selalu menampilkan warna asli template.
 */
export const TEMPLATE_REGISTRY: TemplateMeta[] = TEMPLATE_META.map((meta) => ({
  ...meta,
  swatches: paletteSwatches(TEMPLATE_PALETTES[meta.id]),
}));

/** Label ramah untuk id template apa pun (termasuk id lawas). */
export function templateLabel(id: unknown): string {
  const hit = TEMPLATE_REGISTRY.find((t) => t.id === id);
  if (hit) return `${hit.name} — ${hit.category}`;
  if (typeof id !== "string") return "Aruna";
  const legacy: Record<string, string> = {
    elegant: "Elegant Gold (lawas)",
    rustic: "Rustic Earthy (lawas)",
    floral: "Floral Romance (lawas)",
    minimalist: "Modern Minimalist (lawas)",
    luxury: "Luxury Gold & Emerald (lawas)",
    sage: "Sage Botanical (lawas)",
    minimal: "Modern Minimalist (lawas)",
    modern: "Modern Minimalist (lawas)",
  };
  return legacy[id.trim().toLowerCase()] ?? "Aruna";
}

/**
 * Data contoh untuk thumbnail & preview katalog. JELAS data demo:
 * tidak pernah disimpan ke undangan pengguna (katalog hanya
 * mengubah templateType, konten pengguna tidak disentuh).
 */
export const DEMO_INVITATION: InvitationContent = {
  quote:
    "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu merasa tenteram.",
  coupleOrder: "groomFirst",
  groomFullName: "Raden Mas Ayoga Pratama",
  groomNickname: "Yoga",
  groomParents: "Bpk. Haryono & Ibu Sulastri",
  groomChildOrder: "",
  groomInstagram: "",
  groomPhoto: "",
  brideFullName: "Ayu Lestari Dewi",
  brideNickname: "Ayu",
  brideParents: "Bpk. Bambang Sutrisno & Ibu Ratna Sari",
  brideChildOrder: "",
  brideInstagram: "",
  bridePhoto: "",
  akadDate: "2026-12-12",
  akadTime: "08:00",
  akadTimezone: "WIB",
  akadVenue: "Masjid Agung Syuhada, Yogyakarta",
  akadMapsUrl: "https://maps.google.com/?q=Masjid+Agung+Syuhada+Yogyakarta",
  akadDresscode: "",
  receptionDate: "2026-12-12",
  receptionTime: "11:00",
  receptionTimezone: "WIB",
  receptionVenue: "Gedung Graha Saba, Yogyakarta",
  receptionMapsUrl: "https://maps.google.com/?q=Graha+Saba+Yogyakarta",
  receptionDresscode: "",
  heroImage: "",
  galleryImages: [],
  galleryVideos: [],
  backsoundUrl: "",
  accounts: [
    { bank: "BCA", number: "1234567890", holder: "Ayu Lestari Dewi", kind: "bank" },
    { bank: "Mandiri", number: "0987654321", holder: "Ayoga Pratama", kind: "bank" },
  ],
  giftAddress: "",
  liveStreamUrl: "",
  igFilterUrl: "",
  musicRequestUrl: "",
};
