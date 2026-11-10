/* Portulan des saints : carte, sélecteurs, rencontre, verdict. Bilingue FR/EN. Aucune dépendance. */
(function () {
  'use strict';
  const SVGNS = 'http://www.w3.org/2000/svg';
  const LON0 = -26, LAT1 = 72, SX = 10, SY = 13;          // projection « plate » façon portulan
  const MAP_W = 1440, MAP_H = 884;                          // lon −26..118, lat 72..4
  const VIEW0 = { x: -48, y: -56, w: 1536, h: 996 };        // toute la peau
  const MEET_KM = 60, NEAR_KM = 250;
  const X = lon => (lon - LON0) * SX, Y = lat => (LAT1 - lat) * SY;
  const P = (lon, lat) => [X(lon), Y(lat)];

  /* ---------- Langues (de l'interface et des saints) ---------- */
  const LANG_NAMES = {
    fr: { lat: 'latin', grc: 'grec', syc: 'syriaque', cop: 'copte', hye: 'arménien', xcl: 'arménien', kat: 'géorgien', sga: 'vieil irlandais', gla: 'gaélique', cym: 'brittonique', bre: 'breton', cor: 'cornique', ang: 'vieil anglais', enm: 'moyen anglais', non: 'vieux norrois', got: 'gotique', frk: 'francique', goh: 'vieux haut-allemand', gmh: 'moyen haut-allemand', odt: 'vieux néerlandais', fro: 'ancien français', frm: 'moyen français', xno: 'anglo-normand', oci: 'occitan', cat: 'catalan', spa: 'castillan', por: 'galaïco-portugais', ita: 'italien', chu: 'vieux slave', orv: 'vieux russe', pol: 'vieux polonais', ces: 'vieux tchèque', srp: 'serbe', bul: 'bulgare', hun: 'hongrois', fin: 'finnois', kom: 'komi', ara: 'arabe', fas: 'persan', pal: 'moyen-perse', heb: 'hébreu', arc: 'araméen', tur: 'turc', kip: 'kiptchak', mon: 'mongol', ber: 'berbère', mal: 'malayalam', gez: 'guèze', egy: 'égyptien', rom: 'roman commun', xtg: 'gaulois', khz: 'khazar', ofs: 'vieux frison', osx: 'vieux saxon', sla: 'slave', dan: 'vieux danois', swe: 'vieux suédois', isl: 'vieil islandais', lit: 'lituanien', prg: 'vieux prussien', est: 'estonien', alb: 'albanais', ron: 'roumain', xpr: 'parthe', sog: 'sogdien', uig: 'ouïghour', zho: 'chinois', tam: 'tamoul', san: 'sanskrit', nub: 'nubien', wln: 'wallon', frp: 'francoprovençal', sco: 'scots', lad: 'ladin', fur: 'frioulan' },
    en: { lat: 'Latin', grc: 'Greek', syc: 'Syriac', cop: 'Coptic', hye: 'Armenian', xcl: 'Armenian', kat: 'Georgian', sga: 'Old Irish', gla: 'Gaelic', cym: 'Brittonic', bre: 'Breton', cor: 'Cornish', ang: 'Old English', enm: 'Middle English', non: 'Old Norse', got: 'Gothic', frk: 'Frankish', goh: 'Old High German', gmh: 'Middle High German', odt: 'Old Dutch', fro: 'Old French', frm: 'Middle French', xno: 'Anglo-Norman', oci: 'Occitan', cat: 'Catalan', spa: 'Castilian', por: 'Galician-Portuguese', ita: 'Italian', chu: 'Old Church Slavonic', orv: 'Old East Slavic', pol: 'Old Polish', ces: 'Old Czech', srp: 'Serbian', bul: 'Bulgarian', hun: 'Hungarian', fin: 'Finnish', kom: 'Komi', ara: 'Arabic', fas: 'Persian', pal: 'Middle Persian', heb: 'Hebrew', arc: 'Aramaic', tur: 'Turkish', kip: 'Kipchak', mon: 'Mongolian', ber: 'Berber', mal: 'Malayalam', gez: 'Geʿez', egy: 'Egyptian', rom: 'Common Romance', xtg: 'Gaulish', khz: 'Khazar', ofs: 'Old Frisian', osx: 'Old Saxon', sla: 'Slavic', dan: 'Old Danish', swe: 'Old Swedish', isl: 'Old Icelandic', lit: 'Lithuanian', prg: 'Old Prussian', est: 'Estonian', alb: 'Albanian', ron: 'Romanian', xpr: 'Parthian', sog: 'Sogdian', uig: 'Uyghur', zho: 'Chinese', tam: 'Tamil', san: 'Sanskrit', nub: 'Nubian', wln: 'Walloon', frp: 'Franco-Provençal', sco: 'Scots', lad: 'Ladin', fur: 'Friulian' }
  };
  const LEVEL = { natif: 3, courant: 2, notions: 1 };

  const I18N = {
    fr: {
      eyebrow: 'Carte marine à l\'usage des curieux', title: 'Portulan des saints',
      sub: 'Deux saints du calendrier auraient-ils pu se croiser de leur vivant ? Choisissez-en deux : la carte trace leurs chemins, cherche le carrefour et devine en quelle langue ils se seraient parlé.',
      first: 'Premier saint', second: 'Second saint', redInk: 'encre rouge', greenInk: 'encre verte',
      random: 'Tirer deux saints au sort', today: 'Les saints du jour', swap: 'Échanger', fit: 'Cadrer', all: 'Tout',
      hint: 'Molette ou pincement pour zoomer, glisser pour déplacer. Les noms des petits ports apparaissent en zoomant.',
      colophon: 'Itinéraires reconstitués d\'après les vies des saints (Wikipédia, notices hagiographiques) : les dates sont souvent approximatives et certains voyages relèvent de la légende, signalée comme telle. Trait de côte Natural Earth. Dessin inspiré du portulan de Vesconte Maggiolo (1541) et de l\'Atlas catalan (1375).',
      byName: 'Par nom', byDate: 'Par date de fête', searchPh: 'Un nom, un lieu, un siècle…', searchAria: 'Chercher un saint par nom', month: 'Mois', day: 'Jour',
      none: 'Aucun saint ne répond à cet appel.', noneOnDay: d => `Aucun saint du portulan n'est fêté le ${d}. Les plus proches :`,
      feast: d => `fête le ${d}`, nobody: 'Personne pour l\'instant : tapez un nom, un lieu (« Irlande », « Rome ») ou un siècle (« 7e »).',
      months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
      dayLabel: (d, m) => (d === 1 ? '1er' : d) + ' ' + m, circa: 'v. ', year: t => `an ${t}`,
      level: { natif: 'langue maternelle', courant: 'couramment', notions: 'quelques notions' },
      how: { natif: 'langue maternelle', courant: 'couramment', notions: 'avec quelques notions' },
      tradition: { catholique: 'catholique', orthodoxe: 'orthodoxe', commune: 'vénéré des deux côtés' },
      legend: 'légende', probable: 'probable', attested: 'rencontre attestée', inTransit: 'de passage',
      tipStop: (place, years, legend, note) => `${place} (${years})${legend ? ' · légende' : ''}\n${note || ''}`,
      pawnAge: (n, age) => `${n}, ${age} ans`, pawnUnborn: (n, f) => `${n} (pas encore né${f ? 'e' : ''})`, pawnDead: (n, y) => `${n} († ${y})`,
      pawnMoving: (n, a, b) => `${n} voyage de ${a} vers ${b}`, pawnAt: (n, p) => `${n} est à ${p}`,
      missing: 'Il manque un second saint', missingLede: 'Choisissez-en un autre pour savoir s\'ils auraient pu se croiser.',
      neverHead: gap => `Impossible : ${gap >= 100 ? Math.round(gap / 100) + ' siècle' + (gap >= 150 ? 's' : '') : gap + ' ans'} les séparent`,
      neverLede: (f, fd, s, gap, sb) => `Quand ${f} meurt en ${fd}, ${s} ne naîtra que ${gap} ans plus tard, en ${sb}.`,
      samePlacesOtherTimes: 'Mêmes lieux, autres temps', samePlacesOtherYears: 'Mêmes lieux, autres années', missed: 'Les occasions manquées', crossroads: 'Les carrefours', sources: 'Ce que disent les sources',
      sharedNever: (place, A, ra, B, rb, gap) => `${place} : ${A} y est ${ra}, ${B} ${rb}. Ils ont peut-être foulé les mêmes dalles, à ${gap} ans d'écart.`,
      sharedMissed: (place, A, ra, B, rb, gap) => `${place} : ${A} ${ra}, ${B} ${rb} : raté de ${gap} an${gap > 1 ? 's' : ''}.`,
      rangeIn: y => `en ${y}`, rangeFromTo: (a, b) => `de ${a} à ${b}`,
      twoWorlds: 'Leurs chemins ne passent même pas par les mêmes villes. Deux mondes.',
      noCross: 'Leurs itinéraires ne se recoupent nulle part. Il aurait fallu une lettre, ou un pèlerinage de plus.',
      onlyNear: d => `Aucune ville commune, seulement ce voisinage de ${d} km.`,
      contemporaries: (n, a, b) => `Contemporains pendant ${n} an${n > 1 ? 's' : ''} (${a} à ${b}).`,
      meetHead: place => `Rencontre possible à ${place}`,
      meetLede: (when, transit, A, ageA, B, ageB, contemp) => `${when}${transit ? ', l\'un des deux étant de passage' : ''}. ${A} a alors ${ageA} ans, ${B} en a ${ageB}. ${contemp}`,
      whenIn: y => `En ${y}`, whenBetween: (a, b) => `Entre ${a} et ${b}`,
      nearHead: km => `Presque : ${km} km les séparent au plus près`,
      nearLede: (y, A, pa, B, pb, contemp) => `Vers ${y}, ${A} est à ${pa} et ${B} à ${pb} : quelques jours de marche, mais personne n'a fait le détour. ${contemp}`,
      apartHead: 'Contemporains, mais jamais à portée de voix',
      attestedHead: where => `Rencontre attestée${where ? ' : ' + where : ''}`,
      attestedLede: (y, contemp) => `Nos itinéraires, forcément simplifiés, ne les placent pas au même endroit au même moment, mais les sources sont formelles${y ? ' (' + y + ')' : ''}. ${contemp}`,
      apartLede: (contemp, km, y) => `${contemp} Au plus près, ${km} km les séparent vers ${y}.`,
      onTheWay: 'en chemin',
      langHead: 'En quelle langue ?',
      langNone: (A, la, B, lb) => `Aucune langue commune : il aurait fallu un interprète, ou beaucoup de gestes. ${A} parle ${la} ; ${B} parle ${lb}.`,
      langIntro: hyp => hyp ? 'S\'ils avaient été contemporains, ils auraient pu se parler' : 'Ils auraient pu se parler',
      langIn: l => ` en <b>${l}</b>`,
      langSame: { natif: ', leur langue maternelle à tous deux.', courant: ', que tous deux pratiquent couramment.', notions: ', avec des notions de part et d\'autre : conversation laborieuse mais possible.' },
      langDiff: (ha, A, hb, B) => ` : ${ha} pour ${A}, ${hb} pour ${B}.`,
      todayTwo: (d, names, more) => `Aujourd'hui ${d} : ${names}${more ? ' (les deux premiers sont affichés)' : ''}.`,
      todayOne: (d, n, other, od) => `Aujourd'hui ${d} : ${n}. Pour lui tenir compagnie, le plus proche au calendrier : ${other} (${od}).`,
      todayNone: (d, list) => `Personne du portulan n'est fêté ce ${d}. Les plus proches au calendrier : ${list}.`,
      and: ' et ', count: (n, a, b, c) => `${n} saints et saintes, de ${a} à ${b}, ${c} lieux nommés.`,
      play: 'Faire défiler les années', pause: 'Arrêter', zoomIn: 'Agrandir', zoomOut: 'Réduire', toDark: 'Passer en mode sombre', toLight: 'Passer en mode clair',
      stTitle: s => (s.sex === 'f' ? 'sainte ' : 'saint ') + s.name
    },
    en: {
      eyebrow: 'A sea chart for the curious', title: 'Portolan of the Saints',
      sub: 'Could two saints of the calendar have met in their lifetimes? Pick two: the chart draws their journeys, looks for the crossroads and guesses which language they would have spoken.',
      first: 'First saint', second: 'Second saint', redInk: 'red ink', greenInk: 'green ink',
      random: 'Draw two saints at random', today: 'Today\'s saints', swap: 'Swap', fit: 'Frame', all: 'All',
      hint: 'Scroll or pinch to zoom, drag to pan. Small ports show their names as you zoom in.',
      colophon: 'Itineraries reconstructed from the lives of the saints (Wikipedia, hagiographical notices): dates are often approximate and some journeys belong to legend, flagged as such. Coastlines from Natural Earth. Drawing inspired by Vesconte Maggiolo\'s portolan chart (1541) and the Catalan Atlas (1375).',
      byName: 'By name', byDate: 'By feast day', searchPh: 'A name, a place, a century…', searchAria: 'Search a saint by name', month: 'Month', day: 'Day',
      none: 'No saint answers that call.', noneOnDay: d => `No saint of this chart is celebrated on ${d}. The nearest:`,
      feast: d => `feast on ${d}`, nobody: 'Nobody yet: type a name, a place ("Ireland", "Rome") or a century ("7th").',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dayLabel: (d, m) => d + ' ' + m, circa: 'c. ', year: t => `AD ${t}`,
      level: { natif: 'mother tongue', courant: 'fluent', notions: 'some notions' },
      how: { natif: 'mother tongue', courant: 'fluently', notions: 'with some notions' },
      tradition: { catholique: 'Catholic', orthodoxe: 'Orthodox', commune: 'venerated by both' },
      legend: 'legend', probable: 'probable', attested: 'documented meeting', inTransit: 'passing through',
      tipStop: (place, years, legend, note) => `${place} (${years})${legend ? ' · legend' : ''}\n${note || ''}`,
      pawnAge: (n, age) => `${n}, aged ${age}`, pawnUnborn: n => `${n} (not yet born)`, pawnDead: (n, y) => `${n} († ${y})`,
      pawnMoving: (n, a, b) => `${n} travels from ${a} to ${b}`, pawnAt: (n, p) => `${n} is in ${p}`,
      missing: 'A second saint is missing', missingLede: 'Pick another one to find out whether they could have met.',
      neverHead: gap => `Impossible: ${gap >= 100 ? Math.round(gap / 100) + (gap >= 150 ? ' centuries' : ' century') : gap + ' years'} apart`,
      neverLede: (f, fd, s, gap, sb) => `When ${f} dies in ${fd}, ${s} will not be born for another ${gap} years, in ${sb}.`,
      samePlacesOtherTimes: 'Same places, other times', samePlacesOtherYears: 'Same places, other years', missed: 'Missed opportunities', crossroads: 'The crossroads', sources: 'What the sources say',
      sharedNever: (place, A, ra, B, rb, gap) => `${place}: ${A} is there ${ra}, ${B} ${rb}. They may have trodden the same flagstones, ${gap} years apart.`,
      sharedMissed: (place, A, ra, B, rb, gap) => `${place}: ${A} ${ra}, ${B} ${rb}: missed by ${gap} year${gap > 1 ? 's' : ''}.`,
      rangeIn: y => `in ${y}`, rangeFromTo: (a, b) => `from ${a} to ${b}`,
      twoWorlds: 'Their paths do not even pass through the same towns. Two worlds.',
      noCross: 'Their routes never overlap. It would have taken a letter, or one more pilgrimage.',
      onlyNear: d => `No town in common, only this ${d} km proximity.`,
      contemporaries: (n, a, b) => `Contemporaries for ${n} year${n > 1 ? 's' : ''} (${a} to ${b}).`,
      meetHead: place => `A meeting was possible in ${place}`,
      meetLede: (when, transit, A, ageA, B, ageB, contemp) => `${when}${transit ? ', one of them passing through' : ''}. ${A} is then ${ageA}, ${B} is ${ageB}. ${contemp}`,
      whenIn: y => `In ${y}`, whenBetween: (a, b) => `Between ${a} and ${b}`,
      nearHead: km => `Almost: ${km} km apart at their closest`,
      nearLede: (y, A, pa, B, pb, contemp) => `Around ${y}, ${A} is in ${pa} and ${B} in ${pb}: a few days\' walk, but nobody made the detour. ${contemp}`,
      apartHead: 'Contemporaries, but never within earshot',
      attestedHead: where => `A documented meeting${where ? ': ' + where : ''}`,
      attestedLede: (y, contemp) => `Our itineraries, simplified by necessity, do not put them in the same place at the same time, but the sources are clear${y ? ' (' + y + ')' : ''}. ${contemp}`,
      apartLede: (contemp, km, y) => `${contemp} At their closest, ${km} km separate them around ${y}.`,
      onTheWay: 'on the road',
      langHead: 'In which language?',
      langNone: (A, la, B, lb) => `No common language: they would have needed an interpreter, or a lot of gestures. ${A} speaks ${la}; ${B} speaks ${lb}.`,
      langIntro: hyp => hyp ? 'Had they been contemporaries, they could have talked' : 'They could have talked',
      langIn: l => ` in <b>${l}</b>`,
      langSame: { natif: ', the mother tongue of both.', courant: ', which both speak fluently.', notions: ', with notions on both sides: a laborious but possible conversation.' },
      langDiff: (ha, A, hb, B) => `: ${ha} for ${A}, ${hb} for ${B}.`,
      todayTwo: (d, names, more) => `Today, ${d}: ${names}${more ? ' (the first two are shown)' : ''}.`,
      todayOne: (d, n, other, od) => `Today, ${d}: ${n}. To keep company, the nearest in the calendar: ${other} (${od}).`,
      todayNone: (d, list) => `Nobody on this chart is celebrated on ${d}. The nearest in the calendar: ${list}.`,
      and: ' and ', count: (n, a, b, c) => `${n} saints, from ${a} to ${b}, ${c} named places.`,
      play: 'Play the years', pause: 'Pause', zoomIn: 'Zoom in', zoomOut: 'Zoom out', toDark: 'Switch to dark mode', toLight: 'Switch to light mode',
      stTitle: s => 'St ' + F(s, 'name')
    }
  };
  let lang = 'fr';
  const T = () => I18N[lang];
  const F = (o, field) => (lang === 'en' && o[field + '_en']) ? o[field + '_en'] : o[field];
  const langName = code => LANG_NAMES[lang][code] || LANG_NAMES.fr[code] || code;

  const saints = DATA.saints.slice().sort((a, b) => a.born - b.born);
  const byId = Object.fromEntries(saints.map(s => [s.id, s]));
  const cities = DATA.places.cities || [];

  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, attrs, children) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (k === 'text') n.textContent = attrs[k]; else if (k === 'html') n.innerHTML = attrs[k]; else n.setAttribute(k, attrs[k]); }
    (children || []).forEach(c => n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return n;
  };
  const svg = (tag, attrs, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const fmt = n => String(Math.round(n));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const roman = n => { const t = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let r = ''; for (const [v, s] of t) while (n >= v) { r += s; n -= v; } return r; };
  const haversine = (a, b) => { const R = 6371, d2r = Math.PI / 180; const dLat = (b.lat - a.lat) * d2r, dLon = (b.lon - a.lon) * d2r; const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * d2r) * Math.cos(b.lat * d2r) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const feastLabel = f => { const [m, d] = f.split('-').map(Number); return T().dayLabel(d, T().months[m - 1]); };
  const datesLabel = s => (s.approx ? T().circa : '') + s.born + ' – ' + s.died;
  const shortPlace = p => String(p).replace(/\s*\(.*\)$/, '');
  const stopPlace = st => shortPlace(F(st, 'place'));

  /* ---------- Position d'un saint à une date ---------- */
  function posAt(s, t) {
    if (t < s.born || t > s.died) return null;
    const st = s.stops;
    for (let i = 0; i < st.length; i++) {
      const a = st[i];
      if (t >= a.from && t <= a.to) return { lat: a.lat, lon: a.lon, stop: a, i, moving: false };
      const b = st[i + 1];
      if (b && t > a.to && t < b.from) {
        const k = (t - a.to) / (b.from - a.to);
        return { lat: a.lat + (b.lat - a.lat) * k, lon: a.lon + (b.lon - a.lon) * k, stop: null, from: a, to: b, i, moving: true };
      }
    }
    const last = st[st.length - 1];
    return { lat: last.lat, lon: last.lon, stop: last, i: st.length - 1, moving: false };
  }
  function nearestCity(lat, lon, maxKm) {
    let best = null, bd = Infinity;
    for (const c of cities) { const d = haversine({ lat, lon }, c); if (d < bd) { bd = d; best = c; } }
    return bd <= (maxKm || 80) ? best : null;
  }

  /* ---------- Carte ---------- */
  const chart = $('#chart');
  const frame = $('#chart-frame');
  const layers = {};
  // le cadre peut être carré sur téléphone : le rapport hauteur/largeur de la vue suit celui du cadre
  const ratio = () => { const r = frame.getBoundingClientRect(); return r.width > 0 && r.height > 0 ? r.height / r.width : VIEW0.h / VIEW0.w; };
  function fullView() {
    const k = ratio(); let w = VIEW0.w, h = w * k;
    if (h < VIEW0.h) { h = VIEW0.h; w = h / k; }
    return { x: VIEW0.x + (VIEW0.w - w) / 2, y: VIEW0.y + (VIEW0.h - h) / 2, w, h };
  }
  let view = fullView();

  function parchmentPath() {
    const x0 = -34, y0 = -42, x1 = MAP_W + 34, y1 = MAP_H + 42;
    return `M ${x0 + 60} ${y0} Q ${MAP_W / 2} ${y0 - 6} ${x1 - 70} ${y0 + 2} Q ${x1 + 4} ${y0 + 10} ${x1} ${y0 + 80}
      L ${x1 + 3} ${y1 - 90} Q ${x1} ${y1 + 4} ${x1 - 80} ${y1} Q ${MAP_W / 2} ${y1 + 8} ${x0 + 90} ${y1 - 2} Q ${x0 - 2} ${y1 - 6} ${x0} ${y1 - 120}
      L ${x0 - 2} ${MAP_H * 0.62} Q ${x0 - 12} ${MAP_H * 0.6} ${x0 - 14} ${MAP_H * 0.56} L ${x0 - 15} ${MAP_H * 0.47} Q ${x0 - 12} ${MAP_H * 0.43} ${x0 - 1} ${MAP_H * 0.41}
      L ${x0 + 1} ${y0 + 70} Q ${x0} ${y0 + 6} ${x0 + 60} ${y0} Z`;
  }
  // Peau du parchemin : grain + halo des côtes rasterisés une fois pour toutes dans une seule image étirée sur la carte.
  // En SVG pur (motif <pattern>, trait large translucide le long de 7 700 points de côte), Firefox refaisait tout ce
  // travail à chaque changement de viewBox et le zoom saccadait ; une image se redessine pour rien.
  const SKIN_W = 2048, SKIN_H = 1280, SKIN_PAD = 70;
  function skinDataUrl(coastD) {
    const c = document.createElement('canvas'); c.width = SKIN_W; c.height = SKIN_H;
    const ctx = c.getContext('2d'); const img = ctx.createImageData(SKIN_W, SKIN_H);
    let seed = 1234567;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    for (let i = 0; i < img.data.length; i += 4) {
      const v = rnd(); const dark = v < 0.5;
      img.data[i] = dark ? 90 : 255; img.data[i + 1] = dark ? 60 : 250; img.data[i + 2] = dark ? 30 : 235;
      img.data[i + 3] = Math.floor((dark ? 14 : 10) * rnd() + (v > 0.995 ? 60 : 0));
    }
    ctx.putImageData(img, 0, 0);
    const k = SKIN_W / (MAP_W + 2 * SKIN_PAD);
    ctx.setTransform(k, 0, 0, k, SKIN_PAD * k, SKIN_PAD * k);
    ctx.strokeStyle = 'rgba(138, 106, 69, .16)'; ctx.lineWidth = 3.4; ctx.lineJoin = 'round';
    ctx.stroke(new Path2D(coastD));
    return c.toDataURL('image/png');
  }

  function buildMap() {
    applyView();
    const defs = svg('defs', null, chart);
    const vig = svg('radialGradient', { id: 'vignette', cx: '50%', cy: '50%', r: '72%' }, defs);
    svg('stop', { offset: '55%', 'stop-color': '#7a5a30', 'stop-opacity': 0 }, vig);
    svg('stop', { offset: '100%', 'stop-color': '#6b4a26', 'stop-opacity': .28 }, vig);
    const town = svg('symbol', { id: 'town', viewBox: '0 0 20 18' }, defs);
    svg('path', { d: 'M2 17 V9 H6 V5 H8 V9 H12 V5 H14 V9 H18 V17 Z', fill: '#e8b48a', stroke: '#6b4a2b', 'stroke-width': .9 }, town);
    svg('path', { d: 'M8 17 V12 H12 V17 Z', fill: '#6b4a2b' }, town);
    svg('path', { d: 'M9.5 5 V1 L13 2.3 L9.5 3.6 Z', fill: '#b4372b' }, town);
    svg('path', { d: 'M9.5 1 V5', stroke: '#6b4a2b', 'stroke-width': .6 }, town);
    const ship = svg('symbol', { id: 'ship', viewBox: '0 0 40 36' }, defs);
    svg('path', { class: 'ship', d: 'M4 24 Q20 30 36 24 L33 32 Q20 36 7 32 Z' }, ship);
    svg('path', { d: 'M20 24 V4', stroke: '#5b3f28', 'stroke-width': 1 }, ship);
    svg('path', { class: 'ship-sail', d: 'M20 6 Q32 12 28 22 L20 22 Z' }, ship);
    svg('path', { class: 'ship-sail', d: 'M20 8 Q10 14 13 22 L20 22 Z' }, ship);
    svg('path', { class: 'ship-flag', d: 'M20 4 L27 6 L20 8 Z' }, ship);
    const palm = svg('symbol', { id: 'palm', viewBox: '0 0 20 24' }, defs);
    svg('path', { d: 'M10 23 Q9 14 10 8', stroke: '#6b4a2b', 'stroke-width': 1.4, fill: 'none' }, palm);
    ['M10 8 Q4 6 1 10 Q6 8 10 9', 'M10 8 Q16 6 19 10 Q14 8 10 9', 'M10 8 Q5 2 4 3 Q8 4 10 8', 'M10 8 Q15 2 16 3 Q12 4 10 8', 'M10 8 Q10 1 12 1 Q10 4 10 8'].forEach(d => svg('path', { d, fill: '#5d8244', stroke: '#3d5f2c', 'stroke-width': .4 }, palm));

    // Pas de clip-path sur le groupe racine (Firefox le recompose à chaque image) : ce qui dépasse du parchemin
    // est recouvert par un chemin « cache » de la couleur du cadre, inséré sous les trajets.
    const root = svg('g', null, chart);
    // la mer en bleu (choix de Clément, un peu anachronique mais lisible), la terre en vélin, le grain sur les deux
    svg('path', { d: parchmentPath(), fill: '#6a98bd' }, root);
    ['water', 'land', 'rhumbs', 'rivers', 'coast', 'lakes', 'mountains', 'cities', 'labels', 'deco', 'dim', 'meet', 'routes', 'pawns'].forEach(k => { layers[k] = svg('g', { id: 'l-' + k }, root); });
    root.insertBefore(svg('path', { class: 'cover', d: 'M-9000 -9000H9000V9000H-9000Z' + parchmentPath(), 'fill-rule': 'evenodd', 'pointer-events': 'none' }), layers.dim);
    layers.dimPath = svg('path', { d: parchmentPath(), fill: '#f4ead2', opacity: 0, 'pointer-events': 'none' }, layers.dim);
    svg('path', { d: parchmentPath(), fill: 'url(#vignette)', 'pointer-events': 'none' }, root);
    svg('path', { d: parchmentPath(), fill: 'none', stroke: '#6b4a2b', 'stroke-width': 1.4, opacity: .6 }, chart);
    drawWater(); drawLand(); drawRhumbs(); drawRivers(); drawMountains(); drawCities(); drawLabels(); drawDeco();
  }
  function ringPath(pts) { return 'M' + pts.map(p => fmt(X(p[0])) + ' ' + fmt(Y(p[1]))).join('L') + 'Z'; }
  function polyPath(pts) { return 'M' + pts.map(p => X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join('L'); }
  function drawWater() {
    const red = [[32.3, 30.2], [34.6, 29.6], [35.2, 28], [37, 25], [38.6, 22], [40, 18.5], [42, 15.5], [43.6, 12.6], [43.4, 12.2], [41.5, 13.8], [39.8, 16.5], [38.6, 20], [36.6, 23.5], [34.6, 27.5], [33.9, 28.6], [32.9, 29.4]];
    svg('path', { d: ringPath(red), fill: '#c4473a', opacity: .85 }, layers.water);
  }
  function drawLand() {
    const outer = DATA.land.filter(r => !r.hole), holes = DATA.land.filter(r => r.hole);
    const d = outer.map(r => ringPath(r.pts)).join('');
    svg('path', { class: 'land', d, 'fill-rule': 'evenodd' }, layers.land);
    svg('image', { href: skinDataUrl(d), x: -SKIN_PAD, y: -SKIN_PAD, width: MAP_W + 2 * SKIN_PAD, height: MAP_H + 2 * SKIN_PAD, preserveAspectRatio: 'none', 'pointer-events': 'none' }, layers.land);
    svg('path', { class: 'coast', d }, layers.coast);
    for (const h of holes) svg('path', { d: ringPath(h.pts), fill: '#5f8fb8', stroke: '#2f4a63', 'stroke-width': .6, opacity: .9 }, layers.lakes);
  }
  function drawRhumbs() {
    const cx = X(17), cy = Y(39), R = 430, L = 2600;
    const nodes = [[cx, cy]];
    for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; nodes.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    const groups = { main: [], half: [], quarter: [] };
    nodes.forEach(([nx, ny], ni) => {
      for (let k = 0; k < 32; k++) {
        const a = k * Math.PI / 16;
        const cls = k % 4 === 0 ? 'main' : (k % 2 === 0 ? 'half' : 'quarter');
        if (ni > 0 && cls === 'quarter' && (ni % 2 === 0)) continue;
        groups[cls].push(`M${nx.toFixed(1)} ${ny.toFixed(1)}l${(L * Math.cos(a)).toFixed(1)} ${(L * Math.sin(a)).toFixed(1)}`);
      }
    });
    for (const k in groups) svg('path', { class: 'rhumb-' + k, d: groups[k].join(''), fill: 'none' }, layers.rhumbs);
    nodes.slice(1).forEach(([nx, ny]) => star(layers.rhumbs, nx, ny, 7, 8, '#b23a2c', '#5b3f28'));
  }
  function star(parent, cx, cy, r, n, c1, c2) {
    const g = svg('g', null, parent);
    for (let k = 0; k < n; k++) {
      const a = k * 2 * Math.PI / n, a1 = a - Math.PI / n, a2 = a + Math.PI / n, ri = r * 0.3;
      const tip = [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      const l = [cx + ri * Math.cos(a1), cy + ri * Math.sin(a1)], rr = [cx + ri * Math.cos(a2), cy + ri * Math.sin(a2)];
      svg('path', { d: `M${cx} ${cy}L${l[0]} ${l[1]}L${tip[0]} ${tip[1]}Z`, fill: c1 }, g);
      svg('path', { d: `M${cx} ${cy}L${tip[0]} ${tip[1]}L${rr[0]} ${rr[1]}Z`, fill: c2 }, g);
    }
    return g;
  }
  function compassRose(parent, cx, cy, r) {
    const g = svg('g', { class: 'rose' }, parent);
    svg('circle', { cx, cy, r: r * 1.08, fill: '#f6ecd4', stroke: '#5b3f28', 'stroke-width': .8, opacity: .9 }, g);
    svg('circle', { cx, cy, r: r * 0.98, fill: 'none', stroke: '#c08f36', 'stroke-width': 1.2 }, g);
    const kite = (a, len, w, c1, c2) => {
      const tip = [cx + len * Math.cos(a), cy + len * Math.sin(a)];
      const p1 = [cx + w * Math.cos(a - Math.PI / 2), cy + w * Math.sin(a - Math.PI / 2)];
      const p2 = [cx + w * Math.cos(a + Math.PI / 2), cy + w * Math.sin(a + Math.PI / 2)];
      svg('path', { d: `M${cx} ${cy}L${p1[0]} ${p1[1]}L${tip[0]} ${tip[1]}Z`, fill: c1, stroke: '#3b2a1b', 'stroke-width': .3 }, g);
      svg('path', { d: `M${cx} ${cy}L${tip[0]} ${tip[1]}L${p2[0]} ${p2[1]}Z`, fill: c2, stroke: '#3b2a1b', 'stroke-width': .3 }, g);
    };
    for (let k = 1; k < 32; k += 2) kite(k * Math.PI / 16 - Math.PI / 2, r * 0.55, r * 0.05, '#e3c37a', '#c08f36');
    for (let k = 2; k < 32; k += 4) kite(k * Math.PI / 16 - Math.PI / 2, r * 0.75, r * 0.08, '#6f8fc4', '#3a5c98');
    for (let k = 0; k < 32; k += 4) kite(k * Math.PI / 16 - Math.PI / 2, r, r * 0.11, '#f0d9a0', k === 0 ? '#b4372b' : '#2f2418');
    svg('circle', { cx, cy, r: r * 0.09, fill: '#c08f36', stroke: '#3b2a1b', 'stroke-width': .4 }, g);
    const fy = cy - r * 1.02, s = r * 0.16;
    svg('path', { d: `M${cx} ${fy - s * 1.6} C${cx - s * .9} ${fy - s * .6} ${cx - s * 1.2} ${fy + s * .2} ${cx - s * .3} ${fy + s * .1} L${cx} ${fy + s * .9} L${cx + s * .3} ${fy + s * .1} C${cx + s * 1.2} ${fy + s * .2} ${cx + s * .9} ${fy - s * .6} ${cx} ${fy - s * 1.6}Z`, fill: '#b4372b', stroke: '#3b2a1b', 'stroke-width': .4 }, g);
    return g;
  }
  function tent(parent, cx, cy, w, h, c1, c2) {
    // tente de souverain, comme celles du Sahara et de Tartarie chez Maggiolo
    const g = svg('g', null, parent);
    svg('path', { d: `M${cx - w / 2} ${cy} L${cx} ${cy - h} L${cx + w / 2} ${cy} Z`, fill: c1, stroke: '#3b2a1b', 'stroke-width': .6 }, g);
    for (let i = -2; i <= 2; i++) svg('path', { d: `M${cx} ${cy - h} L${cx + i * w / 6} ${cy}`, stroke: c2, 'stroke-width': 1.1 }, g);
    svg('path', { d: `M${cx - w / 2} ${cy} Q${cx} ${cy + h * .18} ${cx + w / 2} ${cy}`, fill: c2, stroke: '#3b2a1b', 'stroke-width': .5 }, g);
    svg('path', { d: `M${cx - w * .12} ${cy} L${cx} ${cy - h * .4} L${cx + w * .12} ${cy} Z`, fill: '#2f2418' }, g);
    svg('path', { d: `M${cx} ${cy - h} V${cy - h - 6} L${cx + 5} ${cy - h - 4.5} L${cx} ${cy - h - 3}`, fill: '#b4372b', stroke: '#3b2a1b', 'stroke-width': .4 }, g);
    return g;
  }
  function drawRivers() { svg('path', { class: 'river', d: DATA.rivers.map(r => polyPath(r.pts)).join('') }, layers.rivers); }
  function drawMountains() {
    for (const f of DATA.places.features || []) {
      if (f.type !== 'mountain' || !f.points || f.points.length < 2) continue;
      const pts = f.points.map(p => P(p[0], p[1]));
      const g = svg('g', { class: 'range' }, layers.mountains);
      let acc = 0, step = 6;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
        const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
        for (let d = acc; d < len; d += step) {
          const bx = x0 + ux * d, by = y0 + uy * d, h = 4 + 1.8 * Math.sin(d * 1.7 + i), w = 4.6;
          svg('path', { class: 'mountain', d: `M${(bx - w).toFixed(1)} ${by.toFixed(1)} Q${bx.toFixed(1)} ${(by - 2 * h).toFixed(1)} ${(bx + w).toFixed(1)} ${by.toFixed(1)} Z` }, g);
          svg('path', { class: 'mountain-shade', d: `M${bx.toFixed(1)} ${(by - h).toFixed(1)} Q${(bx + w * .55).toFixed(1)} ${(by - h * .9).toFixed(1)} ${(bx + w).toFixed(1)} ${by.toFixed(1)} L${(bx + w * .15).toFixed(1)} ${by.toFixed(1)} Z` }, g);
        }
        acc = (acc + Math.ceil(len / step) * step - len) % step;
      }
      if (f.name) {
        const mid = pts[Math.floor(pts.length / 2)];
        svg('text', { class: 'region-label size-0', x: mid[0].toFixed(1), y: (mid[1] + 14).toFixed(1) }, g).textContent = f.name;
      }
    }
  }
  function labelTransform(c) {
    const [x, y] = P(c.lon, c.lat);
    const off = c.tier === 1 ? 5 : 3.2;
    switch (c.coastal ? c.side : null) {
      case 'N': return { x: x + 2, y: y + off, rot: 90, anchor: 'start' };
      case 'S': return { x: x - 2, y: y - off, rot: -90, anchor: 'start' };
      case 'E': return { x: x - off, y: y + 2.5, rot: 0, anchor: 'end' };
      case 'NE': return { x: x - off * .7, y: y + off * .7, rot: 45, anchor: 'end' };
      case 'SE': return { x: x - off * .7, y: y - off * .7, rot: -45, anchor: 'end' };
      case 'NW': return { x: x + off * .7, y: y + off * .7, rot: -45, anchor: 'start' };
      case 'SW': return { x: x + off * .7, y: y - off * .7, rot: 45, anchor: 'start' };
      default: return { x: x + off, y: y + 2.5, rot: 0, anchor: 'start' };
    }
  }
  const cityLabels = [];
  function drawCities() {
    for (const c of cities) {
      const [x, y] = P(c.lon, c.lat);
      if (c.tier === 1) svg('use', { href: '#town', x: x - 5.5, y: y - 9, width: 11, height: 9.9 }, layers.cities);
      else svg('circle', { class: 'city-dot', cx: x.toFixed(1), cy: y.toFixed(1), r: c.tier === 2 ? 1.6 : 1.1 }, layers.cities);
      const t = labelTransform(c);
      const txt = svg('text', { class: 'city-label t' + c.tier, x: t.x.toFixed(1), y: t.y.toFixed(1), 'text-anchor': t.anchor, transform: t.rot ? `rotate(${t.rot} ${t.x.toFixed(1)} ${t.y.toFixed(1)})` : null }, layers.labels);
      txt.textContent = c.name;
      const cw = (c.tier === 1 ? 4 : 3.3) * c.name.length, ch = c.tier === 1 ? 8 : 7;
      const bx = t.rot ? { x0: t.x - ch, x1: t.x + ch, y0: t.rot > 0 ? t.y : t.y - cw, y1: t.rot > 0 ? t.y + cw : t.y } : (t.anchor === 'end' ? { x0: t.x - cw, x1: t.x, y0: t.y - ch, y1: t.y + 1 } : { x0: t.x, x1: t.x + cw, y0: t.y - ch, y1: t.y + 1 });
      cityLabels.push({ el: txt, c, x, y, off: { x0: bx.x0 - t.x, x1: bx.x1 - t.x, y0: bx.y0 - t.y, y1: bx.y1 - t.y }, ax: t.x, ay: t.y });
      svg('title', null, txt).textContent = c.modern && c.modern !== c.name ? `${c.name} (${c.modern})` : c.name;
    }
  }
  function drawLabels() {
    for (const r of DATA.places.regions || []) {
      const [x, y] = P(r.lon, r.lat);
      svg('text', { class: 'region-label size-' + (r.size || 1), x: x.toFixed(1), y: y.toFixed(1) }, layers.labels).textContent = r.name;
    }
    for (const s of DATA.places.seas || []) {
      const [x, y] = P(s.lon, s.lat);
      svg('text', { class: 'sea-label', x: x.toFixed(1), y: y.toFixed(1) }, layers.labels).textContent = s.name;
    }
  }
  function drawDeco() {
    compassRose(layers.deco, X(-19), Y(46), 54);
    [[-21, 56], [-15, 36], [-22, 26], [60, 14], [78, 8], [-10, 48], [90, 16]].forEach(([lon, lat], i) => {
      const [x, y] = P(lon, lat); svg('use', { href: '#ship', x: x - 12, y: y - 12, width: 24, height: 22, transform: i % 2 ? `scale(-1 1) translate(${-2 * x} 0)` : null }, layers.deco);
    });
    const [mx, my] = P(92, 9);
    svg('path', { class: 'monster', d: `M${mx} ${my} c-8 -10 -18 -8 -22 0 c6 -3 10 -1 12 3 c-6 2 -10 8 -6 12 c2 -5 6 -7 10 -5 c4 6 12 6 16 -2 c-4 2 -7 0 -8 -4 c6 -1 10 -5 8 -10 c-2 4 -6 6 -10 6z` }, layers.deco);
    svg('circle', { cx: mx - 18, cy: my - 5, r: 1, fill: '#1c2a3a' }, layers.deco);
    // tentes des souverains : Sahara (Maggiolo) et Grand Khan en Tartarie
    [[-2, 23, '#3a5c98', '#e3c37a'], [6, 22, '#b4372b', '#e3c37a'], [14, 22.5, '#c08f36', '#3a5c98'], [22, 23, '#3a5c98', '#b4372b'], [30, 21.5, '#b4372b', '#f0d9a0']].forEach(([lon, lat, c1, c2]) => { const [x, y] = P(lon, lat); tent(layers.deco, x, y, 26, 20, c1, c2); });
    [[70, 50, '#b4372b', '#e3c37a'], [78, 48.5, '#3a5c98', '#e3c37a'], [86, 50.5, '#c08f36', '#b4372b']].forEach(([lon, lat, c1, c2]) => { const [x, y] = P(lon, lat); tent(layers.deco, x, y, 30, 24, c1, c2); });
    // palmiers en Arabie et au Sahara
    [[46, 23], [50, 20], [10, 27], [-3, 27], [54, 25]].forEach(([lon, lat]) => { const [x, y] = P(lon, lat); svg('use', { href: '#palm', x: x - 7, y: y - 16, width: 14, height: 17 }, layers.deco); });
    // cartouche de titre et échelle
    const g = svg('g', { transform: `translate(${X(-24)} ${Y(70)})` }, layers.deco);
    svg('rect', { x: 0, y: 0, width: 230, height: 54, fill: '#f6ecd4', stroke: '#5b3f28', 'stroke-width': 1, rx: 2 }, g);
    svg('rect', { x: 4, y: 4, width: 222, height: 46, fill: 'none', stroke: '#c08f36', 'stroke-width': 1 }, g);
    svg('text', { class: 'cartouche-text', id: 'cartouche-title', x: 115, y: 22, 'font-size': 15 }, g).textContent = 'Portulan des saints';
    svg('text', { class: 'cartouche-text', x: 115, y: 40, 'font-size': 9, style: 'font-family: var(--font-body); font-style: italic; letter-spacing: .02em' }, g).textContent = 'ubi sancti convenire potuissent';
    const sg = svg('g', { transform: `translate(${X(-24)} ${Y(6)})` }, layers.deco);
    svg('rect', { x: 0, y: 0, width: 220, height: 8, fill: '#f6ecd4', stroke: '#5b3f28', 'stroke-width': .8 }, sg);
    for (let i = 0; i < 10; i++) svg('rect', { x: i * 22, y: 0, width: 22, height: 8, fill: i % 2 ? '#5b3f28' : 'none' }, sg);
    for (let i = 0; i <= 10; i++) svg('line', { x1: i * 22, y1: 8, x2: i * 22, y2: 12, stroke: '#5b3f28', 'stroke-width': .6 }, sg);
    svg('text', { class: 'scale-text', x: 0, y: 20 }, sg).textContent = '0';
    svg('text', { class: 'scale-text', id: 'scale-label', x: 220, y: 20, 'text-anchor': 'end' }, sg).textContent = '1000 milia';
    svg('rect', { x: -40, y: -46, width: MAP_W + 80, height: 7, fill: '#d9a84a', opacity: .8 }, layers.deco);
    svg('rect', { x: -40, y: MAP_H + 36, width: MAP_W + 80, height: 7, fill: '#d9a84a', opacity: .8 }, layers.deco);
  }

  /* ---------- Zoom et déplacement ---------- */
  let ts = 1;
  function applyView() {
    chart.setAttribute('viewBox', `${view.x.toFixed(1)} ${view.y.toFixed(1)} ${view.w.toFixed(1)} ${view.h.toFixed(1)}`);
    chart.classList.toggle('zoomed', VIEW0.w / view.w > 2.1);
    // en zoomant, textes et traits rétrécissent (en unités carte) pour rester à taille d'écran raisonnable
    const nts = Math.max(0.3, Math.min(1, Math.pow(view.w / VIEW0.w, 0.7)));
    if (Math.abs(nts - ts) > 0.01) {
      ts = nts; chart.style.setProperty('--ts', ts.toFixed(3));
      if (layers.pawns) layers.pawns.querySelectorAll('.pawn').forEach(g => g.setAttribute('transform', `translate(${g.dataset.x} ${g.dataset.y}) scale(${(ts * 1.5).toFixed(3)})`));
      if (currentLabels.length) placeLabels(currentLabels);
    }
  }
  let anim = null;
  function animateTo(target, ms) {
    if (anim) cancelAnimationFrame(anim);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !ms) { view = { ...target }; applyView(); return; }
    const from = { ...view }, t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      view = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e };
      applyView();
      if (k < 1) anim = requestAnimationFrame(step); else anim = null;
    };
    anim = requestAnimationFrame(step);
  }
  function clampView(v) {
    const maxW = VIEW0.w * 1.15, minW = VIEW0.w / 12;
    v.w = Math.max(minW, Math.min(maxW, v.w)); v.h = v.w * ratio();
    v.x = Math.max(VIEW0.x - v.w * .5, Math.min(VIEW0.x + VIEW0.w - v.w * .5, v.x));
    v.y = Math.max(VIEW0.y - v.h * .5, Math.min(VIEW0.y + VIEW0.h - v.h * .5, v.y));
    return v;
  }
  function zoomAt(factor, px, py) {
    const r = chart.getBoundingClientRect();
    const mx = view.x + (px - r.left) / r.width * view.w, my = view.y + (py - r.top) / r.height * view.h;
    const nw = view.w * factor;
    animateTo(clampView({ x: mx - (mx - view.x) * factor, y: my - (my - view.y) * factor, w: nw, h: nw * ratio() }), 160);
  }
  function fitTo(points, pad) {
    if (!points.length) return animateTo(fullView(), 600);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of points) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const padding = pad || 80;
    const k = ratio();
    let w = Math.max(x1 - x0 + 2 * padding, 260), h = Math.max(y1 - y0 + 2 * padding, 260 * k);
    if (h / w < k) h = w * k; else w = h / k;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    animateTo(clampView({ x: cx - w / 2, y: cy - h / 2, w, h }), 700);
  }
  function setupPointer() {
    const pointers = new Map(); let last = null, pinch = null;
    chart.addEventListener('pointerdown', e => { chart.setPointerCapture(e.pointerId); pointers.set(e.pointerId, [e.clientX, e.clientY]); last = [e.clientX, e.clientY]; chart.classList.add('dragging'); if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), w: view.w }; } });
    chart.addEventListener('pointermove', e => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      const r = chart.getBoundingClientRect();
      if (pointers.size === 2 && pinch) {
        const [a, b] = [...pointers.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1;
        const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
        const mx = view.x + (cx - r.left) / r.width * view.w, my = view.y + (cy - r.top) / r.height * view.h;
        const nw = pinch.w * pinch.d / d, f = nw / view.w;
        view = clampView({ x: mx - (mx - view.x) * f, y: my - (my - view.y) * f, w: nw, h: nw * ratio() }); applyView();
      } else if (last) {
        const dx = (e.clientX - last[0]) / r.width * view.w, dy = (e.clientY - last[1]) / r.height * view.h;
        last = [e.clientX, e.clientY];
        view = clampView({ ...view, x: view.x - dx, y: view.y - dy }); applyView();
      }
    });
    const up = e => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null; if (!pointers.size) { last = null; chart.classList.remove('dragging'); } else last = [...pointers.values()][0]; };
    chart.addEventListener('pointerup', up); chart.addEventListener('pointercancel', up);
    // Firefox envoie les événements de molette au rythme du matériel (pavé tactile : bien plus d'un par image) ;
    // on les regroupe et on applique une seule étape de zoom par image.
    let wheel = null;
    frame.addEventListener('wheel', e => {
      e.preventDefault();
      const dir = Math.sign(e.deltaY) || 0; if (!dir) return;
      if (wheel) { wheel.dir = dir; wheel.x = e.clientX; wheel.y = e.clientY; return; }
      wheel = { dir, x: e.clientX, y: e.clientY };
      requestAnimationFrame(() => { const w = wheel; wheel = null; zoomAt(w.dir > 0 ? 1.18 : 1 / 1.18, w.x, w.y); });
    }, { passive: false });
    $('#zoom-in').addEventListener('click', () => { const r = chart.getBoundingClientRect(); zoomAt(1 / 1.5, r.left + r.width / 2, r.top + r.height / 2); });
    $('#zoom-out').addEventListener('click', () => { const r = chart.getBoundingClientRect(); zoomAt(1.5, r.left + r.width / 2, r.top + r.height / 2); });
    $('#zoom-all').addEventListener('click', () => animateTo(fullView(), 600));
    let rt = null; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { view = clampView({ ...view }); applyView(); }, 120); });
    $('#zoom-fit').addEventListener('click', () => fitRoutes());
  }

  /* ---------- Sélection ---------- */
  const state = { a: null, b: null, year: null };
  const slots = ['a', 'b'];
  const pickers = {};

  function resultButton(s, slot, metaText) {
    const b = el('button', { type: 'button', role: 'option' });
    b.appendChild(el('span', { class: 'r-name', text: F(s, 'name') }));
    b.appendChild(el('span', { class: 'r-dates', text: datesLabel(s) }));
    b.appendChild(el('span', { class: 'r-meta', text: metaText }));
    b.addEventListener('click', () => { select(slot, s.id); pickers[slot].clear(); });
    return el('li', null, [b]);
  }
  function buildPicker(slot) {
    const body = $(`.picker-${slot} .picker-body`);
    const modes = el('div', { class: 'modes', role: 'tablist' });
    const tabName = el('button', { type: 'button', role: 'tab', 'aria-selected': 'true', 'data-i18n': 'byName', text: T().byName });
    const tabDate = el('button', { type: 'button', role: 'tab', 'aria-selected': 'false', 'data-i18n': 'byDate', text: T().byDate });
    modes.append(tabName, tabDate);
    const search = el('div', { class: 'search' });
    const input = el('input', { type: 'search', id: `search-${slot}`, autocomplete: 'off' });
    search.appendChild(input);
    const datepick = el('div', { class: 'datepick', hidden: '' });
    const selM = el('select', { id: `month-${slot}` }); const selD = el('select', { id: `day-${slot}` });
    for (let d = 1; d <= 31; d++) selD.appendChild(el('option', { value: d, text: d }));
    datepick.append(selD, selM);
    const results = el('ul', { class: 'results', role: 'listbox' });
    const chosen = el('div', { class: 'chosen' });
    body.append(modes, search, datepick, results, chosen);
    let mode = 'name';
    const fillMonths = () => { const v = selM.value || 1; selM.innerHTML = ''; T().months.forEach((m, i) => selM.appendChild(el('option', { value: i + 1, text: m }))); selM.value = v; };
    const relabel = () => {
      input.placeholder = T().searchPh; input.setAttribute('aria-label', T().searchAria);
      selM.setAttribute('aria-label', T().month); selD.setAttribute('aria-label', T().day); fillMonths();
    };
    const show = list => {
      results.innerHTML = '';
      if (!list.length) { results.appendChild(el('li', { class: 'r-empty', text: T().none })); return; }
      list.slice(0, 40).forEach(s => results.appendChild(resultButton(s, slot, `${F(s, 'role')}, ${F(s, 'origin')} · ${T().feast(feastLabel(s.feast))}`)));
    };
    const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    input.addEventListener('input', () => {
      const q = norm(input.value.trim());
      if (!q) { results.innerHTML = ''; return; }
      const century = q.match(/^(\d{1,2})(e|er|th|st|nd|rd)?$/);
      show(saints.filter(s => {
        if (century) { const c = Number(century[1]); return Math.floor((s.born - 1) / 100) + 1 === c || Math.floor((s.died - 1) / 100) + 1 === c; }
        return norm(`${s.name} ${s.full} ${s.origin} ${s.role} ${s.name_en || ''} ${s.full_en || ''} ${s.origin_en || ''} ${s.role_en || ''} ${s.born}`).includes(q);
      }));
    });
    input.addEventListener('focus', () => { if (!input.value) show(saints.filter(s => s.id !== state[slot === 'a' ? 'b' : 'a'])); });
    input.addEventListener('keydown', e => { if (e.key === 'Escape') { results.innerHTML = ''; input.blur(); } if (e.key === 'ArrowDown') { const f = results.querySelector('button'); if (f) { e.preventDefault(); f.focus(); } } });
    results.addEventListener('keydown', e => {
      const items = [...results.querySelectorAll('button')], i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && i < items.length - 1) { e.preventDefault(); items[i + 1].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (i > 0 ? items[i - 1] : input).focus(); }
      if (e.key === 'Escape') { results.innerHTML = ''; input.focus(); }
    });
    document.addEventListener('click', e => { if (!body.contains(e.target) && mode === 'name') results.innerHTML = ''; });
    const byDate = () => {
      const key = String(selM.value).padStart(2, '0') + '-' + String(selD.value).padStart(2, '0');
      const hits = saints.filter(s => s.feast === key);
      if (hits.length) return show(hits);
      results.innerHTML = '';
      results.appendChild(el('li', { class: 'r-empty', text: T().noneOnDay(feastLabel(key)) }));
      nearestFeasts(key, 5).forEach(s => results.appendChild(resultButton(s, slot, `${T().feast(feastLabel(s.feast))} · ${F(s, 'role')}, ${F(s, 'origin')}`)));
    };
    selM.addEventListener('change', byDate); selD.addEventListener('change', byDate);
    const setMode = m => {
      mode = m;
      tabName.setAttribute('aria-selected', String(m === 'name')); tabDate.setAttribute('aria-selected', String(m === 'date'));
      search.hidden = m !== 'name'; datepick.hidden = m !== 'date'; results.innerHTML = '';
      if (m === 'date') byDate();
    };
    tabName.addEventListener('click', () => setMode('name')); tabDate.addEventListener('click', () => setMode('date'));
    relabel();
    return { chosen, relabel, clear() { results.innerHTML = ''; input.value = ''; if (mode === 'date') byDate(); } };
  }
  function dayOfYear(key) { const [m, d] = key.split('-').map(Number); const cum = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]; return cum[m - 1] + d; }
  function nearestFeasts(key, n) {
    const d0 = dayOfYear(key);
    return saints.map(s => { let d = Math.abs(dayOfYear(s.feast) - d0); d = Math.min(d, 365 - d); return [d, s]; }).sort((a, b) => a[0] - b[0] || a[1].born - b[1].born).slice(0, n).map(x => x[1]);
  }
  function figureSVG(slot, s) {
    const color = slot === 'a' ? '#b4372b' : '#3f7a3c';
    return `<svg viewBox="0 0 46 60" width="46" height="60" aria-hidden="true"><circle cx="23" cy="14" r="12.5" fill="none" stroke="#c08f36" stroke-width="2"/><circle cx="23" cy="15" r="7" fill="#f3d9b5" stroke="#5b3f28" stroke-width=".8"/><path d="M9 58 L13 30 Q23 24 33 30 L37 58 Z" fill="${color}" stroke="#3b2a1b" stroke-width=".8"/>${s.sex === 'f' ? '<path d="M14 22 Q23 10 32 22 L31 30 Q23 26 15 30 Z" fill="#f6ecd4" stroke="#5b3f28" stroke-width=".7"/>' : ''}<path d="M23 34 V52 M17 41 H29" stroke="#f6ecd4" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  }
  function renderChosen(slot) {
    const s = byId[state[slot]], box = pickers[slot].chosen;
    if (!s) { box.innerHTML = `<p class="c-blurb" style="grid-column:1/-1;color:var(--muted);font-style:italic;margin:0">${esc(T().nobody)}</p>`; return; }
    const note = F(s, 'feast_note');
    box.innerHTML = `<div class="figure">${figureSVG(slot, s)}</div>
      <div class="c-name">${esc(F(s, 'name'))}</div>
      <div class="c-full">${esc(F(s, 'full'))} · ${esc(F(s, 'role'))}, ${esc(F(s, 'origin'))}</div>
      <div class="c-dates"><b>${esc(datesLabel(s))}</b> · ${esc(T().feast(feastLabel(s.feast)))}${note ? ' <span class="tag">' + esc(note) + '</span>' : ''} · <span class="tag">${esc(T().tradition[s.tradition] || s.tradition)}</span></div>
      <p class="c-blurb">${esc(F(s, 'blurb'))}</p>
      <div class="c-langs">${s.languages.map(l => `<span class="lang ${l.level}">${esc(langName(l.code))} <small>${esc(T().level[l.level] || l.level)}</small></span>`).join('')}</div>`;
  }
  function select(slot, id, opts) {
    if (!byId[id]) return;
    const other = slot === 'a' ? 'b' : 'a';
    if (state[other] === id) { state[other] = state[slot]; renderChosen(other); }
    state[slot] = id;
    renderChosen(slot);
    update(opts);
  }
  function hashFor() { const h = [state.a, state.b].filter(Boolean).join('--'); return h ? '#' + h + '--' + lang : ''; }
  function update(opts) {
    opts = opts || {};
    stopPlay();
    drawRoutes();
    const v = verdict();
    renderVerdict(v);
    setupTimeline(v);
    if (!opts.keepView) fitRoutes();
    if (!opts.noHash) { const h = hashFor(); if (h && location.hash !== h) history.replaceState(null, '', h); }
  }

  /* ---------- Tracés ---------- */
  function routePoints() { const pts = []; slots.forEach(k => { const s = byId[state[k]]; if (s) s.stops.forEach(st => pts.push(P(st.lon, st.lat))); }); return pts; }
  function fitRoutes() { fitTo(routePoints(), 70); }
  function curve(a, b, bend) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L, k = Math.min(L * 0.18, 40) * bend;
    return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${(mx + nx * k).toFixed(1)} ${(my + ny * k).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  function drawRoutes() {
    layers.routes.innerHTML = ''; layers.meet.innerHTML = '';
    layers.dimPath.setAttribute('opacity', (state.a || state.b) ? 0.36 : 0);
    const labels = [];
    slots.forEach((k, si) => {
      const s = byId[state[k]]; if (!s) return;
      const g = svg('g', { class: 'route-group ' + k }, layers.routes);
      const bend = si === 0 ? 1 : -1;
      for (let i = 0; i < s.stops.length - 1; i++) {
        const a = s.stops[i], b = s.stops[i + 1];
        if (a.lat === b.lat && a.lon === b.lon) continue;
        const d = curve(P(a.lon, a.lat), P(b.lon, b.lat), bend);
        svg('path', { class: 'route-casing', d }, g);
        svg('path', { class: 'route-travel ' + k, d }, g);
      }
      const seen = new Map();
      s.stops.forEach((st, i) => {
        const key = st.lat.toFixed(1) + ',' + st.lon.toFixed(1);
        if (!seen.has(key)) seen.set(key, { st, nums: [], years: [], notes: [] });
        const e = seen.get(key);
        e.nums.push(i + 1); e.years.push(st.from === st.to ? String(st.from) : `${st.from}-${st.to}`); if (F(st, 'note')) e.notes.push(F(st, 'note'));
        if (st.certainty === 'legende') e.legend = true;
      });
      for (const { st, nums, years, notes, legend } of seen.values()) {
        const [x, y] = P(st.lon, st.lat);
        const c = svg('circle', { class: 'stop ' + k + (legend ? ' legende' : ''), cx: x.toFixed(1), cy: y.toFixed(1), r: nums.length > 1 ? 6.2 : 5.4 }, g);
        svg('title', null, c).textContent = T().tipStop(stopPlace(st), years.join(', '), legend, notes.join(' '));
        svg('text', { class: 'stop-num', x: x.toFixed(1), y: (y + 2.4).toFixed(1) }, g).textContent = nums.length > 2 ? nums[0] + '…' : nums.join('·');
        labels.push({ x, y, si, g, text: `${stopPlace(st)} ${years.length > 1 ? years[0] + '…' : years[0]}`, weight: (st.to - st.from) + (nums.length > 1 ? 50 : 0) });
      }
    });
    currentLabels = labels;
    placeLabels(labels);
  }
  let currentLabels = [];
  function placeLabels(labels) {
    // placement glouton, recalculé à chaque niveau de zoom : les longs séjours d'abord, quatre positions candidates,
    // on renonce plutôt que de chevaucher (l'information reste dans l'infobulle de la pastille)
    layers.routes.querySelectorAll('.stop-label').forEach(n => n.remove());
    const placed = [];
    const H = 13 * ts, cw = 5.8 * ts, o = 7.5 * ts;
    const cands = si => si === 0
      ? [[-o, -o * .6, 'end'], [o, -o * .6, 'start'], [-o, o * 1.9, 'end'], [o, o * 1.9, 'start']]
      : [[o, o * 1.9, 'start'], [-o, o * 1.9, 'end'], [o, -o * .6, 'start'], [-o, -o * .6, 'end']];
    for (const cl of cityLabels) {
      const dup = labels.some(l => Math.hypot(l.x - cl.x, l.y - cl.y) < 9 * ts);
      cl.el.style.display = dup ? 'none' : '';
      if (!dup && cl.c.tier <= 2) placed.push({ x0: cl.ax + cl.off.x0 * ts, x1: cl.ax + cl.off.x1 * ts, y0: cl.ay + cl.off.y0 * ts, y1: cl.ay + cl.off.y1 * ts });
    }
    labels.forEach(l => { const r = 7 * ts; placed.push({ x0: l.x - r, x1: l.x + r, y0: l.y - r, y1: l.y + r }); });
    labels.sort((a, b) => b.weight - a.weight);
    for (const l of labels) {
      const w = l.text.length * cw;
      let ok = null;
      for (const [dx, dy, anchor] of cands(l.si)) {
        const x = l.x + dx, y = l.y + dy;
        const box = anchor === 'end' ? { x0: x - w, x1: x, y0: y - H, y1: y + 1 } : { x0: x, x1: x + w, y0: y - H, y1: y + 1 };
        if (!placed.some(b => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) { ok = { x, y, anchor, box }; break; }
      }
      if (!ok) continue;
      placed.push(ok.box);
      svg('text', { class: 'stop-label ' + (l.si === 0 ? 'a' : 'b'), x: ok.x.toFixed(1), y: ok.y.toFixed(1), 'text-anchor': ok.anchor }, l.g).textContent = l.text;
    }
  }
  function drawMeet(v) {
    layers.meet.innerHTML = '';
    (v.windows || []).slice(0, 3).forEach((w, i) => {
      const [x, y] = P(w.lon, w.lat);
      svg('circle', { class: 'meet-halo', cx: x.toFixed(1), cy: y.toFixed(1), r: i === 0 ? 22 : 15 }, layers.meet);
      svg('circle', { class: 'meet-halo-ring', cx: x.toFixed(1), cy: y.toFixed(1), r: i === 0 ? 22 : 15, 'stroke-dasharray': '3 2' }, layers.meet);
      if (i === 0) svg('text', { class: 'meet-label', x: x.toFixed(1), y: (y - 26).toFixed(1) }, layers.meet).textContent = `✶ ${placeName(w)} · ${w.t0 === w.t1 ? w.t0 : w.t0 + '-' + w.t1}`;
    });
  }
  function placeName(w) { return w.stopRef ? stopPlace(w.stopRef) : w.city ? (w.city.modern || w.city.name) : T().onTheWay; }

  /* ---------- Rencontre ---------- */
  function verdict() {
    const A = byId[state.a], B = byId[state.b];
    if (!A || !B) return { kind: 'incomplete', A, B };
    const start = Math.max(A.born, B.born), end = Math.min(A.died, B.died);
    const common = commonLanguages(A, B);
    const attested = (A.met || []).filter(m => m.with === B.id).concat((B.met || []).filter(m => m.with === A.id && !(A.met || []).some(x => x.with === B.id)));
    const sharedPlaces = sharedStops(A, B);
    if (start > end) {
      const first = A.died < B.born ? A : B, second = first === A ? B : A;
      return { kind: 'never', A, B, first, second, gap: second.born - first.died, common, sharedPlaces, attested };
    }
    const windows = [], near = []; let minD = Infinity, minAt = null, cur = null, curNear = null;
    for (let t = start; t <= end + 1e-9; t += 0.25) {
      const pa = posAt(A, t), pb = posAt(B, t);
      if (!pa || !pb) continue;
      const d = haversine(pa, pb);
      if (d < minD) { minD = d; minAt = { t, pa, pb }; }
      if (d <= MEET_KM) { if (!cur) cur = { t0: t, t1: t, samples: [] }; cur.t1 = t; cur.samples.push({ t, pa, pb, d }); }
      else if (cur) { windows.push(cur); cur = null; }
      if (d <= NEAR_KM) { if (!curNear) curNear = { t0: t, t1: t, d, t, pa, pb }; curNear.t1 = t; if (d < curNear.d) { curNear.d = d; curNear.t = t; curNear.pa = pa; curNear.pb = pb; } }
      else if (curNear) { near.push(curNear); curNear = null; }
    }
    if (cur) windows.push(cur); if (curNear) near.push(curNear);
    for (const w of windows) {
      const mid = w.samples[Math.floor(w.samples.length / 2)];
      w.lat = (mid.pa.lat + mid.pb.lat) / 2; w.lon = (mid.pa.lon + mid.pb.lon) / 2;
      const stopA = mid.pa.stop, stopB = mid.pb.stop;
      w.stopRef = stopA || stopB || null; w.city = w.stopRef ? null : nearestCity(w.lat, w.lon, 60);
      w.inTransit = !stopA || !stopB;
      w.legend = (stopA && stopA.certainty === 'legende') || (stopB && stopB.certainty === 'legende') || (mid.pa.moving && (mid.pa.from.certainty === 'legende' || mid.pa.to.certainty === 'legende')) || (mid.pb.moving && (mid.pb.from.certainty === 'legende' || mid.pb.to.certainty === 'legende'));
      w.probable = (stopA && stopA.certainty === 'probable') || (stopB && stopB.certainty === 'probable');
      w.t0 = Math.floor(w.t0); w.t1 = Math.floor(w.t1);
      w.ageA = Math.floor((w.t0 + w.t1) / 2) - A.born; w.ageB = Math.floor((w.t0 + w.t1) / 2) - B.born;
    }
    // rencontre documentée par les sources mais que nos itinéraires simplifiés ne font pas coïncider : on le dit
    const kind = windows.length ? 'meet' : attested.length ? 'attested' : near.length ? 'near' : 'apart';
    return { kind, A, B, start, end, windows, near, minD, minAt, common, sharedPlaces, attested };
  }
  function sharedStops(A, B) {
    const out = [];
    for (const a of A.stops) for (const b of B.stops) {
      if (haversine(a, b) <= MEET_KM) { const overlap = Math.min(a.to, b.to) - Math.max(a.from, b.from); out.push({ a, b, gap: overlap >= 0 ? 0 : -overlap }); }
    }
    const best = new Map();
    for (const o of out) { const k = o.a.lat.toFixed(1) + o.a.lon.toFixed(1); if (!best.has(k) || best.get(k).gap > o.gap) best.set(k, o); }
    return [...best.values()].sort((x, y) => x.gap - y.gap);
  }
  function commonLanguages(A, B) {
    const la = Object.fromEntries(A.languages.map(l => [l.code, l.level])), lb = Object.fromEntries(B.languages.map(l => [l.code, l.level]));
    const out = [];
    for (const code in la) if (lb[code]) out.push({ code, la: la[code], lb: lb[code], score: Math.min(LEVEL[la[code]], LEVEL[lb[code]]) * 10 + LEVEL[la[code]] + LEVEL[lb[code]] });
    return out.sort((x, y) => y.score - x.score);
  }

  /* ---------- Verdict (texte) ---------- */
  const yr = t => `<span class="year">${t}</span>`;
  const nm = (s, slot) => `<b class="${slot}">${esc(F(s, 'name'))}</b>`;
  const range = st => st.from === st.to ? T().rangeIn(yr(st.from)) : T().rangeFromTo(yr(st.from), yr(st.to));
  function sealSVG(kind) {
    const c = { meet: '#c08f36', near: '#b4372b', apart: '#5b3f28', never: '#5b3f28', incomplete: '#9a8a70' }[kind];
    const glyph = { meet: '✶', near: '≈', apart: '∅', never: '⌛', incomplete: '?' }[kind];
    return `<svg class="seal" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="${c}" opacity=".18"/><circle cx="32" cy="32" r="29" fill="none" stroke="${c}" stroke-width="2"/><circle cx="32" cy="32" r="23" fill="none" stroke="${c}" stroke-width=".8" stroke-dasharray="2 2"/><text x="32" y="41" text-anchor="middle" font-size="26" font-family="serif" fill="${c}">${glyph}</text></svg>`;
  }
  function placeBtn(lon, lat, label) { return `<button type="button" class="place-btn" data-lon="${lon}" data-lat="${lat}">${esc(label)}</button>`; }
  function langSection(v, hypothetical) {
    const { A, B, common } = v, t = T();
    if (!common.length) return `<h3>${t.langHead}</h3><p>${t.langNone(nm(A, 'a'), A.languages.map(l => langName(l.code)).join(', '), nm(B, 'b'), B.languages.map(l => langName(l.code)).join(', '))}</p>`;
    const best = common[0];
    let p = t.langIntro(hypothetical) + t.langIn(esc(langName(best.code)));
    p += best.la === best.lb ? t.langSame[best.la] : t.langDiff(t.how[best.la], nm(A, 'a'), t.how[best.lb], nm(B, 'b'));
    const chips = common.map((l, i) => `<span class="lang ${i === 0 ? 'best' : ''}">${esc(langName(l.code))} <small>${esc(t.how[l.la])} / ${esc(t.how[l.lb])}</small></span>`).join('');
    return `<h3>${t.langHead}</h3><p>${p}</p><div class="v-lang-list">${chips}</div>`;
  }
  function sharedList(v, fn, emptyText) {
    const { A, B } = v;
    if (!v.sharedPlaces.length) return `<p>${emptyText}</p>`;
    return '<ul>' + v.sharedPlaces.slice(0, 5).map(o => `<li>${fn(placeBtn(o.a.lon, o.a.lat, stopPlace(o.a)), nm(A, 'a'), range(o.a), nm(B, 'b'), range(o.b), o.gap)}</li>`).join('') + '</ul>';
  }
  function renderVerdict(v) {
    const box = $('#verdict'), t = T();
    if (v.kind === 'incomplete') { box.innerHTML = v.A || v.B ? `<div class="verdict-head">${sealSVG('incomplete')}<h2>${t.missing}</h2><p class="lede">${t.missingLede}</p></div>` : ''; drawMeet(v); return; }
    const { A, B } = v;
    let head = '', left = '', right = '';
    if (v.kind === 'never') {
      const f = v.first, s = v.second, fs = f === A ? 'a' : 'b', ss = s === A ? 'a' : 'b';
      head = `${sealSVG('never')}<h2>${t.neverHead(v.gap)}</h2><p class="lede">${t.neverLede(nm(f, fs), yr(f.died), nm(s, ss), v.gap, yr(s.born))}</p>`;
      left = `<div><h3>${t.samePlacesOtherTimes}</h3>${sharedList(v, t.sharedNever, t.twoWorlds)}</div>`;
      right = `<div>${langSection(v, true)}</div>`;
    } else {
      const years = v.end - v.start + 1, contemp = t.contemporaries(years, yr(v.start), yr(v.end));
      if (v.kind === 'meet') {
        const w = v.windows[0];
        const when = w.t0 === w.t1 ? t.whenIn(yr(w.t0)) : t.whenBetween(yr(w.t0), yr(w.t1));
        const badge = v.attested.length ? ` <span class="tag attested">${t.attested}</span>` : w.legend ? ` <span class="tag">${t.legend}</span>` : w.probable ? ` <span class="tag">${t.probable}</span>` : '';
        head = `${sealSVG('meet')}<h2>${t.meetHead(esc(placeName(w)))}${badge}</h2><p class="lede">${t.meetLede(when, w.inTransit, nm(A, 'a'), w.ageA, nm(B, 'b'), w.ageB, contemp)}</p>`;
        left = `<div><h3>${t.crossroads}</h3><ul>${v.windows.slice(0, 6).map(x => `<li>${placeBtn(x.lon, x.lat, placeName(x))}, ${x.t0 === x.t1 ? t.rangeIn(yr(x.t0)) : t.rangeFromTo(yr(x.t0), yr(x.t1))}${x.inTransit ? ' (' + t.inTransit + ')' : ''}${x.legend ? ' <span class="tag">' + t.legend + '</span>' : ''}</li>`).join('')}</ul>${v.attested.length ? `<h3>${t.sources}</h3><ul>${v.attested.map(m => `<li>${esc(F(m, 'where') || '')}${m.year ? ', ' + yr(m.year) : ''} : ${esc(F(m, 'note'))}</li>`).join('')}</ul>` : ''}</div>`;
      } else if (v.kind === 'attested') {
        const m = v.attested[0];
        head = `${sealSVG('meet')}<h2>${t.attestedHead(esc(F(m, 'where') || ''))} <span class="tag attested">${t.attested}</span></h2><p class="lede">${t.attestedLede(m.year ? yr(m.year) : '', contemp)}</p>`;
        left = `<div><h3>${t.sources}</h3><ul>${v.attested.map(x => `<li>${esc(F(x, 'where') || '')}${x.year ? ', ' + yr(x.year) : ''} : ${esc(F(x, 'note'))}</li>`).join('')}</ul><h3>${t.samePlacesOtherYears}</h3>${sharedList(v, t.sharedMissed, t.noCross)}</div>`;
      } else if (v.kind === 'near') {
        const n = v.near.slice().sort((x, y) => x.d - y.d)[0];
        const where = p => p.stop ? stopPlace(p.stop) : ((nearestCity(p.lat, p.lon, 150) || {}).modern || t.onTheWay);
        head = `${sealSVG('near')}<h2>${t.nearHead(Math.round(n.d / 10) * 10)}</h2><p class="lede">${t.nearLede(yr(Math.floor(n.t)), nm(A, 'a'), esc(where(n.pa)), nm(B, 'b'), esc(where(n.pb)), contemp)}</p>`;
        left = `<div><h3>${t.missed}</h3>${sharedList(v, t.sharedMissed, t.onlyNear(Math.round(n.d)))}</div>`;
      } else {
        head = `${sealSVG('apart')}<h2>${t.apartHead}</h2><p class="lede">${t.apartLede(contemp, Math.round(v.minD / 50) * 50, yr(Math.floor(v.minAt.t)))}</p>`;
        left = `<div><h3>${t.samePlacesOtherYears}</h3>${sharedList(v, t.sharedMissed, t.noCross)}</div>`;
      }
      right = `<div>${langSection(v, false)}</div>`;
    }
    const fun = `<div class="v-fun"><p class="a">${nm(A, 'a')} : ${esc(F(A, 'fun') || F(A, 'blurb'))}</p><p class="b">${nm(B, 'b')} : ${esc(F(B, 'fun') || F(B, 'blurb'))}</p></div>`;
    box.innerHTML = `<div class="verdict-head">${head}</div>${left}${right}${fun}`;
    box.querySelectorAll('.place-btn').forEach(b => b.addEventListener('click', () => { const [x, y] = P(Number(b.dataset.lon), Number(b.dataset.lat)); fitTo([[x - 90, y - 60], [x + 90, y + 60]], 10); }));
    drawMeet(v);
  }

  /* ---------- Frise du temps ---------- */
  const tl = $('#timeline'), yearInput = $('#year'), yearLabel = $('#year-label'), playBtn = $('#play');
  let playTimer = null;
  function setupTimeline(v) {
    if (!v.A || !v.B) { tl.hidden = true; layers.pawns.innerHTML = ''; return; }
    const lo = Math.min(v.A.born, v.B.born), hi = Math.max(v.A.died, v.B.died);
    tl.hidden = false; yearInput.min = lo; yearInput.max = hi;
    const target = v.kind === 'meet' ? v.windows[0].t0 : v.kind === 'attested' ? (v.attested[0].year || v.start) : v.kind === 'near' ? Math.floor(v.near.slice().sort((x, y) => x.d - y.d)[0].t) : v.kind === 'never' ? v.first.died : Math.floor(v.minAt.t);
    yearInput.value = target; setYear(target);
  }
  function setYear(tY) {
    const t = T();
    state.year = tY; yearLabel.textContent = `${t.year(tY)} · ${roman(tY)}`;
    layers.pawns.innerHTML = '';
    slots.forEach(k => {
      const s = byId[state[k]]; if (!s) return;
      const p = posAt(s, tY);
      const dead = !p; const q = p || (tY < s.born ? s.stops[0] : s.stops[s.stops.length - 1]);
      const [x, y] = P(q.lon, q.lat);
      const g = svg('g', { class: 'pawn ' + k + (dead ? ' dead' : ''), transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(ts * 1.5).toFixed(3)})`, 'data-x': x.toFixed(1), 'data-y': y.toFixed(1) }, layers.pawns);
      svg('circle', { class: 'halo', cx: 0, cy: -13, r: 5.5 }, g);
      svg('circle', { cx: 0, cy: -12.5, r: 3.2, fill: '#f3d9b5', stroke: '#5b3f28', 'stroke-width': .5 }, g);
      svg('path', { class: 'body', d: 'M-5 2 L-3.5 -9 Q0 -11.5 3.5 -9 L5 2 Z', stroke: '#3b2a1b', 'stroke-width': .5 }, g);
      const n = F(s, 'name');
      const txt = dead ? (tY < s.born ? t.pawnUnborn(n, s.sex === 'f') : t.pawnDead(n, s.died)) : t.pawnAge(n, tY - s.born);
      const w = txt.length * 3.4 + 6;
      // cartouche au-dessus de l'auréole, pour ne pas couvrir les étiquettes d'étapes
      svg('rect', { class: 'pawn-card', x: -w / 2, y: -29, width: w, height: 8.5, rx: 1.5 }, g);
      svg('text', { class: 'pawn-text', x: 0, y: -22.7 }, g).textContent = txt;
      svg('title', null, g).textContent = p ? (p.moving ? t.pawnMoving(n, stopPlace(p.from), stopPlace(p.to)) : t.pawnAt(n, stopPlace(p.stop))) : n;
    });
  }
  yearInput.addEventListener('input', () => setYear(Number(yearInput.value)));
  function stopPlay() { if (playTimer) { clearInterval(playTimer); playTimer = null; } playBtn.textContent = '▶'; playBtn.setAttribute('aria-label', T().play); }
  playBtn.addEventListener('click', () => {
    if (playTimer) return stopPlay();
    playBtn.textContent = '❚❚'; playBtn.setAttribute('aria-label', T().pause);
    if (Number(yearInput.value) >= Number(yearInput.max)) yearInput.value = yearInput.min;
    playTimer = setInterval(() => { const t = Number(yearInput.value) + 1; if (t > Number(yearInput.max)) return stopPlay(); yearInput.value = t; setYear(t); }, 90);
  });

  /* ---------- Actions ---------- */
  const toast = el('p', { class: 'chart-hint', id: 'toast', style: 'margin:0', 'aria-live': 'polite' });
  $('.actions').after(toast);
  let contemporaryPairs = null;
  $('#btn-random').addEventListener('click', () => {
    let a, b;
    if (Math.random() < 0.65) {
      if (!contemporaryPairs) { contemporaryPairs = []; for (let i = 0; i < saints.length; i++) for (let j = i + 1; j < saints.length; j++) { const o = Math.min(saints[i].died, saints[j].died) - Math.max(saints[i].born, saints[j].born); if (o >= 15) contemporaryPairs.push([saints[i], saints[j]]); } }
      [a, b] = contemporaryPairs[Math.floor(Math.random() * contemporaryPairs.length)];
      if (Math.random() < 0.5) [a, b] = [b, a];
    } else { a = saints[Math.floor(Math.random() * saints.length)]; do { b = saints[Math.floor(Math.random() * saints.length)]; } while (b === a); }
    state.a = a.id; state.b = b.id; renderChosen('a'); renderChosen('b'); update(); toast.textContent = '';
  });
  $('#btn-today').addEventListener('click', () => {
    const t = T(), now = new Date(), key = String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    const hits = saints.filter(s => s.feast === key), d = feastLabel(key);
    let pick;
    if (hits.length >= 2) { pick = hits.slice(0, 2); toast.textContent = t.todayTwo(d, hits.map(s => F(s, 'name')).join(', '), hits.length > 2); }
    else {
      const near = nearestFeasts(key, 2 + hits.length).filter(s => !hits.includes(s)); pick = hits.concat(near).slice(0, 2);
      toast.textContent = hits.length ? t.todayOne(d, F(hits[0], 'name'), F(pick[1], 'name'), feastLabel(pick[1].feast)) : t.todayNone(d, pick.map(s => `${F(s, 'name')} (${feastLabel(s.feast)})`).join(t.and));
    }
    state.a = pick[0].id; state.b = pick[1].id; renderChosen('a'); renderChosen('b'); update();
  });
  $('#btn-swap').addEventListener('click', () => { [state.a, state.b] = [state.b, state.a]; renderChosen('a'); renderChosen('b'); update({ keepView: true }); });

  /* ---------- Langue de l'interface ---------- */
  function applyLang(l, opts) {
    lang = l; document.documentElement.lang = l;
    try { localStorage.setItem('portulan-lang', l); } catch (e) { /* stockage indisponible : tant pis */ }
    $('#lang-fr').setAttribute('aria-pressed', String(l === 'fr')); $('#lang-en').setAttribute('aria-pressed', String(l === 'en'));
    document.querySelectorAll('[data-i18n]').forEach(n => { const k = n.getAttribute('data-i18n'); if (T()[k]) n.textContent = T()[k]; });
    document.title = T().title; const ct = $('#cartouche-title'); if (ct) ct.textContent = T().title;
    $('#zoom-in').setAttribute('aria-label', T().zoomIn); $('#zoom-out').setAttribute('aria-label', T().zoomOut); yearInput.setAttribute('aria-label', l === 'en' ? 'Year' : 'Année');
    labelTheme();
    slots.forEach(k => { pickers[k].relabel(); renderChosen(k); });
    toast.textContent = '';
    $('#colophon-count').textContent = T().count(saints.length, saints[0].born, Math.max(...saints.map(s => s.died)), cities.length) + ' ' + (l === 'en' ? 'Built on ' : 'Construit le ') + DATA.built + '.';
    if (!(opts && opts.initial)) update({ keepView: true });
  }
  $('#lang-fr').addEventListener('click', () => applyLang('fr'));
  $('#lang-en').addEventListener('click', () => applyLang('en'));

  /* ---------- Clair / sombre ---------- */
  // Sans préférence enregistrée, on suit le système (ou le thème imposé par l'hôte via data-theme) ; le bouton fixe un choix.
  const themeBtn = $('#theme-toggle'), darkMedia = matchMedia('(prefers-color-scheme: dark)');
  function labelTheme() { const dark = document.documentElement.dataset.theme === 'dark'; themeBtn.setAttribute('aria-pressed', String(dark)); themeBtn.setAttribute('aria-label', dark ? T().toLight : T().toDark); }
  function applyTheme(t, opts) {
    document.documentElement.dataset.theme = t;
    if (!(opts && opts.initial)) { try { localStorage.setItem('portulan-theme', t); } catch (e) { /* stockage indisponible : tant pis */ } }
    labelTheme();
  }
  let storedTheme = null; try { storedTheme = localStorage.getItem('portulan-theme'); } catch (e) { storedTheme = null; }
  applyTheme(storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : document.documentElement.dataset.theme || (darkMedia.matches ? 'dark' : 'light'), { initial: true });
  darkMedia.addEventListener('change', e => { if (!storedTheme) applyTheme(e.matches ? 'dark' : 'light', { initial: true }); });
  themeBtn.addEventListener('click', () => { storedTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(storedTheme); });

  /* ---------- Démarrage ---------- */
  buildMap(); setupPointer();
  pickers.a = buildPicker('a'); pickers.b = buildPicker('b');
  function fromHash() {
    const parts = location.hash.slice(1).split('--').filter(Boolean);
    // suffixe de langue facultatif (--fr / --en) : un lien partagé s'ouvre dans la langue de celui qui l'a copié
    const last = parts[parts.length - 1], hashLang = last === 'en' || last === 'fr' ? last : null; if (hashLang) parts.pop();
    if (parts.length === 2 && byId[parts[0]] && byId[parts[1]] && parts[0] !== parts[1]) return { ids: parts, lang: hashLang };
    return hashLang ? { ids: null, lang: hashLang } : null;
  }
  const h0 = fromHash();
  let stored = null; try { stored = localStorage.getItem('portulan-lang'); } catch (e) { stored = null; }
  const initialLang = h0 && h0.lang ? h0.lang : stored === 'en' || stored === 'fr' ? stored : (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  applyLang(initialLang, { initial: true });
  const defaults = ['francois-d-assise', 'dominique'].every(id => byId[id]) ? ['francois-d-assise', 'dominique'] : [saints[0].id, saints[1].id];
  const init = (h0 && h0.ids) || defaults;
  state.a = init[0]; state.b = init[1]; renderChosen('a'); renderChosen('b'); update({ noHash: !(h0 && h0.ids) });
  window.addEventListener('hashchange', () => { const p = fromHash(); if (p && p.ids && (p.ids[0] !== state.a || p.ids[1] !== state.b)) { state.a = p.ids[0]; state.b = p.ids[1]; renderChosen('a'); renderChosen('b'); update({ noHash: true }); } });
})();
