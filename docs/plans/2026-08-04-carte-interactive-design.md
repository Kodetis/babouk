# Carte interactive — design

> Branche `feat/carte-interactive`. Rédigé le 2026-08-04, révisé le même jour
> après relecture adverse. Les corrections sont notées en fin de document.

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
- **Pas de zoom libre, pas de pan.** Molette et glisser demandent un moteur à
  écrire et à régler au doigt, pour un gain nul ici : le recadrage par pays
  couvre le besoin et reste utilisable au clavier.
- **Pas de relations entre acteurs.** Les arcs décoratifs restent sur la
  landing, assumés comme tels ; ils n'ont rien à faire ici.
- **Pas de second moteur de recherche.** Pas de champ texte : la recherche
  plein texte reste dans l'annuaire. La carte n'a que deux filtres.

## Architecture

Une page, `/carte`, rendue au build comme le reste du site. Trois surfaces :

1. **La carte** — le composant `MapOceanIndien`, en mode interactif
2. **Le panneau** — la liste des acteurs du foyer sélectionné
3. **Deux filtres** — famille et pays

Aucun appel réseau après le premier chargement, comme l'annuaire.

## Recadrage par pays

Cliquer un pays recadre la carte dessus. Le zoom suit le filtre au lieu d'être
un contrôle de plus : désigner Maurice et voir Maurice sont le même geste.

Le `viewBox` ne se transitionne pas en CSS. Le cadrage est donc une translation
et une échelle posées sur un groupe englobant, animées en CSS. La contrepartie
est réelle : l'échelle multiplie tout ce que le groupe contient. Les traits de
côte et le graticule en sortent par `vector-effect="non-scaling-stroke"` ; les
foyers par une contre-échelle de `1/k` autour de leur propre centre — position
zoomée, taille constante. Le découpage est porté par le groupe de cadrage et
non par les terres : appliqué là, il s'exerce dans le repère non transformé,
donc sur le cadre visible.

Facteurs de ×2,7 pour l'Inde à ×37 pour les îles. Un pays sans foyer
géolocalisé n'a pas de cadrage : on reste au bassin plutôt que de zoomer sur du
vide.

## Données : deux résolutions

Une seule grille d'agrégation ne peut pas servir les deux échelles de lecture,
et c'est la découverte qui a fait rouvrir le sujet du zoom.

Au demi-degré, La Réunion — 0,47° sur 0,49° — tient dans une cellule : ses 45
acteurs, qui portent **43 coordonnées distinctes réparties sur 19 communes**,
s'écrasaient en 3 disques. La statistique globale des « 71 % d'acteurs partageant
leurs coordonnées exactes » est vraie, mais tirée par l'Inde et Maurice ; elle
ne dit rien de La Réunion, et s'en servir pour refuser le zoom était une erreur.

Deux jeux sont donc calculés au build :

| | grille | foyers | La Réunion |
| :--- | :--- | ---: | ---: |
| `mapPoints` | 0,5° | 55 | 3 |
| `mapPointsFins` | 0,01° | 168 | 30 |

La page montre le premier au bassin — 168 disques s'y chevaucheraient en pâté —
et bascule sur le second dès qu'un pays est cadré, où la place existe pour les
séparer. Les clés de foyer et de panneau sont préfixées par le niveau.

La page pèse 1,4 Mo, du même ordre que l'annuaire. C'est assumé : les deux jeux
de panneaux sont prérendus, le client ne fait que montrer et masquer.

## Données : identité des foyers

`mapPoints` gagne deux champs. Le premier est l'identité qui manque, le second
corrige une approximation du mécanisme de filtrage.

    {
      x, y, n, c, country,
      f,          // famille dominante — sert la COULEUR du disque
      fams,       // toutes les familles présentes, séparées par un espace
      actors: [{ name, fams, city, web }],
    }

`fams` est indispensable et n'existe pas aujourd'hui. Le mécanisme actuel
n'expose que `f`, la famille **dominante** (`data.js`, sélection du `dominant`
par effectif). Or 34 des 55 foyers contiennent plusieurs acteurs : filtrer sur
la dominante éteindrait un foyer contenant un CERT au motif qu'il est
majoritairement composé d'entreprises. `fams` reprend exactement la convention
de `data-f` dans l'annuaire.

Charge utile : 569 acteurs, 49 Ko de JSON brut, **13 Ko gzippés** — à comparer
aux 1,6 Mo que pèse déjà la page annuaire. Le panneau n'interroge rien.

## Filtres

Deux axes, **avec les valeurs exactes de l'annuaire** :

| Axe | Valeurs | Source |
| :--- | :--- | :--- |
| `famille` | 9 slugs, `sans-famille` compris | `familyFacets` |
| `pays` | 14 valeurs, libellés bruts accentués (`Maurice`, `La Réunion`) plus la chaîne vide pour « Sans pays » | `countryFacets` |

Les valeurs de pays ne sont **pas** des slugs : `countryFacets` pose
`slug: c.country`. Un lien `?pays=maurice` serait rejeté par la validation de
`lireUrl()`, qui compare strictement. La carte doit écrire `?pays=Maurice`.

Un foyer dont aucun acteur ne passe le filtre tombe à 12 % d'opacité plutôt que
de disparaître : la géographie du bassin reste lisible. Le test porte sur
`fams` et sur `country`, jamais sur la dominante.

Le filtre pays n'est pas redondant avec le clic sur un foyer : un pays contient
souvent plusieurs foyers — trois pour l'Australie parmi les plus gros, deux pour
l'Inde.

**Garde au build.** `country` d'un foyer est le pays du premier acteur inséré
dans la cellule. Aucune cellule ne mélange aujourd'hui deux pays, mais rien ne
l'empêche à un réexport près. Une assertion au build échoue si une cellule
devient mixte, plutôt que de filtrer en silence sur une valeur arbitraire.

## Le panneau

Au clic sur un foyer : le lieu, l'effectif, puis la liste des acteurs. Chaque
ligne porte la pastille de sa famille, le nom, la ville et un lien vers le site
quand il existe. Le panneau liste **tous** les acteurs du foyer, y compris
ceux que le filtre courant exclut, signalés comme tels — un foyer ouvert est
une question sur un lieu, pas sur un filtre.

En pied de panneau, en permanence : **116 acteurs ne sont pas sur la carte** —
115 sans coordonnées et 1 hors cadre — avec un lien vers l'annuaire. Le chiffre
est lu dans `coverage`, jamais écrit à la main.

Sous `lg`, le panneau devient une feuille ancrée en bas d'écran.

## URL

    /carte/?famille=cert&pays=Maurice

Deux paramètres, ceux de l'annuaire, avec ses valeurs. Une valeur inconnue est
ignorée au lieu de vider l'écran, comme le fait déjà `lireUrl()`.

**Pas de paramètre `foyer`.** L'identifiant d'un foyer serait ses coordonnées
projetées, arrondies au dixième et recalculées à chaque export : un acteur
ajouté dans la cellule déplace le centroïde et casse tout lien partagé, en
silence. La sélection d'un foyer reste un état d'écran, pas un état d'URL.

Conséquence utile : `/carte/?famille=cert` est partageable, et le bouton « voir
dans l'annuaire » transporte l'état d'un écran à l'autre.

## Les trois clics

Scénario de référence — un laboratoire de recherche à Maurice :

    landing → "Recherche" ou "Carte"        (1)
            → Maurice, ou le foyer mauricien (2)
            → l'acteur dans le panneau       (3)

C'est le critère de réussite, et il se vérifie au navigateur.

## Accessibilité

- Un foyer est un `<g role="button" tabindex="0">`, pas un `<button>` HTML :
  ce dernier n'est pas un enfant valide d'un `<g>` SVG.
- En mode interactif, la carte **abandonne** `role="img"`. Ce rôle rend ses
  descendants présentationnels : les foyers ne seraient jamais atteignables au
  clavier. La carte devient un `role="group"` avec son résumé en
  `aria-describedby`. Le mode non interactif de la landing garde `role="img"`.
- **`mapPoints` passe en tri décroissant**, et cela règle deux problèmes d'un
  coup. En SVG, l'ordre du DOM commande à la fois la peinture et le focus, et
  les éléments tardifs sont peints par-dessus les précédents.

  Le tri actuel est croissant (`.sort((a, b) => a.n - b.n)`) : le foyer de 63
  acteurs arrive en dernier et se peint **au-dessus** de ses voisins. Avec un
  rayon de 19 unités quand deux cellules adjacentes n'en sont séparées que de
  4,8, il en recouvre plusieurs — qui sont donc incliquables. C'est un défaut
  actuel, visible aussi sur la landing.

  En décroissant, les gros foyers passent en premier dans le DOM : peints
  dessous, et atteints d'abord au clavier. Les petits finissent en dernier,
  donc au-dessus et cliquables. Aucun arbitrage à faire, contrairement à ce
  qu'affirmait la version précédente de ce document.
- Les filtres sont des `<button>`, jamais un geste.

## Découpage

| Unité | Rôle |
| :--- | :--- |
| `src/lib/data.js` | ajouter `fams` et `actors` à `mapPoints` ; assertion de cellule mono-pays |
| `src/components/MapOceanIndien.astro` | prop `interactif` : foyers focusables, `fams` en attribut, rôle ARIA conditionnel |
| `src/pages/carte.astro` | page, filtres, panneau, lecture et écriture de l'URL |

Le composant de carte reste partagé avec la landing : le mode interactif est
une prop, pas une copie du fichier. La landing continue de l'appeler sans — ce
qui compte, puisque l'animation des flux viendra modifier sa version.

## Vérification

- Le scénario des trois clics, exécuté au navigateur, du premier écran à la
  fiche.
- Un foyer à dominante Entreprises contenant un CERT reste allumé sous
  `famille=cert`. C'est le test qui distingue `fams` de `f`.
- Un lien `?pays=Maurice` sélectionne la facette ; `?pays=maurice` est ignoré
  sans vider l'écran.
- Un filtre sans résultat affiche un état vide explicite, jamais une carte
  éteinte sans explication.
- Parcours au clavier seul : atteindre un foyer, ouvrir le panneau, le lire.
- `coverage.onMap + coverage.unlocated + coverage.offFrame === coverage.total`,
  soit 569 + 115 + 1 = 685. Vérifié sur les valeurs calculées, pas écrites.

## Corrections après relecture

La première version affirmait quatre choses fausses, toutes vérifiées contre le
code :

1. **`pays=maurice`** — les valeurs de pays de l'annuaire sont les libellés
   bruts, pas des slugs. Le pont carte↔annuaire cassait.
2. **« famille (8), pays (13) »** — l'annuaire expose 9 et 14 facettes,
   `sans-famille` et « Sans pays » comprises.
3. **« on étend `data-isolate` sans changer le principe »** — le mécanisme
   filtre sur la famille dominante. La sémantique promise imposait un nouvel
   attribut, donc une réécriture, pas une extension.
4. **« 572 entrées », critère `572 + 115 = 685`** — la carte porte 569 acteurs ;
   l'acteur hors cadre était oublié, et le critère inatteignable.

Deux éléments ont été supprimés comme sur-ingénierie :

- **Les cinq vues régionales fixes**, remplacées depuis par un recadrage qui
  suit le filtre pays — voir ci-dessous.
- **Le paramètre `foyer=`** dans l'URL, dont l'identifiant n'aurait survécu à
  aucun réexport. Toujours écarté.

## Ce qui a été rouvert après coup

Le document écartait le zoom en s'appuyant sur les « 71 % d'acteurs partageant
leurs coordonnées exactes ». L'argument ne tenait pas pour les îles, et le
raisonnement confondait deux problèmes.

La vraie cause de l'illisibilité de La Réunion n'était pas l'absence de zoom
mais la grille d'agrégation, jamais questionnée. Une fois la grille fine
ajoutée, le zoom devient utile puisqu'il révèle enfin quelque chose. Et le
plafond d'échelle de 5, motivé par « au-delà la mer occupe tout et le repère
disparaît », était faux : le fond de carte contient La Réunion — le polygone
France en porte deux avec Mayotte — et à ×37 l'île remplit le cadre.

Le recadrage a aussi cessé d'être un contrôle séparé pour devenir la
conséquence du filtre pays, ce qui règle l'objection initiale : ce n'est plus
un morceau technique en plus, c'est le comportement d'un clic qui existait
déjà.
