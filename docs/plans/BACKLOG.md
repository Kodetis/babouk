# Chantiers

Ce qui est décidé mais pas encore fait. Un chantier quitte cette liste quand il
a son propre document de design ou qu'il est livré.

## Enrichissement des fiches incomplètes

**Le manque.** 113 fiches sur 685 n'ont ni pays ni adresse exploitable, 115
n'ont pas de coordonnées. Elles comptent dans le total mais n'apparaissent ni
sur la carte ni dans le classement par pays. D'autres colonnes sont creuses :
`domaines` n'est renseigné que sur 207 fiches, `specialites` sur 163.

**Le principe.** Un agent recherche sur le web les informations correspondant
aux colonnes déjà présentes dans le CSV — pas de nouveau schéma, pas de
nouvelle source de vérité. Un seul jeu de colonnes, un seul point de lecture.

**La contrainte qui commande la conception.** `scripts/export_acteurs.py`
réécrit `data/acteurs.csv` en entier à chaque exécution (`open(dest, "w")`).
Toute donnée écrite dans ce fichier est détruite au réexport suivant, et il y
aura des réexports puisque le recensement Communecter continue d'évoluer.

**La forme retenue.**

    data/acteurs.csv         Communecter. Écrasé à chaque export, jamais édité.
    data/enrichissement.csv  Ce que l'agent trouve. Mêmes colonnes, clé = id.

La fusion se fait dans `src/lib/data.js` à la construction, avec deux règles :
la source officielle gagne toujours, l'enrichissement ne remplit que les cases
vides. Chaque valeur enrichie garde sa provenance — l'EDIH demandera ce qui
vient du recensement et ce qui a été retrouvé sur le web.

**Reste à trancher.** Le niveau de confiance exigé avant d'écrire une valeur,
ce qu'on fait des fiches introuvables, et si la page signale visuellement une
donnée enrichie.

## Animation des flux sur la carte de la landing à faire avec FABLE 5

**Demandé par tibo, décision assumée.** Les arcs de la carte du héros sont un
effet visuel, pas une donnée. Ils restent, et ils doivent aller jusqu'à
l'Australie — aujourd'hui elle n'est reliée à rien. Le but est le mouvement à
l'arrivée sur la page : un bassin qui vit, pas des points posés.

C'est un parti pris décoratif, connu comme tel : la source ne contient aucune
relation entre acteurs. `partenaires` n'est renseigné que sur 1 fiche sur 685,
et il s'agit d'une phrase de présentation, pas d'une liste. La mention « arcs
illustratifs » reste affichée sous la carte.

**Ce qui bloque aujourd'hui, mesuré.** `mapArcs` dans `src/lib/data.js` écarte
les paires distantes de plus de 900 unités de viewBox. Or les trois foyers
australiens sont entre **770 et 1139** de tout le reste, et la distance
maximale entre les quatorze plus gros foyers est de 1139. Le plafond coupe donc
l'Australie presque entièrement.

    const HUBS = 14
    if (d < 90 || d > 900) continue      // <- le 900 exclut l'Australie
    .slice(0, 26)                        // <- puis on ne garde que 26 arcs

Relever le plafond à ~1150 suffit à connecter l'Australie. Reste à ajuster le
nombre d'arcs conservés pour que la carte ne devienne pas un plat de
spaghettis, et à vérifier que les arcs longs ne traversent pas les terres de
façon disgracieuse — la flèche vaut 18 % de la corde, ce qui se voit sur une
corde de 1100.

À faire en même temps : le balayage d'apparition des 55 foyers d'ouest en est
au chargement, qui est l'autre moitié de l'effet.

## Liens documentés entre acteurs

Indépendant de l'animation ci-dessus, et pour plus tard : une couche de liens
réellement sourcés — CyberTour, évènements CLUSIR, projets EDIH — alimentée à
la main. Distincte des arcs décoratifs, et vide tant qu'il n'y a rien de
documenté à y mettre.

C'est le livrable du WP6 pris à l'endroit : l'animation produit le maillage, la
carte l'enregistre.

## Mode clair

Les huit accents de famille sont vérifiés à 4,5:1 **sur le fond marine**. Sur
fond clair ils s'effondrent — l'or `#ffde59` tombe à environ 1,3:1 sur blanc,
et c'est l'accent de lecture de toute la page. Un mode clair est donc une
seconde palette à concevoir et à revérifier, pas une inversion.

S'y ajoutent les littéraux de couleur écrits en dur dans les dégradés inline
du héros, des voiles de carte et de la section Territoire, à sortir vers des
variables. Ça, c'est mécanique.

À faire après la carte : c'est du confort, pas de la trouvabilité.

## Date d'extraction

`lastUpdate` est calculé dans `data.js` et n'est plus affiché nulle part depuis
la suppression de la section « Source ». Sur un livrable EDIH, la date de
relevé fait partie de la méthode. Une ligne en pied de page suffit.
