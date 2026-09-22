# PRODUCT.md — KGTÜ Bilgisayar Mühendisliği Oryantasyon Rehberi

**Durum:** Mülakat tamamlandı, sayfa yayında — kalan iki placeholder aşağıda
**Tarih:** 22 Eylül 2026
**Akademik yıl:** 2026-2027 Güz

---

## 1. Ürün tanımı

Oryantasyon programının sonunda QR kod ile paylaşılacak, tek sayfalık statik web rehberi. Yeni kayıt olmuş 1. sınıf öğrencilerinin ilk dönem boyunca telefonundan tekrar tekrar açacağı bir başvuru kaynağı.

**Ne değil:** Tanıtım/pazarlama sayfası değil, bölüm web sitesinin kopyası değil, yönetmeliğin tamamının özeti değil.

## 2. Hedef kitle

| Kitle | İhtiyaç |
|---|---|
| 1. sınıf Türk öğrenciler | "Ne zaman ne yapmam gerekiyor?" — takvim, ekle-sil, devamsızlık |
| Yabancı uyruklu öğrenciler | Aynı bilgi + İngilizce + dil/vize kaynaklı ek süreçler |
| Oryantasyon sonrası tekrar bakanlar | Hızlı tarama, telefonda okunabilirlik |

Kullanım bağlamı: **mobil, ayakta, salonda, zayıf Wi-Fi.** Tasarım kararlarının tümü bu bağlamdan türer.

## 3. Başarı kriterleri

1. Öğrenci QR'ı okuttuktan sonra 10 saniye içinde aradığı 3 şeyi bulabilir: ekle-sil tarihi, devamsızlık sınırı, OBS girişi.
2. Sayfadaki hiçbir akademik bilgi kaynaksız değil — her kural yönetmelik maddesine veya takvime dayanıyor.
3. Tek HTML dosyası, harici bağımlılık yok, ~100KB altı, offline'a yakın hızda açılır.
4. Bölüm başkanı yayından önce içeriği onaylamış olur.

## 4. Kapsam

### İçerik sırası (sabit — bu sıradan çıkılmayacak)

1. Hoş Geldin
2. Bölüm ve Program Bilgisi — akademik kadro, müfredat, ekle-sil
3. Akademik Sistem — sınav, notlandırma, CGPA, devamsızlık
4. Mezuniyet Şartları
5. Kampüs Hayatı — OBS, e-posta, kütüphane, yemekhane, ulaşım, Wi-Fi
6. Akademik Takvim
7. SSS (5-8 soru)
8. Kapanış + Geri Bildirim Formu

### Kapsam dışı (eklenmeyecek)

Danışman hoca sistemi · Staj süreci · Bitirme projesi · Kulüpler · Ayrı iletişim bölümü

> Not: COMP 2800/3800 (Practical Training) ve COMP 4901/4902 (Graduation Project) müfredat tablosunda satır olarak görünür; bunlara dair **açıklayıcı bölüm** yazılmayacak.

## 5. Tasarım ilkeleri

- **Kaynak disiplini.** Uydurma yok. Belgede yoksa sorulur; sorulmadıysa sayfaya girmez.
- **Tarama önce, okuma sonra.** Her bölüm başlığı altında önce tablo/kart, sonra açıklama.
- **Kritik bilgi yukarıda.** Tarihi geçmek üzere olan işlemler (ekle-sil) üst sıraya.
- **Tek dosya.** Framework yok, CDN yok, font indirme yok — sistem fontu yığını.
- **Baskıya ve ekran okuyucuya dost.** Semantik HTML, `<table>`, landmark rolleri.
- **Yaşayan belge değil.** Dönem sonunda tarihler eskir; sayfada "son güncelleme" tarihi ve neyin ne zaman yenilenmesi gerektiği yorumda belirtilir.

## 6. Teknik yaklaşım

| Karar | Seçim | Gerekçe |
|---|---|---|
| Format | Tek `index.html` (inline CSS + JS) | QR → tek istek → anında açılır |
| Çerçeve | Yok | Bağımlılık = bakım yükü + yavaşlık |
| İki dillilik | Dil değiştirme butonu, tarayıcı diline göre otomatik seçim | Tek QR yeter, tek dosya kalır |
| Hosting | GitHub Pages — `OktayMelihGul/kgtu-ceng-orientation-2026` | Public repo, özel alan adı yok |
| Form | `fetch()` → Google Apps Script Web App | URL placeholder olarak bırakılacak |
| Erişilebilirlik | WCAG 2.2 AA hedef | Yabancı öğrenciler + ekran okuyucu |

## 7. Doğrulanmış içerik (kaynaklı)

Aşağıdakiler yüklenen belgelerden **doğrudan** çıkarıldı. Aşama 2'de teyit edilecek.

### Yönetmelik (RG 06.08.2023/32271)

| Konu | Bulgu | Madde |
|---|---|---|
| Devamsızlık | Teorik %70, uygulamalı %80 devam zorunlu; sağlanmazsa final hakkı yok, NA notu | 31(2), 33(5) |
| Rapor | Raporlu süre **devamsızlıktan düşülmez** — öğrenci devamsız sayılır | 31(13)f |
| Sınav zorunluluğu | Her derste en az 1 dönem içi + 1 dönem sonu değerlendirmesi | 31(5) |
| Vize/final ağırlığı | **Yönetmelikte oran YOK** — dersi veren öğretim elemanı belirler, dönem başında ders izlencesinde ilan edilir | 31(3), 31(4) |
| Not ilanı | Her değerlendirme sonucu en geç 10 iş günü içinde duyurulur | 31(5) |
| Bütünleme | Finalde **F** alınan derslerden; not final notu yerine geçer; koşullu geçilen (C-, D) derslerden de girilebilir | 31(12) |
| Mazeret sınavı | Yalnızca **ara sınav** için; final/bütünleme için mazeret sınavı yok | 31(13)a |
| Not itirazı | İlan tarihinden sonra **5 gün** içinde yazılı, Dekanlığa | 32(1) |
| Harf notları | A 4,00 (90-100) / A- 3,70 (85-89) / B+ 3,30 (80-84) / B 3,00 (75-79) / B- 2,70 (70-74) / C+ 2,30 (65-69) / C 2,00 (60-64) / C- 1,70 (55-59) / D 1,30 (50-54) / F 0 (0-49) | 33(4) |
| Geçer notlar | A…C ve S geçer; C-, D **koşullu geçer** (yarıyıl ort. ≥2,00 gerekir); F, NA, U başarısız | 35(1-3) |
| CGPA barajı | GNO < 2,00 → takip eden yarıyıl "başarısız öğrenci" statüsü | 38(1) |
| Onur | Yarıyıl 3,00-3,49 onur / ≥3,50 yüksek onur (≥30 AKTS başarmak şartıyla) | 37(1)a |
| Ders yükü | Yarıyıl başına en az 30, en fazla 40 AKTS; **ilk yarıyılda değiştirilemez** | 26(2), 26(4) |
| Üst sınıftan ders | Alt sınıfların tümü başarılmış + GNO ≥ 2,50 → dönem AKTS'sinin %20'sine kadar | 26(7) |
| Ekle-sil | Yarıyıl kaydı tamamlanmış öğrenci, takvimdeki tarihlerde ekler/bırakır; **danışman onayı şart** | 17(1) |
| Mazeretli kayıt | Ekle-sil bitiminden itibaren 2 hafta içinde dilekçe + yönetim kurulu kararı | 14(2), 17(2) |
| Dersten çekilme | Ekle-sil sonrası, ilk 7 hafta içinde; dönemde en çok 1, öğrenim boyunca en çok 2 ders; **müfredatın ilk iki yarıyılından çekilinmez** | 29(4) |
| Mezuniyet | Tüm dersler ≥ D veya S · toplam ≥ **240 AKTS** · GNO ≥ **2,00** · kredinin en az yarısı KGTÜ'de · son iki yarıyıl KGTÜ'de | 39(1), 39(3) |
| Öğrenim süresi | Normal 8 yarıyıl, azami 14 yarıyıl (hazırlığın ilk yılı ve yaz okulu hariç) | 23(1) |
| Öğrenim dili | Üniversitede İngilizce ve Türkçe; İngilizce programlara ÖSYM ile gelen **tüm** öğrenciler yeterlik sınavına girer, başaramayan hazırlığa kaydolur | 6(1), 7(1) |
| Tebligat | Resmî tebligat **kurumsal e-posta adresine** yapılır | 43(1) |

### Akademik takvim 2026-2027 Güz (PDF'den, doğrulanmış)

| İşlem | Tarih |
|---|---|
| Kayıt yenileme ve ders kayıtları | 7-11 Eylül 2026 |
| Danışman onayları | 7-13 Eylül 2026 |
| **Dersler başlangıç** | **14 Eylül 2026 Pazartesi** |
| Muafiyet dilekçeleri (güz+bahar, tek seferde) | 7-18 Eylül 2026 |
| Yabancı Dil Yeterlik Sınavı I-II | 7-8-9 Eylül 2026 |
| **Ders ekleme-bırakma** | **21-25 Eylül 2026** |
| Ekle-bırak danışman onayları | 21-27 Eylül 2026 |
| Mazeretli geç kayıt son başvuru | 9 Ekim 2026 |
| Cumhuriyet Bayramı | 28 Ekim (1/2) – 29 Ekim 2026 |
| Dersten çekilme son gün | 30 Ekim 2026 |
| **Ara sınavlar** | **7-15 Kasım 2026** (fakülteler 21-22 Kasım'a taşabilir) |
| Kayıt dondurma/izin son gün | 20 Kasım 2026 |
| Dönem içi değerlendirmelerin OBS'ye girişi son gün | 18 Aralık 2026 |
| Dönem içi maddi hata düzeltme son gün | 22 Aralık 2026 |
| **Derslerin bitişi** | **25 Aralık 2026** |
| **Final sınavları** | **28-29-30 Aralık 2026 + 4-10 Ocak 2027** |
| Yılbaşı tatili | 1 Ocak 2027 |
| Final notlarının sisteme girişi son gün | 13 Ocak 2027 |
| Final maddi hata düzeltme son gün | 15 Ocak 2027 |
| **Bütünleme sınavları** | **18-24 Ocak 2027** |
| Bütünleme notlarının girişi son gün | 27 Ocak 2027 |
| Bütünleme maddi hata düzeltme son gün | 29 Ocak 2027 |
| (Bahar) Dersler | 8 Şubat – 4 Haziran 2027 |
| (Bahar) Ekle-bırak | 15-19 Şubat 2027 |
| Mezuniyet töreni | 2 Temmuz 2027 |

> ⚠️ **Zamanlama uyarısı:** Bugün 22 Eylül 2026. Ekle-bırak penceresi **25 Eylül Cuma** kapanıyor. Rehber bu hafta yayına girecekse ekle-sil kutusu en üstte, sayaçlı biçimde durmalı.

### Müfredat (MMFcomputer_engineering_curriculum.xlsx)

- Toplam **240 AKTS** / 8 yarıyıl, her yarıyıl 30 AKTS
- Zorunlu **183 AKTS (%76)** · Seçmeli **57 AKTS (%24)**
- 1. yarıyıl (30 AKTS): COMP 1001 Introduction to Programming (4) · COMP 1003 Introduction to Computer Engineering Concepts (2) · COMP 1005 Ethics in Computer Science (3) · FLED 1001 Advanced English (4) · UNIV 1005 Calculus I (6) · UNIV 1015 Türk Dili ve Edebiyatı I (2) · UNIV 1017 İş Sağlığı ve Güvenliği (3) · UNIV 1019 Physics I (6)
- 2. yarıyıl (30 AKTS): COMP 1002 Advanced Python (6) · FLED 1002 Academic English (4) · UNIV 1006 Calculus II (6) · UNIV 1016 Türk Dili ve Edebiyatı II (2) · UNIV 1020 Physics II (6) · UNIV 1024 Kariyer Planlama (2) · UNIV 2014 Linear Algebra (4)
- Seçmeli havuzu: ~60 ders (Güz + Bahar), her biri 5 AKTS

### Akademik kadro (bölüm sayfasından, 22.09.2026)

| Unvan | Ad Soyad | E-posta |
|---|---|---|
| Prof. Dr. | Kasım ÖZTOPRAK — **Bölüm Başkanı** | kasim.oztoprak@ |
| Prof. Dr. | Reza Zare HASSANPOUR | reza.hassanpour@ |
| Prof. Dr. | Fahir Talay AKYILDIZ | fahir.akyildiz@ |
| Prof. Dr. | Meltem Huri BATURAY KHAN | meltem.baturay@ |
| Prof. Dr. | Şenol Zafer ERDOĞAN | senol.erdogan@ |
| Dr. Öğr. Üyesi | Metin Burak ALTINOKLU | burak.altinoklu@ |
| Dr. Öğr. Üyesi | Ayşe Gül ÖZKAN | aysegul.ozkan@ |
| Dr. Öğr. Üyesi | Yusuf Kürşat TUNCEL | yusuf.tuncel@ |
| Öğr. Gör. | Elif UYSAL | elif.uysal@ |

(Hepsi `@gidatarim.edu.tr`)

### Sistem linkleri (doğrulanmış)

| Hizmet | URL |
|---|---|
| OBS | https://obs.gidatarim.edu.tr/ |
| Öğrenci e-posta | https://mail.gidatarim.edu.tr/ |
| Bologna Bilgi Paketi | https://obs.gidatarim.edu.tr/oibs/bologna |
| Öğrenci El Kitabı | https://www.gidatarim.edu.tr/tr/ogrenci-el-kitabi |
| Öğrenci İşleri Daire Bşk. | https://www.gidatarim.edu.tr/tr/oidb |
| Kütüphane | https://www.gidatarim.edu.tr/tr/library |
| Yemekhane / Kampüs Kart | https://kampuskart.gidatarim.edu.tr/ |
| Rehberlik ve Psikolojik Danışmanlık | https://www.gidatarim.edu.tr/tr/pdr |
| Bölüm akademik kadro | https://www.gidatarim.edu.tr/tr/mmf/ceng/akademik-personel |

**OBS ilk giriş (Öğrenci El Kitabı'ndan):** Kullanıcı adı = öğrenci numarası. Şifre giriş ekranındaki "Şifremi Unuttum / şifre sıfırlama" bölümünden oluşturulur; sıfırlama bağlantısı **kurumsal `@gidatarim.edu.tr` e-postasına** gönderilir.

## 8. Mülakatta verilen kararlar

| # | Konu | Karar |
|---|---|---|
| A | Vize/final ağırlığı | Sabit oran yazılmadı: "derse göre değişir, ders izlencesine bak" |
| B, C | Harf notu tablosu | **Yönetmelik tablosu esas alındı.** Öğrenci El Kitabı'ndaki C- (50-59) ve "D 0,00" satırları hatalı kabul edildi |
| D | Ders yükü artırımı | Yönetmelik ifadesi kullanıldı (30 taban, 40 tavan) |
| E | Öğretim dili | %100 İngilizce. Öğrenciler hazırlığı geçmiş/atlamış olduğu için hazırlık anlatılmadı |
| F | Wi-Fi | SSID `KGTU`, kurumsal e-posta + şifre. Windows ek işlem yok, Android ayar, iPhone sertifika. Detay için Bilgi İşlem sayfasına link |
| G | Yemekhane | Kampüs Kart üzerinden haftalık rezervasyon, Cuma mesai bitimine kadar. 175 TL rezervasyonlu / 350 TL rezervasyonsuz |
| H | Kütüphane | **Çıkarıldı** — kurallar sık değiştiği için eskiyen bilgi bırakılmadı |
| I | Müfredat seçmelileri | Yarıyıl bazında yapı olarak verildi (5 AKTS seçmeli, 2 AKTS sosyal seçmeli); ders listesi yok, Bologna'ya yönlendirildi |
| J | Yabancı öğrenciler | Ayrı bölüm açılmadı; içerik zaten iki dilli |
| — | Ulaşım, kimlik kartı, mazeretli geç kayıt, kayıt dondurma, not itirazı prosedürü, tebligat maddesi | Kapsam dışı bırakıldı |
| — | Mezuniyet Md. 39(3)c | "Son iki yarıyıl KGTÜ'de" şartına Erasmus/değişim istisnası eklendi |
| — | Ekle-sil sayacı | **Yapılmadı** — 1. yarıyılda silinebilecek ders yok, sayfa dönem boyu kullanılacak |

### Hâlâ açık — yayından önce doldurulmalı

1. **Arş. Gör. Oktay Melih Gül'ün kurumsal e-postası** — `index.html` içinde
   `EPOSTA_DOLDURULACAK@gidatarim.edu.tr` placeholder'ı duruyor.
2. **Apps Script Web App URL'i** — `index.html` içinde `FEEDBACK_ENDPOINT` placeholder'ı duruyor.
   Kurulum adımları `README.md`'de.
3. **Bölüm başkanı onayı** — içerik yayın öncesi son kez teyit edilmeli.

## 9. Teslim edilecekler

1. `index.html` — tek dosya, tam HTML/CSS/JS
2. Harici yapılacaklar listesi (Apps Script deploy, GitHub Pages, fotoğraf/link doldurma, bölüm başkanı onayı)
