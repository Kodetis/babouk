# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (SSG) + Tailwind CSS 4, déploiement statique. Choix de l'utilisateur, motivé par la
reprise de la direction artistique de cybertour.re, bâtie sur la même stack : les tokens
`@theme`, les classes utilitaires et les composants décrits dans `CYBERTOUR_DESIGN.md` se
transposent sans réécriture.

Le contenu est généré au build depuis `data/acteurs.csv`. Aucun backend, aucune base de
données, aucune dépendance runtime.

## Users

**Utilisateur principal : l'écosystème et les institutions de la filière cyber de la zone
Océan Indien** — CLUSIR, EDIH, financeurs, agences publiques, structures d'accompagnement.

Sa situation : il doit se représenter une filière répartie sur 13 pays qu'aucune source unique
ne donne à voir. Son travail : lire la densité par pays et par typologie, repérer les angles
morts, identifier le maillage entre acteurs — pour instruire une décision, un financement, une
politique publique ou une mise en relation.

Conséquence produit : **la lecture régionale agrégée est le cœur du site ; la fiche
individuelle est la preuve détaillée, pas la destination.** Les entreprises en recherche de
prestataire, les acteurs référencés eux-mêmes et les publics en orientation sont des audiences
secondaires, non prioritaires pour la conception.

## Product Purpose

Babouk répertorie les acteurs de la cybersécurité de la zone Océan Indien et rend visible la
structure de cette filière : qui fait quoi, où, et selon quelle répartition.

Le succès se mesure à la capacité d'un décideur institutionnel à sortir du site avec une
lecture qu'il n'avait pas en arrivant — un déséquilibre, une concentration, un manque.

## Positioning

La donnée existe déjà, dispersée dans l'annuaire Communecter de l'EDIH La Réunion, dont
l'interface est un outil de saisie générique et non un outil de lecture. Babouk ne collecte pas
une nouvelle donnée : **il en fait une lecture régionale**, avec un parti pris éditorial et
cartographique qu'un annuaire générique ne porte pas.

## Operating Context

- Consultation majoritairement sur poste de travail, en contexte professionnel : préparation de
  dossiers, notes de cadrage, revues de filière. Le mobile doit fonctionner mais n'est pas la
  scène d'usage principale.
- Les libellés métier de référence sont ceux du costum Communecter `cyberReunion` : 8 familles
  d'acteurs, un référentiel de domaines et un référentiel de spécialités.
- La zone couverte par les données actuelles : La Réunion, Maurice, Madagascar, Seychelles,
  Maldives, Mozambique, Tanzanie, Kenya, Afrique du Sud, Sri Lanka, Inde, Australie, France.

## Capabilities and Constraints

**Périmètre de la première livraison** : une landing page aboutie, une seule page. L'annuaire
filtrable et les fiches détaillées sont explicitement remis à plus tard — la landing sert à
valider la direction artistique et la carte animée avant d'industrialiser 685 fiches.

**Langue** : français pour la livraison. L'anglais est prévu mais non livré ; le code et le
contenu doivent être structurés pour l'accueillir sans refonte (chaînes externalisées, routes
prêtes). Contrainte réelle : la majorité des pays couverts sont anglophones ou lusophones.

**Cycle de vie de la donnée** : `data/acteurs.csv` est la source de vérité, versionnée.
`scripts/export_acteurs.py` la régénère à la demande depuis l'API Communecter
(`globalautocomplete`, filtre `sourceKey=cyberReunion`). Les corrections manuelles s'appliquent
au CSV et survivent aux rebuilds ; elles ne remontent pas vers Communecter.

**Taxonomie** — 8 familles d'acteurs, libellés officiels du costum :
Entreprises (produits/solutions et services) · CERT/CSIRT · Organismes de formation ·
Laboratoires/recherche · Structure d'accompagnement et financement · Réseaux/cluster ·
Services défense/intérieur · Association/ONG.

**Contraintes techniques héritées** :

- Les logos des acteurs (522 sur 685) sont des URL distantes vers `communecter.org`, pas des
  fichiers locaux. Dépendance externe assumée pour l'instant.
- Les fontes de la direction artistique reprise (ITC Avant Garde, Ambroise) sont commerciales.
  La couverture de licence pour un second site n'est **pas** établie : à trancher avant
  livraison, avec substitution libre en repli.
- 36 acteurs portent plusieurs familles : la somme des comptages par famille vaut 708 pour
  664 acteurs classés. Toute vue par typologie doit annoncer ce dépassement plutôt que le
  laisser passer pour une erreur.

**Non décidé à ce stade** : nom de domaine, hébergement, calendrier de mise en ligne,
ouverture éventuelle des données, modalités de correction d'une fiche par l'acteur concerné.

## Brand Commitments

- **Nom** : Babouk. Baseline du logo : « CYBERSÉCURITÉ | OCÉAN INDIEN ».
- **Logo** : `logo_babouk.png` — araignée au centre d'une toile, tracé monoline, crème sur fond
  sombre. Seul asset de marque disponible ; pas de version vectorielle, pas de déclinaison.
- **Direction artistique** : celle consignée dans `CYBERTOUR_DESIGN.md` (extraction de
  cybertour.re). Contrainte posée par l'utilisateur, à respecter telle que documentée.
- **Porteur** : Kodetis. Le site peut se réclamer de Kodetis.
- **Ton** : français, vouvoiement, registre professionnel — cohérent avec le lectorat
  institutionnel.

## Evidence on Hand

**Réel, vérifié, utilisable** :

- `data/acteurs.csv` — 685 organisations, 30 colonnes, extraites le 4 août 2026. Répartition
  par famille : Entreprises 420 · Services défense/intérieur 86 · Organismes de formation 68 ·
  Réseaux/cluster 55 · CERT/CSIRT 33 · Laboratoires/recherche 29 · Association/ONG 9 ·
  Structure d'accompagnement et financement 8 · non classés 21.
  Par pays : Inde 93 · Australie 92 · Kenya 67 · Sri Lanka 47 · Tanzanie 47 · La Réunion 45 ·
  Maldives 41 · Seychelles 40 · Mozambique 39 · Maurice 28 · Madagascar 22 · Afrique du Sud 10 ·
  France 1 · pays inconnu 113.
  Couverture : 636 sites web, 570 géolocalisations, 522 logos, 158 téléphones, 133 emails.
- `CYBERTOUR_DESIGN.md` — direction artistique de référence.
- `scripts/export_acteurs.py` — régénération de l'export.
- `logo_babouk.png` — identité visuelle.

**Absences que le site ne doit pas combler par invention** :

- Aucun partenaire, aucune caution institutionnelle, aucun soutien confirmé. **Babouk n'est ni
  mandaté ni endossé par le CLUSIR, l'EDIH ou la COI** ; Communecter et l'EDIH La Réunion sont
  cités comme source de données créditée, rien de plus.
- Aucun témoignage, aucune étude de cas, aucun chiffre d'audience ou d'usage.
- Les champs `offre`, `partenaires` et `siren` sont renseignés sur **une seule** fiche : ils ne
  peuvent alimenter aucune vue.
- 113 acteurs sans pays, 115 sans coordonnées géographiques, 21 sans typologie. Ces trous sont
  des faits de la filière telle qu'elle est recensée, pas des erreurs à masquer.

## Product Principles

1. **La donnée montrée est traçable.** Chaque acteur affiché renvoie à sa source. Aucun champ
   vide n'est complété par une supposition, une estimation ou un enrichissement automatique.
2. **Les trous se montrent.** 21 acteurs non classés et 115 sans géolocalisation font partie de
   la lecture. Un annuaire de filière qui masque ses manques ment sur la filière.
3. **Le maillage prime sur l'unité.** La valeur naît de la densité, de la répartition et des
   liens entre acteurs, pas de l'exhaustivité d'une fiche.
4. **Aucune caution empruntée.** Le site n'emprunte le crédit d'aucune institution qui ne l'a
   pas accordé.
5. **Le français d'abord, l'anglais sans refonte.** Toute décision de structure anticipe la
   seconde langue plutôt que de la reporter en dette.

## Accessibility & Inclusion

Aucune obligation légale n'a été établie pour ce projet. Deux exigences sont néanmoins
retenues, l'une héritée, l'autre imposée par le concept :

- **WCAG AA sur les contrastes**, conformément aux arbitrages chiffrés de la direction
  artistique reprise (`CYBERTOUR_DESIGN.md` §2 et §7).
- **La carte animée doit avoir un équivalent accessible.** Une visualisation cartographique
  animée en fond de page ne peut pas être le seul porteur d'une information : tout ce qu'elle
  raconte doit être lisible autrement, et son mouvement doit se soumettre à
  `prefers-reduced-motion`.
