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

## 13:48 — références visuelles
- Maggiolo 1541 (fourni par Clément dans ~/news/) : vélin ivoire, rhumbs rouge + sépia fins et denses,
  côtes à l'encre brune, toponymes minuscules perpendiculaires à la côte, montagnes en chenilles vertes,
  mer Rouge peinte en rouge, lacs bleus, villes en vignettes (tours, drapeaux), roses des vents polychromes
  (rouge/bleu/or/noir), tentes des souverains au Sahara, navires dans l'Atlantique, bandeaux dorés haut/bas,
  échelles « en échelle » (ladder) dans les bandeaux, noms de régions en capitales (ALAMANIA, VNGARIA).
- Wikimedia bloque le téléchargement direct des autres images (403). Pas gênant.
- Schéma de données écrit dans data/SCHEMA.md ; 5 lots de saints (~135) + 1 lot de toponymes confiés à des sous-agents.

## 13:55 — géodonnées
- data/land.json : Natural Earth 50m (world-atlas@2.0.2) décodé par tools/geo.py, fenêtre lon −28..120 / lat 3..73,
  Douglas-Peucker 0,04°, 211 anneaux / 7 738 points (129 ko). Îlots < 0,01 deg² écartés.
- data/rivers.json : shapefile NE 50m lu en pur Python (tools/rivers.py), ~45 fleuves nommés, 37 ko.
  Pièges : noms NE en graphie locale (Dnipro, Tajo, Duero, Rhein, Severnaya Dvina) ; pas de Tibre ni de Kura au 50m.
- Projection prévue : équirectangulaire simple (x = lon, y = −lat × 1,3), comme les portulans (pas de projection).
