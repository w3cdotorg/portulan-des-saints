"""Enveloppe dist/index.html dans un squelette HTML (comme le fait l'artefact) pour la prévisualisation locale."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from page import wrap
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
body = open(os.path.join(ROOT, 'dist', 'index.html'), encoding='utf-8').read()
theme = sys.argv[1] if len(sys.argv) > 1 else ''
os.makedirs(os.path.join(ROOT, 'scratch'), exist_ok=True)
out = os.path.join(ROOT, 'scratch', 'preview%s.html' % ('-' + theme if theme else ''))
open(out, 'w', encoding='utf-8').write(wrap(body, theme)); print(out)
