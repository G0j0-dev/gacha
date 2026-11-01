# Berry Gacha

Petit jeu de gacha en HTML, CSS et JavaScript, prêt à héberger gratuitement avec GitHub Pages.

## Fonctionnalités
- 1 000 Berrys au démarrage
- Invocation simple : 100 Berrys
- Invocation x10 : 900 Berrys
- 5 raretés avec probabilités pondérées
- Inventaire et historique
- Sauvegarde automatique dans le navigateur (`localStorage`)
- Bouton `+` pour ajouter 500 Berrys de test

## Modifier les probabilités ou les améliorations

Ouvre `script.js` et modifie le tableau `upgrades` au début du fichier. La somme des chances doit faire 100.

Exemple :
```js
{ name: "Mon pouvoir", rarity: "Rare", tier: "rare", chance: 25, icon: "🌊", description: "Description du pouvoir." }
```

Tu peux aussi changer `STARTING_BERRIES`, `COST_ONE` et `COST_TEN`.

## Publier sur GitHub Pages
1. Crée un dépôt GitHub, par exemple `berry-gacha`.
2. Envoie les trois fichiers `index.html`, `style.css` et `script.js` (tu peux aussi envoyer `README.md`).
3. Dans le dépôt, ouvre **Settings → Pages**.
4. Dans **Build and deployment**, choisis **Deploy from a branch**.
5. Choisis `main` et `/ (root)`, puis clique sur **Save**.
6. Après quelques instants, GitHub affichera l'adresse de ton site dans la section Pages.

## À savoir
La progression est sauvegardée sur l'appareil et le navigateur utilisés. Ce prototype n'a pas de compte joueur ni de sauvegarde partagée entre amis. Les Berrys sont fictifs et n'ont aucune valeur réelle.
