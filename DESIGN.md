---
name: Babouk
description: Poste de lecture de la filière cyber de l'océan Indien — bleu nuit CLUSIR, carte-instrument et relevés monospace.
colors:
  navy-dark: "#0f1a30"
  slate-deep: "#192842"
  navy: "#21314e"
  clusir-red: "#ce463a"
  clusir-red-bright: "#e56b5f"
  gold: "#ffde59"
  gold-dim: "#d4b84a"
  fam-entreprises: "#5b8cc9"
  fam-defense: "#8fb573"
  fam-formation: "#e6a23c"
  fam-reseaux: "#4db6ac"
  fam-cert: "#e56b5f"
  fam-recherche: "#9d8ec9"
  fam-association: "#d98cb0"
  fam-accompagnement: "#d4b84a"
  surface-card: "rgba(255, 255, 255, 0.03)"
  border-card: "rgba(255, 255, 255, 0.06)"
  nav-scrolled: "rgba(15, 26, 48, 0.95)"
  grid-line: "rgba(44, 62, 107, 0.12)"
  scrollbar-thumb: "#2c3e6b"
  map-sea: "#0a1120"
  map-land: "#182742"
  map-land-scope: "#263b60"
  map-stroke: "rgba(120, 150, 200, 0.2)"
  map-stroke-scope: "rgba(165, 198, 245, 0.55)"
typography:
  display:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6.5vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  title-list:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "normal"
  editorial:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.005em"
    fontVariation: "'opsz' 96"
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  readout:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tabular-nums"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  headline-sm:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  label-section:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.15em"
  label-badge:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  focus: "2px"
  accent: "0 2px 2px 0"
  button: "0.5rem"
  panel: "1rem"
  surface: "1rem"
  pill: "999px"
spacing:
  gutter: "1.5rem"
  card-gap: "1rem"
  panel-pad: "1.5rem"
  section-header: "3.5rem"
  section-y: "7rem"
  section-y-md: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.clusir-red}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.button}"
    padding: "0.9rem 2rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.clusir-red-bright}"
    typography: "{typography.title}"
    rounded: "{rounded.button}"
    padding: "0.7rem 1.6rem"
  button-outline-hover:
    backgroundColor: "{colors.clusir-red}"
    textColor: "#ffffff"
  button-soon:
    backgroundColor: "transparent"
    textColor: "rgba(255, 255, 255, 0.6)"
    typography: "{typography.title}"
    rounded: "{rounded.button}"
    padding: "0.7rem 1.6rem"
  badge-soon:
    backgroundColor: "rgba(255, 222, 89, 0.1)"
    textColor: "{colors.gold}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.1rem 0.5rem"
  panel:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-pad}"
  section-label:
    textColor: "rgba(255, 222, 89, 0.7)"
    typography: "{typography.label}"
    padding: "0 0 0 0.75rem"
  nav-link:
    textColor: "rgba(255, 255, 255, 0.7)"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.gold}"
  nav-bar-scrolled:
    backgroundColor: "{colors.nav-scrolled}"
    height: "auto"
---

# Design System: Babouk

## Overview

**Creative North Star: « Le poste de supervision »**

Babouk n'est pas la brochure d'une filière, c'est son poste de lecture. Le monde est
celui d'une console de veille tenue dans la pénombre : un fond bleu nuit unique
(`#0f1a30`), aucune alternative claire, une carte qui occupe son propre champ comme
un écran d'instrument, et autour d'elle des rails de relevés, des libellés monospace
numérotés (`01 // Familles`) et des barres d'accent qui mesurent au lieu de décorer.
Chaque chiffre affiché est calculé au build depuis un seul fichier source ; la mise en
forme n'a donc jamais à mentir sur ce qu'elle montre.

Le monde est une **transposition explicite** de la charte cybertour.re / CLUSIR
(consignée dans `CYBERTOUR_DESIGN.md`). Sont repris tels quels : la palette de marque,
les tokens de surface, l'échelle d'opacité du texte, l'anatomie de section, les
boutons, l'accent latéral de carte, la courbe de mouvement unique, les textures
(grille, bruit, ligne de scan) et la politique nuancée de `prefers-reduced-motion`.
Sont créés pour Babouk : les deux fontes de titrage substituées, trois des huit accents
de famille, l'échelle tonale de la carte (`--map-*`), le rail de relevés, la pastille
de foyer et son halo, l'arc parcouru par un tiret, et l'isolement de famille par
attribut.

Ce que le monde refuse : le héros carte-en-décor-derrière-un-titre-centré. La carte
est l'instrument, le texte est sa légende. Les trous de la donnée sont une section à
part entière, chiffrée dans la même typographie que les succès. Aucune section
n'invente de valeur : quatre compositions de héros ont été essayées et écartées parce
qu'elles amputaient soit l'Afrique de l'Est, soit la côte australienne, soit les deux.

**Key Characteristics:**
- Thème sombre unique, aucun mode clair, `theme-color` du navigateur aligné sur `#0f1a30`.
- Toute mesure est en monospace tabulaire ; tout titre est en géométrique ; l'exergue seul est en didone.
- Surfaces jamais pleines : blanc 3 % sur bordure blanc 6 %, accent latéral 3 px pour dire la famille.
- Le rouge peint, sa variante claire écrit, l'or attire l'œil — et l'or reste rare.
- Le mouvement n'a qu'une courbe et ne bouge que ce qui compose ; rien n'anime `height`, `filter` ou `box-shadow` en boucle.
- Aucune couleur ne porte seule une information : chaque pastille colorée est doublée d'un libellé.

## Colors

Une seule teinte de fond, deux accents de marque et huit accents catégoriels
désaturés : la page tire toute sa hiérarchie de l'opacité du blanc, pas d'une seconde
gamme de gris.

### Primary
- **Rouge CLUSIR** (`{colors.clusir-red}`) : couleur structurelle. Fond du bouton principal, bordure du bouton contour, barres du classement par pays, accent latéral par défaut, curseur de barre de défilement au survol. Ne porte jamais de texte.
- **Rouge clair de lecture** (`{colors.clusir-red-bright}`) : la seule variante rouge qui écrit — libellé du bouton contour, chiffres des angles morts (`5,45:1` sur le fond de page). Sert aussi d'accent latéral pour les cartes d'angles morts et d'accent de la famille CERT / CSIRT.

### Secondary
- **Or de lecture** (`{colors.gold}`) : accent de lecture, volontairement rare. Un mot par titre de section, la deuxième ligne du titre principal, l'anneau de focus de tout le site, le tiret qui parcourt les arcs de la carte, le survol des liens de navigation et de pied de page, la sélection de texte (à 25 %), les libellés de section (à 70 %) et leur filet gauche (à 35 %).
- **Or assourdi** (`{colors.gold-dim}`) : jamais employé comme or ; il sert d'accent à la famille Accompagnement, où il tient le rôle d'un jaune éteint et non d'un accent de lecture.

### Tertiary — les huit familles
Les accents de typologie, dans l'ordre d'effectif décroissant du recensement. Cinq
proviennent de la charte cybertour (bleu, ambre, sarcelle, rouge clair, or assourdi) ;
trois — kaki, violet, rose — ont été créés pour compléter le jeu dans la même gamme
désaturée. Tous sont vérifiés à AA sur le fond de page et sur la surface de carte
(blanc 3 %) ; le plus faible est le bleu Entreprises, à `4,99` et `4,55`.

- **Bleu instrument** (`{colors.fam-entreprises}`) : Entreprises. Sert aussi de couleur au dégradé des arcs de la carte.
- **Kaki tempéré** (`{colors.fam-defense}`) : Services défense / intérieur. *Créé pour Babouk.*
- **Ambre** (`{colors.fam-formation}`) : Organismes de formation.
- **Sarcelle** (`{colors.fam-reseaux}`) : Réseaux / cluster.
- **Rouge clair** (`{colors.fam-cert}`) : CERT / CSIRT.
- **Violet cendré** (`{colors.fam-recherche}`) : Laboratoires / recherche. *Créé pour Babouk.*
- **Rose ardoise** (`{colors.fam-association}`) : Association / ONG. *Créé pour Babouk.*
- **Or assourdi** (`{colors.fam-accompagnement}`) : Structures d'accompagnement et financement.

Un foyer de carte dont aucune famille ne se dégage prend `rgba(255,255,255,0.45)` et
le slug `sans-famille` : l'absence de typologie est une valeur affichée, pas un trou.

### Neutral
- **Bleu nuit** (`{colors.navy-dark}`) : fond primaire de toute la page, fond des cellules de la grille « Source », et fond du rail de relevés à 70 % sous flou d'arrière-plan.
- **Bleu ardoise profond** (`{colors.slate-deep}`) : seconde valeur des dégradés inter-sections, jamais employée seule.
- **Bleu CLUSIR** (`{colors.navy}`) : halo diffus du héros uniquement (`blur(60px)`).
- **Surface de panneau** (`{colors.surface-card}`) sur **bordure de panneau** (`{colors.border-card}`) : le couple qui définit toute surface élevée. La bordure passe à `rgba(255,255,255,0.15)` au survol.
- **Échelle du texte** : blanc pur pour les titres et les chiffres, puis `/85`, `/80`, `/75`, `/70`, `/65`, `/60`, `/55`, `/50`. Aucun gris opaque.

### La carte
Trois valeurs d'une seule teinte, plus deux traits. L'océan (`{colors.map-sea}`)
descend sous le fond de page, les terres (`{colors.map-land}`) montent au-dessus, et
les treize pays du recensement (`{colors.map-land-scope}`) montent encore d'un cran :
la hiérarchie géographique se lit sans introduire de couleur. Les contours suivent le
même dédoublement (`{colors.map-stroke}` / `{colors.map-stroke-scope}`). Une lueur
radiale centrée sur le bassin fait remonter l'océan par variation d'opacité, jamais
par une seconde teinte de bleu.

### Named Rules

**La Règle Rouge/Or.** C'est la contrainte de couleur la plus stricte du système.
`{colors.clusir-red}` **peint** : aplats, bordures, barres d'accent, barres de
classement, anneaux structurels. Il n'**écrit** jamais — il tient `3,77:1` sur le fond
de page. `{colors.clusir-red-bright}` est la seule variante rouge autorisée pour du
texte. `{colors.gold}` est l'accent de **lecture** : il désigne où regarder, donc il
est rare. Test d'audit : si plus d'un mot par titre de section est en or, ou si une
barre de données est dorée, l'accent est devenu la couleur dominante et la règle est
rompue.

**La Règle du Plancher /50.** L'échelle d'opacité du texte s'arrête à `/50`
(`5,15:1` sur `#0f1a30`). `/45` tombe à `4,43:1` et sort de AA : il n'existe nulle
part dans le build pour du texte. Toute valeur sous `/50` est réservée aux éléments
décoratifs marqués `aria-hidden`.

**La Règle du Doublon.** Aucune couleur ne porte seule une information. Chaque pastille
de famille est suivie de son libellé, chaque foyer de la carte porte un `<title>`, et
tout ce que la carte montre est relu en texte dans les sections « Familles »,
« Territoire » et « Angles morts ».

**La Règle de l'Anneau Unique.** Un seul anneau de focus pour tout le site :
`2px solid {colors.gold}`, `outline-offset: 3px`, `border-radius: 2px`. L'or est le
seul accent qui tienne `4,5:1` sur chacune des surfaces de la page, fond de carte
compris.

## Typography

**Display / Body Font :** Jost (variable 400–700, repli `system-ui, sans-serif`)
**Editorial Font :** Bodoni Moda (variable 400–600, repli `Georgia, serif`)
**Label / Mono Font :** JetBrains Mono (variable 400–700, repli `ui-monospace`)

Trois familles auto-hébergées en WOFF2 depuis `public/fonts/`, `font-display: swap`,
104 Ko au total pour les trois.

**Substitutions.** Les deux fontes de titrage de la charte d'origine sont commerciales
et non licenciées pour ce projet.
- *ITC Avant Garde → Jost.* Même famille formelle (grotesque géométrique dérivée de la Futura), un axe de graisse variable 400–700 remplaçant quatre fichiers statiques.
- *Ambroise → Bodoni Moda.* Playfair Display, proposé dans le document d'ADN, a un contraste trop mou pour tenir le rôle d'une didone de titrage. Bodoni Moda porte un axe `opsz` qui affine réellement les déliés au-delà de 48 pt — c'est le geste même de la fonte remplacée.
- *JetBrains Mono → inchangée.* Déjà libre (SIL OFL 1.1) dans le projet source ; aucune raison de substituer.

**Character :** une géométrique large et neutre qui laisse toute l'expression aux
chiffres, une didone employée une fois par page pour rompre le registre d'instrument,
et un monospace qui signale : ceci est une mesure.

### Hierarchy
- **Display** (`{typography.display}`) : le seul H1 de la page, en trois lignes — blanc, or, puis une troisième ligne évidée (`-webkit-text-stroke: 1.5px rgba(255,255,255,0.3)`) en `tracking: 0.24em` à `clamp(1rem, 2.6vw, 1.75rem)`.
- **Headline** (`{typography.headline}`) : titres de section, échelle fluide par paliers `2.25rem → 3rem (≥640px) → 3.5rem (≥768px)`, `text-wrap: balance`, un mot en or.
- **Title** (`{typography.title}`) : nom de famille dans une carte (`1rem`, `1.25rem`/`1.5rem` pour la carte de tête), libellé de bouton en capitales `tracking: 0.05em`, marque « BABOUK » en `tracking: 0.18em`.
- **Title-list** (`{typography.title-list}`) : nom d'un acteur dans une liste dense. Le palier `title` à `1.25rem` casse la densité dès qu'il y a plusieurs centaines de lignes ; celui-ci est le seul cran de titre autorisé sous ce régime, et il n'existe que sur les surfaces Operate.
- **Editorial** (`{typography.editorial}`) : une seule exergue dans toute la page, dans le panneau « Territoire ». `opsz` poussé à **96** — sans lui la variable rend sa coupe de labeur et la didone n'est plus qu'un serif ordinaire. Corps à +4 % seulement (contre +8 % pour Ambroise : la hauteur d'x de Bodoni Moda est déjà plus proche de celle de Jost) et `font-synthesis: none` pour interdire toute fausse graisse.
- **Body** (`{typography.body}`) : chapô de section à `text-lg leading-relaxed` sur `white/60`–`/70`, corps courant à `text-sm leading-relaxed` sur `white/55`–`/60`. Largeur bornée par `max-w-2xl`, `max-w-xl` ou `max-w-prose`, jamais par une largeur en `ch`.
- **Readout** (`{typography.readout}`) : tout chiffre affiché. Monospace 700, `tabular-nums`, `line-height: 1`, `letter-spacing: -0.02em`. Taille selon le rang : `2xl/3xl` au rail du héros, `3xl/4xl` dans les cartes de famille, `4xl/5xl` dans les angles morts.
- **Label** (`{typography.label}`) : métadonnées, unités, mentions. Monospace `0.6875rem`, `tracking: 0.14em`, capitales. Variante « libellé de section » à `0.75rem`, `tracking: 0.15em`, en or à 70 % derrière un filet gauche de 2 px en or à 35 %, au format `NN // Nom`.

### Named Rules

**La Règle du Chiffre Monospace.** Un nombre destiné à être lu comme une mesure est
toujours en JetBrains Mono avec `tabular-nums`. Aucun chiffre de relevé n'est composé
en Jost. Corollaire : l'unité qui accompagne le nombre est en `label`, jamais dans la
même graisse ni la même famille que lui.

**La Règle de l'Exergue Unique.** Bodoni Moda apparaît au plus une fois par section, et
une seule fois sur la page actuelle. C'est un changement de registre, pas un style de
texte : dès la seconde occurrence, il devient une décoration.

**La Règle du Préchargement Concentré.** Deux fontes préchargées, pas trois. Jost peint
le titre et le corps au-dessus de la ligne de flottaison ; JetBrains Mono peint le rail
de relevés, qui est du texte de premier rendu et non un simple libellé. Bodoni Moda
n'apparaît que sous la ligne de flottaison. `crossorigin` est obligatoire même en
same-origin : sans lui le preload est ignoré et le fichier téléchargé deux fois.

## Layout

**Conteneur.** `max-w-7xl` centré, gouttière `px-6` — sur *toutes* les sections, y
compris la dernière. Une section passée en `max-w-4xl` décrochait son bord gauche de
192 px des trois précédentes.

**Rythme vertical.** `py-28 md:py-32` pour chaque section de contenu. En-tête de
section suivi de `mb-14`. Ancres compensées par `scroll-margin-top: 6rem` sur tout
`section[id]`, sinon la barre fixe recouvre le libellé et le haut du titre.

**Le héros.** `min-h-dvh`, colonne unique. À partir de `lg`, la carte occupe son
propre champ à droite (`left: 37%`, `top: 6rem`, `bottom: 7rem`) : elle est entière et
rien n'est posé dessus. Le titre tient dans `max-w-[30rem]` à gauche, avec un fondu de
96 px sur le bord gauche de la carte pour que la coupe ne lise pas comme un défaut de
cadrage. Sous `lg`, la carte repasse en fond plein cadre avec un débordement latéral
plafonné à 12 % de chaque côté et un voile vertical à cinq arrêts qui la recule
derrière le texte.

**Le rail de relevés.** Collé au bas du premier écran, pleine largeur, filet supérieur
blanc 8 %, fond `navy-dark/70` sous `backdrop-blur-md`. Grille `grid-cols-2` puis
`sm:grid-cols-4` ; les filets verticaux se réarrangent selon le nombre de colonnes
(l'élément 3 ouvre la seconde rangée en deux colonnes et perd son filet gauche, que la
grille à quatre lui rend). La légende des familles occupe une seconde rangée sous un
filet blanc 6 % : rangée de pastilles à défilement horizontal avec dégradé de bord sur
petit écran, `flex-wrap` à partir de `lg`.

**Les grilles de contenu.**
- *Familles* : `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, `gap-4`. La surface d'une carte suit l'effectif : la première famille prend `col-span-2 row-span-2`, la deuxième `col-span-2`. Sur quatre colonnes, ce couple plus six cases simples remplit exactement trois rangées, sans trou en bas à droite.
- *Territoire* : `lg:grid-cols-12` en 7 / 5, `gap-14 lg:gap-16`. Le classement est en `grid-flow-col` sur `grid-rows-7` à partir de `sm` : un classement se lit de haut en bas, 1 à 7 puis 8 à 13, pas en serpentin. L'exergue est `lg:sticky lg:top-28`.
- *Angles morts* : `sm:grid-cols-2`, `gap-4`.
- *Source* : grille `gap-px` sur fond blanc 7 % dans un conteneur `rounded-2xl overflow-hidden` — les filets internes sont l'espace entre les cellules, pas des bordures.

**Densité.** Panneaux `p-5 sm:p-6` en grille dense, `p-6 sm:p-8` en grille à deux
colonnes, `p-8` pour l'exergue. Aucune valeur d'espacement hors du pas Tailwind.

## Elevation & Depth

**Aucune ombre portée dans le système.** Le seul `box-shadow` du build est une lueur
d'état sur le bouton principal au survol (`0 8px 30px rgba(255,222,89,0.3)`) — une
réaction, pas une élévation. La profondeur est entièrement **tonale et atmosphérique** :

1. **Empilement d'opacité** : une surface s'élève en prenant blanc 3 % sur bordure blanc 6 %. Il n'y a qu'un seul niveau ; il n'existe pas de « carte sur carte ».
2. **Flou d'arrière-plan** : la barre de navigation au-delà de 60 px de défilement (`blur(12px)`), le menu mobile (`backdrop-blur-lg`) et le rail de relevés (`backdrop-blur-md`). C'est le seul dispositif qui dit « ceci flotte au-dessus du contenu ».
3. **Voiles dégradés** : bord gauche de la carte, bas du premier écran, voile mobile à cinq arrêts, et le voile interne de la carte (`#scrim`) qui s'éteint à 42 % de la largeur.
4. **Textures de fond** : grille cyber 60 × 60 px en `rgba(44,62,107,0.12)` pulsée, bruit `feTurbulence` inline à 3,5 % d'opacité, ligne de scan de 1 px en or 20 %.
5. **Halo diffus** : un cercle de 384 px en bleu CLUSIR, `blur(60px)`, opacité et échelle pulsées.

### Named Rules

**La Règle du Flou Fixe.** Le rayon de flou d'une lueur ne s'anime jamais : animer
`filter: blur()` en boucle repeint une large surface à chaque frame. Seules l'opacité et
l'échelle bougent.

**La Règle du Voile Interne.** Un voile de lisibilité se pose *dans* la carte, entre les
terres et les acteurs — jamais par-dessus l'ensemble. Un voile global à 0,8 d'opacité
éteint aussi les foyers, et un point bleu vif devient indiscernable du fond.

**La Règle de la Surface Unique.** Une carte n'a jamais de fond plein. Blanc 3 % sur
bordure blanc 6 %, bordure à blanc 15 % au survol. Un aplat opaque sur ce fond lit comme
un composant importé d'un autre système.

## Shapes

Le langage de forme est **rectangulaire à angles adoucis**, avec un seul geste
signature : la barre verticale d'accent.

- **Panneaux et surfaces** : `1rem` (`rounded-2xl`). Bordure de 1 px, jamais plus.
- **Boutons** : `0.5rem` (`rounded-lg`), bordure de 2 px pour la variante contour, 1 px **en pointillés** pour l'action différée — l'indisponibilité est dessinée, pas seulement écrite.
- **Pilules et barres de données** : `999px`. Toute barre de proportion est une piste `rounded-full` de 1 à 2 px de haut sur blanc 5–7 %, remplie à la part exacte.
- **Anneau de focus** : `2px`, décalé de 3 px.
- **Accent latéral de famille** : bande de 3 px collée au bord gauche du panneau, `border-radius: 0 2px 2px 0` — arrondie du côté intérieur seulement, comme un onglet qui sort du bord. Posée au repos à `scaleY(0.34)`, dépliée à `scaleY(1)` au survol.
- **Pastilles de légende** : disque de 8 px, `rounded-full`, agrandi à `scale(1.25)` au survol du groupe.
- **Foyers de carte** : trois cercles concentriques — halo (sur les cinq plus gros seulement), anneau à 30 % de remplissage et trait de 1,8, et noyau plein à 32 % du rayon.
- **Marque** : image crème à canal alpha, jamais un masque CSS (voir Do's and Don'ts).

## Components

### Buttons
- **Shape :** angles adoucis (`{rounded.button}`), capitales espacées (`tracking: 0.05em`), en Jost.
- **Primary :** aplat rouge CLUSIR, texte blanc 700, `0.9rem 2rem`, icône SVG inline de 16 px en `currentColor` à gauche du libellé. Au survol : `translateY(-2px)` et lueur dorée. Un pseudo-élément porte un balayage `shimmer` de 3 s en boucle.
- **Outline :** bordure 2 px rouge CLUSIR, libellé en rouge clair 600, `0.7rem 1.6rem`. Au survol : aplat rouge plein, texte blanc. Employé en `px-5 py-2 text-xs` dans la barre de navigation.
- **Soon :** ni lien ni bouton — un `<span>` en pointillés blanc 18 %, texte blanc 60 %, `cursor: default`, `user-select: none`, suivi d'une pastille « bientôt » en or. Une action non disponible annonce son indisponibilité au lieu de se déguiser en lien mort.

### Chips
- **Style :** libellé `label` en blanc 55 %, précédé d'un disque de 8 px à la couleur exacte de la famille. Aucun fond, aucune bordure — la pastille est le seul ornement.
- **State :** au survol ou au focus, le texte passe à blanc plein et le disque grandit de 25 %. L'action réelle est ailleurs : la pastille pose `data-isolate` sur la carte (voir *La carte*).

### Cards / Containers
- **Corner Style :** `{rounded.panel}`.
- **Background :** `{colors.surface-card}`, bordure `{colors.border-card}` → blanc 15 % au survol.
- **Shadow Strategy :** aucune (voir Elevation & Depth).
- **Accent :** barre latérale de 3 px pilotée par la variable `--accent`, repliée à un tiers au repos. Contrairement à l'original cybertour, elle est **visible au repos** : c'est le seul marqueur qui distingue une famille d'une autre, et huit panneaux identiques ne se lisent pas.
- **Internal Padding :** `p-5 sm:p-6` en grille dense, `p-6 sm:p-8` sinon.
- **Anatomie d'une carte de famille :** chiffre `readout` à la couleur de la famille en haut à gauche, part en pourcentage en `label` en haut à droite, nom de la famille en `title`, barre de proportion collée au bas par `mt-auto`. La carte de tête ajoute un paragraphe de description.
- **Retour tactile :** sur pointeur grossier, `scale(0.98)` à l'appui et l'accent se déplie.

### Navigation
- **Style :** fixe, `z-50`, transparente au chargement. Au-delà de 60 px de défilement : fond `{colors.nav-scrolled}`, `blur(12px)`, filet bas blanc 6 %. Le gestionnaire de défilement est passif et n'interroge aucun style, donc ne force aucun reflow.
- **Marque :** image de 40–44 px + « BABOUK » en `tracking: 0.18em` avec « Océan Indien » en `label` dessous. Le logo grandit de 5 % au survol du groupe.
- **Liens :** Jost `text-xs` capitales `tracking: 0.12em`, blanc 70 % → or au survol. Bascule desktop / mobile à `lg`.
- **Mobile :** panneau `bg-navy-dark/95 backdrop-blur-lg` sous la barre, fermeture au clic sur un lien et à `Escape` avec restitution du focus au bouton ; `aria-expanded`, `aria-controls` et `aria-label` tenus à jour.

### Footer
Filet supérieur blanc 6 %, `py-12`. Marque à gauche, ligne de contexte monospace au
centre (`685 acteurs · 13 pays · Zone Océan Indien`), liens en `label` blanc 50 % → or
à droite. Seconde rangée séparée par un filet pour la mention d'origine des données et
la réserve d'indépendance.

### Les composants d'annuaire (mode Operate)

La route `/annuaire` bascule en mode Operate — le visiteur accomplit une tâche.
Le monde ne change pas d'un pixel ; six composants s'y ajoutent, tous bâtis sur
le couple blanc 3 % / bordure blanc 6 % et sur la pastille de famille de 8 px.
Aucun n'a le droit d'apparaître sur une surface Persuade.

- **Champ de recherche** (`.search-field`) : le seul élément de la page autorisé à cette échelle, parce qu'il est l'action principale. Blanc 4 % sur bordure blanc 10 %, rayon de bouton, corps `body`. **Jamais sous 1rem** : sous 16 px, iOS zoome à la mise au point et ne dézoome plus. Focus doublé — l'anneau or global pour le clavier, une bordure or 55 % pour la souris, qui n'obtient pas `:focus-visible`. La croix native de `type="search"` est neutralisée : elle est bleu système, hors palette, et double le bouton d'effacement maison, qui lui existe partout.
- **Facette** (`.facet`) : ligne de rail en grille pastille / libellé / effectif. L'effectif est en `readout`, aligné à droite : le rail se lit aussi comme un classement. Actif = fond blanc 6 % et bordure à 40 % de la couleur de famille — pas de bande latérale, qui ferait un second geste d'accent. Variante `.facet--plain` sans pastille pour les pays : la pastille nomme une famille, et quatorze disques blancs identiques ne nommeraient rien. Variante `.facet--vide` pour un effectif nul : elle recule en blanc 50 % mais reste lisible et cliquable — « zéro » est une réponse. **44 px de haut minimum sous `lg`**, où le rail se manipule au doigt.
- **Ligne d'acteur** (`.actor-row`) : un `<details>`, pas une carte. Filet bas de 1 px, pastille de famille, chevron qui pivote de 90° à l'ouverture. La ligne dépliée prend blanc 2 % et son sommaire blanc 4 % : le sommaire et sa fiche partagent un fond, sinon la fiche flotte sous une bande claire sans lui appartenir. **685 panneaux empilés font un mur de bordures** — c'est pour ça que ce n'est pas une carte.
- **Repère alphabétique** (`.lettre-rail`) : en-tête collant sous la console de recherche. Son offset n'est pas un palier en dur — la hauteur de la console est mesurée en JS et publiée dans `--console-h`, parce qu'elle change entre le téléphone (champ et compteur empilés) et le bureau. Fond **opaque** : une ligne qui transparaît sous le repère se lit comme un défaut de rendu, pas comme de la profondeur.
- **Étiquette** (`.tag`) : pilule `label` sans couleur, bordure blanc 10 %. La seule couleur d'une ligne est sa famille ; treize étiquettes teintées la noieraient.
- **Lien de fiche** (`.fiche-link`) : icône 16 px + libellé, souligné **à la demande seulement**. Quatre liens soulignés dans un panneau de six lignes font une grille de traits.

### La carte (composant signature)

L'instrument. Rendue **intégralement au build** : les côtes deviennent des chemins SVG
et les acteurs des cercles déjà projetés. Le client ne reçoit ni géométrie source, ni
code de projection, et l'animation est entièrement en CSS — la carte vit même sans
JavaScript.

- **Projection :** Mercator, pas équirectangulaire. Sur une bande qui descend à 38° S, la plate carrée étire les côtes australiennes et sud-africaines d'environ 20 % ; Mercator est conforme et sa déformation d'échelle est sans effet ici, la fenêtre s'arrêtant à 31° N.
- **Fenêtre :** `BOUNDS = { west: 8, east: 156, north: 31, south: -41 }`, `viewBox` de 1410 unités de large, hauteur **dérivée** du rapport des étendues en unités Mercator — jamais fixée à la main, sinon la projection cesse d'être conforme. Les dix degrés d'Atlantique à l'ouest ne contiennent aucun acteur ; ils écartent Le Cap et Nairobi du bord de cadre.
- **Graticule :** repères d'instrument. Méridiens tous les 20°, parallèles tous les 15°, l'équateur au double d'opacité comme ligne de foi.
- **Foyers :** les acteurs co-localisés sont agrégés sur une grille d'un demi-degré (93 fiches indiennes partagent le centroïde de Delhi ; 570 disques empilés feraient une tache). Le rayon suit la **racine de l'effectif** (`4 + √n × 1,9`) : c'est l'aire du disque qui doit porter le nombre, pas son diamètre. Couleur = famille dominante du groupe, l'ordre de `FAMILIES` tranchant les égalités. Les cinq plus gros reçoivent un anneau qui respire ; au-delà, la carte clignote de partout et plus rien ne ressort.
- **Arcs :** **illustratifs, et la page le dit** — deux fois, dans la légende du héros et dans la section « Source ». Aucune relation entre acteurs n'est documentée dans la source. Construits entre les 14 plus gros foyers, filtrés à `90 < d < 900` unités, les 26 plus courts retenus. Flèche de l'arc à 18 % de la corde. Un tiret de 18 unités les parcourt en 3,6 à 7,2 s.
- **Isolement d'une famille :** l'attribut `data-isolate="<slug>"` est posé sur le conteneur par la légende ; tout le rendu est en CSS. Les foyers non concernés tombent à `opacity: 0.12`, les arcs à `0.25`, transition `0.4s` sur la courbe maison. Aucune classe n'est écrite sur les 55 foyers.
- **Accessibilité :** `role="img"` porteur d'un résumé chiffré généré au build, `<title>` par foyer, et relecture textuelle intégrale dans les trois sections suivantes.

### Le rail de relevés
Quatre couples `<dd>` / `<dt>` : chiffre `readout` en blanc, unité en `label` blanc 55 %,
séparés par des filets verticaux blanc 6 %. Aucune valeur écrite à la main. C'est la
ligne d'instruments du poste, pas une rangée de cartes statistiques : pas de fond, pas
de bordure, pas d'icône.

## Do's and Don'ts

### Do:
- **Do** dériver tout chiffre affiché du fichier source au build. La page n'écrit aucune valeur à la main ; un réexport change la page.
- **Do** afficher les manques. Les acteurs sans coordonnées, sans pays, sans famille ou hors cadre sont comptés, nommés et expliqués dans une section propre — jamais retranchés en silence du total.
- **Do** peindre en `{colors.clusir-red}` et écrire en `{colors.clusir-red-bright}`.
- **Do** garder l'or pour un mot par titre, l'anneau de focus, les survols de lien et le tiret des arcs.
- **Do** composer toute mesure en JetBrains Mono avec `tabular-nums`.
- **Do** doubler chaque couleur d'un libellé texte.
- **Do** n'employer qu'une seule courbe d'entrée : `cubic-bezier(0.16, 1, 0.3, 1)` — révélations 0,8 s, survols de carte 0,4 s, survols de bouton 0,3 s.
- **Do** déclencher les révélations par `IntersectionObserver` seul (`threshold: 0`, `rootMargin: 0px 0px -8% 0px`, `unobserve` après coup), avec un repli qui **révèle tout** si l'API manque : mieux vaut perdre l'animation que laisser la page à `opacity: 0`.
- **Do** réduire l'amplitude sous 768 px : translations 40 → 20 px, durées 0,8 → 0,4 s, délais de cascade divisés par deux.
- **Do** traiter `prefers-reduced-motion` par cas. Les boucles décoratives se figent sur une valeur médiane **lisible** (grille à 5 %, halo à 45 %, arc avec son tiret posé à mi-course), la ligne de scan — sans état statique utile — est retirée, les révélations passent à `0.01ms` en conservant leur état final visible, et les retours d'interaction survivent sans déplacement.
- **Do** marquer tout décor `aria-hidden="true"` et `pointer-events: none`.
- **Do** dimensionner les images (`width` / `height`) et préciser `alt=""` sur les images décoratives.

### Don't:
- **Don't** écrire du texte en `{colors.clusir-red}` (`3,77:1`), ni descendre le texte sous `white/50` (`/45` = `4,43:1`, hors AA).
- **Don't** colorer une barre de données en or. Le §2 de la charte d'origine attribue nommément les barres d'accent au rouge et réserve l'or à ce qui doit attirer l'œil ; treize barres dorées font de l'accent la couleur dominante de la section.
- **Don't** poser un `mask-image` sur un descendant d'un élément à `backdrop-filter`. Sous Chromium, le masque perce le flou d'arrière-plan et laisse un rectangle plus clair à l'emplacement exact du motif — la barre de navigation étant floutée sur presque toute la page, le défaut est visible en permanence. La marque est donc une image crème à canal alpha, servie par une `<img>` ordinaire, malgré le surcoût par rapport à un masque teintable.
- **Don't** quantifier la palette d'un PNG monochrome à canal alpha. Sur une image dont les trois canaux RGB sont constants et où toute l'information est dans l'alpha, la quantification écrase les canaux RGB à zéro et la marque crème ressort noire sur fond bleu nuit. Le logo est exporté en PNG pleine profondeur (`compressionLevel: 9`, `effort: 10`), sans réduction de palette.
- **Don't** animer `height`, `filter`, `box-shadow` ou `width` en boucle. Les accents latéraux se déplient en `scaleY`, les halos en `opacity` et `transform`, les arcs en `stroke-dashoffset`.
- **Don't** poser un voile par-dessus la carte entière : il éteint les foyers, qui sont le sujet.
- **Don't** rogner la carte pour remplir un cadre. La fenêtre couvre 148° de longitude pour un ratio de 1,9:1 ; remplir en rognant supprime l'Afrique de l'Est ou la côte australienne, c'est-à-dire les deux extrémités que le sous-titre annonce.
- **Don't** ajouter de pastille ou de sur-titre au-dessus du H1. Le titre porte son poids seul ; une pastille y redit le nom de la zone, qui est déjà la troisième ligne du titre.
- **Don't** mettre un fond plein sur une carte, ni une seconde couche de surface sur une surface existante.
- **Don't** précharger plus de deux fontes. Précharger toute la famille répartit la bande passante du premier rendu au lieu de la concentrer.
- **Don't** couper le mouvement en bloc par `animation: 0.01ms !important` : la page devient illisible là où une boucle portait une information de position.
