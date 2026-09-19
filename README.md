# IRONAIR — web sitesi

Endüstriyel fan kataloğu. Next.js 15 (App Router) + Tailwind v4.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 69 sayfa statik üretilir
```

## Yapı

```
app/
  page.tsx                          ana sayfa (kaydırmalı hero + katalog + süreç + SSS)
  urunler/                          katalog, kategori ve ürün sayfaları
  uygulama-alanlari/                sektöre göre kullanım alanları (+ alt sayfalar)
  fan-secimi/                       debi ve basınç hesaplayan seçim aracı
  referanslar/  belgeler/  sss/     kurumsal sayfalar
  hakkimizda/  iletisim/  teklif/
  api/teklif/route.ts               teklif uç noktası (e-posta + WhatsApp)
  components/
    ScrollHero.tsx                  kare dizisini canvas'a çizen kaydırma sahnesi
    Cursor.tsx                      kırmızı imleç — tıklamada büyür
    FanSelector.tsx                 fan seçim hesaplayıcısı
    Configurator.tsx                seçilebilir teknik tablolar
    QuoteDialog.tsx                 ürün sayfasındaki teklif penceresi
    CategoryIndex.tsx  ProductCard.tsx  PageHeader.tsx
data/
  categories.ts  products.ts  options.ts  site.ts  company.ts  types.ts
tools/
  replicate.mjs      gen-hero-frame.mjs  gen-hero-video.mjs  gen-products.mjs
  .cache/                             ham çıktılar — siteyle birlikte yayınlanmaz
    hero/                             başlangıç kareleri ve ham video
    products-png/                     ürün görsellerinin PNG kaynakları
public/
  hero/f1440  hero/f768               kaydırma animasyonunun kareleri (4,2 MB)
  generated/products/<slug>.webp      saydam arka planlı ürün görselleri (3,1 MB)
```

`public/` toplam 7,3 MB. Ürün görselleri alfalı WebP olarak tutulur; PNG
kaynakları `tools/.cache/products-png/` altında durur (yayınlanmaz).

## Hero nasıl çalışıyor

`hero2-seedance.mp4` (5 sn, 16:9, 24 fps, 1080p) 121 kareye ayrıldı, her kare
Real-ESRGAN ile 3840×2160'a çıkarıldı, sonra üç çözünürlükte WebP'ye kodlandı.
`ScrollHero` kareyi videonun `currentTime`'ından değil sayfa konumundan hesaplar:

- aşağı kaydırma diziyi ileri, yukarı kaydırma geri sarar
- son kareye gelindiğinde yapışkan sahne serbest kalır, sayfa normal akar
- `prefers-reduced-motion` açıksa yalnız ilk kare gösterilir ve sahne tek ekrana iner

Kareler kabadan inceye yüklenir (önce ilk kare, sonra her 8'incisi, sonra
kalanlar), böylece sahne dizi tamamlanmadan açılır. Çözünürlük ekran genişliği ×
piksel yoğunluğuna göre seçilir: retina masaüstünde `f2560`, normal masaüstünde
`f1440`, mobilde `f768`.

İlk kare yüklenemezse yükleyici bir alt sete düşer (`f2560 → f1440 → f768`),
hiçbiri açılmazsa sahneyi yine de açar. Bu yüzden bir set eksik yayınlansa bile
hero `%0`'da kilitlenmez — üç klasörün de `public/hero/` altında bulunması gerekir.

Kaydırma hızı `ScrollHero.tsx` içindeki `TRACK_VH` ile ayarlanır — 180 = bir
ekran yapışkan sahne + 80vh kaydırma yolu. Sayı büyüdükçe animasyon yavaşlar.

Videoyu değiştirmek isterseniz sırasıyla:

```bash
node tools/gen-hero-frame.mjs      # başlangıç karesi adayları
node tools/gen-hero-video.mjs      # iki modelden video
ffmpeg -i tools/.cache/hero/hero2-seedance.mp4 -vf "crop=1920:1080:0:4" \
  tools/.cache/hero/frames_src/%04d.png
node tools/upscale-hero.mjs        # kareleri 4K'ya çıkarır
node tools/encode-hero.mjs         # üç çözünürlükte WebP üretir
```

`upscale-hero.mjs` her kareyi Real-ESRGAN'a tek tek gönderir ve üretilmiş kareyi
atlar; yarıda kesilirse tekrar çalıştırmak kaldığı yerden devam eder. Eşzamanlılık
**1'de bırakılmalı** — daha yükseğinde paylaşımlı GPU "CUDA out of memory" verip
kareleri düşürüyor. Bir kare yine de üretilemezse `encode-hero.mjs` o kareyi 1080p
kaynaktan kodlar ve sonunda kaç karenin böyle çıktığını yazar.

Kare sayısı değişirse `ScrollHero.tsx` içindeki `FRAME_COUNT` güncellenmeli.

## Ürün görselleri

```bash
node tools/gen-products.mjs                    # eksikleri üretir
node tools/gen-products.mjs kovanli-boru-tip-aspirator   # tek ürünü yeniler
```

İki adım: `google/nano-banana` beyaz fon üzerinde ürünü çizer,
`851-labs/background-remover` fonu saydama çevirir. Üretilmiş dosyalar atlanır.

`tools/.env` yerine kök dizindeki **`.env.local`** okunur:

```
REPLICATE_API_TOKEN=...
```

Bu dosya `.gitignore`'da. Token'ı deponun içine yazmayın.

## Teklif akışı

Ürün sayfasında bütün başlıklar işaretlenince **Teklif iste** açılır. Form
`POST /api/teklif` uç noktasına gider; uç nokta talebi doğrular, WhatsApp
bağlantısını üretir ve e-postayı yollar.

E-postanın gerçekten gönderilmesi için:

```
RESEND_API_KEY=re_...
TEKLIF_ALICI_EPOSTA=teklif@ironair.com.tr
TEKLIF_GONDEREN_EPOSTA=IRONAIR <teklif@ironair.com.tr>
```

Anahtar yoksa talep sunucu günlüğüne yazılır ve akış bozulmaz.

WhatsApp şu an ziyaretçiyi hazır mesajla `wa.me` üzerine yönlendirir. Mesajın
firmaya otomatik düşmesi için WhatsApp Business API bağlanmalı — bu adım henüz
yapılmadı.

## Bekleyen işler

- **Teknik tablolar.** `data/products.ts` içindeki `specs` ve `config` değerleri
  sektörün standart kademeleridir, IRONAIR'in kendi ölçü tabloları değil.
  Arşivdeki Excel dosyaları okunabilir hale gelince bunlarla değiştirilecek.
- **Firma bilgileri.** `data/company.ts` içindeki telefon, WhatsApp numarası,
  e-posta ve adres yer tutucudur.
- **WhatsApp Business API** bağlantısı.
