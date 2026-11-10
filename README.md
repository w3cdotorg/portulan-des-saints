# Portulan des saints

Deux saints du calendrier auraient-ils pu se croiser ? Choisissez-en deux, par nom ou par date de fête :
la carte, dessinée à la manière des portulans du XIVe au XVIe siècle, trace leurs itinéraires, cherche
où et quand ils auraient pu se rencontrer, et dit en quelle(s) langue(s) ils auraient pu se parler.

**En ligne : https://w3cdotorg.github.io/portulan-des-saints/** (français et anglais, bascule en haut de page).

*Two saints of the calendar: could they ever have met? Pick two, by name or by feast day, and a
portolan-style chart draws their journeys, looks for a possible meeting and lists the languages they
could have shared. The page is bilingual (FR / EN).*

## Ce que c'est, ce que ce n'est pas

Un jeu de curiosité historique, pas un ouvrage savant. Les 136 fiches (IVe au XVe siècle) reposent sur
les vies et traditions courantes ; chaque étape est notée « sûre », « probable » ou « légende », et les
dates d'avant l'an mil sont souvent approximatives. Les rencontres attestées par les sources sont
signalées comme telles ; les autres ne sont que des coïncidences de lieu et de temps.

## Structure

- `src/template.html`, `src/style.css`, `src/app.js` : la page, une seule dépendance externe (Google Fonts).
- `data/saints-*.json` : les fiches (schéma dans `data/SCHEMA.md`, convention de traduction dans `data/TRANSLATION.md`).
- `data/places.json` : 219 toponymes en graphie portulan ; `data/land.json`, `data/rivers.json` : traits de côte et fleuves (Natural Earth 50 m, domaine public).
- `tools/build.py` : assemble `dist/index.html` (corps de page pour l'artefact claude.ai) et `docs/index.html` (page complète servie par GitHub Pages).
- `tools/validate.py` : contrôles de cohérence des fiches. `tools/preview.py` : prévisualisation locale.
- `NOTES.md` : journal de bord du projet.

```sh
python3 -I tools/build.py        # régénère dist/ et docs/
python3 -I tools/validate.py     # vérifie les fiches
python3 -I tools/preview.py && python3 -m http.server 8791   # puis ouvrir scratch/preview.html
```

Ne pas éditer `dist/` ni `docs/` à la main : ils sont régénérés à chaque build.

## Inspirations

Vesconte Maggiolo (1541), l'Atlas catalan (1375), la Carte pisane et les cartes d'Angelino Dulcert
(1339) et de Mecia de Viladestes (1413). Les mers sont bleues, les roses des vents et les tentes
décoratives, les monstres marins sans garantie.
