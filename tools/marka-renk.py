#!/usr/bin/env python3
"""
Kaynak render'lardaki turuncu marka rengini IRONAIR kırmızısına çevirir.

AI ile yeniden çizdirmek yerine yerel ton kaydırma kullanılıyor: 3D render'ın
gölgesi, yansıması ve geometrisi piksel piksel korunuyor, sadece renk dönüyor.
Sarı uyarı etiketi (H 45–70) ve yeşil sertifika etiketi (H 80–170) aralık
dışında bırakıldı — onlar AI adımında ayrıca ele alınıyor.
"""
import numpy as np
from PIL import Image

# Kaynak turuncu bandı ve hedef kırmızı bandı (HSV derece)
KAYNAK = (6.0, 44.0)
HEDEF = (350.0, 8.0)      # 8 = 368 mod 360; bant 18° genişliğinde
DOYGUNLUK_CARPANI = 1.06  # kırmızı, turuncudan biraz daha doygun okunur
PARLAKLIK_CARPANI = 0.94  # ve biraz daha koyu — aynı ışıkta kırmızı koyulaşır


def rgb_hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(2), a.min(2)
    d = mx - mn
    h = np.zeros_like(mx)
    m = (d > 1e-6) & (mx == r); h[m] = ((g - b)[m] / d[m]) % 6
    m = (d > 1e-6) & (mx == g); h[m] = ((b - r)[m] / d[m]) + 2
    m = (d > 1e-6) & (mx == b); h[m] = ((r - g)[m] / d[m]) + 4
    s = np.where(mx > 1e-6, d / np.maximum(mx, 1e-6), 0)
    return h * 60, s, mx


def hsv_rgb(h, s, v):
    h = h % 360
    i = np.floor(h / 60).astype(int) % 6
    f = h / 60 - np.floor(h / 60)
    p, q, t = v * (1 - s), v * (1 - f * s), v * (1 - (1 - f) * s)
    r = np.select([i == 0, i == 1, i == 2, i == 3, i == 4, i == 5], [v, q, p, p, t, v])
    g = np.select([i == 0, i == 1, i == 2, i == 3, i == 4, i == 5], [t, v, v, q, p, p])
    b = np.select([i == 0, i == 1, i == 2, i == 3, i == 4, i == 5], [p, p, t, v, v, q])
    return np.stack([r, g, b], -1)


def cevir(im: Image.Image) -> Image.Image:
    alfa = im.getchannel("A") if im.mode == "RGBA" else None
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255
    h, s, v = rgb_hsv(a)

    h0, h1 = KAYNAK
    d0, d1 = HEDEF
    genislik = (d1 + 360 - d0) if d1 < d0 else (d1 - d0)

    # Yumuşak maske: bandın ortasında tam, kenarlarında kısmi — kenar
    # yumuşatmasının bozulmaması için geçiş doygunlukla da ölçekleniyor.
    #
    # Doygunluk eşiği 0.30–0.50 arasında: kaynak render'larda turuncu banda
    # düşen pikseller iki kümeye ayrılıyor — sıcak ışık alan alüminyum/metal
    # yüzeyler (s≈0.05–0.15) ve gerçek marka turuncusu (s≈0.50–0.80). Eşik
    # ikisinin arasına konuyor ki metal parçalar pembeleşmesin.
    icinde = (h >= h0) & (h <= h1)
    kenar = np.clip((s - 0.30) / 0.20, 0, 1) * np.clip((v - 0.10) / 0.12, 0, 1)
    maske = icinde * kenar

    oran = np.clip((h - h0) / (h1 - h0), 0, 1)
    yeni_h = (d0 + oran * genislik) % 360
    yeni_s = np.clip(s * DOYGUNLUK_CARPANI, 0, 1)
    yeni_v = np.clip(v * PARLAKLIK_CARPANI, 0, 1)

    h_son = np.where(maske > 0, yeni_h, h)
    s_son = s + (yeni_s - s) * maske
    v_son = v + (yeni_v - v) * maske

    cikti = np.clip(hsv_rgb(h_son, s_son, v_son), 0, 1)
    # Maske dışını bit bit koru — yuvarlama kaymasın
    cikti = np.where(maske[..., None] > 0, cikti, a)

    out = Image.fromarray((cikti * 255 + 0.5).astype(np.uint8), "RGB")
    if alfa is not None:
        out.putalpha(alfa)
    return out


if __name__ == "__main__":
    import sys
    kaynak, hedef = sys.argv[1], sys.argv[2]
    cevir(Image.open(kaynak)).save(hedef)
    print(hedef)
