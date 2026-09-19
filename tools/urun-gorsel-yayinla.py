#!/usr/bin/env python3
"""
AI'dan dönen ham çıktıları marka rengine çevirip 2K webp olarak yayınlar.

Renk dönüşümü bilerek bu son adımda: modelin her karede biraz farklı ürettiği
kırmızı yerine, katalogdaki bütün görseller aynı deterministik IRONAIR
kırmızısını alıyor.

Girdi : tools/.cache/gorsel-ham/<seri>/<ad>.png   (urun-gorsel-ai.mjs çıktısı)
Çıktı : public/katalog/<seri>/<ad>.webp
"""
import importlib.util, json, pathlib, sys
from PIL import Image

KOK = pathlib.Path(__file__).resolve().parent.parent
HAM = KOK / "tools" / ".cache" / "gorsel-ham"
HEDEF = KOK / "public" / "katalog"
PLAN = KOK / "tools" / ".cache" / "gorsel-plan.json"

UZUN_KENAR = 2048
KALITE = 88

_spec = importlib.util.spec_from_file_location("mr", KOK / "tools" / "marka-renk.py")
_mr = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_mr)


def yayinla():
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    yazildi = eksik = 0
    kaynak_bayt = hedef_bayt = 0

    for is_ in plan:
        ham = HAM / is_["cikti"].replace(".webp", ".png")
        cikti = HEDEF / is_["cikti"]
        if not ham.exists():
            eksik += 1
            continue

        im = _mr.cevir(Image.open(ham))
        if max(im.size) > UZUN_KENAR:
            oran = UZUN_KENAR / max(im.size)
            im = im.resize((round(im.width * oran), round(im.height * oran)), Image.LANCZOS)

        cikti.parent.mkdir(parents=True, exist_ok=True)
        im.convert("RGB").save(cikti, "WEBP", quality=KALITE, method=6)
        kaynak_bayt += ham.stat().st_size
        hedef_bayt += cikti.stat().st_size
        yazildi += 1

    print(f"{yazildi} görsel yayınlandı → public/katalog/")
    if eksik:
        print(f"{eksik} görsel henüz AI aşamasından geçmemiş (atlandı)")
    print(f"{kaynak_bayt/1e6:.0f} MB ham → {hedef_bayt/1e6:.1f} MB webp")


if __name__ == "__main__":
    yayinla()
