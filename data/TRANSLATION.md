# Traduction anglaise des fiches

Chaque fiche de `data/saints-<lettre>.json` reçoit des champs anglais À CÔTÉ des champs français (on ne modifie
jamais les champs existants) :

- `name_en` (usage anglais : "Columbanus", "Gall", "Augustine of Hippo" → ici seulement le prénom usuel : "Columbanus", "Augustine"),
- `full_en` ("Saint Columbanus of Luxeuil"), `origin_en`, `role_en`,
- `blurb_en`, `fun_en`, `feast_note_en` (seulement si `feast_note` est non vide),
- pour chaque étape : `place_en` (graphie anglaise du lieu : "Jerusalem", "Constantinople", "Rome", "Cologne"…) et `note_en`,
- pour chaque rencontre `met` : `where_en`, `note_en`,
- pour chaque langue qui aurait un champ `note` : `note_en`.

Ton : même esprit que le français, enjoué et précis, anglais naturel (pas de traduction mot à mot).
Pas de tiret cadratin. Les légendes restent signalées comme légendes.
Méthode conseillée : un script Python qui charge le JSON, applique un dictionnaire de traductions par id,
puis réécrit le fichier avec `json.dump(..., ensure_ascii=False, indent=1)`. Vérifier à la fin que chaque fiche,
chaque étape et chaque rencontre ont bien tous les champs `_en` attendus.
