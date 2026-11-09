"""Validation croisée de tous les lots : ids, rencontres, coordonnées, chronologie, langues, fêtes."""
import json, glob, os, re, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = set('lat grc syc cop hye kat sga gla cym bre cor ang enm non got frk goh gmh odt fro frm xno oci cat spa por ita chu orv pol ces srp bul hun fin kom ara fas pal heb arc tur kip mon ber mal gez egy xcl rom xtg ofs osx khz'.split())
saints = []
for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'saints-*.json'))):
    for s in json.load(open(f, encoding='utf-8')): s['_file'] = os.path.basename(f); saints.append(s)
ids = collections.Counter(s['id'] for s in saints)
errs = []
for i, n in ids.items():
    if n > 1: errs.append(f'id en double : {i}')
known = set(ids)
for s in saints:
    pre = f"{s['_file']} {s['id']}:"
    if not re.fullmatch(r'\d\d-\d\d', s['feast']): errs.append(f'{pre} feast {s["feast"]}')
    if s['stops'][0]['from'] != s['born'] or s['stops'][-1]['to'] != s['died']: errs.append(f'{pre} bornes étapes')
    for a, b in zip(s['stops'], s['stops'][1:]):
        if a['to'] > b['from']: errs.append(f'{pre} chronologie {a["place"]} -> {b["place"]}')
    for st in s['stops']:
        if not (-26 <= st['lon'] <= 118 and 4 <= st['lat'] <= 72): errs.append(f'{pre} hors carte {st["place"]} ({st["lat"]},{st["lon"]})')
        if st['from'] > st['to']: errs.append(f'{pre} étape inversée {st["place"]}')
    for l in s['languages']:
        if l['code'] not in LANGS: errs.append(f'{pre} langue inconnue {l["code"]}')
    for m in s.get('met', []):
        if m['with'] not in known: errs.append(f'{pre} rencontre avec inconnu {m["with"]}')
        else:
            o = next(x for x in saints if x['id'] == m['with'])
            if 'year' in m and not (o['born'] <= m['year'] <= o['died'] and s['born'] <= m['year'] <= s['died']): errs.append(f'{pre} rencontre {m["with"]} en {m["year"]} hors des vies')
            if not any(x['with'] == s['id'] for x in o.get('met', [])): errs.append(f'{pre} rencontre non réciproque avec {m["with"]}')
    for k in ('blurb', 'fun'):
        if '—' in s.get(k, ''): errs.append(f'{pre} tiret cadratin dans {k}')
print(len(saints), 'saints ;', len(errs), 'problèmes')
for e in errs: print(' -', e)
# fêtes du jour
today = __import__('datetime').date.today().strftime('%m-%d')
print('fêtés aujourd\'hui', today, ':', [s['name'] for s in saints if s['feast'] == today])
