/**
 * KGTÜ Bilgisayar Mühendisliği — Oryantasyon Rehberi
 * Geri bildirim toplayıcı (Google Apps Script Web App)
 *
 * Bu dosyayı bir Google E-Tablo'ya bağlı Apps Script projesine yapıştır ve
 * Web App olarak deploy et. Kurulum adımları README.md içinde.
 *
 * Gelen istek gövdesi (index.html tarafından JSON olarak gönderilir):
 *   { puan, faydali, oneri, cihaz, dil, zaman }
 *
 * Yanıt:
 *   { ok: true }                      -> kaydedildi
 *   { ok: false, hata: "tekrar" }     -> bu cihazdan daha önce gönderilmiş
 *   { ok: false, hata: "..." }        -> diğer hatalar
 */

/** Verilerin yazılacağı sayfa adı. Yoksa otomatik oluşturulur. */
var SAYFA_ADI = 'Geri Bildirim';

/** Sütun başlıkları — sıralama doPost içindeki appendRow ile eşleşmeli. */
var BASLIKLAR = ['Zaman (sunucu)', 'Puan (1-5)', 'En faydalı yön', 'Öneri / eksik', 'Dil', 'Cihaz anahtarı'];

function doPost(e) {
  var kilit = LockService.getScriptLock();
  try {
    // Aynı anda gelen iki istek mükerrer kayıt oluşturmasın.
    kilit.waitLock(20000);

    if (!e || !e.postData || !e.postData.contents) {
      return yanit({ ok: false, hata: 'bos-govde' });
    }

    var veri;
    try {
      veri = JSON.parse(e.postData.contents);
    } catch (hata) {
      return yanit({ ok: false, hata: 'gecersiz-json' });
    }

    var puan = parseInt(veri.puan, 10);
    if (!(puan >= 1 && puan <= 5)) {
      return yanit({ ok: false, hata: 'gecersiz-puan' });
    }

    var cihaz = String(veri.cihaz || '').slice(0, 64);
    if (!cihaz) {
      return yanit({ ok: false, hata: 'cihaz-yok' });
    }

    var sayfa = sayfayiAl();

    // Cihaz başına tek gönderim: son sütundaki anahtarları tara.
    if (cihazVarMi(sayfa, cihaz)) {
      return yanit({ ok: false, hata: 'tekrar' });
    }

    sayfa.appendRow([
      new Date(),
      puan,
      String(veri.faydali || '').slice(0, 1000),
      String(veri.oneri || '').slice(0, 1000),
      String(veri.dil || '').slice(0, 8),
      cihaz
    ]);

    return yanit({ ok: true });

  } catch (hata) {
    return yanit({ ok: false, hata: String(hata) });
  } finally {
    try { kilit.releaseLock(); } catch (hata) {}
  }
}

/** Tarayıcıdan /exec adresi açıldığında görünen basit sağlık kontrolü. */
function doGet() {
  return yanit({ ok: true, servis: 'kgtu-ceng-oryantasyon-geri-bildirim' });
}

/** JSON yanıt üretir. */
function yanit(nesne) {
  return ContentService
    .createTextOutput(JSON.stringify(nesne))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Hedef sayfayı döndürür; yoksa başlıklarıyla birlikte oluşturur. */
function sayfayiAl() {
  var kitap = SpreadsheetApp.getActiveSpreadsheet();
  var sayfa = kitap.getSheetByName(SAYFA_ADI);
  if (!sayfa) {
    sayfa = kitap.insertSheet(SAYFA_ADI);
  }
  if (sayfa.getLastRow() === 0) {
    sayfa.appendRow(BASLIKLAR);
    sayfa.getRange(1, 1, 1, BASLIKLAR.length).setFontWeight('bold');
    sayfa.setFrozenRows(1);
  }
  return sayfa;
}

/** Cihaz anahtarı daha önce kaydedilmiş mi? */
function cihazVarMi(sayfa, cihaz) {
  var sonSatir = sayfa.getLastRow();
  if (sonSatir < 2) return false;
  var sutun = BASLIKLAR.length; // Cihaz anahtarı en son sütunda
  var degerler = sayfa.getRange(2, sutun, sonSatir - 1, 1).getValues();
  for (var i = 0; i < degerler.length; i++) {
    if (String(degerler[i][0]) === cihaz) return true;
  }
  return false;
}
