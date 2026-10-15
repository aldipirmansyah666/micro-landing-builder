/**
 * Alias webhook Midtrans di path yang umum dicari.
 *
 * Logika kanonis (verifikasi signature SHA-512, baca order_id &
 * transaction_status, upgrade is_pro → true saat settlement/capture,
 * respons JSON 200) hidup di `@/app/api/webhook/payment/route` agar tidak
 * ada duplikasi — file ini hanya meneruskan handler yang sama.
 * Daftarkan SALAH SATU URL ini di dashboard Midtrans (Settings → Configuration):
 * - https://<domain-anda>/api/webhooks/midtrans  (alias ini), atau
 * - https://<domain-anda>/api/webhook/payment    (kanonis)
 */
export { GET, POST } from "@/app/api/webhook/payment/route";
