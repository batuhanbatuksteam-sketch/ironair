#!/usr/bin/env python3
"""
UVENTS/CloudAir ham kataloğunu (kaynak-uvents/catalog-ham.json) site verisine çevirir.

Çıktı: data/katalog.json — 52 seri, 454 model, her modelde gruplanmış teknik tablo.
Ham veri İngilizce enum kodları taşıyor (Backward-Curved-Blades gibi); burada
Türkçeleştirilir, seri başına debi/basınç/güç aralıkları modellerden hesaplanır.
"""
import json, re, unicodedata, pathlib, collections

KOK = pathlib.Path(__file__).resolve().parent.parent
HAM = KOK.parent / "kaynak-uvents" / "catalog-ham.json"
CIKTI = KOK / "data" / "katalog.json"
CIKTI_INDEX = KOK / "data" / "katalog-index.json"
CIKTI_KAYNAK = KOK / "data" / "katalog-kaynak.json"
CIKTI_YONLENDIRME = KOK / "data" / "katalog-yonlendirme.json"

# ── Enum kodu → Türkçe karşılık ───────────────────────────────────────────────
DEGER = {
    "Direct-Drive": "Direkt akuple", "Belt-Drive": "Kayış-kasnak",
    "Carbon-Steel": "Karbon çelik", "Galvanized-Steel": "Galvaniz sac",
    "Stainless-Steel": "Paslanmaz çelik", "Aluminum": "Alüminyum",
    "Backward-Curved-Blades": "Geriye eğik kanat", "Forward-Curved-Blades": "Öne eğik kanat",
    "Airfoil-Blades": "Airfoil kanat", "Straight-Blades": "Düz kanat",
    "Centrifugal-Rotor": "Radyal çark", "Axial-Rotor": "Aksiyel pervane",
    "Cast-Blades-Rotor": "Döküm kanatlı çark", "Stamped-Sheet-Metal-Rotor": "Pres sac çark",
    "Powder-Coated": "Elektrostatik toz boya", "Galvanized": "Galvanizli",
    "Painted": "Boyalı", "Coated": "Kaplamalı", "Scroll-Casing": "Salyangoz gövde",
    "Duct-Mount": "Kanal tipi", "Wall-Mount": "Duvar tipi", "Roof-Mount": "Çatı tipi",
    "Flange-Mount": "Flanşlı", "Hanging": "Asma tip", "Base-Mount": "Şasi üstü",
    "AC": "AC", "inverter": "Frekans invertörü", "continous": "Kademesiz",
    "theoretical": "Teorik", "electrical": "Elektriksel",
    "Erp-Exempt-None": "Muafiyet yok", "Erp-Fan": "Fan", "vsdNone": "VSD yok",
}

# Ham veride adı bozuk ya da makine çevirisi kalmış anahtarlar
AD_DUZELT = {
    "frequencyStepOnDraft": "Frekans adımı",
    "impellerBladeProfile": "Kanat profili",
    "phase": "Faz sayısı",
    "Lwa2": "Ses gücü seviyesi (LwA)",
    "Lpa2": "Ses basınç seviyesi (LpA)",
    "LpaDistance": "Ölçüm mesafesi",
    "frequencyMaxAllowed": "Maksimum frekans",
    "frequencyMinAllowed": "Minimum frekans",
    "housingMaterial": "Gövde malzemesi",
    "housingSurface": "Gövde yüzey işlemi",
    "housingType": "Gövde tipi",
    "motorProtection": "Motor koruma sınıfı (IP)",
    "motorSupplyType": "Motor besleme tipi",
    "temperatureMediumMax": "Maksimum taşınan hava sıcaklığı",
    "currentRated": "Nominal akım",
    "frequencyRated": "Nominal frekans",
    "erpPower": "ErP güç tüketimi",
    "erpVolume": "ErP hava debisi",
    "erpPressure": "ErP basınç artışı",
    "erpSpeed": "ErP dönme hızı",
}

# Site tarafında anlamsız olan iç ayar anahtarları
ATLA = {"powerCurveType", "regulationCurveType", "regulationContinousStep",
        "frequencyStepOnDraft", "erpCompressibilityFactor", "erpEtaMinimal",
        "erpNTarget", "erpCharCoeff", "erpSpecificSpeed"}

GRUP_SIRA = ["hydrodynamic", "electric", "motor", "impeller", "drive", "size",
             "housing", "temperature", "acoustic", "regulation", "efficiency",
             "erp", "configuration", "option", "atex", "insulation"]

GRUP_AD = {
    "hydrodynamic": "Hava performansı", "electric": "Elektrik", "motor": "Motor",
    "impeller": "Çark / pervane", "drive": "Tahrik", "size": "Ölçüler",
    "housing": "Gövde", "temperature": "Sıcaklık", "acoustic": "Ses",
    "regulation": "Devir kontrolü", "efficiency": "Verim", "erp": "ErP uyumu",
    "configuration": "Yapılandırma", "option": "Opsiyonlar", "atex": "ATEX",
    "insulation": "Yalıtım",
}

KATEGORI_SLUG = {88: "radyal-fanlar", 89: "kanal-fanlari",
                 90: "aksiyel-fanlar", 91: "cati-fanlari"}

# ── IRONAIR revizyonları (2026-09-24) ─────────────────────────────────────────
# Kaynak katalog olduğu gibi kalır; firmanın istediği farklar burada uygulanır.

ONEK = "IRR-"
# 2026-09-24'e kadar yayındaki önek. Eski slug'lar yeni karşılıklarına
# yönlendirilir, panel de eski talepleri bu eşlemeyle bulur.
ESKI_ONEK = "IRT-"

# Seri kodu değişenler (kaynak kodun öneksiz hali → IRONAIR kodu)
KOD_DEGISTIR = {"GS": "FGS", "Y": "IY"}

# Seri adı değişenler — kaynak kod → yeni ad
SERI_AD = {
    "UVS-GS": "Alçak basınç konik emişli radyal fan",
    "UVS-GR": "Orta basınç konik emişli radyal fan",
    "UVS-Y": "Orta basınç toz toplama fanı",
    # Kaynakta Türkçe karşılığı yok, İngilizce geliyor
    "UVS-UJET-R": "Radyal jet akış duman tahliye fanı",
}
SERI_OZET = {
    "UVS-UJET-R": "Duman tahliyesi ve sıcak hava uzaklaştırma sistemleri için radyal jet "
                  "fan. Yüksek sıcaklıklarda çalışmaya uyarlanmıştır.",
}
# Ad içindeki terim düzeltmeleri — bütün serilere uygulanır
AD_TERIM = [("Düşük basınçlı", "Alçak basınçlı"), ("Bölmeli", "Hücreli")]

# Katalogdan tamamen çıkarılan modeller (kaynak model adı)
MODEL_SIL = {"UVS-M1"}

# Kanal fanlarından ayrılan alüminyum profil çerçeveli kabin fanları
HUCRELI = {"UVS-H", "UVS-H EKO", "UVS-HS", "UVS-KKF", "UVS-KEF",
           "UVS-MF", "UVS-PEF-H", "UVS-PF", "UVS-PY"}

# Kategori sırası ve adları
KAT_AD = {"radyal-fanlar": "Radyal Fanlar", "kanal-fanlari": "Kanal Fanları",
          "hucreli-fanlar": "Hücreli Fanlar", "aksiyel-fanlar": "Aksiyel Fanlar",
          "cati-fanlari": "Çatı Fanları"}

# Kategori içinde öne alınan seriler, bu sırayla; kalanlar büyük debiden
# küçüğe dizilir. Site bu sırayı olduğu gibi kullanır — kategorinin ilk serisi
# ana sayfadaki grup kartının görseli olur.
ONCE = ["IRR-M", "IRR-FGS", "IRR-GR", "IRR-IY"]

# Kart üstünde ve seri sayfasında gösterilecek aralıklar
ARALIK = [
    ("debi", "volumeMax", "m³/h", "Debi"),
    ("basinc", "pressureStaticMax", "Pa", "Statik basınç"),
    ("guc", "powerRated", "W", "Nominal güç"),
    ("devir", "speedRated", "rpm", "Devir"),
    ("cap", ("diameterInlet", "diameter", "diameterOutlet"), "mm", "Çap"),
    ("agirlik", "weight", "kg", "Ağırlık"),
]


def IRONAIR_KOD(kaynak: str, seri: str | None = None, onek: str = ONEK) -> str:
    """UVS-GB → IRR-GB, UVS-GS → IRR-FGS.

    Model adı verilirse (`seri` = kaynak seri kodu) adın seri kısmı da
    değiştirilir: UVS-GS320 → IRR-FGS320.
    """
    if not kaynak.startswith("UVS-"):
        return kaynak
    govde = kaynak[4:]
    seri_govde = (seri or kaynak)[4:]
    if seri_govde in KOD_DEGISTIR and govde.startswith(seri_govde):
        govde = KOD_DEGISTIR[seri_govde] + govde[len(seri_govde):]
    return onek + govde


def metin_kod(metin: str) -> str:
    """Açıklama metninde geçen kaynak seri kodlarını da IRONAIR koduna çevirir."""
    return re.sub(r"\bUVS-([A-Z0-9][A-Z0-9-]*)",
                  lambda m: ONEK + KOD_DEGISTIR.get(m[1], m[1]), metin)


def seri_adi(s) -> str:
    ad = SERI_AD.get(s["name"]) or s.get("subname") or s["name"]
    for eski, yeni in AD_TERIM:
        ad = ad.replace(eski, yeni)
    return ad


def slugla(s: str) -> str:
    s = s.replace("ı", "i").replace("İ", "i").replace("ş", "s").replace("Ş", "s")
    s = s.replace("ğ", "g").replace("Ğ", "g").replace("ü", "u").replace("Ü", "u")
    s = s.replace("ö", "o").replace("Ö", "o").replace("ç", "c").replace("Ç", "c")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def sayi(v):
    """Spec değerini sayıya çevirir; '3.3/1.6' gibi çoklu değerde en büyüğü alır."""
    if isinstance(v, (int, float)):
        return float(v)
    if not isinstance(v, str):
        return None
    parcalar = [p for p in re.split(r"[/,]", v) if re.fullmatch(r"\s*-?\d+(\.\d+)?\s*", p)]
    return max(float(p) for p in parcalar) if parcalar else None


# Ham veride "mmxmm" gibi bozuk birimler var
BIRIM_DUZELT = {"mmxmm": "mm", "x": ""}


def bicimle(deger, birim):
    """Tabloda görünen metin: binlik ayraçlı sayı + birim."""
    birim = BIRIM_DUZELT.get(birim, birim)
    s = DEGER.get(deger, deger) if isinstance(deger, str) else deger
    n = sayi(s) if isinstance(s, str) and s not in DEGER.values() else (
        float(s) if isinstance(s, (int, float)) else None)
    if n is not None and not (isinstance(s, str) and "/" in s):
        gosterim = f"{int(n):,}".replace(",", ".") if n == int(n) else f"{n:g}".replace(".", ",")
    else:
        gosterim = str(s)
    return f"{gosterim} {birim}".strip() if birim else gosterim


def sayi_bicim(n):
    return f"{int(n):,}".replace(",", ".") if n == int(n) else f"{n:g}".replace(".", ",")


def main():
    ham = json.loads(HAM.read_text(encoding="utf-8"))
    seriler, kat_sayac = [], collections.Counter()

    yonlendirme = {"series": {}, "models": {}}

    for s in ham["series"]:
        kat_id = (s.get("categoryIds") or [88])[0]
        kat_slug = KATEGORI_SLUG.get(kat_id, "diger")
        if s["name"] in HUCRELI:
            kat_slug = "hucreli-fanlar"
        kat_sayac[kat_slug] += 1
        kod = IRONAIR_KOD(s["name"])
        seri_slug = slugla(kod)
        # Eski yayında kod değişikliği yoktu: yalnız önek farklıydı.
        yonlendirme["series"][slugla(ESKI_ONEK + s["name"][4:])] = {
            "slug": seri_slug, "categorySlug": kat_slug}

        ham_modeller = [m for m in s["models"] if m["name"] not in MODEL_SIL]
        modeller = []
        for m in ham_modeller:
            gruplar = collections.OrderedDict()
            for sp in m["specs"]:
                if sp["key"] in ATLA:
                    continue
                birim = BIRIM_DUZELT.get(sp.get("unit") or "", sp.get("unit") or "")
                gruplar.setdefault(sp["group"], []).append({
                    "key": sp["key"],
                    "label": AD_DUZELT.get(sp["key"], sp["name"]),
                    "symbol": sp.get("symbol") or None,
                    "unit": birim or None,
                    "value": sp["value"],
                    "display": bicimle(sp["value"], sp.get("unit") or ""),
                })
            model_ad = IRONAIR_KOD(m["name"], s["name"])
            yonlendirme["models"][ESKI_ONEK + m["name"][4:]] = model_ad
            modeller.append({
                "id": m["id"],
                "slug": slugla(model_ad),
                "name": model_ad,
                "subname": m.get("subname") or None,
                "groups": [{"id": g, "label": GRUP_AD.get(g, g), "rows": gruplar[g]}
                           for g in sorted(gruplar, key=lambda x: GRUP_SIRA.index(x)
                                           if x in GRUP_SIRA else 99)],
            })

        # Seri aralıkları — modellerin min/max'ı
        aralik = []
        for alan, anahtar, birim, etiket in ARALIK:
            anahtarlar = anahtar if isinstance(anahtar, tuple) else (anahtar,)
            degerler = []
            for m in ham_modeller:
                for sp in m["specs"]:
                    if sp["key"] in anahtarlar:
                        n = sayi(sp["value"])
                        if n is not None:
                            degerler.append(n)
                        break
            if not degerler:
                continue
            lo, hi = min(degerler), max(degerler)
            aralik.append({
                "field": alan, "label": etiket, "unit": birim,
                "min": lo, "max": hi,
                "display": (f"{sayi_bicim(lo)} – {sayi_bicim(hi)} {birim}"
                            if lo != hi else f"{sayi_bicim(lo)} {birim}"),
            })

        seriler.append({
            "id": s["id"],
            "slug": seri_slug,
            "code": kod,
            "name": seri_adi(s),
            "summary": SERI_OZET.get(s["name"]) or metin_kod(s.get("overview") or ""),
            "categorySlug": kat_slug,
            # Ürün başına tek görsel: stüdyo fotoğrafı. Kaynak render
            # (ana.webp) diskte kalır ama katalogda yer almaz — fotoğraf ondan
            # üretiliyor, ileride yeniden üretmek gerekirse lazım.
            "image": f"/katalog/{seri_slug}/studyo.webp" if s.get("image") else None,
            "gallery": [],
            "modelCount": len(modeller),
            "ranges": aralik,
            "models": modeller,
        })

    kaynak_izi = {
        IRONAIR_KOD(s["name"]): {
            "sourceCode": s["name"],
            "models": {IRONAIR_KOD(m["name"], s["name"]): m["name"] for m in s["models"]
                       if m["name"] not in MODEL_SIL},
            "files": [f["url"] for f in s.get("files") or []],
        }
        for s in ham["series"]
    }

    def debi_max(x):
        return next((r["max"] for r in x["ranges"] if r["field"] == "debi"), 0)

    seriler.sort(key=lambda x: (ONCE.index(x["code"]) if x["code"] in ONCE else len(ONCE),
                                -debi_max(x), x["code"]))
    cikti = {
        "categories": [{"slug": v, "name": ad, "seriesCount": kat_sayac[v]}
                       for v, ad in KAT_AD.items()],
        "seriesCount": len(seriler),
        "modelCount": sum(x["modelCount"] for x in seriler),
        "series": seriler,
    }
    CIKTI.parent.mkdir(parents=True, exist_ok=True)
    CIKTI.write_text(json.dumps(cikti, ensure_ascii=False, indent=1), encoding="utf-8")

    # İstemci tarafı yalnızca dizini görür — 454 modelin spec tablosu tarayıcıya inmez.
    index = dict(cikti, series=[{k: v for k, v in s.items() if k != "models"}
                                for s in seriler])
    CIKTI_INDEX.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")

    CIKTI_KAYNAK.write_text(json.dumps(
        {"note": "IRONAIR kodu → kaynak katalog karşılığı. Yalnızca veri doğrulaması "
                 "için tutulur; site bileşenleri bu dosyayı import etmez.",
         "source": "CloudAir datahub — uvents.com.tr/data/catalog.json",
         "map": kaynak_izi}, ensure_ascii=False, indent=1), encoding="utf-8")

    CIKTI_YONLENDIRME.write_text(json.dumps(
        {"note": f"{ESKI_ONEK} önekli eski slug ve model adlarının güncel karşılığı. "
                 "next.config.ts eski ürün adreslerini buradan yönlendirir, panel eski "
                 "talepleri buradan bulur.",
         **yonlendirme}, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"{CIKTI.name}  →  {cikti['seriesCount']} seri / {cikti['modelCount']} model "
          f"({CIKTI.stat().st_size / 1e6:.1f} MB)")
    print(f"{CIKTI_INDEX.name}  →  modelsiz dizin ({CIKTI_INDEX.stat().st_size / 1e3:.0f} KB)")
    for k in cikti["categories"]:
        print(f"  {k['name']:<16} {k['seriesCount']:>2} seri")


if __name__ == "__main__":
    main()
