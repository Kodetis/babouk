# Carte interactive — design

> Branche `feat/carte-interactive`. Rédigé le 2026-08-04.

## Le problème

Trouver un acteur cyber de l'océan Indien à partir de sa localisation, en trois
clics. Aujourd'hui la carte du héros montre 55 foyers mais ne dit pas qui s'y
trouve : `mapPoints` porte un effectif, jamais une identité.

Cadre : livrable EDIH, WP6 Écosystème & Réseautage. Le message est
l'inventaire — voici les acteurs, où ils sont, ce qu'ils font. Ni classement,
ni comparaison.

## Hors sujet

- **Pas de fond de tuiles.** Ni OpenStreetMap ni équivalent : aucune valeur
  ajoutée pour placer 55 foyers, et une dépendance externe sur un livrable qui
  se veut autonome.
- **Pas de zoom ni de pan libres.** 71 % des acteurs géolocalisés partagent
  leurs coordonnées exactes avec un autre — ce sont des centroïdes de ville,
  33 fiches au même point à Port-Louis. Le zoom promet une séparation que la
  donnée ne peut pas tenir.
- **Pas de relations entre acteurs.** Les arcs décoratifs restent sur la
  landing, assumés comme tels ; ils n'ont rien à faire ici.
- **Pas de second moteur de recherche.** L'annuaire reste la liste ; la carte
  est une entrée géographique vers elle.

## Architecture

Une page, `/carte`, rendue au build comme le reste du site. Trois surfaces :

1. **La carte** — le composant `MapOceanIndien` existant, en mode interactif
2. **Le panneau** — la liste des acteurs du foyer sélectionné
3. **La barre de filtres** — famille, pays, vue régionale

Aucun appel réseau après le premier chargement, comme l'annuaire.

## Données

`mapPoints` gagne le champ qui lui manque : chaque foyer porte les acteurs
qu'il contient.

    { x, y, n, c, f, country, actors: [{ name, fams, city, web }] }

572 entrées, 49 Ko de JSON brut, **13 Ko gzippés** — à comparer aux 1,6 Mo que
pèse déjà la page annuaire. Le panneau n'interroge rien : tout est dans la
page au chargement.

## Recadrage par région

Cinq vues : **tout le bassin** (défaut), Afrique de l'Est, Mascareignes,
Inde & Sri Lanka, Australie.

Point technique qui commande l'implémentation : **l'attribut `viewBox` ne se
transitionne pas en CSS.** Le recadrage passe donc par un `transform`
translate + scale posé sur un groupe englobant, animé en CSS. C'est composité
par le GPU, et la projection du SVG reste intacte — aucun point n'est
reprojeté.

`src/lib/vues.js` traduit des bornes géographiques en transform, avec la même
projection que le reste. Les bornes sont écrites une fois, jamais les
transforms.

## Le panneau

Au clic sur un foyer : le lieu, l'effectif, puis la liste des acteurs. Chaque
ligne porte la pastille de sa famille, le nom, la ville et un lien vers le
site quand il existe.

En pied de panneau, en permanence : **115 acteurs sans coordonnées**, qui
renvoie vers l'annuaire. Ils comptent dans le total de 685 et n'apparaissent
sur aucune carte — les masquer serait le seul vrai mensonge possible sur une
page qui s'appelle « carte ».

Sous `lg`, le panneau devient une feuille ancrée en bas d'écran.

## Filtres

Famille (8) et pays (13), mêmes slugs que l'annuaire. Un foyer dont aucun
acteur ne passe le filtre tombe à 12 % d'opacité plutôt que de disparaître :
la géographie du bassin reste lisible.

Le mécanisme existe déjà pour les familles — `data-isolate` posé sur un
ancêtre, tout le rendu en CSS, aucune classe écrite sur les 55 foyers. On
l'étend au pays sans changer le principe.

## URL

    /carte/?famille=cert&pays=maurice&vue=mascareignes&foyer=452:318

Même contrat que l'annuaire pour `famille` et `pays`, augmenté de `vue` et
`foyer`. Une valeur inconnue est ignorée au lieu de vider l'écran, comme le
fait déjà `lireUrl()` dans l'annuaire.

Conséquence utile : `/carte/?famille=cert` est un lien partageable, et le
bouton « voir dans l'annuaire » transporte l'état d'un écran à l'autre.

## Les trois clics

Scénario de référence — un laboratoire de recherche à Maurice :

    landing → "Recherche" ou "Carte"        (1)
            → Maurice, ou le foyer mauricien (2)
            → l'acteur dans le panneau       (3)

C'est le critère de réussite, et il se vérifie au navigateur.

## Accessibilité

- Chaque foyer est un `<button>` focusable, ordre de tabulation par effectif
  décroissant — le plus gros d'abord, pas le plus à l'ouest.
- Les vues sont des `<button>`, jamais un geste : la carte reste utilisable
  sans souris et sans doigt.
- Le panneau est une région annoncée à chaque changement de sélection.
- Tant qu'aucun foyer n'est sélectionné, la carte garde son `role="img"` et
  son résumé textuel.

## Découpage

| Unité | Rôle |
| :--- | :--- |
| `src/lib/data.js` | ajouter `actors` à `mapPoints` |
| `src/lib/vues.js` | les cinq cadrages, bornes géographiques → transform |
| `src/components/MapOceanIndien.astro` | mode interactif, groupe de recadrage |
| `src/pages/carte.astro` | page, barre de filtres, panneau |

Le composant de carte est partagé avec la landing : le mode interactif est une
prop, pas une copie. La landing continue de l'appeler sans.

## Vérification

- Le scénario des trois clics, exécuté au navigateur, du premier écran à la
  fiche.
- Chaque vue recadre sans couper un foyer de sa région.
- Un filtre sans résultat affiche un état vide explicite, jamais une carte
  éteinte sans explication.
- Parcours au clavier seul : atteindre un foyer, ouvrir le panneau, le lire.
- Le total du panneau plus les 115 sans coordonnées égale 685, quel que soit
  le filtre actif.
