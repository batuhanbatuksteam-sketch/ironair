/**
 * Firma bilgileri. Teklif e-postası, WhatsApp yönlendirmesi ve iletişim
 * sayfası bu değerleri kullanır.
 */
export const COMPANY = {
  name: "IRONAIR",
  phone: "+90 532 701 30 76",
  /** tel: bağlantılarında kullanılan sade biçim. */
  phoneRaw: "+905327013076",
  /** Sabit hat. */
  landline: "0216 755 83 53",
  landlineRaw: "+902167558353",
  /** WhatsApp numarası — başında + ve boşluk olmadan. */
  whatsapp: "905327013076",
  email: "info@ironair.com.tr",
  address: "Orta Mah. İshakpaşa Cd. No: 3/1, 34956 Tuzla / İstanbul",
  /** Haritada işaretlenen konum. */
  koordinat: { lat: 40.903461, lng: 29.37953 },
  get haritaUrl() {
    return `https://maps.google.com/?q=${this.koordinat.lat},${this.koordinat.lng}`;
  },
} as const;
