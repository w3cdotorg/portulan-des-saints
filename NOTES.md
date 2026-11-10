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

## 14:02 — premier squelette
- src/template.html + src/style.css + src/app.js, assemblés par tools/build.py (données inlinées) → dist/index.html.
- Lots reçus : places.json (219 villes, 44 régions, 33 features, 20 mers ; Volga = « Edil », Dniepr = « Borysthenes »),
  saints-b.json (25 saints, 15 rencontres documentées). Séverin et Brendan très incertains (marqués).
- Logique de rencontre : position interpolée par pas de 0,25 an ; rencontre ≤ 60 km, voisinage ≤ 250 km ;
  occasions manquées = mêmes lieux à d'autres années ; langues = intersection pondérée natif/courant/notions.

## 14:04 — nouvelle exigence : bilingue FR/EN (message de Clément)
- Interface : dictionnaire I18N dans app.js, bascule FR/EN dans l'en-tête, préférence mémorisée (localStorage) + suffixe « --en » dans le hash.
- Données : champs *_en sur chaque saint (name_en, full_en, origin_en, role_en, blurb_en, fun_en, feast_note_en,
  stops[].note_en, met[].note_en / where_en). Traduction confiée à des sous-agents une fois tous les lots reçus.
- Toponymes de la carte : graphie portulan commune aux deux langues (pas de traduction). Noms de langues : table EN à ajouter.
- Lots reçus : B (25), E (28). Premier rendu : très proche de Maggiolo ; corrections : régions trop grandes, montagnes trop grosses,
  attribut transform="null" (warning), lueur de côte ajoutée.

## 14:18 — lots complets, affichage retravaillé
- 5 lots reçus : A 25, B 25, C 30, D 27, E 28 = 135 saints. Codes ajoutés : xtg (gaulois), ofs (vieux frison), osx (vieux saxon), frm (moyen français).
- Clément (14:12) : textes les uns sur les autres en zoomant → textes et traits en unités carte multipliés par --ts = (vue/vue totale)^0,7
  (borné 0,3..1) ; étiquettes d'étapes replacées à chaque niveau de zoom (glouton, 4 positions, villes tier 1-2 comme obstacles,
  nom de ville masqué s'il double une étape) ; pion animé avec cartouche. Vérifié en capture à 3,8×.
- À corriger après les traductions (fichiers data verrouillés par les agents) : Geneviève died 502 → 512 (tradition ; la rencontre
  Clotilde 508 est hors vie sinon). Rencontres non réciproques tolérées par l'app (théodore/cuthbert, amand/éloi, henri/étienne, edmond/louis).
- Traductions EN en cours (5 agents : A, B, C, E, puis D).

## 14:21 — traductions reçues, publication
- 5 lots traduits (champs *_en, anglais britannique, indent=1). Geneviève : mort 512 (tradition) pour que la rencontre Clotilde 508 tienne.
- Bug corrigé : verdict « presque » plantait quand le premier échantillon était le plus proche (pa/pb absents).
- Nouveau cas de verdict « attested » : rencontre documentée par les sources alors que les itinéraires simplifiés ne coïncident pas
  (François/Dominique à Rome 1216 par exemple). 120 paires aléatoires testées sans erreur.
- dist/index.html : 830 ko (données inlinées). Publication artefact + push GitHub.

- Artefact publié : https://claude.ai/artifact/4sqwWnR7kBwJtK3phhqQ3W (privé). Republier : même chemin dist/index.html.

## 17:00 — retours de Clément (à traiter à partir de 18h30, après remise à zéro des quotas)
1. Ajouter sainte Adèle (fête le 24 décembre) : Adèle de Pfalzel (v. 660-735, fille de Dagobert II, abbesse à Trèves, grand-mère de Grégoire d'Utrecht, correspondante de Boniface) → lot C.
2. Lisibilité : les saints sélectionnés ne ressortent pas. Pistes : fond de carte atténué (calque blanc-vélin semi-transparent
   sur rhumbs/villes/étiquettes quand deux saints sont choisis), trajets plus épais avec liseré clair, pastilles plus grandes,
   pions plus visibles, halo de rencontre plus net.
3. Une seule boussole : garder la grande à gauche (Atlantique) ou la centrale ; supprimer les autres.
4. Mers et océans en bleu (comme la Caspienne), même si anachronique : fond bleu sous la terre vélin, rhumbs par-dessus.
5. Clément peut fournir des images de référence : lui donner des URL.

## 18:30-18:40 — retours traités
- Sainte Adèle de Pfalzel (24/12) ajoutée au lot C, FR+EN, rencontre réciproque avec Boniface (Pfalzel 721). 136 saints.
- Mers en bleu (#6a98bd, même teinte que la Caspienne), grain conservé sur mer et terre, étiquettes de mers en ivoire liseré.
- Une seule rose des vents (la grande, Atlantique, r = 54). Les quatre autres supprimées.
- Lisibilité : calque d'atténuation (#f4ead2 à 36 %) entre le fond et les trajets dès qu'un saint est choisi ;
  trajets gainés d'ivoire, pastilles plus grandes avec ombre, étiquettes d'étapes en gras à la couleur du saint,
  pions à 1,5× avec cartouche au-dessus de l'auréole. Vérifié en vue totale et à 12× sur Trèves.
- Artefact republié (même URL). Pièges notés : navigation vers la même URL avec un autre hash ne recharge pas la page (ajouter ?v=N).

## 10/11 08:25-08:30 — repo public et GitHub Pages
- Demande de Clément : passer le repo en public et déployer sur GitHub Pages.
- tools/page.py : squelette HTML complet (doctype, head, titre remonté depuis le corps, favicon rose des vents en data URI),
  partagé par build.py (écrit docs/index.html + docs/.nojekyll) et preview.py. dist/index.html reste le corps nu pour l'artefact.
- README.md ajouté (FR, résumé EN), .gitignore : __pycache__.
- Repo w3cdotorg/portulan-des-saints passé en PUBLIC ; Pages activé sur master:/docs (build_type legacy).
  Premier build « errored » (activation avant indexation du push), le second a réussi dans la minute.
- En ligne : https://w3cdotorg.github.io/portulan-des-saints/ ; vérifié sous Playwright, 0 erreur console, page en anglais
  car la langue suit le navigateur quand le hash ne la fixe pas.
- Pas de licence dans le repo pour l'instant (choix de Clément) ; Natural Earth est du domaine public.
