/**
 * Ürün kataloğu dışındaki sayfaların içeriği.
 *
 * Referans ve belge listeleri gerçek IRONAIR kayıtlarıyla değiştirilecek
 * yer tutuculardır; metinler yapıyı ve tonu gösterir.
 */

export type Uygulama = {
  slug: string;
  ad: string;
  ozet: string;
  /** Bu alanda tipik olarak çözülmesi gereken sorun. */
  sorun: string;
  /** Önerilen ürün grubu slug'ları. */
  gruplar: string[];
  /** Sahadan tipik değerler. */
  degerler: { etiket: string; deger: string }[];
};

export const uygulamalar: Uygulama[] = [
  {
    slug: "fabrika-ve-uretim",
    ad: "Fabrika ve üretim holü",
    ozet:
      "Yüksek tavanlı üretim alanlarında ısınan havayı çatıdan atıp tabandan taze hava almak, çalışanın soluduğu havayı temiz tutar.",
    sorun:
      "Makinelerin yaydığı ısı tavanda birikir, yaz aylarında hol 40 °C'yi bulur; kaynak dumanı ve yağ buharı asılı kalır.",
    gruplar: ["radyal-fanlar", "cati-fanlari", "aksiyel-fanlar"],
    degerler: [
      { etiket: "Saatlik hava değişimi", deger: "6 – 12 kat" },
      { etiket: "Tipik debi", deger: "20.000 – 80.000 m³/h" },
      { etiket: "Çalışma sıcaklığı", deger: "+40 °C'ye kadar" },
    ],
  },
  {
    slug: "ticari-mutfak",
    ad: "Ticari mutfak",
    ozet:
      "Davlumbaz üzerinden çekilen yağlı ve sıcak havanın kanalı tıkamadan çatıya taşınması gerekir.",
    sorun:
      "Yağ kanalda birikip yangın riski yaratır; yetersiz emiş kokuyu salona taşır.",
    gruplar: ["kanal-fanlari", "cati-fanlari", "radyal-fanlar"],
    degerler: [
      { etiket: "Davlumbaz emiş hızı", deger: "0,25 – 0,5 m/s" },
      { etiket: "Tipik debi", deger: "3.000 – 20.000 m³/h" },
      { etiket: "Filtre", deger: "Paslanmaz labirent + karbon" },
    ],
  },
  {
    slug: "otopark",
    ad: "Kapalı otopark",
    ozet:
      "Egzoz gazının, özellikle karbonmonoksitin, sensöre bağlı fanlarla sürekli tahliyesi.",
    sorun:
      "CO seviyesi sessizce yükselir; yangın anında dumanın tahliye yönü hayati önem taşır.",
    gruplar: ["aksiyel-fanlar", "cati-fanlari", "kanal-fanlari"],
    degerler: [
      { etiket: "Normal işletme", deger: "6 hava değişimi/saat" },
      { etiket: "Yangın modu", deger: "10 hava değişimi/saat" },
      { etiket: "Kontrol", deger: "CO sensörü + frekans invertörü" },
    ],
  },
  {
    slug: "kimya-ve-boyahane",
    ad: "Kimya tesisi ve boyahane",
    ozet:
      "Patlayıcı gaz ve korozif buharın bulunduğu hatlarda ATEX sertifikalı, kıvılcım çıkarmaz ekipman zorunludur.",
    sorun:
      "Solvent buharı patlama sınırına ulaşabilir; asit buharı standart sacı birkaç ayda delip geçer.",
    gruplar: ["aksiyel-fanlar", "radyal-fanlar"],
    degerler: [
      { etiket: "Bölge sınıfı", deger: "Zone 1/21 veya 2/22" },
      { etiket: "Gövde", deger: "Polipropilen veya paslanmaz" },
      { etiket: "Sertifika", deger: "ATEX 2014/34/EU" },
    ],
  },
  {
    slug: "hastane-ve-laboratuvar",
    ad: "Hastane ve laboratuvar",
    ozet:
      "Basınç kademeleri ve HEPA filtreleme ile temiz alanların kirli alanlardan ayrılması.",
    sorun:
      "Ameliyathane pozitif, izolasyon odası negatif basınçta kalmalı; hava akışının yönü hiç şaşmamalı.",
    gruplar: ["kanal-fanlari"],
    degerler: [
      { etiket: "Filtre sınıfı", deger: "F9 + H13 HEPA" },
      { etiket: "Basınç farkı", deger: "±15 Pa" },
      { etiket: "Ses seviyesi", deger: "< 45 dBA" },
    ],
  },
  {
    slug: "gemi-ve-tersane",
    ad: "Gemi ve tersane",
    ozet:
      "Ambar, tank ve makine dairesi gibi kapalı hacimlerde taşınabilir fanlarla geçici havalandırma.",
    sorun:
      "Kapalı hacimde oksijen azalır, boya ve yakıt buharı birikir; ekipman tuzlu havaya dayanmalı.",
    gruplar: ["aksiyel-fanlar"],
    degerler: [
      { etiket: "Körük uzunluğu", deger: "5 – 30 m" },
      { etiket: "Tipik debi", deger: "1.500 – 9.000 m³/h" },
      { etiket: "Koruma", deger: "IP55, deniz tipi boya" },
    ],
  },
  {
    slug: "tahil-ve-toz",
    ad: "Tahıl, talaş ve toz toplama",
    ozet:
      "Malzeme taşıyan hatlarda aşınmaya dayanıklı, tıkanmayan çarklı yüksek basınçlı fanlar.",
    sorun:
      "Standart çark birkaç ayda aşınır ve balansı bozulur; toz birikimi patlama riski taşır.",
    gruplar: ["radyal-fanlar"],
    degerler: [
      { etiket: "Basınç", deger: "2.500 – 8.000 Pa" },
      { etiket: "Çark", deger: "Açık düz kanatlı, aşınma plakalı" },
      { etiket: "Bakım", deger: "Temizleme kapağı standart" },
    ],
  },
  {
    slug: "siginak-ve-kritik-tesis",
    ad: "Sığınak ve kritik tesis",
    ozet:
      "Elektrik kesilse bile çalışmayı sürdüren, NBC filtreli el tahrikli yedekli fan üniteleri.",
    sorun:
      "Yönetmelik kapalı hacimde belirli bir taze hava debisini şartsız zorunlu kılar.",
    gruplar: ["kanal-fanlari"],
    degerler: [
      { etiket: "Kişi başı debi", deger: "En az 3 m³/h" },
      { etiket: "Filtre", deger: "Kaba toz + karbon + NBC" },
      { etiket: "Yedek tahrik", deger: "El kolu" },
    ],
  },
];

export const uygulamaBySlug = (slug: string) => uygulamalar.find((u) => u.slug === slug);

/** Bir ürün grubunun kullanıldığı uygulama alanları. */
export const uygulamalarByCategory = (categorySlug: string) =>
  uygulamalar.filter((u) => u.gruplar.includes(categorySlug));

/* ── Referanslar ─────────────────────────────────────────────────────────── */

export type Referans = {
  ad: string;
  sektor: string;
  sehir: string;
  yil: string;
  is: string;
  /** Projeyi tek bir ölçüyle özetleyen değer. */
  olcu: string;
};

export const referanslar: Referans[] = [
  { ad: "Organize Sanayi Dökümhanesi", sektor: "Metal", sehir: "Kocaeli", yil: "2025", is: "Ocak üstü toz toplama ve çatı egzozu", olcu: "62.000 m³/h" },
  { ad: "Zincir Otel Mutfak Grubu", sektor: "Turizm", sehir: "Antalya", yil: "2025", is: "Filtreli mutfak egzozu ve taze hava santrali", olcu: "18 ünite" },
  { ad: "Boya ve Kaplama Tesisi", sektor: "Kimya", sehir: "Bursa", yil: "2024", is: "ATEX exproof emiş hattı, Zone 1", olcu: "Zone 1/21" },
  { ad: "Lojistik Deposu", sektor: "Depolama", sehir: "İstanbul", yil: "2024", is: "Çatı aspiratörleri ve doğal baca", olcu: "45.000 m³/h" },
  { ad: "Kapalı Otopark Projesi", sektor: "Yapı", sehir: "Ankara", yil: "2024", is: "CO sensörlü jet fan ve egzoz sistemi", olcu: "3 kat / 480 araç" },
  { ad: "Un Fabrikası", sektor: "Gıda", sehir: "Konya", yil: "2023", is: "Pnömatik taşıma ve toz toplama fanları", olcu: "6.400 Pa" },
  { ad: "Tersane Blok Montaj Hattı", sektor: "Denizcilik", sehir: "Yalova", yil: "2023", is: "Taşınabilir gemi fanı tedariki", olcu: "36 adet" },
  { ad: "Özel Hastane Ek Bloğu", sektor: "Sağlık", sehir: "İzmir", yil: "2023", is: "HEPA filtreli klima santrali ve ısı geri kazanım", olcu: "%82 geri kazanım" },
  { ad: "Tekstil Boyahanesi", sektor: "Tekstil", sehir: "Denizli", yil: "2022", is: "Nem alma santrali ve salon havalandırma", olcu: "28.000 m³/h" },
];

/* ── Belgeler ────────────────────────────────────────────────────────────── */

export type Belge = {
  kod: string;
  ad: string;
  aciklama: string;
  kapsam: string;
};

export const belgeler: Belge[] = [
  {
    kod: "ATEX",
    ad: "ATEX 2014/34/EU",
    aciklama:
      "Patlayıcı ortamlarda kullanılan ekipman yönetmeliği. Exproof serilerimiz bu kapsamda belgelendirilir.",
    kapsam: "Exproof fan grubu — Zone 1/21 ve Zone 2/22",
  },
  {
    kod: "CE",
    ad: "CE uygunluk beyanı",
    aciklama:
      "Makine Emniyeti Yönetmeliği ve Alçak Gerilim Yönetmeliği kapsamında uygunluk beyanı.",
    kapsam: "Tüm fan grupları",
  },
  {
    kod: "ISO 9001",
    ad: "ISO 9001 Kalite Yönetim Sistemi",
    aciklama:
      "Tasarımdan sevkiyata kadar üretim süreçlerinin belgelendirilmiş kalite sistemi.",
    kapsam: "Üretim ve satış sonrası",
  },
  {
    kod: "EN 12101-3",
    ad: "EN 12101-3 Duman tahliye fanları",
    aciklama:
      "Yangın anında sıcak dumanı belirli süre boyunca tahliye edebilen fanların standardı.",
    kapsam: "Duman tahliye serileri — F300 / F400",
  },
  {
    kod: "ISO 1940",
    ad: "ISO 1940 G6.3 dinamik balans",
    aciklama:
      "Çarkların titreşim sınıfı. Balanssız çark yatak ömrünü kısaltır ve ses seviyesini yükseltir.",
    kapsam: "Tüm radyal ve aksiyel çarklar",
  },
  {
    kod: "EN 1886",
    ad: "EN 1886 Kabin sınıfı",
    aciklama:
      "Klima santrali kabinlerinin mekanik dayanım, kaçak ve ısı köprüsü sınıflandırması.",
    kapsam: "Kabinli ve hücreli fan sistemleri",
  },
];

/* ── Sık sorulanlar ──────────────────────────────────────────────────────── */

export type SSS = { soru: string; cevap: string };

export const sss: SSS[] = [
  {
    soru: "Hangi fanı seçeceğimi bilmiyorum, nereden başlamalıyım?",
    cevap:
      "İki değer yeterli: ortamın hacmi ve ne iş yaptığı. Fan seçim aracına bunları girin, gerekli debiyi hesaplayıp uygun ürün grubunu önersin. Emin olamazsanız teklif formuna yazın, biz seçelim.",
  },
  {
    soru: "Debi ve basınç arasındaki fark ne?",
    cevap:
      "Debi (m³/h) fanın saatte ne kadar hava taşıdığını, basınç (Pa) bu havayı kanaldaki dirence rağmen itebilme gücünü gösterir. Kanal uzunsa, dirsek ve filtre çoksa debi aynı kalsa bile daha yüksek basınç gerekir.",
  },
  {
    soru: "Aksiyel mi radyal mı almalıyım?",
    cevap:
      "Kısa mesafeye çok hava taşıyacaksanız aksiyel yeterlidir ve daha ekonomiktir. Uzun kanal, filtre veya siklon varsa radyal gerekir — aksiyel bu dirençte debisini kaybeder.",
  },
  {
    soru: "Özel ölçüde üretim yapıyor musunuz?",
    cevap:
      "Evet. Katalogdaki seriler standart kademelerdir; çark çapı, gövde malzemesi, motor gücü ve flanş ölçüleri projeye göre değiştirilir. Standart dışı işlerde teknik resim üzerinden çalışırız.",
  },
  {
    soru: "Teslim süresi ne kadar?",
    cevap:
      "Standart kademelerde genellikle 5 – 15 iş günü. Özel ölçü, ATEX sertifikalı ve paslanmaz gövdeli üretimlerde süre projeye göre belirlenir ve teklifte yazılı olarak verilir.",
  },
  {
    soru: "Fan çok ses yapıyor, ne yapabilirim?",
    cevap:
      "Çoğu zaman fan yanlış çalışma noktasındadır: gereğinden yüksek devirde dönüyordur. Frekans invertörü ile devri düşürmek sesi belirgin azaltır ve elektrik tüketimini de düşürür. Susturucu ve titreşim takozu da eklenebilir.",
  },
  {
    soru: "Yedek parça buluyor muyum?",
    cevap:
      "Motor, çark, kayış, kasnak ve yatak grubu için yedek parça tutulur. Ürün kodunu ve etiket bilgisini iletmeniz yeterli.",
  },
  {
    soru: "Bakım ne sıklıkla yapılmalı?",
    cevap:
      "Temiz havada yılda bir, tozlu ve yağlı ortamlarda üç ayda bir kontrol önerilir. Kontrolde çark temizliği, kayış gerginliği, yatak sesi ve titreşim ölçümü yapılır.",
  },
];

/* ── Çalışma süreci ──────────────────────────────────────────────────────── */

export const surec = [
  {
    baslik: "İhtiyacı ölçüyoruz",
    metin:
      "Hacim, kullanım amacı, kanal güzergâhı ve varsa mevcut ekipman konuşulur. Gerekirse sahada ölçüm alınır.",
  },
  {
    baslik: "Seriyi ve ölçüyü belirliyoruz",
    metin:
      "Debi–basınç eğrisinden çalışma noktası çıkarılır; çark çapı, devir ve gövde malzemesi buna göre seçilir.",
  },
  {
    baslik: "Üretip test ediyoruz",
    metin:
      "Çark dinamik balansa alınır, motor ve gövde montajı yapılır, ünite çalıştırılarak titreşim ve akım kontrol edilir.",
  },
  {
    baslik: "Devreye alıyoruz",
    metin:
      "Montaj sonrası debi ölçülür, devir ayarlanır ve işletmeye bakım aralıkları yazılı olarak bırakılır.",
  },
];

/* ── Neden IRONAIR ───────────────────────────────────────────────────────── */

export const nedenler = [
  {
    baslik: "Ölçüye göre üretim",
    metin:
      "Katalog bir başlangıç noktası. Çark, gövde ve motor projenin debi–basınç ihtiyacına göre değişir.",
  },
  {
    baslik: "Mühendislik desteği",
    metin:
      "Seçimi tek başınıza yapmak zorunda değilsiniz. Hesabı biz çıkarır, çalışma noktasını teklifle birlikte veririz.",
  },
  {
    baslik: "Sertifikalı üretim",
    metin:
      "ATEX, CE ve EN 12101-3 kapsamındaki seriler belgeli üretilir; balans sınıfı her çarkta kayıt altındadır.",
  },
  {
    baslik: "Satış sonrası",
    metin:
      "Motor, çark, kayış ve yatak için yedek parça tutulur. Ürün kodunu iletmeniz yeterli.",
  },
];
