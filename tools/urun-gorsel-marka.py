#!/usr/bin/env python3
"""
Kaynak ürün render'larını IRONAIR markasına çevirir ve 2K webp olarak yayınlar.

Üç aşama, her biri işi en iyi yapan araca veriliyor:

  1. Logo/etiket  → qwen-image-edit ($0.03)  yalnızca marka izi taşıyan
                    görsellerde çalışır; UVENTS yazısını IRONAIR yapar,
                    yeşil sertifika ve sarı uyarı etiketini siler.
  2. Çözünürlük   → real-esrgan ($0.002)     2048 px altındaki her görseli
                    2K'ya çıkarır.
  3. Marka rengi  → yerel ton kaydırma ($0)  turuncuyu IRONAIR kırmızısına
                    çevirir. En sona bırakıldı: AI'ın kırmızıyı her karede
                    biraz farklı üretmesi yerine, katalogdaki 340 görselin
                    tamamı birebir aynı kırmızıyı alıyor.

İş planını `tools/.cache/gorsel-plan.json` üretir, tamamlananı
`tools/.cache/gorsel-durum.json` içinde tutar — script yeniden çalıştırılırsa
biten görseller atlanır, para iki kez harcanmaz.
"""
import json, pathlib, re, unicodedata, sys
import numpy as np
from PIL import Image, ImageFilter

KOK = pathlib.Path(__file__).resolve().parent.parent
HAM = KOK.parent / "kaynak-uvents" / "catalog-ham.json"
MEDYA = KOK.parent / "kaynak-uvents" / "media"
HEDEF = KOK / "public" / "katalog"
CACHE = KOK / "tools" / ".cache"
PLAN = CACHE / "gorsel-plan.json"

HEDEF_UZUN_KENAR = 2048
WEBP_KALITE = 88

# Marka izi eşikleri — tools/urun-gorsel-marka.py analizinden
YAZI_ESIK, ETIKET_ESIK = 1500, 400


def slugla(s: str) -> str:
    for a, b in [("ı","i"),("İ","i"),("ş","s"),("Ş","s"),("ğ","g"),("Ğ","g"),
                 ("ü","u"),("Ü","u"),("ö","o"),("Ö","o"),("ç","c"),("Ç","c")]:
        s = s.replace(a, b)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def ironair_kod(k: str) -> str:
    return "IRT-" + k.split("-", 1)[1] if k.startswith("UVS-") else k


def hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(2), a.min(2)
    d = mx - mn + 1e-6
    h = np.zeros_like(mx)
    m = (mx == r); h[m] = ((g - b)[m] / d[m]) % 6
    m = (mx == g); h[m] = ((b - r)[m] / d[m]) + 2
    m = (mx == b); h[m] = ((r - g)[m] / d[m]) + 4
    return h * 60, np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0), mx


def marka_izi(p: pathlib.Path):
    """Görselde ne tür marka izi var: 'yazi', 'etiket' ya da None."""
    im = Image.open(p).convert("RGB"); im.thumbnail((700, 700))
    a = np.asarray(im).astype(np.float32) / 255
    h, s, v = hsv(a)
    doygun = (s > 0.45) & (v > 0.25)
    turuncu = (h >= 8) & (h <= 42) & doygun
    yesil = int(((h > 80) & (h < 170) & doygun).sum())
    sari = int(((h > 45) & (h < 70) & doygun).sum())
    mi = Image.fromarray((turuncu * 255).astype(np.uint8))
    kalin = np.asarray(mi.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(7))) > 127
    ince = int((turuncu & ~kalin).sum())
    if ince > YAZI_ESIK:
        return "yazi"
    if yesil > ETIKET_ESIK or sari > ETIKET_ESIK:
        return "etiket"
    return None


def plan_uret():
    ham = json.loads(HAM.read_text(encoding="utf-8"))
    def yol(p): return MEDYA / str(p).split("media/", 1)[-1]

    isler = []
    for s in ham["series"]:
        slug = slugla(ironair_kod(s["name"]))
        hedefler = []
        if s.get("image"):
            hedefler.append((yol(s["image"]), f"{slug}/ana.webp"))
        for i, g in enumerate(s.get("gallery") or []):
            hedefler.append((yol(g), f"{slug}/{i + 1}.webp"))
        for kaynak, cikti in hedefler:
            if not kaynak.exists():
                continue
            isler.append({
                "kaynak": str(kaynak),
                "cikti": cikti,
                "iz": marka_izi(kaynak),
                "boyut": list(Image.open(kaynak).size),
            })
    CACHE.mkdir(parents=True, exist_ok=True)
    PLAN.write_text(json.dumps(isler, ensure_ascii=False, indent=1), encoding="utf-8")

    yazi = sum(1 for x in isler if x["iz"] == "yazi")
    etiket = sum(1 for x in isler if x["iz"] == "etiket")
    temiz = sum(1 for x in isler if x["iz"] is None)
    buyut = sum(1 for x in isler if max(x["boyut"]) < HEDEF_UZUN_KENAR)
    print(f"{len(isler)} iş planlandı")
    print(f"  UVENTS yazısı   : {yazi:3}  → qwen-image-edit")
    print(f"  sadece etiket   : {etiket:3}  → qwen-image-edit")
    print(f"  marka izi yok   : {temiz:3}  → AI'a gitmiyor")
    print(f"  2K altı (büyütme): {buyut:3}  → real-esrgan")
    print()
    print(f"  tahmini maliyet : ${(yazi + etiket) * 0.03 + buyut * 0.002:.2f}")


if __name__ == "__main__":
    plan_uret()
