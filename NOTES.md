# Portulan des saints — carnet de bord

Objectif : artefact "fun" façon portulan (Europe + Asie, Antiquité tardive → fin du Moyen Âge).
On choisit deux saints (par nom ou par date de fête), la carte montre leurs trajets, où ils
auraient pu se croiser, et en quelle(s) langue(s) ils auraient pu se parler.

## 2026-11-09 13:40 — démarrage
- Clément délègue les choix ("je te laisse regarder", "prends ton temps") → pas de brainstorming bloquant.
- Choix de fabrication : HTML unique + SVG, trait de côte Natural Earth (fichier publié à côté),
  données saints rédigées à la main (JSON), repo privé w3cdotorg/portulan-des-saints.
- Contraintes artefact : CSP stricte (scripts cdnjs/jsdelivr/unpkg seulement, pas de fetch externe ;
  fetch des fichiers publiés à côté OK), pas de doctype/html/head à écrire, title 2-4 mots.
