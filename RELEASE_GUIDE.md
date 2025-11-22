# 📦 Guide de création de releases

Ce guide explique comment créer une release GitHub qui sera automatiquement générée par le workflow CI/CD.

## 🚀 Créer une release

### Méthode 1 : Via Git (Recommandé)

1. **Assurez-vous que votre code est à jour et commité**
   ```bash
   git status
   git add .
   git commit -m "feat: Nouvelle fonctionnalité"
   git push origin main
   ```

2. **Créer et pousser un tag de version**
   ```bash
   # Format: vMAJOR.MINOR.PATCH (ex: v1.2.3)
   git tag -a v1.2.3 -m "Release v1.2.3"
   git push origin v1.2.3
   ```

3. **Le workflow GitHub Actions se déclenche automatiquement**
   - Le workflow détecte le push du tag
   - Il build l'application
   - Il génère les notes de version
   - Il crée la release GitHub avec les assets

### Méthode 2 : Via l'interface GitHub

1. Allez sur la page [Releases](https://github.com/Mathis9244/GeoChallenge/releases)
2. Cliquez sur "Draft a new release"
3. Créez un nouveau tag (ex: `v1.2.3`)
4. Remplissez le titre et la description
5. Cliquez sur "Publish release"

⚠️ **Note** : Cette méthode ne déclenchera pas le workflow automatique. Utilisez la méthode 1 pour bénéficier de la génération automatique.

## 📋 Format de version (Semantic Versioning)

Utilisez le format [SemVer](https://semver.org/) : `MAJOR.MINOR.PATCH`

- **MAJOR** : Changements incompatibles avec les versions précédentes
- **MINOR** : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** : Corrections de bugs rétrocompatibles

### Exemples

- `v1.0.0` - Première version stable
- `v1.1.0` - Nouvelle fonctionnalité (badges, undo/redo)
- `v1.1.1` - Correction de bug
- `v2.0.0` - Refonte majeure

## 📝 Convention de commits

Pour que les notes de version soient bien générées, utilisez des messages de commit clairs :

### Préfixes recommandés

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage, point-virgule manquant, etc.
- `refactor:` - Refactorisation du code
- `test:` - Ajout de tests
- `chore:` - Maintenance (dépendances, config, etc.)

### Exemples

```bash
git commit -m "feat: Ajout système de badges"
git commit -m "fix: Correction du bug d'annulation"
git commit -m "docs: Mise à jour du README"
git commit -m "chore: Mise à jour des dépendances"
```

## 🔄 Workflow automatique

Lorsque vous poussez un tag, le workflow `.github/workflows/release.yml` :

1. ✅ **Checkout le code** au tag spécifié
2. ✅ **Installe les dépendances** Node.js
3. ✅ **Build l'application** React
4. ✅ **Génère les notes de version** depuis les commits
5. ✅ **Crée un archive zip** avec le build précompilé
6. ✅ **Crée la release GitHub** avec :
   - Titre automatique
   - Notes de version catégorisées
   - Assets (zip du build)
   - Liens de téléchargement

## 📦 Assets de la release

Chaque release contient :

- **Source code** : Code source complet (zip et tar.gz)
- **Build précompilé** : Archive zip avec `frontend/dist/` prêt à déployer

## 🐛 Dépannage

### Le workflow ne se déclenche pas

1. Vérifiez que le tag suit le format `v*.*.*`
2. Vérifiez que le tag a bien été poussé : `git push origin v1.2.3`
3. Consultez les [Actions GitHub](https://github.com/Mathis9244/GeoChallenge/actions)

### Les notes de version sont vides

1. Assurez-vous d'avoir fait des commits avant de créer le tag
2. Vérifiez que les messages de commit sont clairs
3. Le workflow utilise les commits entre le tag précédent et le nouveau tag

### Le build échoue

1. Vérifiez que `npm run build` fonctionne localement
2. Consultez les logs du workflow dans GitHub Actions
3. Vérifiez que toutes les dépendances sont à jour

## 📚 Ressources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)

