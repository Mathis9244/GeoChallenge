# 📦 Gestion des versions

## Version actuelle

**v1.0.0** - MVP initial

## Système de versioning

Nous utilisons le [Semantic Versioning](https://semver.org/) :
- **MAJOR.MINOR.PATCH** (ex: 1.2.3)
  - **MAJOR** : Changements incompatibles
  - **MINOR** : Nouvelles fonctionnalités compatibles
  - **PATCH** : Corrections de bugs

## Créer une nouvelle release

### Méthode 1 : Via Git (recommandé)

```bash
# 1. S'assurer que tout est commité
git add .
git commit -m "Préparation release v1.0.0"

# 2. Créer un tag
git tag -a v1.0.0 -m "Release v1.0.0 - MVP initial"

# 3. Pousser le tag (déclenche automatiquement le workflow GitHub Actions)
git push origin v1.0.0
```

### Méthode 2 : Via GitHub

1. Aller sur https://github.com/Mathis9244/GeoChallenge/releases
2. Cliquer sur "Draft a new release"
3. Choisir un tag (ex: `v1.0.0`) ou créer un nouveau tag
4. Remplir le titre et la description
5. Publier la release

## Workflow automatique

Quand vous poussez un tag `v*.*.*`, GitHub Actions :
1. ✅ Build automatiquement le frontend
2. ✅ Crée une release GitHub
3. ✅ Attache les fichiers compilés
4. ✅ Génère les notes de release

## Historique des versions

### v1.0.0 (MVP)
- ✅ Jeu fonctionnel avec 8 catégories
- ✅ Système de scoring
- ✅ Personal best et classement
- ✅ Design responsive mobile
- ✅ Drapeaux réels via FlagCDN
- ✅ Script ETL avec fallbacks
- ✅ 8 catégories : superficie, PIB, capitale, armée, football, ZEE, riz, francophones

## Prochaines versions prévues

### v1.1.0 (à venir)
- [ ] Historique des parties
- [ ] Mode chrono
- [ ] Plus de catégories
- [ ] Améliorations UI/UX

### v1.2.0 (à venir)
- [ ] Système de badges
- [ ] Partage amélioré
- [ ] Mode difficile/facile

