"""Décode le TopoJSON Natural Earth land-50m, découpe sur la fenêtre du portulan,
simplifie (Douglas-Peucker) et écrit data/land.json : liste d'anneaux [[lon,lat],...]."""
import json, sys, math

BBOX = (-28.0, 3.0, 120.0, 73.0)  # lon_min, lat_min, lon_max, lat_max
TOL = 0.04  # degrés

def decode(topo):
    sc, tr = topo['transform']['scale'], topo['transform']['translate']
    arcs = []
    for arc in topo['arcs']:
        x = y = 0; pts = []
        for dx, dy in arc:
            x += dx; y += dy
            pts.append((round(x*sc[0]+tr[0], 4), round(y*sc[1]+tr[1], 4)))
        arcs.append(pts)
    return arcs

def ring(arc_idx, arcs):
    out = []
    for i in arc_idx:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        if out and out[-1] == a[0]: a = a[1:]
        out.extend(a)
    return out

def dp(pts, tol):
    if len(pts) < 3: return pts
    keep = [False]*len(pts); keep[0] = keep[-1] = True
    stack = [(0, len(pts)-1)]
    while stack:
        s, e = stack.pop()
        ax, ay = pts[s]; bx, by = pts[e]
        dx, dy = bx-ax, by-ay; L2 = dx*dx+dy*dy
        dmax, idx = 0, -1
        for i in range(s+1, e):
            px, py = pts[i]
            if L2 == 0: d = math.hypot(px-ax, py-ay)
            else:
                t = max(0, min(1, ((px-ax)*dx+(py-ay)*dy)/L2))
                d = math.hypot(px-(ax+t*dx), py-(ay+t*dy))
            if d > dmax: dmax, idx = d, i
        if dmax > tol:
            keep[idx] = True; stack.append((s, idx)); stack.append((idx, e))
    return [p for p, k in zip(pts, keep) if k]

def inbox(r):
    return any(BBOX[0] <= x <= BBOX[2] and BBOX[1] <= y <= BBOX[3] for x, y in r)

topo = json.load(open(sys.argv[1]))
arcs = decode(topo)
land = topo['objects']['land']
geoms = land['geometries'] if land['type'] == 'GeometryCollection' else [land]
rings = []
for g in geoms:
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    for poly in polys:
        for k, arc_idx in enumerate(poly):
            r = ring(arc_idx, arcs)
            if not inbox(r): continue
            r = dp(r, TOL)
            if len(r) < 4: continue
            # aire approx pour écarter les îlots
            area = abs(sum(r[i][0]*r[(i+1)%len(r)][1]-r[(i+1)%len(r)][0]*r[i][1] for i in range(len(r))))/2
            if area < 0.01 and k == 0: continue
            rings.append({'hole': k > 0, 'pts': [[round(x, 3), round(y, 3)] for x, y in r]})
json.dump(rings, open(sys.argv[2], 'w'), separators=(',', ':'))
print(len(rings), 'anneaux,', sum(len(r['pts']) for r in rings), 'points')
