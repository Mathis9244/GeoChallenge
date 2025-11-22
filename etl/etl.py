"""
ETL Script pour générer le snapshot Géo Challenge
Génère un JSON avec les rangs de tous les pays pour les 8 catégories
Version améliorée avec mapping ISO3 robuste
"""

import json
import requests
from pathlib import Path
from datetime import datetime
from SPARQLWrapper import SPARQLWrapper, JSON
import os
import pycountry
import unicodedata

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
SNAPSHOT_DIR = BASE_DIR / "snapshot"
SNAPSHOT_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)

# Mapping de noms de pays vers ISO3 (pour les cas spéciaux)
COUNTRY_NAME_MAPPING = {
    # Variations communes
    "United States": "USA",
    "United States of America": "USA",
    "USA": "USA",
    "US": "USA",
    "United Kingdom": "GBR",
    "UK": "GBR",
    "Russia": "RUS",
    "Russian Federation": "RUS",
    "South Korea": "KOR",
    "Korea, Rep.": "KOR",
    "Korea, South": "KOR",
    "North Korea": "PRK",
    "Korea, Dem. People's Rep.": "PRK",
    "Korea, North": "PRK",
    "Iran": "IRN",
    "Iran, Islamic Rep.": "IRN",
    "Venezuela": "VEN",
    "Venezuela, RB": "VEN",
    "Syria": "SYR",
    "Syrian Arab Republic": "SYR",
    "Egypt": "EGY",
    "Egypt, Arab Rep.": "EGY",
    "Laos": "LAO",
    "Lao PDR": "LAO",
    "Myanmar": "MMR",
    "Burma": "MMR",
    "Czech Republic": "CZE",
    "Czechia": "CZE",
    "Macedonia": "MKD",
    "North Macedonia": "MKD",
    "Moldova": "MDA",
    "Moldova, Republic of": "MDA",
    "Palestine": "PSE",
    "West Bank and Gaza": "PSE",
    "Yemen": "YEM",
    "Yemen, Rep.": "YEM",
    "Congo": "COG",
    "Congo, Rep.": "COG",
    "Congo, Dem. Rep.": "COD",
    "DR Congo": "COD",
    "Democratic Republic of the Congo": "COD",
    "Tanzania": "TZA",
    "Tanzania, United Rep. of": "TZA",
    "Gambia": "GMB",
    "Gambia, The": "GMB",
    "Bahamas": "BHS",
    "Bahamas, The": "BHS",
    "Kyrgyzstan": "KGZ",
    "Kyrgyz Republic": "KGZ",
}

# Mapping ISO3 vers drapeaux emoji (pour les pays principaux)
# Note: Pour une solution complète, utiliser une bibliothèque comme countryflags
FLAG_EMOJI_MAPPING = {
    "FRA": "🇫🇷", "USA": "🇺🇸", "GBR": "🇬🇧", "DEU": "🇩🇪", "ITA": "🇮🇹",
    "ESP": "🇪🇸", "RUS": "🇷🇺", "CHN": "🇨🇳", "JPN": "🇯🇵", "IND": "🇮🇳",
    "BRA": "🇧🇷", "CAN": "🇨🇦", "AUS": "🇦🇺", "KOR": "🇰🇷", "MEX": "🇲🇽",
    "IDN": "🇮🇩", "NLD": "🇳🇱", "BEL": "🇧🇪", "CHE": "🇨🇭", "SWE": "🇸🇪",
    "POL": "🇵🇱", "ARG": "🇦🇷", "SAU": "🇸🇦", "TUR": "🇹🇷", "ZAF": "🇿🇦",
    "EGY": "🇪🇬", "THA": "🇹🇭", "VNM": "🇻🇳", "PHL": "🇵🇭", "BGD": "🇧🇩",
    "PAK": "🇵🇰", "IRN": "🇮🇷", "IRQ": "🇮🇶", "AFG": "🇦🇫", "NGA": "🇳🇬",
    "ETH": "🇪🇹", "KEN": "🇰🇪", "UGA": "🇺🇬", "TZA": "🇹🇿", "GHA": "🇬🇭",
    "MAR": "🇲🇦", "DZA": "🇩🇿", "TUN": "🇹🇳", "LBY": "🇱🇾", "SDN": "🇸🇩",
    "COD": "🇨🇩", "CMR": "🇨🇲", "CIV": "🇨🇮", "SEN": "🇸🇳", "MLI": "🇲🇱",
    "BFA": "🇧🇫", "NER": "🇳🇪", "TCD": "🇹🇩", "GIN": "🇬🇳", "GAB": "🇬🇦",
    "COG": "🇨🇬", "CAF": "🇨🇫", "GNQ": "🇬🇶", "BEN": "🇧🇯", "TGO": "🇹🇬",
    "MRT": "🇲🇷", "GMB": "🇬🇲", "GNB": "🇬🇼", "STP": "🇸🇹", "DJI": "🇩🇯",
    "COM": "🇰🇲", "MUS": "🇲🇺", "SYC": "🇸🇨", "MDG": "🇲🇬", "RWA": "🇷🇼",
    "BDI": "🇧🇮", "UGA": "🇺🇬", "KEN": "🇰🇪", "TZA": "🇹🇿", "MWI": "🇲🇼",
    "ZMB": "🇿🇲", "ZWE": "🇿🇼", "BWA": "🇧🇼", "NAM": "🇳🇦", "LSO": "🇱🇸",
    "SWZ": "🇸🇿", "MOZ": "🇲🇿", "AGO": "🇦🇴", "ZAF": "🇿🇦", "LBR": "🇱🇷",
    "SLE": "🇸🇱", "GHA": "🇬🇭", "TGO": "🇹🇬", "BEN": "🇧🇯", "NGA": "🇳🇬",
    "NLD": "🇳🇱", "BEL": "🇧🇪", "LUX": "🇱🇺", "CHE": "🇨🇭", "AUT": "🇦🇹",
    "DEU": "🇩🇪", "POL": "🇵🇱", "CZE": "🇨🇿", "SVK": "🇸🇰", "HUN": "🇭🇺",
    "ROU": "🇷🇴", "BGR": "🇧🇬", "GRC": "🇬🇷", "ALB": "🇦🇱", "MKD": "🇲🇰",
    "SRB": "🇷🇸", "BIH": "🇧🇦", "HRV": "🇭🇷", "SVN": "🇸🇮", "ITA": "🇮🇹",
    "FRA": "🇫🇷", "ESP": "🇪🇸", "PRT": "🇵🇹", "GBR": "🇬🇧", "IRL": "🇮🇪",
    "ISL": "🇮🇸", "NOR": "🇳🇴", "SWE": "🇸🇪", "FIN": "🇫🇮", "DNK": "🇩🇰",
    "EST": "🇪🇪", "LVA": "🇱🇻", "LTU": "🇱🇹", "BLR": "🇧🇾", "UKR": "🇺🇦",
    "MDA": "🇲🇩", "RUS": "🇷🇺", "GEO": "🇬🇪", "ARM": "🇦🇲", "AZE": "🇦🇿",
    "KAZ": "🇰🇿", "UZB": "🇺🇿", "TKM": "🇹🇲", "TJK": "🇹🇯", "KGZ": "🇰🇬",
    "MNG": "🇲🇳", "CHN": "🇨🇳", "PRK": "🇰🇵", "KOR": "🇰🇷", "JPN": "🇯🇵",
    "TWN": "🇹🇼", "HKG": "🇭🇰", "MAC": "🇲🇴", "MYS": "🇲🇾", "SGP": "🇸🇬",
    "IDN": "🇮🇩", "BRN": "🇧🇳", "PHL": "🇵🇭", "VNM": "🇻🇳", "LAO": "🇱🇦",
    "KHM": "🇰🇭", "THA": "🇹🇭", "MMR": "🇲🇲", "BGD": "🇧🇩", "BTN": "🇧🇹",
    "NPL": "🇳🇵", "IND": "🇮🇳", "PAK": "🇵🇰", "AFG": "🇦🇫", "IRN": "🇮🇷",
    "IRQ": "🇮🇶", "KWT": "🇰🇼", "BHR": "🇧🇭", "QAT": "🇶🇦", "ARE": "🇦🇪",
    "OMN": "🇴🇲", "YEM": "🇾🇪", "SAU": "🇸🇦", "JOR": "🇯🇴", "LBN": "🇱🇧",
    "SYR": "🇸🇾", "ISR": "🇮🇱", "PSE": "🇵🇸", "CYP": "🇨🇾", "TUR": "🇹🇷",
    "EGY": "🇪🇬", "LBY": "🇱🇾", "TUN": "🇹🇳", "DZA": "🇩🇿", "MAR": "🇲🇦",
    "MRT": "🇲🇷", "MLI": "🇲🇱", "NER": "🇳🇪", "TCD": "🇹🇩", "SDN": "🇸🇩",
    "ERI": "🇪🇷", "ETH": "🇪🇹", "DJI": "🇩🇯", "SOM": "🇸🇴", "KEN": "🇰🇪",
    "UGA": "🇺🇬", "RWA": "🇷🇼", "BDI": "🇧🇮", "TZA": "🇹🇿", "MWI": "🇲🇼",
    "ZMB": "🇿🇲", "ZWE": "🇿🇼", "BWA": "🇧🇼", "NAM": "🇳🇦", "ZAF": "🇿🇦",
    "LSO": "🇱🇸", "SWZ": "🇸🇿", "MOZ": "🇲🇿", "MDG": "🇲🇬", "MUS": "🇲🇺",
    "SYC": "🇸🇨", "COM": "🇰🇲", "AGO": "🇦🇴", "COD": "🇨🇩", "CAF": "🇨🇫",
    "TCD": "🇹🇩", "CMR": "🇨🇲", "GNQ": "🇬🇶", "GAB": "🇬🇦", "COG": "🇨🇬",
    "GIN": "🇬🇳", "GNB": "🇬🇼", "SLE": "🇸🇱", "LBR": "🇱🇷", "CIV": "🇨🇮",
    "GHA": "🇬🇭", "TGO": "🇹🇬", "BEN": "🇧🇯", "BFA": "🇧🇫", "MLI": "🇲🇱",
    "SEN": "🇸🇳", "GMB": "🇬🇲", "MRT": "🇲🇷", "NGA": "🇳🇬", "NER": "🇳🇪",
    "BRA": "🇧🇷", "ARG": "🇦🇷", "CHL": "🇨🇱", "PER": "🇵🇪", "BOL": "🇧🇴",
    "PRY": "🇵🇾", "URY": "🇺🇾", "COL": "🇨🇴", "VEN": "🇻🇪", "GUY": "🇬🇾",
    "SUR": "🇸🇷", "ECU": "🇪🇨", "PAN": "🇵🇦", "CRI": "🇨🇷", "NIC": "🇳🇮",
    "HND": "🇭🇳", "SLV": "🇸🇻", "GTM": "🇬🇹", "BLZ": "🇧🇿", "MEX": "🇲🇽",
    "CUB": "🇨🇺", "JAM": "🇯🇲", "HTI": "🇭🇹", "DOM": "🇩🇴", "PRI": "🇵🇷",
    "CAN": "🇨🇦", "USA": "🇺🇸", "GRL": "🇬🇱", "NZL": "🇳🇿", "AUS": "🇦🇺",
    "PNG": "🇵🇬", "FJI": "🇫🇯", "VUT": "🇻🇺", "NCL": "🇳🇨", "PYF": "🇵🇫",
}

def normalize_country_name(name):
    """Normalise un nom de pays et retourne l'ISO3"""
    if not name:
        return None
    
    # Nettoyer le nom
    name = name.strip()
    name = unicodedata.normalize('NFKD', name)
    
    # Vérifier d'abord le mapping manuel
    if name in COUNTRY_NAME_MAPPING:
        return COUNTRY_NAME_MAPPING[name]
    
    # Essayer avec pycountry
    try:
        # Chercher par nom officiel
        country = pycountry.countries.search_fuzzy(name)
        if country:
            return country[0].alpha_3
    except (LookupError, AttributeError):
        pass
    
    # Essayer avec des variations du nom
    variations = [
        name,
        name.replace(",", ""),
        name.split(",")[0].strip(),
        name.split("(")[0].strip(),
    ]
    
    for variation in variations:
        try:
            country = pycountry.countries.search_fuzzy(variation)
            if country:
                return country[0].alpha_3
        except (LookupError, AttributeError):
            continue
    
    return None

def get_country_info(iso3):
    """Récupère les informations d'un pays (nom, drapeau) à partir de son ISO3
    
    Utilise FlagCDN API pour les drapeaux : https://flagcdn.com/
    Format: https://flagcdn.com/w{width}/{iso2}.png
    """
    if not iso3:
        return {"name": "Unknown", "flag": "https://flagcdn.com/w40/xx.png"}
    
    try:
        country = pycountry.countries.get(alpha_3=iso3)
        if country:
            name = country.name
            # Convertir ISO3 en ISO2 pour l'API FlagCDN
            iso2 = country.alpha_2.lower()
            # Utiliser FlagCDN avec différentes tailles disponibles
            flag_url = f"https://flagcdn.com/w80/{iso2}.png"
            return {"name": name, "flag": flag_url}
    except (LookupError, AttributeError):
        pass
    
    # Fallback : essayer de trouver l'ISO2 manuellement pour quelques cas spéciaux
    iso3_to_iso2_fallback = {
        "ENG": "gb",  # Angleterre (pas un pays ISO, mais utilisé dans FIFA)
    }
    
    if iso3 in iso3_to_iso2_fallback:
        iso2 = iso3_to_iso2_fallback[iso3]
        flag_url = f"https://flagcdn.com/w80/{iso2}.png"
        return {"name": iso3, "flag": flag_url}
    
    # Dernier recours
    return {"name": iso3, "flag": "https://flagcdn.com/w80/xx.png"}

def get_world_bank_data(indicator, reverse=False, year=None, fallback_file=None):
    """Récupère les données de la World Bank API avec fallback
    
    Args:
        indicator: Code de l'indicateur World Bank
        reverse: True pour tri décroissant (plus grand = meilleur), False pour croissant
        year: Année spécifique (None pour toutes les années, prend la dernière disponible)
        fallback_file: Nom du fichier de secours dans data/ si l'API échoue
    """
    # Codes de régions World Bank à exclure (pas des pays ISO3)
    REGION_CODES = {
        'AFE', 'AFW', 'ARB', 'CEB', 'CSS', 'EAP', 'EAS', 'ECA', 'ECS', 'EMU',
        'EUU', 'FCS', 'HIC', 'HPC', 'IBD', 'IBT', 'IDB', 'IDX', 'LAC', 'LCN',
        'LDC', 'LIC', 'LMC', 'LMY', 'MEA', 'MIC', 'MNA', 'NAC', 'OED', 'OSS',
        'PRE', 'PSS', 'PST', 'SAS', 'SSA', 'SSF', 'SST', 'TEA', 'TEC', 'TLA',
        'TMN', 'TSA', 'TSS', 'UMC', 'WLD', 'EAR'
    }
    
    # Pour certains indicateurs, utiliser une année spécifique ou toutes les années
    if year:
        url = f"https://api.worldbank.org/v2/country/all/indicator/{indicator}?format=json&per_page=500&date={year}"
    else:
        # Récupérer toutes les années et prendre la dernière disponible
        url = f"https://api.worldbank.org/v2/country/all/indicator/{indicator}?format=json&per_page=500"
    try:
        response = requests.get(url, timeout=60)
        data = response.json()
        if len(data) < 2:
            return {}
        
        countries = {}
        for item in data[1]:
            if item.get('value') is not None:
                iso3 = item.get('countryiso3code', '').strip().upper()
                # Filtrer : seulement codes ISO3 valides de 3 lettres, exclure les régions
                if iso3 and len(iso3) == 3 and iso3.isalpha() and iso3 not in REGION_CODES:
                    # Vérifier que c'est un vrai code ISO3 avec pycountry (optionnel mais recommandé)
                    is_valid_country = False
                    try:
                        country = pycountry.countries.get(alpha_3=iso3)
                        is_valid_country = country is not None
                    except (LookupError, AttributeError):
                        # Si pycountry ne trouve pas, on accepte quand même (certains codes peuvent être valides mais absents de pycountry)
                        is_valid_country = True
                    
                    if is_valid_country:
                        year_data = item.get('date', '')
                        value = float(item['value'])
                        
                        # Si on a plusieurs années, prendre la dernière disponible
                        if iso3 not in countries or year_data > countries[iso3].get('year', ''):
                            countries[iso3] = {
                                'name': item.get('country', {}).get('value', ''),
                                'value': value,
                                'year': year_data
                            }
        
        # Calculer les rangs
        sorted_countries = sorted(
            countries.items(),
            key=lambda x: x[1]['value'],
            reverse=reverse
        )
        
        ranks = {}
        for rank, (iso3, data) in enumerate(sorted_countries, 1):
            ranks[iso3] = rank
        
        # Si aucun résultat ou très peu, utiliser le fallback
        if len(ranks) < 10 and fallback_file:
            print(f"  [FALLBACK] Seulement {len(ranks)} pays recuperes, utilisation du fichier de secours: {fallback_file}")
            fallback_data = load_local_dataset(fallback_file)
            fallback_ranks = fallback_data.get("ranks", {})
            if fallback_ranks:
                print(f"  [OK] {len(fallback_ranks)} pays charges depuis le fichier de secours")
                return fallback_ranks
        
        return ranks
    except Exception as e:
        print(f"Erreur World Bank {indicator}: {e}")
        if fallback_file:
            print(f"  [FALLBACK] Utilisation des donnees de secours: {fallback_file}")
            fallback_data = load_local_dataset(fallback_file)
            fallback_ranks = fallback_data.get("ranks", {})
            if fallback_ranks:
                print(f"  [OK] {len(fallback_ranks)} pays charges depuis le fichier de secours")
                return fallback_ranks
        return {}

def get_wikidata_capital_population(fallback_file=None):
    """Récupère la population des capitales via Wikidata SPARQL avec extraction ISO3
    
    Args:
        fallback_file: Nom du fichier de secours dans data/ si l'API échoue
    """
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = """
    SELECT ?country ?countryLabel ?capital ?capitalLabel ?population ?iso3 WHERE {
      ?country wdt:P31 wd:Q6256 .
      ?country wdt:P36 ?capital .
      ?capital wdt:P1082 ?population .
      OPTIONAL { ?country wdt:P298 ?iso3 . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    ORDER BY DESC(?population)
    LIMIT 200
    """
    
    try:
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        
        countries = {}
        for result in results["results"]["bindings"]:
            country_label = result.get("countryLabel", {}).get("value", "")
            population = float(result.get("population", {}).get("value", 0))
            
            # Essayer d'abord d'extraire l'ISO3 depuis Wikidata
            iso3 = None
            if "iso3" in result:
                iso3_raw = result.get("iso3", {}).get("value", "")
                if iso3_raw:
                    iso3 = iso3_raw.strip().upper()
            
            # Si pas d'ISO3 dans Wikidata, utiliser le nom du pays
            if not iso3 or len(iso3) != 3:
                iso3 = normalize_country_name(country_label)
            
            if iso3 and len(iso3) == 3 and population > 0:
                countries[iso3] = {
                    'name': country_label,
                    'value': population
                }
        
        # Calculer les rangs
        sorted_countries = sorted(
            countries.items(),
            key=lambda x: x[1]['value'],
            reverse=True
        )
        
        ranks = {}
        for rank, (iso3, data) in enumerate(sorted_countries, 1):
            ranks[iso3] = rank
        
        # Si aucun résultat ou très peu, utiliser le fallback
        if len(ranks) < 10 and fallback_file:
            print(f"  [FALLBACK] Seulement {len(ranks)} pays recuperes, utilisation du fichier de secours: {fallback_file}")
            fallback_data = load_local_dataset(fallback_file)
            fallback_ranks = fallback_data.get("ranks", {})
            if fallback_ranks:
                print(f"  [OK] {len(fallback_ranks)} pays charges depuis le fichier de secours")
                return fallback_ranks
        
        return ranks
    except Exception as e:
        print(f"Erreur Wikidata: {e}")
        if fallback_file:
            print(f"  [FALLBACK] Utilisation des donnees de secours: {fallback_file}")
            fallback_data = load_local_dataset(fallback_file)
            fallback_ranks = fallback_data.get("ranks", {})
            if fallback_ranks:
                print(f"  [OK] {len(fallback_ranks)} pays charges depuis le fichier de secours")
                return fallback_ranks
        return {}

def load_local_dataset(filename):
    """Charge un dataset local (FIFA, EEZ, francophones, fallbacks)
    
    Args:
        filename: Nom du fichier dans le dossier data/
    
    Returns:
        dict: Données du fichier JSON ou {} si le fichier n'existe pas
    """
    filepath = DATA_DIR / filename
    if not filepath.exists():
        print(f"  [ATTENTION] Fichier {filename} non trouve dans data/")
        return {}
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"  [OK] Fichier {filename} charge")
            return data
    except Exception as e:
        print(f"  [ERREUR] Impossible de charger {filename}: {e}")
        return {}

def normalize_countries(all_ranks):
    """Normalise tous les pays et crée la structure finale avec noms et drapeaux"""
    # Récupérer tous les ISO3 uniques
    all_iso3 = set()
    for category_ranks in all_ranks.values():
        all_iso3.update(category_ranks.keys())
    
    # Créer la structure finale avec les vraies informations
    countries = {}
    for iso3 in all_iso3:
        if not iso3 or len(iso3) != 3:
            continue
        
        # Récupérer les informations du pays
        country_info = get_country_info(iso3)
        
        countries[iso3] = {
            "name": country_info["name"],
            "flag": country_info["flag"],
            "ranks": {}
        }
        
        # Remplir les rangs pour chaque catégorie
        for category in ["small_area", "gdp", "capital_pop", "military", 
                        "football", "eez", "rice", "francophones"]:
            rank = all_ranks.get(category, {}).get(iso3)
            countries[iso3]["ranks"][category] = rank if rank else 196  # Par défaut dernier
    
    return countries

def generate_snapshot():
    """Génère le snapshot complet"""
    print("Génération du snapshot Géo Challenge...")
    print("=" * 60)
    
    all_ranks = {}
    
    # 1. Petite superficie (World Bank)
    print("\n1. Récupération des données de superficie...")
    all_ranks["small_area"] = get_world_bank_data("AG.LND.TOTL.K2", reverse=False, fallback_file="small_area_fallback.json")
    print(f"   [OK] {len(all_ranks['small_area'])} pays trouves")
    
    # 2. PIB global (World Bank) avec fallback
    print("\n2. Récupération des données de PIB...")
    all_ranks["gdp"] = get_world_bank_data("NY.GDP.MKTP.CD", reverse=True, fallback_file="gdp_fallback.json")
    print(f"   [OK] {len(all_ranks['gdp'])} pays trouves")
    
    # 3. Grande capitale (Wikidata) avec fallback
    print("\n3. Récupération des données de capitales...")
    all_ranks["capital_pop"] = get_wikidata_capital_population(fallback_file="capital_pop_fallback.json")
    print(f"   [OK] {len(all_ranks['capital_pop'])} pays trouves")
    
    # 4. Taille de l'armée (World Bank) avec fallback
    print("\n4. Récupération des données militaires...")
    all_ranks["military"] = get_world_bank_data("MS.MIL.TOTL.P1", reverse=True, year=2020, fallback_file="military_fallback.json")
    print(f"   [OK] {len(all_ranks['military'])} pays trouves")
    
    # 5. Football (local)
    print("\n5. Chargement du classement FIFA...")
    fifa_data = load_local_dataset("fifa_ranking.json")
    all_ranks["football"] = fifa_data.get("ranks", {})
    print(f"   [OK] {len(all_ranks['football'])} pays trouves")
    
    # 6. Taille ZEE (local)
    print("\n6. Chargement des données ZEE...")
    eez_data = load_local_dataset("eez_data.json")
    all_ranks["eez"] = eez_data.get("ranks", {})
    print(f"   [OK] {len(all_ranks['eez'])} pays trouves")
    
    # 7. Production de riz (FAOSTAT - pour MVP, données locales)
    print("\n7. Chargement de la production de riz...")
    rice_data = load_local_dataset("rice_production.json")
    all_ranks["rice"] = rice_data.get("ranks", {})
    print(f"   [OK] {len(all_ranks['rice'])} pays trouves")
    
    # 8. Francophones (local)
    print("\n8. Chargement des données francophones...")
    francophones_data = load_local_dataset("francophones.json")
    all_ranks["francophones"] = francophones_data.get("ranks", {})
    print(f"   [OK] {len(all_ranks['francophones'])} pays trouves")
    
    # Normaliser et créer la structure finale
    print("\n" + "=" * 60)
    print("Normalisation des pays...")
    countries = normalize_countries(all_ranks)
    
    # Générer le snapshot
    season = datetime.now().strftime("%Y-%m")
    snapshot = {
        "meta": {
            "season": season,
            "generated_at": datetime.now().isoformat()
        },
        "countries": countries
    }
    
    # Sauvegarder
    snapshot_file = SNAPSHOT_DIR / f"snapshot-{season}.json"
    with open(snapshot_file, 'w', encoding='utf-8') as f:
        json.dump(snapshot, f, indent=2, ensure_ascii=False)
    
    print(f"\n[OK] Snapshot genere: {snapshot_file}")
    print(f"[OK] Nombre de pays: {len(countries)}")
    print("=" * 60)
    
    return snapshot

if __name__ == "__main__":
    generate_snapshot()
