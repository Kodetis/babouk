# ADN design — cybertour.re

Extraction de la direction artistique du site [cybertour.re](https://cybertour.re)
([thibautfontaine/cybertour-web](https://github.com/thibautfontaine/cybertour-web)), destinée à
servir de charte pour l'annuaire des acteurs cyber de la zone Océan Indien.

Sources : `src/styles/global.css` (665 l.), `src/layouts/Layout.astro`, `src/components/*.astro`,
`src/pages/index.astro`.

---

## 1. Positionnement

Site événementiel du CLUSIR Réunion Océan Indien. Registre **cyber sombre / salle de
supervision** : fond bleu nuit, accents rouge de charte et or, typographie géométrique en
capitales, labels en monospace, textures discrètes (grille, bruit, ligne de scan). Le vocabulaire
visuel emprunte au terminal et au SOC sans tomber dans le pastiche « hacker vert sur noir ».

Trois signaux identitaires immédiatement reconnaissables :

1. le fond **`#0f1a30`** uniforme sur tout le site (pas de thème clair) ;
2. le doublet **rouge CLUSIR + or**, l'or portant systématiquement l'accent de lecture ;
3. les **labels monospace en capitales espacées** (`01 // À propos`) qui numérotent les sections.

**Stack d'origine** : Astro 7 (SSG) + Tailwind CSS 4 (`@theme`), fontes auto-hébergées,
zéro dépendance runtime, déploiement statique GitHub Pages.

---

## 2. Couleurs

### Tokens de marque (`@theme` dans `global.css`)

| Token | Hex | Rôle |
|---|---|---|
| `--color-navy-dark` | `#0f1a30` | Fond primaire de tout le site, `theme-color` du navigateur |
| `--color-navy` / `--color-slate-mid` | `#21314e` | Bleu CLUSIR, aplats et halos |
| `--color-slate-deep` | `#192842` | Fond secondaire, dégradés inter-sections |
| `--color-clusir-red` / `--color-red` | `#ce463a` | Rouge de charte — **aplats et bordures uniquement** |
| `--color-clusir-red-bright` | `#e56b5f` | Variante **texte** du rouge (voir accessibilité) |
| `--color-gold` | `#FFDE59` | Accent principal : mots-clés, hover, chiffres, labels |
| `--color-gold-dim` | `#d4b84a` | Or assourdi, dégradés |
| `--color-track-blue` | `#5b8cc9` | Accent de parcours |
| `--color-track-teal` | `#4db6ac` | Accent de parcours |
| `--color-track-amber` | `#e6a23c` | Accent de parcours |
| `--color-swio-teal` | `#2dd4bf` | Accent « international » (SWIO / Madagascar) |

### Tokens de surface (`:root`)

```css
--bg-primary:    #0f1a30;
--bg-secondary:  #192842;
--bg-card:       rgba(255,255,255,0.03);
--border-card:   rgba(255,255,255,0.06);
--text-primary:  #ffffff;
--text-secondary: rgba(255,255,255,0.75);
--text-muted:    rgba(255,255,255,0.60);
--text-faint:    rgba(255,255,255,0.55);
--text-ghost:    rgba(255,255,255,0.45);
--nav-scrolled:  rgba(15,26,48,0.95);
--grid-color:    rgba(44,62,107,0.12);
--scrollbar-thumb: #2c3e6b;
```

### Règles de couleur

- **Une seule échelle de texte** : blanc pur pour les titres, puis `white/80`, `/70`, `/60`,
  `/55`, `/50` pour hiérarchiser. Aucun gris opaque.
- **Surfaces de carte** : `bg-white/[0.03]` + `border-white/[0.06]`, bordure qui passe à
  `white/[0.15]` au survol. Jamais de fond plein sur une carte.
- **L'or est rare**. Il souligne un mot dans un titre, un chiffre, un état actif de nav, un
  hover de lien. Le rouge structure (barres d'accent, boutons, focus) ; l'or attire l'œil.
- **Accents par catégorie** : chaque parcours porte une couleur unique, déclinée en suffixes
  alpha hexadécimaux (`${hex}15` fond, `${hex}30` bordure, `${hex}CC` texte). Ce motif est
  directement réutilisable pour les 8 typologies d'acteurs.
- **Scrollbar personnalisée** : piste `#0f1a30`, curseur `#2c3e6b`, rouge au survol.

### Accessibilité couleur (documentée dans la source)

Le rouge de charte `#ce463a` n'est **pas** utilisé pour du texte. Le commentaire de
`global.css` chiffre l'arbitrage :

- `#d9564a` → 4.44:1 sur `#0f1a30` et 3.93:1 sur fond de badge teinté → sous le seuil AA (4.5:1) ;
- `#e56b5f` → **5.45:1** sur `#0f1a30`, **4.82:1** sur `rgba(206,70,58,.15)` → conforme.

Même logique sur les badges « à confirmer » : l'opacité du texte est passée de `0.3` (2.68:1) à
`0.6` (**6.50:1**).

> À reprendre tel quel : le rouge peint, la variante claire écrit.

---

## 3. Typographie

Trois familles, toutes auto-hébergées en WOFF2 (repli OTF), `font-display: swap`.

| Famille | Token | Usage |
|---|---|---|
| **ITC Avant Garde** (400/500/600/700) | `--font-display`, `--font-body` | Titres et corps. Grotesque géométrique, capitales larges. |
| **Ambroise** (400 uniquement) | `--font-serif` | Didone de titrage — exergues éditoriaux, une phrase par section maximum. |
| **JetBrains Mono** (400/700, sous-ensemblée) | `--font-mono` | Labels, badges, chiffres, métadonnées, compte à rebours. |

*(ITC Avant Garde et Ambroise sont des fontes commerciales sous licence : un projet dérivé doit
soit disposer de la licence, soit substituer — par exemple Poppins/Jost pour la géométrique et
Playfair Display pour la didone.)*

### Règles typographiques

**Titres de section** (`.section-title`) : `font-display`, poids 800, `letter-spacing: -0.01em`,
`line-height: 1.375`, `text-wrap: balance`. Échelle fluide `2.25rem → 3rem (≥640px) → 3.75rem (≥768px)`.

**Labels de section** (`.section-label`) : monospace, `0.75rem`, `letter-spacing: 0.15em`,
capitales, couleur `rgba(255,222,89,0.7)`, barre verticale à gauche (`border-left: 2px solid
rgba(255,222,89,0.35)`, `padding-left: 0.75rem`). Format du contenu : `NN // Nom de section`.

**Titre principal** : `font-extrabold`, `leading-[0.95]`, échelle `text-6xl → 9xl`, mot-clé en or,
troisième ligne en `tracking-[0.2em]` et contour vide (voir `.reunion-outline`).

**Ambroise** — la classe `.font-serif` porte trois corrections optiques codées en dur, à
conserver si la fonte est reprise :

```css
font-synthesis: none;   /* aucune fausse graisse : une seule romaine existe */
font-size: 1.08em;      /* +8 % : à corps égal, la didone paraît plus petite */
line-height: 1.3;       /* ascendantes longues → interlignage resserré */
letter-spacing: 0.01em; /* compense la finesse des déliés sur fond sombre */
```

**Chiffres** : toujours `font-mono` + `tabular-nums` (compte à rebours, statistiques). Les
compteurs sont zéro-paddés (`String(n).padStart(3,'0')`) pour figer la largeur.

**Micro-copie** : liens de nav, badges et méta en `uppercase` + `tracking-wider`. Le corps de
texte reste en casse normale.

### Stratégie de préchargement

Trois fichiers seulement (~52 Ko), ceux qui peignent du texte > 16 px au-dessus de la ligne de
flottaison : ITC Avant Garde **Bold 700**, **Demi 600**, **Bk 400**. Volontairement exclus :
Md 500 (uniquement 9 micro-liens de nav), JetBrains Mono (labels ≤ 12 px, fichier le plus lourd),
Ambroise (décorative, sous la ligne de flottaison). L'attribut `crossorigin` est obligatoire même
en same-origin, sinon le preload est ignoré et le fichier téléchargé deux fois.

> Principe : précharger sept fontes serait pire que zéro — la bande passante du premier rendu se
> répartit au lieu de se concentrer.

---

## 4. Mise en page et rythme

- **Conteneur** : `max-w-7xl mx-auto px-6` (variantes `max-w-5xl` pour les sections de lecture).
- **Rythme vertical** : `py-32` sur toutes les sections de la home (`py-28 md:py-32` pour une
  variante). Header de section suivi de `mb-14` à `mb-20`.
- **Grilles** : `grid lg:grid-cols-2 gap-16 items-center` pour les blocs texte/visuel,
  `sm:grid-cols-2 lg:grid-cols-3` pour les cartes.
- **Rayons** : `rounded-2xl` (cartes), `rounded-lg` (boutons, pastilles carrées),
  `rounded-full` (badges, pilules), `rounded-md` (tags).
- **Anatomie de section**, systématique :

```html
<section id="…" class="relative py-32 overflow-hidden">
  <div class="absolute inset-0 noise-overlay"></div>       <!-- ou gradient + cyber-grid -->
  <div class="relative z-10 max-w-7xl mx-auto px-6">
    <div class="reveal mb-20">
      <span class="section-label">01 // À propos</span>
      <h2 class="section-title mt-4">Titre avec <span class="text-gold">accent</span></h2>
      <p class="text-white/50 mt-4 max-w-2xl mx-auto text-lg">Sous-titre.</p>
    </div>
    …
  </div>
</section>
```

Le décor de fond alterne d'une section à l'autre : `noise-overlay` seul, ou
`bg-gradient-to-b from-navy-dark via-slate-deep to-navy-dark` + `cyber-grid opacity-20`.

---

## 5. Composants

### Navigation

Fixe, `z-50`, transparente au chargement. Au-delà de **60 px de scroll** : fond
`rgba(15,26,48,0.95)`, `backdrop-filter: blur(12px)`, bordure basse `rgba(255,255,255,0.06)`.
Bascule desktop/mobile à `lg` (8 liens + CTA débordent sous 1024 px). Liens en
`text-xs xl:text-sm uppercase tracking-wider text-white/70`, or au survol et à l'état actif.
Menu mobile : `bg-navy-dark/95 backdrop-blur-lg`, fermeture au clic sur un lien et à `Escape`
avec restitution du focus au bouton, `aria-expanded` / `aria-controls` tenus à jour.

### Boutons

```css
.btn-primary  /* fond #ce463a, texte blanc, 700, 1rem 2.5rem, tracking .05em, uppercase
                 hover: translateY(-2px) + box-shadow 0 8px 30px rgba(255,222,89,.3)
                 ::after : balayage `shimmer` en boucle 3s */
.btn-outline  /* bordure 2px #ce463a, texte #e56b5f, 600, .75rem 2rem, uppercase
                 hover: fond rouge plein, texte blanc */
```

### Cartes

Base : `bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8`.

- **`.topic-card`** : accent latéral de 4 px qui se déplie au survol en `scaleY(0 → 1)` depuis le
  haut, `transform-origin: top`, courbe expo-out 0.4 s. *(Animer `height` déclenchait un layout
  à chaque frame — la composition pure est un choix explicite.)*
- **`.bento-track`** : même principe en 3 px, `border-radius: 0 2px 2px 0`, modificateur de
  couleur par catégorie (`--red-accent`, `--blue`, `--teal`, `--amber`) qui teinte aussi la
  bordure au survol (`rgba(…, 0.2)`).
- **Carte thématique complète** (`StageCard.astro`) — modèle direct pour une fiche acteur :
  barre de dégradé en tête (`linear-gradient(90deg, ${hex}, ${hex}60)`), halo radial
  `blur-[80px]` révélé au survol, pastille numérotée `w-10 h-10 rounded-lg font-mono`, titre
  `font-display font-bold text-xl`, méta monospace en capitales, pilule de statut à droite,
  séparateur en dégradé (`linear-gradient(90deg, ${hex}30, transparent)`), tags monospace
  `rounded-md`, CTA fléché dont l'écart passe de `gap-2` à `gap-3` au survol.
- **`.sponsor-card`** : `translateY(-8px)` au survol, transition 0.4 s.
- **`.partner-bubble`** : fond blanc plein, `rounded-2xl`, `translateY(-4px)` + ombre au survol
  — le seul endroit du site où un fond clair est admis (lisibilité des logos partenaires).

### Badges et pilules

```css
.agenda-badge-red  /* mono .65rem uppercase, fond rgba(206,70,58,.15),
                      texte #e56b5f, bordure rgba(206,70,58,.3), radius .375rem */
.agenda-badge-tbd  /* même gabarit, fond white/4 %, bordure 1px dashed white/18 %,
                      texte white/60 % — l'état « à confirmer » est en pointillés */
```

Pilules de contexte du hero : `rounded-full px-3 py-1 text-xs font-mono tracking-wider`, avec un
triplet cohérent bordure `/25` + fond `/[0.07]` + texte plein.

### Pied de page

`border-t border-white/[0.06] py-12`, logo à gauche, ligne de contexte monospace au centre, liens
légaux à droite, seconde rangée séparée par une bordure pour les réseaux sociaux. Tout le pied de
page est en `text-white/50 font-mono text-sm`, or au survol.

---

## 6. Mouvement

### Courbe et durées

Une seule courbe pour tout ce qui entre : **`cubic-bezier(0.16, 1, 0.3, 1)`** (expo-out).
Révélations 0.8 s, hovers de carte 0.4 s, hovers de bouton 0.3 s.

### Révélations au scroll

Classes `.reveal` (`translateY(40px)`), `.reveal-left` / `.reveal-right` (`translateX(∓40px)`),
opacité 0 → 1. Cascade via `.delay-1` … `.delay-6` (0.1 s → 0.6 s).

Déclenchement par **IntersectionObserver seul** — aucun listener `scroll`, donc aucun reflow
synchrone. `threshold: 0`, `rootMargin: '0px 0px -8% 0px'`, `unobserve` après révélation. Repli
explicite : sans IntersectionObserver, tout est révélé immédiatement plutôt que laissé invisible.

### Animations décoratives

| Keyframes | Effet | Durée |
|---|---|---|
| `float` | Flottement `translateY(-20px) rotate(2deg)` | 6 s |
| `pulse-glow` | Halo `opacity .3→.6`, `scale 1→1.12`, `filter: blur(50px)` **fixe** | 4 s |
| `scan-line` | Ligne horizontale `translateY(-100% → 100vh)` | 8 s |
| `grid-pulse` | Grille `opacity .03→.08` | 4 s |
| `shimmer` | Balayage `background-position -200% → 200%` | 3 s |
| `slide-up` | Entrée du hero, échelonnée 0 → 0.6 s en style inline | 0.8 s |
| `glitch-shift` | Décalage `clip-path` + `translate` sur deux calques colorés | 0.3 s |
| `terminal-blink` / `terminal-dots-anim` | Curseur et points de chargement | 1 s / 1.5 s |

Deux optimisations volontaires, à conserver : le **flou de `pulse-glow` est fixe** (l'animer en
boucle forçait un repaint de large surface à chaque frame) et les accents de carte utilisent
`scaleY` plutôt que `height`.

### Textures

- **`.cyber-grid`** : double `linear-gradient` 1 px, maille 60 × 60, couleur
  `rgba(44,62,107,0.12)`, pulsation d'opacité.
- **`.noise-overlay::before`** : `feTurbulence` SVG inline en data-URI, `opacity: 0.035`,
  `pointer-events: none`.
- **`.glitch`** : deux pseudo-éléments `content: attr(data-text)` en rouge et bleu, révélés au
  survol du titre uniquement.
- **`.reunion-outline`** : `color: transparent` + `-webkit-text-stroke: 2px rgba(255,255,255,.25)`,
  contour qui vire au rouge au survol.
- **Halos** : `w-96 h-96 rounded-full` en `bg-navy` et `bg-gold/20`, animés en `pulse-glow`.

### Adaptations mobile

Sous 767 px, amplitude et durée réduites : translations 40 px → 20 px, transitions 0.8 s → 0.4 s,
délais de cascade divisés par deux. Sur pointeur grossier (`(hover: none) and (pointer: coarse)`),
retour tactile à l'appui : `scale(0.98)` sur les cartes, `scale(0.97)` sur les sponsors,
`scale(0.96)` sur les bulles partenaires, et l'accent latéral se révèle au `:active`.

### `prefers-reduced-motion`

Politique nuancée, **pas** de `animation: 0.01ms !important` global :

- boucles décoratives coupées, mais figées sur une valeur médiane lisible
  (`pulse-glow` → `opacity: .45`, `cyber-grid` → `opacity: .05`) ;
- la ligne de scan, sans état statique utile, est retirée (`opacity: 0`) ;
- le shimmer du bouton et le glitch sont supprimés ;
- le terminal se fige sur un état lisible (trait plein, `content: "..."`);
- les révélations passent à `0.01ms` **en conservant leur état final visible** ;
- les retours d'interaction (hover, focus) sont conservés, sans déplacement animé.

---

## 7. Accessibilité — pratiques reprises du site

- Lien d'évitement `sr-only focus:not-sr-only` vers `#main-content`, en or sur bleu nuit.
- Contrastes vérifiés et **chiffrés en commentaire** à chaque dérogation (voir §2).
- Décor purement visuel systématiquement marqué `aria-hidden="true"` et `pointer-events: none`.
- Images décoratives en `alt=""`, images de contenu dimensionnées (`width`/`height`) pour éviter
  le CLS.
- Menu mobile complet au clavier : `aria-expanded`, `aria-controls`, `Escape`, focus restitué.
- Mises à jour dynamiques (fin du compte à rebours) annoncées via `role="status"`.
- Compte à rebours suspendu quand l'onglet passe en arrière-plan (`visibilitychange`).

---

## 8. Ton éditorial

- Français, tutoiement absent, phrases courtes, ponctuation typographique (`—`, `·`, `//`).
- **Rythme ternaire** dans les accroches : « Quatre jours. Trois étapes. Toute l'île. »
- Les chiffres sont mis en avant nus (`220`, `600+`, `150`) avec un label monospace en dessous.
- Les mots-clés sont contrastés dans le corps de texte via `<strong class="text-white">` ou
  `text-gold`, jamais par une couleur nouvelle.
- Les sections sont numérotées (`01 //`, `02 //` …) — la numérotation fait partie de l'identité.
- Le séparateur `//` est un motif récurrent (titre, labels, menus).

---

## 9. Transposition à l'annuaire des acteurs

Reprise directe, sans adaptation :

- palette complète, tokens de surface, échelle d'opacité du texte ;
- `.section-label` numéroté + `.section-title` ;
- anatomie de section (`relative py-32` + décor absolu + contenu `z-10 max-w-7xl px-6`) ;
- système `.reveal` / `.delay-*` et sa politique `prefers-reduced-motion` ;
- navbar transparente → opaque au scroll ;
- `.btn-primary` / `.btn-outline`, badges monospace, `.partner-bubble` pour les logos d'acteurs.

Adaptations à prévoir pour un annuaire de 685 fiches :

1. **Les 8 typologies héritent du système d'accent par catégorie** (`bento-track--*`) : une
   couleur par famille, déclinée en `${hex}15 / ${hex}30 / ${hex}CC`. Trois accents existent déjà
   (`#5b8cc9`, `#4db6ac`, `#e6a23c`) plus `#2dd4bf`, `#ce463a` et `#FFDE59` — il en manque deux à
   créer dans la même gamme désaturée.
2. **La fiche acteur reprend `StageCard.astro`** : barre de dégradé en tête à la couleur de la
   typologie, pastille d'initiales ou logo à la place du numéro, nom en `font-display font-bold`,
   pays/ville en monospace capitales, pilule de typologie à droite, domaines en tags monospace.
3. **Le survol coûteux ne passe pas à l'échelle** : le halo `blur-[80px]` de `StageCard` est
   acceptable sur 4 cartes, pas sur une grille de 60. Le conserver uniquement en vue détail, et
   se limiter à la bordure + l'accent latéral en vue liste.
4. **Les révélations au scroll doivent être plafonnées** : n'observer que les premières cartes
   d'une page, ou basculer sur une pagination / un rendu virtualisé — 685 éléments observés
   simultanément annulent le bénéfice de l'IntersectionObserver.
5. **Ajouter ce qui manque** : champ de recherche, filtres par typologie/pays/domaine, états
   vides et de chargement, carte géographique. Ces motifs n'existent pas dans le site source et
   sont à concevoir dans le même registre (fond `white/[0.03]`, bordure `white/[0.06]`, labels
   monospace).
6. **Licences de fontes** : vérifier la couverture d'ITC Avant Garde et Ambroise pour un second
   site, ou prévoir les substituts mentionnés au §3.
