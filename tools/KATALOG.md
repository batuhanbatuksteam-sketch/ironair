# Katalog verisi nasıl üretiliyor

Site kataloğu elle yazılmaz. Kaynak `IRONAIR/kaynak-uvents/` altındaki ham
arşivdir; `data/` içindeki JSON'lar iki script tarafından üretilir.

## Arşiv

```
IRONAIR/kaynak-uvents/
├── catalog-ham.json     CloudAir datahub çıktısı (52 seri / 454 model)
├── media/               340 PNG — ana fotoğraf + seri galerileri
└── files/               109 PDF — datasheet ve montaj kılavuzları
```

Arşiv sürüme girmez ve siteye kopyalanmaz. PDF'ler kaynak markanın kendi
belgeleri, görsellerde markanın logosu gövdeye basılı — ikisi de olduğu gibi
yayınlanamaz.

## Script'ler

```bash
python3 tools/katalog-normalize.py   # ham JSON → data/katalog*.json
python3 tools/katalog-gorsel.py      # PNG → public/katalog/<slug>/*.webp
```

`katalog-normalize.py` üç dosya yazar:

| Dosya | Boyut | Kim okur |
|---|---|---|
| `data/katalog.json` | 3,9 MB | yalnızca sunucu (`data/katalog.ts`) — model spec tabloları |
| `data/katalog-index.json` | 76 KB | `data/products.ts` — modelsiz dizin, istemciye de iner |
| `data/katalog-kaynak.json` | — | hiçbir bileşen; IRR kodu ↔ kaynak kod eşlemesi |
| `data/katalog-yonlendirme.json` | — | `next.config.ts` (eski adres yönlendirmesi) ve panel (eski talepler) |

Ayrım önemli: tam katalog bir istemci bileşeninden import edilirse 3,9 MB
tarayıcı paketine girer. Ürün sayfası tek serinin modellerini sunucuda okuyup
`Configurator`'a props olarak geçer.

Firmanın kaynaktan farklı istediği her şey script'in başındaki **IRONAIR
revizyonları** bloğunda: kod değişiklikleri (GS → FGS, Y → IY), seri adları,
silinen modeller, Hücreli Fanlar grubuna ayrılan seriler ve kategori içi
sıralama. Kategorinin ilk serisi ana sayfadaki grup kartının görseli olur.

Script ayrıca kaynak marka izlerini temizler: seri ve model kodları `IRR-`
önekine çevrilir (açıklama metinlerinin içindekiler dahil), PDF adları ve
kaynak kodlar site verisinden çıkarılır.

## Görselleri değiştirmek

`public/katalog/<seri-slug>/` altındaki dosyalar kaynak markanın 3D
render'ları. Replicate ile yeniden üretilirken hedef isimlendirme aynı
kalmalı — `data/katalog.json` bu yolları üretiyor:

```
public/katalog/irr-gb/ana.webp    ← kart ve künye
public/katalog/irr-gb/1..7.webp   ← galeri şeridi
```

Orijinal yüksek çözünürlüklü PNG'ler `kaynak-uvents/media/` altında duruyor;
img2img için kaynak olarak onlar kullanılır. Gövdedeki logo inpainting ile
kaldırılmalı, yalnızca renk değişimi yetmez.
