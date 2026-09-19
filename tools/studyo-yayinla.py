#!/usr/bin/env python3
"""
Stüdyo fotoğraflarını 2K webp olarak yayınlar.

Girdi : tools/.cache/studyo/<slug>.png
Çıktı : public/katalog/<slug>/studyo.webp

Kaynak render (ana.webp) silinmiyor — fotoğraf ondan üretildiği için yeniden
üretim gerekirse girdi olarak duruyor.
"""
import json, pathlib
from PIL import Image

KOK = pathlib.Path(__file__).resolve().parent.parent
CACHE = KOK / "tools" / ".cache" / "studyo"
HEDEF = KOK / "public" / "katalog"
UZUN_KENAR, KALITE = 2048, 88


def main():
    index = json.loads((KOK / "data" / "katalog-index.json").read_text(encoding="utf-8"))
    yazildi = eksik = 0
    bayt = 0
    for s in index["series"]:
        kaynak = CACHE / f"{s['slug']}.png"
        if not kaynak.exists():
            eksik += 1
            continue
        im = Image.open(kaynak).convert("RGB")
        if max(im.size) > UZUN_KENAR:
            oran = UZUN_KENAR / max(im.size)
            im = im.resize((round(im.width * oran), round(im.height * oran)), Image.LANCZOS)
        cikti = HEDEF / s["slug"] / "studyo.webp"
        cikti.parent.mkdir(parents=True, exist_ok=True)
        im.save(cikti, "WEBP", quality=KALITE, method=6)
        bayt += cikti.stat().st_size
        yazildi += 1
    print(f"{yazildi} stüdyo fotoğrafı yayınlandı ({bayt/1e6:.1f} MB)")
    if eksik:
        print(f"{eksik} ürünün fotoğrafı henüz üretilmemiş")


if __name__ == "__main__":
    main()
