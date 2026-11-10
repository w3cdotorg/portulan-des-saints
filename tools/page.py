"""Squelette HTML complet autour du corps de page artefact (dist/index.html).

L'artefact Claude fournit lui-même doctype, <html> et <head> ; pour GitHub Pages et la
prévisualisation locale, on les ajoute ici. Une seule fonction, partagée par build.py et preview.py."""
import re

DESCRIPTION = ("Deux saints du calendrier auraient-ils pu se croiser ? Carte façon portulan, "
               "itinéraires, lieux de rencontre possibles et langues communes. FR / EN.")

def wrap(body, theme=''):
    attr = ' data-theme="%s"' % theme if theme else ''
    # Le corps artefact porte son propre <title> et une meta propre à claude.ai : on remonte le titre dans <head>.
    m = re.search(r'<title>(.*?)</title>\n?', body)
    title = m.group(1) if m else 'Portulan des saints'
    body = re.sub(r'<title>.*?</title>\n?', '', body, count=1)
    body = re.sub(r'<meta name="claude:[^"]*"[^>]*>\n?', '', body, count=1)
    return f'''<!doctype html>
<html lang="fr"{attr}>
<head>
<meta charset="utf-8">
<title>{title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="{DESCRIPTION}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{DESCRIPTION}">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='15' fill='%23f1e4c6' stroke='%238e2a20' stroke-width='2'/%3E%3Cpath d='M16 3v26M3 16h26M6.8 6.8l18.4 18.4M25.2 6.8L6.8 25.2' stroke='%233b2a1b' stroke-width='1.2'/%3E%3Cpath d='M16 7l2.5 6.5L16 16l-2.5-2.5z' fill='%238e2a20'/%3E%3C/svg%3E">
<style>body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
</head>
<body>
{body}
</body>
</html>
'''
