"""Assemble dist/index.html : src/template.html + src/style.css + src/app.js + données JSON inlinées."""
import json, glob, re, sys, os, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
saints = []
for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'saints-*.json'))):
    saints += json.load(open(f, encoding='utf-8'))
ids = [s['id'] for s in saints]
dups = {i for i in ids if ids.count(i) > 1}
if dups: sys.exit('ids en double : %s' % dups)
known = set(ids)
for s in saints:
    for m in s.get('met', []):
        if m['with'] not in known: print('  avertissement : %s rencontre un inconnu %s' % (s['id'], m['with']))
data = {
    'saints': saints,
    'places': json.load(open(os.path.join(ROOT, 'data', 'places.json'), encoding='utf-8')) if os.path.exists(os.path.join(ROOT, 'data', 'places.json')) else {'cities': [], 'regions': [], 'features': [], 'seas': []},
    'land': json.load(open(os.path.join(ROOT, 'data', 'land.json'))),
    'rivers': json.load(open(os.path.join(ROOT, 'data', 'rivers.json'))),
    'built': datetime.date.today().isoformat(),
}
blob = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
html = rd('src/template.html')
html = html.replace('/*__CSS__*/', rd('src/style.css')).replace('/*__DATA__*/', 'const DATA = ' + blob + ';').replace('/*__JS__*/', rd('src/app.js'))
out = os.path.join(ROOT, 'dist', 'index.html')
open(out, 'w', encoding='utf-8').write(html)
print('%d saints, %d villes, %d ko -> %s' % (len(saints), len(data['places']['cities']), len(html.encode()) // 1024, out))
