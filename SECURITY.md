# Politique de sécurité

## Signalement de vulnérabilités

Si vous découvrez une vulnérabilité de sécurité, merci de ne pas créer d'issue publique. Contactez directement le mainteneur du projet.

## Bonnes pratiques de sécurité

### Secrets et informations sensibles

- Ne jamais commiter de fichiers contenant des secrets (clés API, mots de passe, tokens)
- Utiliser des variables d'environnement pour les configurations sensibles
- Vérifier que `.env` est bien dans `.gitignore`
- Ne pas exposer de clés API dans le code source

### Dépendances

- Maintenir les dépendances à jour
- Vérifier régulièrement les vulnérabilités avec `npm audit`
- Utiliser des versions spécifiques dans `package.json` pour éviter les mises à jour non désirées

### Configuration Git

- Ne pas commiter de fichiers de build ou de cache
- Utiliser `.gitignore` pour exclure les fichiers sensibles
- Vérifier l'historique Git avant de partager le dépôt

## Fichiers exclus du dépôt

Les fichiers suivants sont exclus via `.gitignore` :
- `node_modules/` - Dépendances npm
- `.env` - Variables d'environnement
- `dist/` et `build/` - Fichiers de build
- Fichiers temporaires et de cache
- Fichiers de configuration IDE

## Audit de sécurité

Pour vérifier les vulnérabilités dans les dépendances :

```bash
cd frontend
npm audit
```

Pour corriger automatiquement les vulnérabilités :

```bash
npm audit fix
```

