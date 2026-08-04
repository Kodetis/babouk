# Babouk

Recensement des acteurs de la cybersécurité de la zone Océan Indien, publié sur
**https://babouk.kodetis.cloud**. Une landing qui donne à lire la répartition de
la filière, et un annuaire des fiches.

685 acteurs, 13 pays, 8 familles. Aucun chiffre de la page n'est écrit à la
main : ils sont tous dérivés du CSV au build. Un réexport qui change les données
change la page.

## Source des données

`data/acteurs.csv`, exporté du costum Communecter `cyberReunion` :

```sh
python3 scripts/export_acteurs.py
```

Le script interroge l'API publique de Communecter et écrit les 30 colonnes du
CSV. Les manques de la source sont conservés, jamais retranchés en silence :
115 fiches n'ont pas de coordonnées et 113 pas de pays exploitable — c'est
également le cas sur la carte d'origine.

## Développement

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # -> ./docs/
```

`prebuild` régénère le fond de carte et le logo, puis copie le CSV dans
`public/`. La sortie va dans `docs/` parce que GitHub Pages sert ce dossier.

## Déploiement

GitHub Pages, branche `main`, dossier `/docs` — le build est donc commité.
`public/CNAME` porte le domaine ; côté Cloudflare, le record `babouk` est un
CNAME vers `kodetis.github.io` en **DNS only** tant que GitHub n'a pas émis son
certificat, la validation ACME ne traversant pas le proxy.

Le site n'est pas indexable : `robots.txt` interdit le crawl, la balise
`meta robots` interdit l'indexation.

## Repères

| Fichier | Rôle |
| :--- | :--- |
| `src/lib/data.js` | Lecture du CSV et dérivation de tous les chiffres affichés |
| `src/lib/projection.js` | Fenêtre de carte et projection Mercator |
| `src/components/MapOceanIndien.astro` | Carte, entièrement rendue au build |
| `DESIGN.md` | Décisions de direction artistique |

Les arcs de la carte sont **illustratifs** : la source ne documente aucune
relation entre acteurs.
