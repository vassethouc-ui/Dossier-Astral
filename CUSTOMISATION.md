# 🎨 Guide de personnalisation — Dossier Astral

Ce projet est en HTML/CSS/JS pur, sans étape de build : chaque modification que tu fais dans les fichiers est visible directement en rechargeant la page dans ton navigateur.

## 1. Changer ou ajouter une couleur de vaisseau

Deux endroits à modifier ensemble :

**a) Dans `solaire.html`** (autour de la ligne 38), ajoute une option dans la liste déroulante :
```html
<select id="ship-color">
  <option value="red">Rouge</option>
  <option value="ma-couleur">Ma couleur</option>  <!-- nouvelle ligne -->
</select>
```

**b) Dans `js/ship-travel.js`** (cherche `const shipColors = {`), ajoute la couleur réelle correspondante (en code hexadécimal) :
```js
const shipColors = {
  red: "#ff506f",
  "ma-couleur": "#00ffcc",  // nouvelle ligne — remplace par ton code couleur
};
```

Le `value` de l'option HTML et la clé dans `shipColors` doivent être **identiques**.

## 2. Modifier les couleurs/tailles des planètes

Tout est dans `css/planets-orbits.css`. Cherche le nom de la planète (ex. `.mars { ... }`) :
```css
.mars { width: clamp(13px, 2.8vmin, 22px); height: clamp(13px, 2.8vmin, 22px); background: #db5b37; box-shadow: 0 0 10px #db5b37; }
```
- `background` → change la couleur de la planète
- `width` / `height` → change sa taille (le `clamp()` définit une taille min/max qui s'adapte à l'écran)

## 3. Changer les logos, noms et textes affichés

- Le **nom** de chaque planète est dans `solaire.html`, dans la balise `<span class="planet-name">`.
- Les **descriptions et données** (température, distance, gravité, etc.) sont dans `js/planet-data.js` (objet `bodies`) et `js/stats-details.js` (objet `statsByBody`).

Exemple pour changer la description de Mars dans `js/planet-data.js` :
```js
mars: {
  name: "Mars",
  description: "Ta nouvelle description ici",
  ...
}
```

## 4. Ajouter un nouveau type de vaisseau

C'est la personnalisation la plus avancée — trois fichiers à toucher :
1. `solaire.html` → ajoute une `<option>` dans `#ship-type`
2. `js/ship-travel.js` → ajoute le nom dans le tableau `shipTypes`
3. `css/ships-effects.css` → ajoute le style visuel du nouveau vaisseau (copie une classe existante comme `.spaceship.cargo` et adapte-la)

## 5. Où trouver quoi (résumé rapide)

| Tu veux changer... | Fichier à ouvrir |
|---|---|
| Couleurs de vaisseau | `js/ship-travel.js` + `solaire.html` |
| Apparence des planètes | `css/planets-orbits.css` |
| Textes/données des planètes | `js/planet-data.js`, `js/stats-details.js` |
| Types de vaisseau | `solaire.html`, `js/ship-travel.js`, `css/ships-effects.css` |
| Styles généraux (fond, radar, boutons) | `css/base.css`, `css/dossier-ui.css` |

## Besoin d'aide ?

Si une modification ne fonctionne pas comme prévu, vérifie d'abord la console du navigateur (touche F12 → onglet "Console") — elle affiche souvent un message d'erreur clair indiquant la ligne à corriger.
