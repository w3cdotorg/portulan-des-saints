"""Enveloppe dist/index.html dans un squelette HTML (comme le fait l'artefact) pour la prévisualisation locale."""
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
body = open(os.path.join(ROOT, 'dist', 'index.html'), encoding='utf-8').read()
theme = sys.argv[1] if len(sys.argv) > 1 else ''
html = f'''<!doctype html><html{(' data-theme="%s"' % theme) if theme else ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{{color-scheme:light}}body{{margin:0;font:14px system-ui}}img{{max-width:100%}}[hidden]{{display:none!important}}</style></head><body>{body}</body></html>'''
out = os.path.join(ROOT, 'scratch', 'preview%s.html' % ('-' + theme if theme else ''))
open(out, 'w', encoding='utf-8').write(html); print(out)
