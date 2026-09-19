#!/usr/bin/env python3
"""
MARK-07 "Hız İzi" — nihai marka işaretini vektör olarak üretir.

AI denemeleri (recraft-v3-svg) konsepti yakaladı ama hepsine gravür/tarama
dokusu ekledi; logo olarak kullanılamazdı. Bu script aynı kompozisyonu
hesaplanmış geometriyle çizer: 5 süpürülmüş kanat, halkalı göbek, iki yanda
hız çizgileri. Simetri tam, kenarlar keskin, dosya birkaç KB.
"""
import math

KANAT = 5
R_GOBEK = 12.0      # kanadın başladığı yarıçap
R_UC = 37.5         # kanat ucu
SUPURME = 34.0      # kanadın iç yarıçaptan uca kadar döndüğü açı
ACIKLIK = 40.0      # kanadın uçtaki açısal genişliği
MERKEZ = 50.0


def nokta(r, derece):
    a = math.radians(derece - 90)
    return (MERKEZ + r * math.cos(a), MERKEZ + r * math.sin(a))


def n(x):
    return f"{x:.2f}".rstrip("0").rstrip(".")


def kanat(i):
    """Tek kanat: içeriden dışarı süpürülen, ucu yay ile kapatılmış dolu form."""
    taban = i * 360 / KANAT
    a_ic_bas = taban
    a_ic_son = taban + ACIKLIK * 0.42
    a_dis_bas = taban + SUPURME
    a_dis_son = taban + SUPURME + ACIKLIK

    A = nokta(R_GOBEK, a_ic_bas)
    B = nokta(R_UC, a_dis_bas)
    C = nokta(R_UC, a_dis_son)
    D = nokta(R_GOBEK, a_ic_son)

    # Kenar eğrileri: kontrol noktası ara yarıçapta, açıyı geriden takip eder
    k1 = nokta((R_GOBEK + R_UC) * 0.52, a_ic_bas + SUPURME * 0.30)
    k2 = nokta((R_GOBEK + R_UC) * 0.52, a_ic_son + SUPURME * 0.72)

    return (
        f"M{n(A[0])} {n(A[1])}"
        f"Q{n(k1[0])} {n(k1[1])} {n(B[0])} {n(B[1])}"
        f"A{n(R_UC)} {n(R_UC)} 0 0 1 {n(C[0])} {n(C[1])}"
        f"Q{n(k2[0])} {n(k2[1])} {n(D[0])} {n(D[1])}"
        f"Z"
    )


def hiz_yayi(r, a_bas, a_son, kalinlik):
    """Çarkın dışında, dönüş yönünü izleyen yay — düz çizgi yerine yay,
       çünkü hareket dairesel; göz dönüşü böyle okuyor."""
    B = nokta(r, a_bas)
    S = nokta(r, a_son)
    buyuk = 1 if (a_son - a_bas) % 360 > 180 else 0
    return (
        f'<path d="M{n(B[0])} {n(B[1])} A{n(r)} {n(r)} 0 {buyuk} 1 {n(S[0])} {n(S[1])}" '
        f'fill="none" stroke="currentColor" stroke-width="{n(kalinlik)}" stroke-linecap="round"/>'
    )


def uret(hiz_cizgileri=True):
    kanatlar = "".join(f'<path d="{kanat(i)}"/>' for i in range(KANAT))

    izler = ""
    if hiz_cizgileri:
        # Çarkın dışında üç yay; uzunluk ve kalınlık kademeli azalıyor —
        # hareketin sönümlenen izi gibi okunuyor.
        for r, a0, uzunluk, k in [(43.5, 18, 58, 3.4), (43.5, 198, 58, 3.4)]:
            izler += hiz_yayi(r, a0, a0 + uzunluk, k)

    gobek = (
        f'<circle cx="{n(MERKEZ)}" cy="{n(MERKEZ)}" r="10.2" fill="none" '
        f'stroke="currentColor" stroke-width="2.4"/>'
        f'<circle cx="{n(MERKEZ)}" cy="{n(MERKEZ)}" r="5.2"/>'
    )

    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" '
        'fill="currentColor" aria-hidden="true">'
        f"{kanatlar}{izler}{gobek}"
        "</svg>"
    )


if __name__ == "__main__":
    import pathlib
    kok = pathlib.Path(__file__).resolve().parent
    (kok / ".cache/ikon/mark07.svg").write_text(uret(True), encoding="utf-8")
    (kok / ".cache/ikon/mark07-sade.svg").write_text(uret(False), encoding="utf-8")
    print("mark07.svg + mark07-sade.svg")
