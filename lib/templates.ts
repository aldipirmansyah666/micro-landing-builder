import type {
  CatalogTemplateId,
  InvitationContent,
} from "./invitation";

export interface TemplateMeta {
  id: CatalogTemplateId;
  /** Nama tampilan, mis. "Aruna". */
  name: string;
  /** Kategori gaya, mis. "Minimalist Elegant". */
  category: string;
  /** Satu kalimat karakter desain. */
  tagline: string;
  /** Contoh warna khas untuk swatch katalog. */
  swatches: [string, string, string];
}

/** Metadata kedelapan belas template katalog — satu sumber untuk katalog UI. */
export const TEMPLATE_REGISTRY: TemplateMeta[] = [
  {
    id: "aruna",
    name: "Aruna",
    category: "Minimalist Elegant",
    tagline: "Ivory bersih, aksen champagne gold, bingkai arch yang timeless.",
    swatches: ["#faf7f0", "#c9a96a", "#3d3a34"],
  },
  {
    id: "mahardika",
    name: "Mahardika",
    category: "Luxury Classic",
    tagline: "Emerald pekat, bingkai emas klasik, dan monogram inisial.",
    swatches: ["#0c2b23", "#c9a96a", "#f5efe0"],
  },
  {
    id: "puspaningrat",
    name: "Puspaningrat",
    category: "Traditional Modern — Jawa",
    tagline: "Krem sogan hangat dengan motif kawung yang anggun.",
    swatches: ["#f6efe2", "#8a5a2b", "#b08d3e"],
  },
  {
    id: "azzahra",
    name: "Azzahra",
    category: "Islamic Elegant",
    tagline: "Teal sakral, pola geometris arabesque, bingkai lengkung.",
    swatches: ["#0f3a3d", "#c2a164", "#f4efe3"],
  },
  {
    id: "seruni",
    name: "Seruni",
    category: "Romantic Floral",
    tagline: "Blush dan dusty rose lembut dengan bunga watercolor.",
    swatches: ["#fbeef0", "#c98a94", "#8a9b85"],
  },
  {
    id: "elan",
    name: "Élan",
    category: "Modern Editorial",
    tagline: "Hitam-putih tegas, tipografi majalah, grid asimetris.",
    swatches: ["#111111", "#ffffff", "#8a8a8a"],
  },
  {
    id: "kala",
    name: "Kala",
    category: "Modern Playful",
    tagline: "Terracotta ceria, bentuk geometris, sudut membulat.",
    swatches: ["#c96f4a", "#f7e8d5", "#3f6b63"],
  },
  {
    id: "senja",
    name: "Senja",
    category: "Nature & Rustic",
    tagline: "Olive dan earthy brown, hero foto alam yang lapang.",
    swatches: ["#4a5d3a", "#e8dcc3", "#6b4f35"],
  },
  {
    id: "verdant",
    name: "Verdant Glass",
    category: "Glassmorphism & Nature",
    tagline: "Deep emerald dengan kartu frosted-glass dan blur lembut.",
    swatches: ["#0b2e25", "#6ee7b7", "#ecfdf5"],
  },
  {
    id: "terra",
    name: "Rustic Terra",
    category: "Boho & Warm Earthy",
    tagline: "Terracotta hangat, linen krem, dan lengkung boho.",
    swatches: ["#b4552d", "#f5ede0", "#3a2d20"],
  },
  {
    id: "heritage",
    name: "Surabaya Heritage",
    category: "Peranakan Jawa Minimalis",
    tagline: "Navy pekat dan krem gading bergaris kawung emas.",
    swatches: ["#1b2a4a", "#c9a227", "#f7f1e3"],
  },
  {
    id: "celestial",
    name: "Celestial Night",
    category: "Dark Mode Luxury",
    tagline: "Midnight blue dan taburan bintang emas berkilau.",
    swatches: ["#060a1a", "#d4af37", "#ece7d4"],
  },
  {
    id: "parisian",
    name: "Parisian Editorial",
    category: "Luxury Fashion Magazine",
    tagline: "Monokrom tegas, grid asimetris, tipografi raksasa.",
    swatches: ["#000000", "#ffffff", "#8a8a8a"],
  },
  {
    id: "blossom",
    name: "Blossom Sage",
    category: "Pastel Watercolor Botanical",
    tagline: "Sage lembut dan pink pastel dengan kaligrafi manis.",
    swatches: ["#7d8b7a", "#e8b4b8", "#f6f3ec"],
  },
  {
    id: "balinese",
    name: "Royal Balinese",
    category: "Traditional Ethnic Bali",
    tagline: "Marun agung berukir emas dan bingkai simetris.",
    swatches: ["#2b0f0f", "#c9973f", "#f0dfb8"],
  },
  {
    id: "mono",
    name: "Minimalist Mono",
    category: "Ultra Clean Typography",
    tagline: "Charcoal dan putih, struktur rapi tanpa ornamen.",
    swatches: ["#1a1a1a", "#ffffff", "#6a6a6a"],
  },
  {
    id: "arabesque",
    name: "Arabesque Sakral",
    category: "Islamic Architecture Gold",
    tagline: "Mihrab melengkung dan mozaik emas di atas emerald.",
    swatches: ["#0b3b36", "#c9a227", "#f2ead2"],
  },
  {
    id: "retro",
    name: "Retro Sunset",
    category: "Warm Terracotta 90s",
    tagline: "Sunburst arch mustard dan peach yang ceria.",
    swatches: ["#c96f4a", "#e8a94e", "#fbe3c8"],
  },
];

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
  groomFullName: "Raden Mas Ayoga Pratama",
  groomNickname: "Yoga",
  groomParents: "Bpk. Haryono & Ibu Sulastri",
  brideFullName: "Ayu Lestari Dewi",
  brideNickname: "Ayu",
  brideParents: "Bpk. Bambang Sutrisno & Ibu Ratna Sari",
  akadDate: "2026-12-12",
  akadTime: "08:00",
  akadVenue: "Masjid Agung Syuhada, Yogyakarta",
  akadMapsUrl: "https://maps.google.com/?q=Masjid+Agung+Syuhada+Yogyakarta",
  receptionDate: "2026-12-12",
  receptionTime: "11:00",
  receptionVenue: "Gedung Graha Saba, Yogyakarta",
  receptionMapsUrl: "https://maps.google.com/?q=Graha+Saba+Yogyakarta",
  heroImage: "",
  galleryImages: [],
  backsoundUrl: "",
  accounts: [
    { bank: "BCA", number: "1234567890", holder: "Ayu Lestari Dewi" },
    { bank: "Mandiri", number: "0987654321", holder: "Ayoga Pratama" },
  ],
};
