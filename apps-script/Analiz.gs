/**
 * KGTÜ Oryantasyon 2026 — Analiz sayfası kurucusu
 *
 * BU DOSYA WEB APP'İN PARÇASI DEĞİLDİR.
 * doPost/doGet'e dokunmaz, yeniden dağıtım gerektirmez. Apps Script
 * düzenleyicisinde bir kez çalıştırılır, "Analiz" sayfasını formüllerle
 * kurar ve işi biter. Formüller canlıdır: yeni geri bildirim düştükçe
 * sayılar kendiliğinden güncellenir, tekrar bir şey çalıştırmana gerek yok.
 *
 * KULLANIM
 *   1. Apps Script düzenleyicisinde + ile yeni dosya ekle, adını Analiz yap.
 *   2. Bu dosyanın içeriğini yapıştır, kaydet.
 *   3. Üstteki fonksiyon listesinden analizSayfasiKur'u seç, Çalıştır'a bas.
 *   4. E-Tabloya dön — "Analiz" sayfası hazır.
 *
 * Yeniden çalıştırmak güvenlidir: sayfa sıfırdan kurulur, elle girdiğin
 * sınıf mevcudu korunur.
 *
 * UYARI: "Geri Bildirim" sayfasının adını değiştirirsen formüller kırılır.
 * Değiştirmen gerekirse Code.gs içindeki SAYFA_ADI'yı da güncelle ve bu
 * fonksiyonu tekrar çalıştır.
 */

var ANALIZ_SAYFASI = 'Analiz';
var SON_SATIR = 2001; // TOPLAM_LIMIT + 1

function analizSayfasiKur() {
  var kitap = SpreadsheetApp.getActiveSpreadsheet();

  if (!kitap.getSheetByName(SAYFA_ADI)) {
    throw new Error('"' + SAYFA_ADI + '" sayfası bulunamadı. Önce en az bir geri bildirim gelmiş olmalı.');
  }

  var s = kitap.getSheetByName(ANALIZ_SAYFASI);
  var mevcutSayisi = '';
  if (s) {
    mevcutSayisi = s.getRange('B12').getValue(); // elle girilen sınıf mevcudunu koru
    s.clear();
  } else {
    s = kitap.insertSheet(ANALIZ_SAYFASI, 0);
  }

  var R = "'" + SAYFA_ADI + "'!";           // veri sayfası referansı
  var sA = R + 'A2:A' + SON_SATIR;          // zaman
  var sB = R + 'B2:B' + SON_SATIR;          // puan
  var sC = R + 'C2:C' + SON_SATIR;          // en faydalı yön
  var sD = R + 'D2:D' + SON_SATIR;          // öneri / eksik
  var sE = R + 'E2:E' + SON_SATIR;          // dil
  var sF = R + 'F2:F' + SON_SATIR;          // cihaz anahtarı (her satırda dolu)

  // ── Başlık ───────────────────────────────────────────────────────────────
  s.getRange('A1').setValue('Oryantasyon Geri Bildirim Analizi');
  s.getRange('A2').setValue('Formüllerle çalışır — yeni geri bildirim geldikçe kendiliğinden güncellenir.');

  // ── GENEL ────────────────────────────────────────────────────────────────
  s.getRange('A4').setValue('GENEL');
  var genel = [
    ['Toplam geri bildirim',      '=COUNTA(' + sF + ')'],
    ['Ortalama puan',             '=IFERROR(ROUND(AVERAGE(' + sB + '),2),"—")'],
    ['Medyan puan',               '=IFERROR(MEDIAN(' + sB + '),"—")'],
    ['En düşük puan',             '=IFERROR(MIN(' + sB + '),"—")'],
    ['En yüksek puan',            '=IFERROR(MAX(' + sB + '),"—")'],
    ['İlk gönderim',              '=IFERROR(MIN(' + sA + '),"—")'],
    ['Son gönderim',              '=IFERROR(MAX(' + sA + '),"—")'],
    ['Sınıf mevcudu (elle gir)',  mevcutSayisi],
    ['Katılım oranı',             '=IF(N(B12)>0,B5/B12,"—")']
  ];
  for (var i = 0; i < genel.length; i++) {
    s.getRange(5 + i, 1).setValue(genel[i][0]);
    var hucre = s.getRange(5 + i, 2);
    if (typeof genel[i][1] === 'string' && genel[i][1].charAt(0) === '=') {
      hucre.setFormula(genel[i][1]);
    } else {
      hucre.setValue(genel[i][1]);
    }
  }
  s.getRange('B6').setNumberFormat('0.00');
  s.getRange('B10:B11').setNumberFormat('dd.MM.yyyy HH:mm');
  s.getRange('B13').setNumberFormat('0.0%');
  s.getRange('B12').setNote('Sınıf mevcudunu buraya yaz; katılım oranı otomatik hesaplanır.');

  // ── PUAN DAĞILIMI ────────────────────────────────────────────────────────
  s.getRange('A15').setValue('PUAN DAĞILIMI');
  s.getRange('A16:D16').setValues([['Puan', 'Kişi', 'Oran', 'Dağılım']]);
  for (var p = 1; p <= 5; p++) {
    var r = 16 + p;
    s.getRange(r, 1).setValue(p);
    s.getRange(r, 2).setFormula('=COUNTIF(' + sB + ',$A' + r + ')');
    s.getRange(r, 3).setFormula('=IF($B$5=0,0,B' + r + '/$B$5)');
    s.getRange(r, 4).setFormula('=IF(B' + r + '=0,"",REPT("▉",ROUND(C' + r + '*25)))');
  }
  s.getRange('C17:C21').setNumberFormat('0.0%');

  // ── MEMNUNİYET ───────────────────────────────────────────────────────────
  s.getRange('A23').setValue('MEMNUNİYET');
  s.getRange('A24:C24').setValues([['Grup', 'Kişi', 'Oran']]);
  var gruplar = [
    ['Memnun (4-5)',       '=COUNTIFS(' + sB + ',">=4")'],
    ['Kararsız (3)',       '=COUNTIF(' + sB + ',3)'],
    ['Memnun değil (1-2)', '=COUNTIFS(' + sB + ',">0",' + sB + ',"<=2")']
  ];
  for (var g = 0; g < gruplar.length; g++) {
    var rg = 25 + g;
    s.getRange(rg, 1).setValue(gruplar[g][0]);
    s.getRange(rg, 2).setFormula(gruplar[g][1]);
    s.getRange(rg, 3).setFormula('=IF($B$5=0,0,B' + rg + '/$B$5)');
  }
  s.getRange('C25:C27').setNumberFormat('0.0%');

  // ── AÇIK UÇLU SORULAR ────────────────────────────────────────────────────
  s.getRange('A29').setValue('AÇIK UÇLU SORULAR');
  s.getRange('A30:C30').setValues([['Ölçüt', 'Kişi', 'Oran']]);
  var acik = [
    ['"En faydalı yön" yanıtlayan', '=COUNTIF(' + sC + ',"?*")'],
    ['"Öneri / eksik" yanıtlayan',  '=COUNTIF(' + sD + ',"?*")'],
    ['İkisini de yanıtlayan',       '=COUNTIFS(' + sC + ',"?*",' + sD + ',"?*")'],
    ['En az birini yanıtlayan',     '=B31+B32-B33'],
    ['İkisini de boş bırakan',      '=B5-B34']
  ];
  for (var a = 0; a < acik.length; a++) {
    var ra = 31 + a;
    s.getRange(ra, 1).setValue(acik[a][0]);
    s.getRange(ra, 2).setFormula(acik[a][1]);
    s.getRange(ra, 3).setFormula('=IF($B$5=0,0,B' + ra + '/$B$5)');
  }
  s.getRange('C31:C35').setNumberFormat('0.0%');

  s.getRange('A36').setValue('Yanıt başına ortalama uzunluk (karakter)');
  s.getRange('B36').setFormula(
    '=IFERROR(ROUND((SUMPRODUCT(LEN(' + sC + '))+SUMPRODUCT(LEN(' + sD + ')))/MAX(1,B31+B32),0),0)');

  // ── SAYFA DİLİ ───────────────────────────────────────────────────────────
  s.getRange('A38').setValue('SAYFA DİLİ');
  s.getRange('A39:C39').setValues([['Dil', 'Kişi', 'Oran']]);
  var diller = [['Türkçe', 'tr'], ['İngilizce', 'en']];
  for (var d = 0; d < diller.length; d++) {
    var rd = 40 + d;
    s.getRange(rd, 1).setValue(diller[d][0]);
    s.getRange(rd, 2).setFormula('=COUNTIF(' + sE + ',"' + diller[d][1] + '")');
    s.getRange(rd, 3).setFormula('=IF($B$5=0,0,B' + rd + '/$B$5)');
  }
  s.getRange('C40:C41').setNumberFormat('0.0%');

  // ── GÜNLÜK DAĞILIM (sağ sütun) ───────────────────────────────────────────
  s.getRange('F4').setValue('GÜNLÜK DAĞILIM');
  s.getRange('F5:G5').setValues([['Gün', 'Gönderim']]);
  s.getRange('F6').setFormula(
    '=IFERROR(QUERY({INT(' + sA + ')},' +
    '"select Col1, count(Col1) where Col1 > 0 group by Col1 order by Col1 label Col1 \'\', count(Col1) \'\'",0),' +
    '"Henüz veri yok")');
  s.getRange('F6:F60').setNumberFormat('dd.MM.yyyy');

  // ── SON YORUMLAR ─────────────────────────────────────────────────────────
  s.getRange('A44').setValue('SON YORUMLAR (en yeni 20)');
  s.getRange('A45').setFormula(
    '=IFERROR(QUERY(' + R + 'A2:E' + SON_SATIR + ',' +
    '"select A, B, C, D where (C is not null and C != \'\') or (D is not null and D != \'\') ' +
    'order by A desc limit 20 ' +
    'label A \'Zaman\', B \'Puan\', C \'En faydalı yön\', D \'Öneri / eksik\'",0),' +
    '"Henüz yorum yok")');
  s.getRange('A46:A70').setNumberFormat('dd.MM.yyyy HH:mm');

  // ── Biçim ────────────────────────────────────────────────────────────────
  s.getRange('A1').setFontSize(15).setFontWeight('bold');
  s.getRange('A2').setFontSize(9).setFontColor('#7a7a7a');

  var basliklar = ['A4', 'A15', 'A23', 'A29', 'A38', 'A44', 'F4'];
  for (var b = 0; b < basliklar.length; b++) {
    s.getRange(basliklar[b]).setFontWeight('bold').setFontColor('#8E1D22');
  }
  var satirBasliklari = ['A16:D16', 'A24:C24', 'A30:C30', 'A39:C39', 'F5:G5'];
  for (var sb = 0; sb < satirBasliklari.length; sb++) {
    s.getRange(satirBasliklari[sb]).setFontWeight('bold').setBackground('#F6EAEA');
  }

  s.getRange('A5:A13').setFontWeight('bold');
  s.getRange('B12').setBackground('#FFF8E8').setBorder(true, true, true, true, false, false);
  s.getRange('D17:D21').setFontColor('#8E1D22');

  s.setColumnWidth(1, 300);
  s.setColumnWidth(2, 110);
  s.setColumnWidth(3, 90);
  s.setColumnWidth(4, 210);
  s.setColumnWidth(6, 120);
  s.setColumnWidth(7, 100);
  s.setFrozenRows(2);

  kitap.toast('Analiz sayfası kuruldu.', 'Tamam', 5);
}
