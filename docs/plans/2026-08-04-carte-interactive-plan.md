# Carte interactive — plan d'implémentation

> Exécute le design `2026-08-04-carte-interactive-design.md` (version révisée
> après relecture adverse). Branche `feat/carte-interactive`. Sept étapes plus
> une vérification finale. Le site reste construisible et fonctionnel entre
> chaque étape : les trois premières ne touchent que les données et le
> composant sans changer le rendu des pages existantes, la page `/carte`
> n'apparaît dans la navigation qu'une fois complète.

Toutes les commandes se lancent depuis la racine du dépôt
(`/Users/tipunch/Gitlab/Tools/babouk`) — `data.js` lit `data/acteurs.csv` en
chemin relatif au répertoire courant. La construction se fait avec
`bunx astro build`, la vérification navigateur avec le serveur de dev
(`astro dev --background`, cf. CLAUDE.md du projet) et le skill Interceptor.

Chiffres de référence, tous dérivés — à vérifier calculés, jamais recopiés :
55 foyers, 569 acteurs sur la carte, 115 sans coordonnées, 1 hors cadre,
685 au total, 34 foyers multi-acteurs.

---

## Étape 1 — `src/lib/data.js` : `fams`, `actors` et garde mono-pays

**Prérequis données. Rien de visible ne change.**

Dans la boucle d'agrégation par cellule (`cells`), accumuler en plus :

- les acteurs de la cellule — pour chacun, un objet `{ name, fams, city, web }`
  où `fams` est la chaîne de slugs séparés par un espace, `"sans-famille"` si
  l'acteur n'a aucune famille. C'est **exactement** la convention de `data-f`
  dans l'annuaire (`annuaire.astro`, construction de `rows`) : le sélecteur
  `~=` et le `split(" ")` côté client en dépendent tous deux.
- l'ensemble des pays rencontrés dans la cellule, pour la garde.

Dans le `map` final de `mapPoints`, ajouter aux objets existants :

- `fams` : l'union des slugs de familles du foyer, même convention espace,
  `"sans-famille"` inclus dans l'union si au moins un acteur en relève.
- `actors` : le tableau ci-dessus.

**Garde au build** : si une cellule contient plus d'une valeur distincte de
`country`, lever une exception avec la clé de cellule et les pays en conflit.
`data.js` s'exécute au build : l'exception fait échouer `astro build`, ce qui
est le comportement voulu (échouer bruyamment plutôt que filtrer en silence
sur le pays du premier inséré).

Commentaires en français, style du fichier : justifier *pourquoi* `fams`
existe à côté de `f` (le filtre teste la présence, la couleur suit la
dominante — la correction n° 3 de la relecture) et pourquoi la garde jette au
lieu de corriger.

**Pourquoi maintenant** : tout le reste — attributs du composant, panneaux de
la page, filtrage — consomme ces champs. Aucune dépendance amont.

**Vérification** :

```sh
node --input-type=module -e "
const { mapPoints, coverage } = await import('./src/lib/data.js');
console.log('foyers:', mapPoints.length);
console.log('somme n:', mapPoints.reduce((s,p)=>s+p.n,0), '=== onMap:', coverage.onMap);
console.log('acteurs sérialisés:', mapPoints.reduce((s,p)=>s+p.actors.length,0));
console.log('foyers multi-acteurs:', mapPoints.filter(p=>p.n>1).length);
console.log('cert caché sous une autre dominante:',
  mapPoints.filter(p=>p.f!=='cert' && p.fams.split(' ').includes('cert')).length);
console.log('poids JSON (Ko):', Math.round(JSON.stringify(mapPoints).length/1024));
"
```

Attendu : `foyers: 55`, `somme n: 569 === onMap: 569`, `acteurs sérialisés:
569`, `foyers multi-acteurs: 34`, au moins 1 foyer « cert caché », un poids de
l'ordre de 50 Ko. Puis `bunx astro build` passe (la garde ne se déclenche pas
sur l'export actuel) et la landing est inchangée.

**Piège** : ne pas embarquer dans `actors` les champs lourds de l'annuaire
(description, haystack, tags, logo) — le design fixe la charge à ~49 Ko de
JSON brut ; quatre champs, pas plus. Second piège : un acteur sur la carte
peut avoir un `country` vide ; la chaîne vide est une valeur comme une autre
pour la garde (une cellule `"" + "Inde"` est mixte et doit jeter).

---

## Étape 2 — `src/lib/data.js` : ordre de peinture des foyers

Inverser le tri final de `mapPoints` : `sort((a, b) => b.n - a.n)` au lieu de
`a.n - b.n`.

**Pourquoi** : en SVG, l'ordre du DOM commande la peinture *et* le focus. Le
tri actuel (croissant) peint les gros foyers en dernier : un petit foyer voisin
d'un gros (rayons jusqu'à 19 unités pour 4,8 unités d'écart entre cellules)
est recouvert, donc incliquable — inacceptable dès que les foyers deviennent
des boutons. Le design tranche : « les petits au-dessus gagne ». Petits peints
en dernier = petits en fin de DOM = tri décroissant. Note d'arbitrage : la
phrase du design « l'ordre du DOM, c'est-à-dire l'effectif croissant » est en
tension avec sa propre règle de peinture ; la règle opérante est
« un foyer recouvert est un foyer inaccessible », donc décroissant. Le
parcours clavier commence par les plus gros foyers, ce qui est aussi l'ordre
utile — les deux objectifs sont servis par le même tri, il n'y a pas
d'arbitrage. Le design a été corrigé en ce sens.

**Pourquoi maintenant** : avant le composant interactif, pour que l'étape 3 se
vérifie sur le bon ordre ; après l'étape 1, pour ne pas mélanger deux
changements dans le même diff de `mapPoints`.

**Vérification** :

```sh
node --input-type=module -e "
const { mapPoints } = await import('./src/lib/data.js');
console.log('premier n:', mapPoints[0].n, '— dernier n:', mapPoints.at(-1).n);
console.log('décroissant:', mapPoints.every((p,i,a)=>i===0||a[i-1].n>=p.n));
"
```

Attendu : premier `n` = 63 (Nairobi), dernier `n` = 1, `décroissant: true`.
Le 93 de l'Inde est un total pays, pas un foyer : la donnée indienne est
éclatée sur plusieurs cellules d'un demi-degré.
Contrôle visuel sur la landing (`interceptor open http://localhost:4321/`) :
la carte du héros reste correcte — les petits disques passent au-dessus des
gros, ce qui était déjà le rendu souhaitable.

**Piège** : `mapArcs` trie sa propre copie (`[...mapPoints].sort(...)`) et
`haloIds` de même — aucun des deux ne dépend de l'ordre de `mapPoints`,
vérifier qu'on n'a touché que le tri final. Ce changement affecte l'ordre de
peinture sur la **landing aussi** : c'est assumé (composant partagé), le
contrôle visuel de la landing fait partie de l'étape.

---

## Étape 3 — `src/components/MapOceanIndien.astro` : prop `interactif`

Ajouter `interactif?: boolean` (défaut `false`) aux `Props`. La landing ne
change pas son appel : `git diff` ne doit toucher que ce fichier.

En mode **non interactif** : strictement le rendu actuel. C'est le contrat —
tout ce qui suit est conditionné par la prop, jamais une copie du fichier.

En mode **interactif** :

- Le `<svg>` abandonne `role="img"` (qui rend les descendants
  présentationnels, donc jamais focusables) pour `role="group"`, avec le
  résumé existant (`label`) déplacé dans un `aria-describedby` pointant un
  `<desc id="carte-resume">` rendu dans le svg, et un `aria-label` court
  (« Carte interactive des acteurs »).
- Chaque `<g class="node">` devient `role="button" tabindex="0"` — jamais un
  `<button>` HTML, enfant invalide d'un `<g>` SVG — et porte :
  - `data-fams={p.fams}` (les slugs séparés par un espace ; le filtre teste
    cet attribut, jamais `data-family` qui reste la dominante pour la couleur
    et pour `data-isolate` de la landing) ;
  - `data-idx={i}` (index de rendu, clé de liaison vers le panneau prérendu de
    la page — stable au sein d'un build, jamais exposé dans l'URL) ;
  - `aria-label` : effectif + lieu (« 33 acteurs — Maurice »), en remplacement
    du `<title>` qui, sous un `role="button"`, ferait doublon d'annonce.
- Le composant ne porte **aucun script** : les écouteurs (clic, Entrée,
  Espace) vivent dans la page `/carte`, par délégation sur le groupe `.nodes`.
  Le composant expose des attributs ; la page décide quoi en faire. Ajouter
  seulement, dans le `<style>`, le style d'état piloté par la page :
  `:global([data-carte-filtre]) .node[data-eteint] { opacity: 0.12; }` plus
  `cursor: pointer` et un état `:focus-visible` visible sur les `.node`
  interactifs (l'anneau or global ne s'applique pas aux éléments SVG dans tous
  les navigateurs ; doubler d'un `stroke` or sur `:focus` est le filet).

**Pourquoi maintenant** : la page de l'étape 4 consomme ces attributs ; et
l'étape se vérifie isolément en construisant les deux pages existantes, qui ne
doivent pas bouger.

**Vérification** :

```sh
bunx astro build
rg -c 'role="img"' dist/index.html          # attendu : 1 (la carte du héros)
rg -c 'tabindex="0"' dist/index.html        # attendu : aucune occurrence issue de la carte
```

Puis, temporairement, passer `interactif` sur une page de test ou attendre
l'étape 4 et vérifier sur `dist/carte/index.html` :
`rg -c 'role="button"' dist/carte/index.html` → 55, `rg -c 'data-fams'` → 55.
Landing au navigateur : le survol des chips de familles isole toujours les
foyers (`data-isolate` intact).

**Piège** : ne pas retirer le `<title>` du mode non interactif — la landing y
gagne son infobulle. Et ne pas faire porter le test de filtre par
`data-family` : c'est la régression exacte que la correction n° 3 de la
relecture interdit (filtrer sur la dominante éteint un foyer qui contient la
famille cherchée).

---

## Étape 4 — `src/pages/carte.astro` : la page statique

Créer la page, entièrement rendue au build, **sans script** à cette étape.
Elle est déjà publiable : carte visible, facettes visibles (inertes), panneaux
présents mais masqués. Structure :

1. **En-tête** : titre + chapo dans le style de l'annuaire, chiffres tirés de
   `coverage` et `mapPoints.length` — aucun littéral.
2. **La carte** : `<MapOceanIndien interactif />` dans un conteneur qui
   portera l'attribut d'état de filtre (`data-carte-filtre`, posé par le
   script de l'étape 5).
3. **Les deux filtres** : reprendre le markup de facettes de l'annuaire
   (`class="facet"`, `data-facet="famille|pays"`, `data-value`,
   `aria-pressed`, `--accent`) sur `familyFacets` et `countryFacets` — mêmes
   valeurs, mêmes slugs, y compris `sans-famille` (9 valeurs) et la chaîne
   vide « Sans pays » (14 valeurs). Des `<button>`, jamais un geste.
4. **Le panneau** : 55 blocs prérendus, un par foyer, `hidden` par défaut,
   `data-panneau={i}` aligné sur le `data-idx` des foyers. Chacun : lieu
   (ville du premier acteur ou pays), effectif en `.readout`, puis la liste
   des acteurs — pastille de famille (couleur + libellé, la couleur ne porte
   jamais seule), nom, ville, lien `web` quand il existe. Chaque ligne
   d'acteur porte `data-f` et `data-c` (conventions annuaire) pour que le
   script marque « hors filtre » sans re-rendre. Prérendre au build plutôt que
   sérialiser du JSON et gabariter au client : c'est le modèle de l'annuaire
   (tout dans le DOM, le client ne fait que masquer/montrer), et il tient sans
   framework client. Un état par défaut du panneau invite à cliquer un foyer.
5. **Pied de panneau permanent** : « {coverage.unlocated + coverage.offFrame}
   acteurs ne sont pas sur la carte » — 115 sans coordonnées, 1 hors cadre —
   avec lien vers `asset("annuaire/")`. Calculé, jamais écrit.
6. **État vide** : bloc masqué, sur le modèle `#vide` de l'annuaire (cause
   nommée + bouton de relâchement + remise à zéro).
7. **Bouton « Voir dans l'annuaire »** : `href` recalculé par le script de
   l'étape 5 pour transporter `famille`/`pays` ; au build, il pointe
   l'annuaire nu.
8. **`<noscript>`** : les filtres et le panneau demandent JavaScript ; le
   texte renvoie à l'annuaire, qui liste tout.

CSS de page : `.panel`, `.meta`, `.readout`, `.section-title`, `.btn-outline`
existants ; sous `lg`, le panneau devient une feuille ancrée en bas d'écran
(`position: fixed; inset-inline: 0; bottom: 0`, hauteur max ~45dvh, défilement
interne, transition CSS d'entrée). Or en accent rare, rouge jamais textuel.

**Pourquoi maintenant** : la page est le support du script ; la livrer inerte
d'abord permet de vérifier le rendu, la charge et l'accessibilité statique
avant d'y brancher l'état.

**Vérification** :

```sh
bunx astro build
rg -c 'data-panneau' dist/carte/index.html      # 55
rg -c 'role="button"' dist/carte/index.html     # 55
rg -c 'data-facet="famille"' dist/carte/index.html  # 9
rg -c 'data-facet="pays"' dist/carte/index.html     # 14
rg -o '116 acteurs' dist/carte/index.html       # présent, issu du calcul
du -h dist/carte/index.html                     # ordre de grandeur : quelques centaines de Ko, très en deçà de l'annuaire
```

Navigateur (`interceptor open http://localhost:4321/carte/`) : carte entière,
facettes listées avec effectifs, panneau à l'état d'invite, aucune erreur
console.

**Piège** : le lien de titre de page et les ancres de la Navbar n'existent pas
encore — ne pas ajouter la page au menu ici (étape 7), la page reste
atteignable par URL directe. Second piège : les 55 panneaux prérendus doivent
utiliser `hidden` (retrait de l'arbre d'accessibilité), pas `display:none` via
classe seulement — 54 panneaux focusables invisibles seraient un piège
clavier.

---

## Étape 5 — `src/pages/carte.astro` : script filtres + URL

Bloc `<script>` (TypeScript, comme l'annuaire). Reprendre le **contrat exact**
de l'annuaire, amputé de `q` :

- `etat = { famille: string | null, pays: string | null }`.
- `lireUrl()` : lecture de `famille` et `pays`, validation stricte contre les
  `data-value` des boutons présents — une valeur inconnue (dont
  `pays=maurice` en minuscules : les valeurs de pays sont les **libellés
  bruts**, `countryFacets` pose `slug: c.country`) est remise à `null`, jamais
  un écran vidé.
- `ecrireUrl()` : `URLSearchParams`, `history.replaceState`, URL nue quand
  aucun filtre. `?pays=Maurice` s'écrit avec le libellé accenté ;
  `URLSearchParams` encode, le pont avec l'annuaire est le même paramètre.
- `refletFacettes()` : `aria-pressed`, second clic = relâchement.
- `popstate` → `lireUrl()` + application.

Application du filtre : pour chaque `.node`, `ok = (famille === null ||
node.dataset.fams.split(" ").includes(famille)) && (pays === null ||
node.dataset.country === pays)`. Le test porte sur `fams` et `country`,
**jamais** sur `data-family`. Un foyer rejeté reçoit `data-eteint` (le CSS de
l'étape 3 le descend à 12 % d'opacité, transition CSS) ; il reste dans le DOM
et dans l'ordre de tabulation — la géographie reste lisible, et un foyer
éteint ouvert dit quand même son contenu. Le conteneur reçoit
`data-carte-filtre` quand au moins un filtre est actif.

Si **zéro** foyer passe : afficher l'état vide avec la cause nommée
(« Aucun foyer ne réunit CERT / CSIRT et Maldives ») et les sorties fines,
comme l'annuaire — jamais une carte éteinte sans explication.

Le bouton « Voir dans l'annuaire » reconstruit son `href` à chaque
application : `annuaire/?famille=…&pays=…` avec les mêmes valeurs — c'est le
pont d'état entre les deux écrans.

**Pourquoi maintenant** : les filtres ne dépendent pas de la sélection de
foyer ; les livrer d'abord rend `?famille=cert` partageable avant même le
panneau, et l'étape 6 s'appuie sur l'état de filtre pour marquer les acteurs
« hors filtre ».

**Vérification** au navigateur (build ou dev) :

- `interceptor open "http://localhost:4321/carte/?famille=cert"` : compter les
  foyers non éteints — attendu, le nombre calculé par
  `node --input-type=module -e "const {mapPoints}=await import('./src/lib/data.js');console.log(mapPoints.filter(p=>p.fams.split(' ').includes('cert')).length)"`
  (exécuter la commande, noter N, comparer à l'écran).
- `?pays=Maurice` : la facette Maurice passe `aria-pressed="true"`, les foyers
  mauriciens restent allumés ; `?pays=maurice` : aucune facette pressée,
  carte entière allumée.
- `?famille=inexistant` : ignoré, carte pleine.
- Une combinaison sans résultat (à déterminer par la même commande node, p.
  ex. famille rare × petit pays) affiche l'état vide nommé.
- L'URL se met à jour au clic sur une facette et le bouton Précédent défait le
  filtre.

**Piège** : pas de paramètre `foyer` dans l'URL, sous aucune forme — la
sélection est un état d'écran (le design l'a écarté : l'identifiant ne
survivrait pas à un réexport). Second piège : la facette « Sans pays »
(valeur `""`) — `p.set("pays", "")` produit `?pays=` ; l'annuaire a le même
comportement, le reproduire tel quel plutôt que « corriger ».

---

## Étape 6 — `src/pages/carte.astro` : sélection de foyer, panneau, clavier

Dans le même `<script>` :

- Délégation sur le groupe `.nodes` : `click`, et `keydown` pour `Enter` et
  `Espace` (avec `preventDefault` sur Espace — sinon la page défile) sur tout
  `[role="button"]`. `Escape` referme le panneau et rend le focus au foyer.
- Sélection : marquer le foyer (`data-actif`, anneau or en CSS), masquer le
  panneau courant, montrer `[data-panneau="idx"]`. Le panneau liste **tous**
  les acteurs du foyer ; ceux que le filtre courant exclut reçoivent une
  classe et une mention textuelle « hors filtre » (grisés + libellé — jamais
  la couleur seule), calculée avec les `data-f`/`data-c` des lignes et l'état
  de l'étape 5. Réappliquer ce marquage quand le filtre change panneau ouvert.
- Focus : à l'ouverture, porter le focus sur le titre du panneau
  (`tabindex="-1"`) pour que le lecteur d'écran enchaîne lieu → effectif →
  liste ; `Escape` fait le chemin inverse.
- Sous `lg` : la feuille basse s'ouvre par ajout d'une classe, transition en
  CSS uniquement.

**Pourquoi maintenant** : dernière brique fonctionnelle ; dépend des panneaux
(étape 4) et de l'état de filtre (étape 5) pour le marquage « hors filtre ».

**Vérification** au navigateur :

- Clic sur le foyer Maurice : le panneau affiche « 33 acteurs », la liste
  complète, les liens s'ouvrent.
- Avec `?famille=cert` actif, ouvrir un foyer à dominante Entreprises
  contenant un CERT : le foyer était allumé, le panneau liste tout, les
  non-CERT portent « hors filtre ».
- Clavier seul : `Tab` atteint les foyers dans l'ordre du DOM (gros d'abord),
  `Entrée` ouvre, le focus arrive dans le panneau, `Échap` revient au foyer.
  Vérifiable avec Interceptor en envoyant les touches, ou à la main.
- Fenêtre < 1024 px : le panneau est une feuille en bas, défilable, qui ne
  masque pas les filtres.

**Piège** : le marquage « hors filtre » doit être recalculé si l'utilisateur
change de filtre **pendant** qu'un panneau est ouvert — brancher le rendu du
panneau dans la même fonction `appliquer()` que les foyers, pas dans le seul
gestionnaire de clic.

---

## Étape 7 — Navigation : `src/components/Navbar.astro` et landing

- `Navbar.astro` : ajouter `{ label: "Carte", href: asset("carte/") }` au
  tableau `links`, et étendre le mécanisme `aria-current` (aujourd'hui
  spécifique à `surAnnuaire`) pour marquer la page courante sur `/carte`
  aussi — généraliser en comparant `Astro.url.pathname` au `href` de chaque
  lien plutôt que dupliquer le booléen.
- `index.astro` : le scénario des trois clics part de la landing —
  ajouter l'accès « Carte » dans le héros (à côté de « Parcourir
  l'annuaire », en `btn-outline`, ou en second lien du bloc d'actions), vers
  `asset("carte/")`.

**Pourquoi en dernier** : on ne pointe le public vers la page qu'une fois
qu'elle est complète ; toutes les étapes précédentes laissaient le site
navigable sans lien mort.

**Vérification** : `bunx astro build` puis
`rg -c 'carte/' dist/index.html` ≥ 2 (nav + héros) ;
au navigateur, le lien « Carte » est présent sur les trois pages, marqué
`aria-current="page"` sur `/carte`, et le menu mobile le porte aussi.

**Piège** : `asset()` obligatoire, jamais `/carte/` en dur — l'helper existe
précisément pour survivre au retour d'une `base` (cf. commentaire de
`url.js`).

---

## Étape 8 — Vérification finale : les six points du design

Tout au navigateur réel (Interceptor), sur le build de production
(`bunx astro build` puis `bunx astro preview`, ou le serveur de dev) :

1. **Les trois clics** : landing → « Carte » → foyer mauricien → un
   laboratoire de recherche dans le panneau, lien sortant fonctionnel. Trois
   clics, chronométrés à l'écran, du premier écran à la fiche.
2. **`fams` contre `f`** : identifier par la commande node de l'étape 5 un
   foyer où `f !== "cert"` et `fams` contient `cert` ; sous
   `/carte/?famille=cert`, ce foyer est allumé. C'est le test qui distingue le
   filtre de la dominante.
3. **Casse des pays** : `/carte/?pays=Maurice` presse la facette et filtre ;
   `/carte/?pays=maurice` est ignoré sans vider l'écran (carte pleine, aucune
   facette pressée).
4. **État vide explicite** : une combinaison sans résultat affiche le bloc qui
   nomme les contraintes et propose de relâcher — jamais une carte éteinte
   muette.
5. **Clavier seul** : depuis la barre d'adresse, `Tab` jusqu'à un foyer,
   `Entrée`, lecture du panneau, `Échap`. Aucune souris. Vérifier au passage
   qu'aucun panneau masqué n'est traversé par `Tab`.
6. **Comptes de couverture** :

   ```sh
   node --input-type=module -e "
   const { coverage } = await import('./src/lib/data.js');
   const ok = coverage.onMap + coverage.unlocated + coverage.offFrame === coverage.total;
   console.log(coverage.onMap, '+', coverage.unlocated, '+', coverage.offFrame, '=', coverage.total, ok);
   if (!ok) process.exit(1);
   "
   ```

   Attendu : `569 + 115 + 1 = 685 true`. Vérifié sur les valeurs calculées ;
   le pied de panneau affiche le même 116, issu du même calcul.

Plus deux régressions hors design mais dues au partage du composant :

- **Landing** : carte du héros intacte (`role="img"`, infobulles `<title>`,
  isolement `data-isolate` au survol des chips, arcs animés,
  `prefers-reduced-motion` respecté).
- **Annuaire** : `annuaire/?famille=cert&pays=Maurice` produit le même
  résultat qu'avant, et le bouton « Voir dans l'annuaire » de la carte y
  atterrit avec les facettes pressées.

`bunx astro build` sans avertissement clôt l'étape.
