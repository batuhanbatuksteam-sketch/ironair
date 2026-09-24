#!/usr/bin/env python3
"""
Ham PNG'leri (kaynak-uvents/media) siteye webp olarak aktarır.

Kaynak görseller 1400x1900 civarı, 4 MB'a varan PNG. Burada uzun kenar 1400'e
indirilip webp'e çevriliyor; şeffaflık korunuyor. Hedef isimlendirme
data/katalog.json'daki yollarla birebir aynı: /katalog/<seri-slug>/ana.webp
ve galeri için 1.webp, 2.webp ...
"""
import json, pathlib, re, unicodedata
from PIL import Image

KOK = pathlib.Path(__file__).resolve().parent.parent
HAM = KOK.parent / "kaynak-uvents" / "catalog-ham.json"
MEDYA = KOK.parent / "kaynak-uvents" / "media"
HEDEF = KOK / "public" / "katalog"

UZUN_KENAR = 1400
KALITE = 82


def slugla(s: str) -> str:
    s = s.replace("ı", "i").replace("İ", "i").replace("ş", "s").replace("Ş", "s")
    s = s.replace("ğ", "g").replace("Ğ", "g").replace("ü", "u").replace("Ü", "u")
    s = s.replace("ö", "o").replace("Ö", "o").replace("ç", "c").replace("Ç", "c")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def cevir(kaynak: pathlib.Path, hedef: pathlib.Path) -> bool:
    if not kaynak.exists():
        print(f"  ! eksik: {kaynak.name}")
        return False
    im = Image.open(kaynak)
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    if max(im.size) > UZUN_KENAR:
        oran = UZUN_KENAR / max(im.size)
        im = im.resize((round(im.width * oran), round(im.height * oran)), Image.LANCZOS)
    hedef.parent.mkdir(parents=True, exist_ok=True)
    im.save(hedef, "WEBP", quality=KALITE, method=6)
    return True



def _normalize():
    """Kod ve slug kuralları tek yerde: katalog-normalize.py."""
    import importlib.util, pathlib
    yol = pathlib.Path(__file__).with_name("katalog-normalize.py")
    spec = importlib.util.spec_from_file_location("katalog_normalize", yol)
    modul = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modul)
    return modul

def main():
    ham = json.loads(HAM.read_text(encoding="utf-8"))
    # media/ altındaki yollar catalog.json'da "assets/catalog/media/..." önekli
    def yol(p): return MEDYA / str(p).split("media/", 1)[-1]

    sayac = kaynak_bayt = hedef_bayt = 0
    for s in ham["series"]:
        slug = slugla(_normalize().IRONAIR_KOD(s["name"]))
        isler = []
        if s.get("image"):
            isler.append((yol(s["image"]), HEDEF / slug / "ana.webp"))
        for i, g in enumerate(s.get("gallery") or []):
            isler.append((yol(g), HEDEF / slug / f"{i + 1}.webp"))
        for k, h in isler:
            if cevir(k, h):
                sayac += 1
                kaynak_bayt += k.stat().st_size
                hedef_bayt += h.stat().st_size
        print(f"{s['name']:<14} {len(isler):>2} görsel → public/katalog/{slug}/")

    print(f"\n{sayac} görsel dönüştürüldü: "
          f"{kaynak_bayt / 1e6:.0f} MB PNG → {hedef_bayt / 1e6:.1f} MB WebP")


if __name__ == "__main__":
    main()
