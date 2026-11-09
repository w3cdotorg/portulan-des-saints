"""Lit le shapefile Natural Earth rivers (50m) sans dépendance, garde les fleuves nommés
dans la fenêtre du portulan et écrit data/rivers.json : [{name, pts:[[lon,lat],...]}]."""
import struct, sys, json, math
shp, dbf, out = sys.argv[1], sys.argv[2], sys.argv[3]
WANT = {'Dnepre','Dnipro','Tajo','Tejo','Duero','Rhein','Rhin','Severnaya Dvina','Tisa','Nile','Danube','Rhine','Rhône','Rhone','Loire','Seine','Ebro','Tagus','Po','Dnieper','Don','Volga','Tigris','Euphrates','Indus','Amu Darya','Syr Darya','Garonne','Elbe','Oder','Vistula','Dniester','Guadalquivir','Douro','Thames','Shannon','Kura','Ural','Ganges','Oxus','Jordan','Tiber','Severn','Meuse','Moselle','Main','Neva','Western Dvina','Daugava','Northern Dvina','Kama','Oka','Orontes','Irtysh','Ob','Amur','Helmand','Narmada','Godavari','Krishna','Brahmaputra','Yellow','Huang He','Yangtze','Chang Jiang','Tarim','Ili','Selenga','Orkhon','Volta','Senegal','Niger','Draa','Moulouya','Medjerda','Chelif','Arno','Adige','Sava','Drava','Tisza','Prut','Southern Bug','Bug','Dvina','Pechora','Vychegda','Sukhona'}
# DBF
f = open(dbf,'rb'); hdr = f.read(32)
nrec, hlen, rlen = struct.unpack('<IHH', hdr[4:12])
fields = []
pos = 32
while True:
    fd = f.read(32)
    if fd[0] == 0x0D: break
    name = fd[:11].split(b'\x00')[0].decode('latin1'); flen = fd[16]
    fields.append((name, flen))
f.seek(hlen)
names = []
for i in range(nrec):
    rec = f.read(rlen); off = 1; d = {}
    for name, flen in fields:
        d[name] = rec[off:off+flen].decode('utf-8','replace').strip(); off += flen
    names.append(d.get('name') or d.get('name_en') or '')
# SHP
s = open(shp,'rb').read(); pos = 100; recs = []
while pos < len(s):
    num, clen = struct.unpack('>II', s[pos:pos+8]); pos += 8
    body = s[pos:pos+clen*2]; pos += clen*2
    shape = struct.unpack('<i', body[:4])[0]
    if shape not in (3, 13, 23): recs.append([]); continue
    nparts, npts = struct.unpack('<ii', body[36:44])
    parts = struct.unpack('<%di' % nparts, body[44:44+4*nparts])
    o = 44+4*nparts
    pts = [struct.unpack('<dd', body[o+16*i:o+16*i+16]) for i in range(npts)]
    lines = [pts[parts[i]:(parts[i+1] if i+1 < nparts else npts)] for i in range(nparts)]
    recs.append(lines)
BBOX = (-28, 3, 120, 73)
def dp(pts, tol=0.03):
    if len(pts) < 3: return pts
    keep=[False]*len(pts); keep[0]=keep[-1]=True; st=[(0,len(pts)-1)]
    while st:
        a,b=st.pop(); ax,ay=pts[a]; bx,by=pts[b]; dx,dy=bx-ax,by-ay; L=dx*dx+dy*dy; m=0;mi=-1
        for i in range(a+1,b):
            px,py=pts[i]
            if L==0: d=math.hypot(px-ax,py-ay)
            else:
                t=max(0,min(1,((px-ax)*dx+(py-ay)*dy)/L)); d=math.hypot(px-ax-t*dx,py-ay-t*dy)
            if d>m: m,mi=d,i
        if m>tol: keep[mi]=True; st+=[(a,mi),(mi,b)]
    return [p for p,k in zip(pts,keep) if k]
out_l = []
for nm, lines in zip(names, recs):
    if nm not in WANT: continue
    for ln in lines:
        if not any(BBOX[0]<=x<=BBOX[2] and BBOX[1]<=y<=BBOX[3] for x,y in ln): continue
        ln = dp(ln)
        if len(ln) >= 2: out_l.append({'name': nm, 'pts': [[round(x,3),round(y,3)] for x,y in ln]})
json.dump(out_l, open(out,'w'), separators=(',',':'))
from collections import Counter
print(len(out_l), 'tronçons', sum(len(l['pts']) for l in out_l), 'points'); print(sorted(Counter(l['name'] for l in out_l).items()))
