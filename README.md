# KGTÜ Bilgisayar Mühendisliği — Oryantasyon Rehberi

2026-2027 Güz dönemi yeni öğrenci oryantasyon rehberi. Oryantasyon programının sonunda
QR kod ile paylaşılmak üzere hazırlanmış, TR/EN çift dilli, tek dosyalık statik web sayfası.

**Yayın adresi:** https://oktaymelihgul.github.io/kgtu-ceng-orientation-2026/

---

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Rehberin tamamı — HTML, CSS ve JS tek dosyada, harici bağımlılık yok. Logo base64 olarak gömülüdür. |
| `apps-script/Code.gs` | Geri bildirim formunun arka ucu (Google Apps Script Web App). Repoda yayınlanmaz, kurulum içindir. |
| `assets/logo_bl.png` · `assets/logo_wh.png` | Logonun açık ve koyu tema sürümlerinin yüksek çözünürlüklü kaynakları. Sayfa bunları kırpıp küçülterek base64 olarak gömer; dosyalar yeniden üretim için durur. |
| `assets/favicon.pdf` | Favicon'un vektör kaynağı. Sayfaya gömülü 32px PNG ve `apple-touch-icon.png` bundan üretildi. |
| `assets/apple-touch-icon.png` | iOS ana ekran simgesi (180×180). Sayfa buna dosya olarak bağlanır. |
| `PRODUCT.md` | Tasarım brifi — hangi bilginin hangi yönetmelik maddesinden geldiği burada kayıtlı. |

## İçeriğin kaynakları

Sayfadaki her akademik kural bir kaynağa dayanır; hiçbiri varsayım değildir.

- **KGTÜ Ön Lisans ve Lisans Eğitim-Öğretim Yönetmeliği** (RG 06.08.2023/32271) — sınavlar,
  notlandırma, devam, ders yükü, mezuniyet. Madde numaraları sayfada gösterilmiyor; hangi
  kuralın hangi maddeden geldiği `index.html` başındaki yorum bloğunda listeli.
- **2026-2027 Lisans-Önlisans Genel Akademik Takvimi** — tüm tarihler.
- **Bilgisayar Mühendisliği müfredat planı** — ders tabloları, AKTS dağılımı.
- **Bölüm akademik personel sayfası** — kadro listesi.

Bir bilgiyi değiştirirken kaynağını da güncelle. `PRODUCT.md` hangi satırın nereden geldiğini gösterir.

---

## Apps Script kurulumu (geri bildirim formu)

Form, `fetch()` ile bir Apps Script Web App adresine POST atar. Sayfa yayına girmeden önce
bu adresin oluşturulup `index.html` içine yazılması gerekir.

### 1. E-Tabloyu ve script'i oluştur

1. [sheets.new](https://sheets.new) ile yeni bir Google E-Tablo aç, adını ver
   (ör. *Oryantasyon 2026 — Geri Bildirim*).
2. Menüden **Uzantılar → Apps Script**. Açılan projedeki `Code.gs` içeriğini tamamen sil.
3. Bu repodaki `apps-script/Code.gs` dosyasının içeriğini yapıştır ve kaydet (Ctrl+S).

### 2. Web App olarak deploy et

1. Sağ üstten **Dağıt → Yeni dağıtım**.
2. Dişli simgesinden tür olarak **Web uygulaması**'nı seç.
3. Ayarlar:
   - **Açıklama:** `oryantasyon geri bildirim v1`
   - **Farklı yürüt:** `Ben (kendi hesabın)`
   - **Erişimi olanlar:** **`Herkes`** ← bu şart, yoksa öğrenciler gönderemez.
4. **Dağıt**'a bas. İlk seferde Google izin isteyecek:
   **Erişimi inceleyin → hesabını seç → Gelişmiş → (proje adı) sayfasına git → İzin ver.**
5. Çıkan **Web uygulaması URL**'ini kopyala. `https://script.google.com/macros/s/.../exec`
   şeklinde, **`/exec` ile biter**.

### 3. URL'i sayfaya yaz

`index.html` içinde şu satırı bul ve URL'i yapıştır:

```js
var FEEDBACK_ENDPOINT = "BURAYA_APPS_SCRIPT_WEB_APP_URL_YAPISTIR";
```

### 4. Test et

Sayfayı aç, formu doldur ve gönder. E-Tabloda **Geri Bildirim** sayfası otomatik oluşur ve
satır düşer. "Teşekkürler! Geri bildiriminiz alındı." mesajını görmelisin.

> **Kod değiştirirsen:** Apps Script'te **Dağıt → Dağıtımları yönet → (kalem simgesi) →
> Sürüm: Yeni sürüm → Dağıt**. Böylece URL aynı kalır. "Yeni dağıtım" dersen URL değişir
> ve `index.html`'i tekrar güncellemen gerekir.

### Toplanan veri

| Sütun | İçerik |
|---|---|
| Zaman (sunucu) | Kaydın düştüğü an |
| Puan (1-5) | 1. soru |
| En faydalı yön | 2. soru (isteğe bağlı) |
| Öneri / eksik | 3. soru (isteğe bağlı) |
| Dil | Formu dolduranın sayfa dili (`tr` / `en`) |
| Cihaz anahtarı | Rastgele UUID — kimlik değil, mükerrer gönderimi engellemek için |

Form **anonimdir**: ad, numara, e-posta veya IP toplanmaz.

**Tek gönderim sınırının kapsamı:** Cihaz anahtarı tarayıcının `localStorage`'ında tutulur ve
her gönderimde sunucuda kontrol edilir. Bu, aynı tarayıcıdan ikinci kez gönderimi engeller.
Gizli sekme, farklı cihaz veya site verisi temizlenmesi durumunda yeni anahtar üretilir —
kimlik doğrulaması olmadan anonim bir formda bunun ötesi mümkün değildir.

### Web App URL'i sayfada açıkta — bu ne kadar sorun?

**URL bir sır değil ve olamaz.** Statik bir sayfa, tarayıcıdan çağırdığı her adresi
zorunlu olarak açık eder; sayfanın kaynağına bakan herkes görür. Gizlemenin (obfuscation,
parçalayıp birleştirme, ayrı dosyaya koyma) hiçbiri işe yaramaz, çünkü isteği yine tarayıcı
atıyor. Sunucusuz mimarinin doğal sonucu bu.

**Sızıntı riski yok.** Uç nokta yalnızca yazar:

- `doPost` sadece satır ekler, hiçbir kaydı geri döndürmez.
- `doGet` yalnızca `{ok:true}` sağlık yanıtı verir; E-Tablo'ya erişim vermez.
- E-Tablo'nun kendisi paylaşılmadığı sürece özeldir. Apps Script "Farklı yürüt: Ben"
  ayarıyla çalıştığı için istek atan kişi senin yetkinle *yalnızca bu fonksiyonu*
  tetikler, dosyaya erişemez.

**Gerçek risk spam.** URL'i bulan biri formu doldurmadan doğrudan istek atıp tabloyu
şişirebilir. Tarayıcıdaki cihaz anahtarı bunu engellemez — istemci tarafındadır, kolayca
atlanır. Bu yüzden sınırlar `Code.gs` içinde, sunucu tarafında:

| Sınır | Değer | Ne yapar |
|---|---|---|
| `GUNLUK_LIMIT` | 300 | Bir günde kabul edilen en fazla kayıt |
| `TOPLAM_LIMIT` | 2000 | Tablodaki toplam kayıt tavanı |
| `EN_UZUN_GOVDE` | 4000 | Kabul edilen en büyük istek gövdesi (bayt) |

Ayrıca puan 1-5 aralığında değilse, JSON bozuksa veya cihaz anahtarı yoksa istek reddedilir.
Sınıf ~100 kişiyse bu değerler bolca yeter; gerekirse `Code.gs` başından değiştir.

**En temiz koruma: işin bitince dağıtımı kaldır.** Oryantasyon geri bildirimi birkaç
günlük bir iştir. Süre dolunca Apps Script'te **Dağıt → Dağıtımları yönet → Arşivle**
dersen uç nokta tamamen kapanır. Toplanan veriler E-Tablo'da kalır.

**Yapılmaması gerekenler:** Bu uç noktaya öğrenci numarası, TC kimlik, e-posta gibi kişisel
veri gönderme. Form bilerek anonim tasarlandı — açık bir uç noktaya kişisel veri akıtmak,
URL'in görünür olmasını gerçek bir soruna çevirirdi.

---

## GitHub Pages

Repo public ve Pages açık olduğu sürece `main` dalına atılan her commit birkaç dakika içinde
yayına girer. Ayarlar: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.

`.nojekyll` dosyası, Jekyll'in dosyaları işlemesini engeller — silme.

## Yerelde çalıştırma

```bash
python -m http.server 8765
```

Sonra <http://localhost:8765> adresini aç. `file://` ile de açılır ama o durumda
`localStorage` çalışmaz; dil tercihi ve form kilidi kalıcı olmaz.

---

## Gelecek yıl neleri güncellemek gerekir

`index.html` başındaki yorum bloğunda da yazılı:

1. **Akademik takvim** (`#takvim`) — tüm tarihler
2. **Oryantasyon tarihi** — sayfa başındaki künye satırı
3. **Akademik kadro** (`#program`) — bölüm personel sayfasından
4. **Müfredat** (`#program`) — müfredat değiştiyse
5. **Yemekhane ücretleri** (`#kampus`)
6. **`FEEDBACK_ENDPOINT`** — yeni bir dağıtım yapıldıysa

Yönetmelik değişmedikçe **Akademik Sistem** ve **Mezuniyet** bölümleri sabit kalır.

## Tarayıcı desteği

Modern masaüstü ve mobil tarayıcılar. Telefon önce tasarlandı; 704px ve 1024px'te iki katman
ekleniyor (haftalık ders saatleri sütunu, sabit sol dizin). JS çalışmazsa sayfa Türkçe olarak
tam okunur kalır. `localStorage` kapalıysa dil tarayıcı diline göre seçilir ve form her açılışta
yeniden gönderilebilir hâle gelir.

## Logo ve favicon'u yeniden üretme

`index.html` logoları ve favicon'u base64 olarak içinde taşır — QR'dan açıldığında tek istek
yeterli olsun diye. Kaynak dosyaları değiştirirsen gömülü sürümleri de yenilemen gerekir:
saydam kenarları kırp, ~620px genişliğe küçült, 96-128 renge indir, base64'e çevir ve
`index.html` içindeki ilgili `data:image/png;base64,…` değerini değiştir.
