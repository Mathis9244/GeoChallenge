# Script ETL - Géo Challenge

Script Python pour générer le snapshot de données utilisé par le jeu.

## Utilisation

### Mode normal (APIs + fallback)

Par défaut, le script essaie d'utiliser les APIs externes (World Bank, Wikidata) et utilise les fichiers JSON locaux en cas d'échec :

```bash
cd etl
python etl.py
```

### Mode local uniquement (forcer l'utilisation des fichiers JSON)

Pour forcer l'utilisation des fichiers JSON locaux dans `data/` et ignorer les APIs :

**Windows PowerShell :**
```powershell
$env:USE_LOCAL_ONLY="true"
python etl.py
```

**Linux/Mac :**
```bash
USE_LOCAL_ONLY=true python etl.py
```

**Ou modifier directement dans `etl.py` :**
```python
USE_LOCAL_ONLY = True  # Au lieu de False
```

## Fichiers utilisés

### APIs avec fallback
- `small_area_fallback.json` - Petite superficie (World Bank)
- `gdp_fallback.json` - PIB global (World Bank)
- `capital_pop_fallback.json` - Population des capitales (Wikidata)
- `military_fallback.json` - Taille de l'armée (World Bank)

### Fichiers locaux uniquement
- `fifa_ranking.json` - Classement FIFA
- `eez_data.json` - Taille des ZEE (Zones Économiques Exclusives)
- `rice_production.json` - Production de riz
- `francophones.json` - Population francophone

## Format des fichiers JSON

Les fichiers de fallback doivent avoir cette structure :

```json
{
  "ranks": {
    "FRA": 1,
    "USA": 2,
    "CHN": 3,
    ...
  }
}
```

Où :
- La clé est le code ISO3 du pays (ex: "FRA", "USA")
- La valeur est le rang (1 = meilleur, 2 = deuxième, etc.)

## Après génération

Une fois le snapshot généré dans `snapshot/snapshot-2025-11.json`, copiez-le dans `frontend/public/` :

```bash
# Windows PowerShell
Copy-Item ../snapshot/snapshot-2025-11.json ../frontend/public/snapshot-2025-11.json -Force

# Linux/Mac
cp ../snapshot/snapshot-2025-11.json ../frontend/public/snapshot-2025-11.json
```

## Dépannage

### Les APIs ne fonctionnent pas
Le script utilise automatiquement les fichiers de fallback si :
- L'API retourne une erreur
- L'API retourne moins de 10 pays

### Forcer l'utilisation des fichiers locaux
Utilisez `USE_LOCAL_ONLY=true` pour ignorer complètement les APIs.

### Le snapshot n'est pas mis à jour dans le jeu
1. Vérifiez que le snapshot a bien été copié dans `frontend/public/`
2. Videz le cache du navigateur (Ctrl+Shift+R)
3. Redémarrez le serveur de développement

