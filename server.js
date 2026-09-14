const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
const PORT = Number(process.env.PORT) || 1111;
const apiKey = process.env.GEMINI_API_KEY;
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use(express.json({ limit: '64kb' }));
app.use(express.json({ limit: '64kb' }));
app.use(express.static(__dirname));


const menuText = `
MONDO CAFFE PIZZA & RISTORANTE - CIJENE U KM/BAM
DORUCAK
Mondo (3 jaja, 1 kobasica, slanina, gljive, pogacice, pomfrit) - 14,00 KM
Domacinski (2 jaja, 2 slanine, 2 cevapa, 2 rostiljske kobasice, ustipci) - 16,00 KM
Bekendeks (3 jaja, slanina, pogacice) - 7,00 KM
Hemendeks (3 jaja, sunka, pogacice) - 7,00 KM
Jaja Kobasica (3 jaja, kranjska kobasica, pogacice) - 7,00 KM
Jaja Suvi vrat (3 jaja, suvi vrat, pogacice) - 7,00 KM
Omlet (3 jaja, pogacice; po izboru: sunka, suvi vrat, kulen, gljive) - 7,00 KM
Ustipci (10 ustipaka, kulen, vrat, pavlaka, svjezi sir) - 10,00 KM
Punjene przenice (sunka, trapist, feta sir, paradajz) - 10,00 KM
PREDJELO
Hladna plata (kulen, pecenica, suvi vrat, prsut, sir, masline, pogacice) - 20,00 KM
Gljive na zaru (sampinjoni, riza) - 7,00 KM
Carbonara Spagete (pasta, slanina, sunka, jaje, pavlaka) - 10,00 KM
Bolonjeze Spagete (pasta, bolonjeze sos) - 10,00 KM
Rizoto sa Gljivama (riza, sampinjoni, pogacice) - 10,00 KM
GOTOVA JELA
Teleca corba - 7,00 KM
Riblja corba - 7,00 KM
Pasulj posni (hleb, kupus salata) - 6,00 KM
Pasulj sa kobasicom (hleb, kupus salata) - 8,00 KM
Gulas juneći (hleb, kupus salata) - 10,00 KM
GLAVNA JELA
Piletina punjena u sosu mala (punjeno bijelo meso 100gr, sampinjon sos, riza, pogacice) - 10,00 KM
Piletina punjena u sosu velika (punjeno bijelo meso 200gr, sampinjon sos, riza, pogacice) - 16,00 KM
Becka snicla (snicla 150 gr, pomfrit, pogacice) - 14,00 KM
Karadjordjeva snicla mala (snicla 150 gr, suvi vrat, svjezi sir, pomfrit, pogacice) - 12,00 KM
Karadjordjeva snicla velika (snicla 200 gr, suvi vrat, svjezi sir, pomfrit, pogacice) - 17,00 KM
Piletina na zaru (pileci file 150gr, pomfrit, pogacice) - 14,00 KM
Pohovana piletina (pileci file 150gr, pomfrit, pogacice) - 15,00 KM
Pileci stapici sa susamom (pileci file 150gr, pomfrit, pogacice) - 17,00 KM
Kari piletina (piletina, gljive sos, riza, pogacice) - 17,00 KM
Piletina u sampinjon sosu (pileci file 150gr, sampinjon sos, riza, pogacice) - 17,00 KM
Piletina Quatro Formaggi (pileci file 150gr, sos 4 vrste sira, riza, pogacice) - 17,00 KM
Oslic (oslic 250gr, krompir salata, pogacice) - 9,00 KM
Riblji stapici (panirani riblji stapici, pomfrit, pogacice) - 9,00 KM
ROSTILJ
Mali cevapi (5 cevapa, 1/2 lepine) - 6,00 KM
Srednji cevapi (7 cevapa, 1/2 lepine) - 8,00 KM
Veliki cevapi (10 cevapa, 1 lepina) - 11,00 KM
Mala pljeskavica (150 gr) - 8,00 KM
Velika pljeskavica (200 gr) - 11,00 KM
Punjena pljeskavica (punjenje sunka, sir) - 13,00 KM
Gurmanska pljeskavica (slanina, luk, sir, cili) - 13,00 KM
Pileci raznjici (pileci file rolovan u slanini, pomfrit, lepina) - 13,00 KM
Mijesano meso (piletina, snicla, svinjski vrat, slanina, cevapi, pljeskavica, raznjic, rostiljska kobasica, pekarski krompir, lepina) - 25,00 KM
Gril plata (2x Mijesano meso) - 40,00 KM
SENDVICI - BESPLATNA 2 PRILOGA
Sunka (sunka, sir trapist) - Mala 5,00 KM / Velika 6,00 KM
Kulen (kulen, sir trapist) - Mala 7,00 KM / Velika 9,00 KM
Suvi vrat (suvi vrat, sir trapist) - Mala 7,00 KM / Velika 9,00 KM
Pecenica (pecenica, sir trapist) - Mala 7,00 KM / Velika 9,00 KM
Piletina (pileci file na zaru, sir) - Mala 7,00 KM / Velika 9,00 KM
Pohovana piletina (pohovani file, sir) - Mala 8,00 KM / Velika 10,00 KM
Index (pecena sunka, gljive, sir) - Mala 7,00 KM / Velika 9,00 KM
Mondo (vrat, kulen, pecenica, sir) - Mala 9,00 KM / Velika 11,00 KM
Posni (tunjevina, posni sir) - Mala 7,00 KM / Velika 9,00 KM
TOST SENDVICI
Sunka (tost, sunka, sir, pomfrit) - 7,00 KM
Suvi vrat (tost, suvi vrat, sir, pomfrit) - 8,00 KM
Posni (tost, tunjevina, posni sir, pomfrit) - 8,00 KM
PIZZA - MALA / VELIKA / PORODICNA
Capriciosa - 8,00 / 11,00 / 19,00 KM
Vesuvio - 8,00 / 11,00 / 19,00 KM
Margherita - 8,00 / 11,00 / 19,00 KM
Arabbiata - 10,00 / 13,00 / 21,00 KM
Al Funghi - 8,00 / 11,00 / 19,00 KM
Al Tonno - 9,00 / 12,00 / 20,00 KM
Quatro Formaggi - 9,00 / 12,00 / 20,00 KM
Quatro Stagioni - 9,00 / 12,00 / 20,00 KM
Alpska - 9,00 / 12,00 / 20,00 KM
Mexicana - 10,00 / 13,00 / 21,00 KM
Mondo - 11,00 / 14,00 / 23,00 KM
Piroska - 9,00 / 12,00 / N/D
Calzzona - 9,00 / 12,00 / 21,00 KM
Pizza Piletina - 10,00 / 13,00 / N/D
Pizza Nutela - 9,00 / 12,00 / N/D
Pizza Vegetariana - 9,00 / 12,00 / 20,00 KM
Posna Pizza - 8,00 / 11,00 / 19,00 KM
Pica Domacinska - 14,00 / 16,00 / 25,00 KM
PALACINKE
Slane: Sunka sir gljive - 8,00 KM; Suvi vrat sir - 10,00 KM; Kulen sir - 10,00 KM; Pecenica sir - 10,00 KM; Besamel - 15,00 KM
Slatke: Krem plazma - 5,50 KM; Nutela plazma - 6,00 KM; Dzem - 5,00 KM
SALATE
Mondo - 10,00 KM; Cezar - 10,00 KM; Posna - 8,00 KM; Sopska - 6,00 KM; Paradajz - 4,00 KM; Kupus - 3,00 KM; Mijesana - 5,00 KM
DODACI
Pogacice - 2,00 KM; Lepina - 2,00 KM; Pomfrit mini - 2,00 KM; Pomfrit mali - 3,00 KM; Pomfrit veliki - 4,00 KM; Pekarski krompir - 4,00 KM; Sampinjon sos - 4,00 KM; Gorgonzola sos - 4,00 KM; Quattro Formaggi sos - 4,00 KM
`;

const systemInstruction = `Ti si ljubazan i precizan AI agent za porucivanje hrane restorana Mondo Caffe Pizza & Ristorante u Bijeljini. UVEK razgovaraj iskljucivo na srpskom jeziku, latinicom. Koristi samo meni i cene ispod; ne izmisljaj artikle, sastojke ili cene. Cene su u KM/BAM.

Tok porudzbine:
1. Pozdravi gosta i pomozi mu da izabere jela. Ako nije jasno, postavi jedno kratko pitanje.
2. Zapamti artikle, kolicine i velicine u toku razgovora.
3. Kada gost izabere artikle, pitaj da li želi dodatke/priloge. Za sendviče su poznati besplatni prilozi: kečap, majonez, pavlaka, paradajz, krastavci, kupus i zelena salata. Zapamti izabrane dodatke; ako ih ne želi, nastavi dalje.
4. Kada gost izabere artikle i dodatke, trazi punu adresu za dostavu, a zatim i broj telefona za kontakt.
5. Dostava je moguca samo unutar grada Bijeljina. Ako adresa nije u Bijeljini, ljubazno odbij dostavu i ponudi preuzimanje u restoranu na adresi Racanska 2, Bijeljina.
6. Pre potvrde uvek prikazi kratak pregled u ovom formatu:
PORUDZBINA:
- [kolicina] x [artikal] — [cena] KM
DODACI: [izabrani dodaci ili "bez dodataka"]
UKUPNO: [iznos] KM
ADRESA DOSTAVE: [adresa]
TELEFON: [broj telefona]
Da li je ovo vaša konačna porudžbina?
7. Ne tvrdi da je porudzbina poslata dok gost izricito ne potvrdi.
8. Kada gost potvrdi, reci da je porudzbina prosledjena kuhinji i navedi da ce osoblje kontaktirati gosta ako je potrebno. Ne izmisljaj vreme dostave.

MENI:
${menuText}`;

const model = apiKey ? new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-3.6-flash', systemInstruction }) : null;
const orderModel = apiKey ? new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-3.6-flash' }) : null;

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-20).filter(entry => (entry.role === 'user' || entry.role === 'model') && Array.isArray(entry.parts) && typeof entry.parts[0]?.text === 'string').map(entry => ({ role: entry.role, parts: [{ text: entry.parts[0].text.slice(0, 4000) }] }));
}

function addressIsInBijeljina(address) {
  const normalized = String(address || '').toLocaleLowerCase('sr-Latn');
  const localStreets = ['racanska', 'gavrila principa', 'filipa visnjica', 'sremska', 'neznanih junaka', 'patrijarha pavla', 'majora ilica', 'trg kralja petra'];
  return normalized.includes('bijeljin') || localStreets.some(street => normalized.includes(street));
}

function clearlyOutsideBijeljina(text) {
  const normalized = String(text || '').toLocaleLowerCase('sr-Latn');
  return ['banja luka', 'sarajevo', 'tuzla', 'brcko', 'beograd', 'novi sad', 'brčko'].some(place => normalized.includes(place));
}

async function extractOrder(history) {
  if (!orderModel) return null;
  const transcript = history.map(entry => `${entry.role}: ${entry.parts[0].text}`).join('\n');
  const prompt = `Izvuci konacnu potvrdjenu porudzbinu iz sledeceg razgovora. Vrati iskljucivo validan JSON bez markdowna u obliku {"items":[{"name":"...","quantity":1,"price":"0.00 KM","addons":["majonez"]}],"addons":["majonez"],"total":"0.00 KM","deliveryAddress":"...","customerPhone":"..."}. Ako nema potvrđene porudžbine ili nedostaje adresa ili telefon, vrati null.\n\n${transcript}`;
  try {
    const result = await orderModel.generateContent(prompt);
    const raw = result.response.text().replace(/^```json\s*|\s*```$/g, '').trim();
    return JSON.parse(raw);
  } catch (error) {
    console.error('Order extraction failed:', error.message);
    return null;
  }
}

async function sendKitchenNotification(order) {
  const payload = { ...order, timestamp: new Date().toISOString() };
  if (process.env.KITCHEN_WEBHOOK_URL) {
    const response = await fetch(process.env.KITCHEN_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`Kitchen webhook returned ${response.status}`);
  } else if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const lines = [
      'NOVA MONDO PORUDZBINA',
      ...payload.items.map(item => `- ${item.quantity} x ${item.name} — ${item.price}${item.addons?.length ? ` [${item.addons.join(', ')}]` : ''}`),
      `DODACI: ${payload.addons?.length ? payload.addons.join(', ') : 'bez dodataka'}`,
      `UKUPNO: ${payload.total}`,
      `ADRESA: ${payload.deliveryAddress}`,
      `TELEFON: ${payload.customerPhone}`,
      `VREME: ${payload.timestamp}`
    ];
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: lines.join('\n') })
    });
    if (!response.ok) throw new Error(`Telegram webhook returned ${response.status}`);
  } else {
    console.log('[SIMULATED KITCHEN WEBHOOK]', JSON.stringify(payload, null, 2));
  }
  return payload;
}

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Poruka ne može biti prazna.' });
  if (!model) return res.status(503).json({ error: 'Gemini nije konfigurisan. Dodajte GEMINI_API_KEY u .env fajl.' });

  if (clearlyOutsideBijeljina(message)) {
    return res.json({ reply: 'Nažalost, dostava je dostupna samo na području Bijeljine. Porudžbinu možete preuzeti u restoranu Mondo na adresi Račanska 2, Bijeljina.' });
  }

  const priorHistory = cleanHistory(history).filter(entry => entry.parts[0].text !== message).slice(-19);
  try {
    const chat = model.startChat({ history: priorHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();
    const hasSummary = priorHistory.some(entry => /konačna porudžbina|konacna porudzbina/i.test(entry.parts[0].text));
    const confirmation = hasSummary && /^(da|potvrđujem|potvrđujem porudžbinu|jeste|može|moze|potvrda)\b/i.test(message.trim());
    let notificationSent = false;
    let notificationError = null;
    if (confirmation) {
      const order = await extractOrder([...priorHistory, { role: 'user', parts: [{ text: message.trim() }] }]);
      if (order && addressIsInBijeljina(order.deliveryAddress) && order.customerPhone) {
        try { await sendKitchenNotification(order); notificationSent = true; } catch (error) { notificationError = error.message; console.error('Kitchen notification failed:', error.message); }
      }
    }
    res.json({ reply, orderAccepted: confirmation, notificationSent, notificationError });
  } catch (error) {
    console.error('Gemini request failed:', error.message);
    const detail = String(error.message || 'Nepoznata Gemini greška.').replace(apiKey || '', '[redigovano]');
    const responseMessage = process.env.NODE_ENV === 'production'
      ? 'Trenutno ne mogu da odgovorim. Pokušajte ponovo za trenutak.'
      : `Gemini greška: ${detail}`;
    res.status(502).json({ error: responseMessage });
  }
});


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(process.env.PORT || 1111, '0.0.0.0', () => {
  console.log(`Mondo AI server sluša na portu ${process.env.PORT || 1111}`);
});
