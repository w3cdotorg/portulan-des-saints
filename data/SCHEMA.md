# Schéma des données « saints »

Un fichier JSON par lot : `data/saints-<lettre>.json` = tableau d'objets. Tout texte en français.
Pas de tiret cadratin (—) dans les textes : virgule, point ou deux-points.

```json
{
  "id": "colomban",                      // slug ascii, unique, minuscules, tirets
  "name": "Colomban",                    // prénom usuel FR, sans « saint »
  "full": "Saint Colomban de Luxeuil",   // nom complet FR
  "feast": "11-23",                      // MM-JJ, fête au calendrier romain actuel (sinon FR usuel ; pour un saint orthodoxe seul, calendrier byzantin)
  "feast_note": "",                      // optionnel : « 24 novembre en Irlande », etc.
  "born": 543, "died": 615,              // années entières (estimation si besoin)
  "approx": true,                        // true si les dates sont approximatives
  "tradition": "catholique",             // "catholique" | "orthodoxe" | "commune" (vénéré des deux côtés)
  "origin": "Leinster, Irlande",
  "role": "moine missionnaire",          // 2-4 mots : évêque, ermite, reine, roi, abbé, pèlerine...
  "sex": "m",                            // "m" | "f"
  "languages": [                         // langues PARLÉES, pas seulement lues. Codes : voir LANGUES ci-dessous
    {"code": "sga", "level": "natif"},   // level : "natif" | "courant" | "notions"
    {"code": "lat", "level": "courant"}
  ],
  "stops": [                             // chronologique, du lieu de naissance (from = born) au lieu de mort (to = died)
    {"place": "Nobber (Leinster)", "lat": 53.82, "lon": -6.75, "from": 543, "to": 560,
     "note": "Enfance et premières études.", "certainty": "sur"}   // certainty : "sur" | "probable" | "legende"
  ],
  "met": [                               // optionnel : rencontres DOCUMENTÉES avec d'autres saints de la liste
    {"with": "gall", "where": "Luxeuil puis Bregenz", "year": 591, "note": "Gall est son compagnon de route pendant vingt ans."}
  ],
  "blurb": "Une ou deux phrases drôles mais exactes, pour donner envie.",
  "fun": "Un détail savoureux et vrai (anecdote, relique, légende signalée comme telle).",
  "sources": ["https://fr.wikipedia.org/wiki/Colomban_de_Luxeuil"]
}
```

Règles pour `stops` :
- 3 à 12 étapes. Garder les longs séjours et les voyages importants (pèlerinages, exils, missions, conciles).
- Les années d'une étape sont celles de PRÉSENCE sur place ; le déplacement entre deux étapes est implicite.
- `to` d'une étape ≤ `from` de la suivante. Première étape : `from` = `born`. Dernière : `to` = `died`.
- Un même lieu peut revenir plusieurs fois (aller-retour).
- Coordonnées décimales à 2 décimales (lat, lon). Lieux antiques : coordonnées du site actuel.
- Voyage légendaire (Brendan, etc.) : `certainty: "legende"`, on le garde car c'est amusant, mais on le dit.
- Saint sédentaire : 1 à 3 étapes, c'est très bien aussi (« il n'a jamais bougé, à toi de venir »).

LANGUES (codes autorisés) :
lat latin · grc grec · syc syriaque · cop copte · hye arménien · kat géorgien · sga vieil irlandais · gla gaélique écossais ·
cym brittonique/gallois · bre breton · cor cornique · ang vieil anglais · enm moyen anglais · non vieux norrois · got gotique ·
frk francique · goh vieux haut-allemand · gmh moyen haut-allemand · odt vieux néerlandais · fro ancien français ·
xno anglo-normand · oci occitan · cat catalan · spa castillan · por galaïco-portugais · ita italien (vernaculaires) ·
chu vieux slave (slavon) · orv vieux russe · pol vieux polonais · ces vieux tchèque · srp serbe · bul bulgare ·
hun hongrois · fin finnois · kom komi · ara arabe · fas persan · pal moyen-perse · heb hébreu · arc araméen ·
tur turc · kip kiptchak/tatar · mon mongol · ber berbère · mal malayalam · gez guèze · egy égyptien tardif ·
xcl arménien classique (= hye) · rom roman commun (proto-roman, avant 800 : on utilise « lat » pour le latin parlé)

Si une langue manque vraiment, ajouter le code ISO 639-3 et le signaler dans la réponse.
