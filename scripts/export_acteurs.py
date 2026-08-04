#!/usr/bin/env python3
"""Exporte les acteurs cyber Océan Indien du costum Communecter `cyberReunion`.

Usage : python3 scripts/export_acteurs.py [destination]
"""
import csv
import html
import json
import re
import subprocess
import sys

BASE = "https://www.communecter.org"
SEARCH = f"{BASE}/co2/search/globalautocomplete"
SOURCE_KEY = "cyberReunion"

FIELDS = [
    "name", "type", "typologie", "address", "email", "url", "contact", "telephone",
    "shortDescription", "siren", "domains", "specialties", "offer", "partners", "tags",
    "geo", "slug", "profilImageUrl", "profilMediumImageUrl", "profilThumbImageUrl",
    "source", "created", "updated",
]

# Les 8 familles officielles déclarées dans costum.lists.family.
# Clé = valeur brute stockée en base, valeur = libellé normalisé.
FAMILIES = {
    "Entreprises(produits/solutions et services)": "Entreprises (produits/solutions et services)",
    "CERT/CSIRT": "CERT/CSIRT",
    "Organismes de formation": "Organismes de formation",
    "Laboratoires /recherche": "Laboratoires/recherche",
    "Laboratoires/recherche": "Laboratoires/recherche",
    "Structure d’accompagnement et financement": "Structure d’accompagnement et financement",
    "Structure d'accompagnement et financement": "Structure d’accompagnement et financement",
    "Réseaux/cluster": "Réseaux/cluster",
    "Services défense/intérieur": "Services défense/intérieur",
    "Association/ONG": "Association/ONG",
}

COUNTRIES = {
    "AU": "Australie", "FR": "France", "IN": "Inde", "KE": "Kenya", "LK": "Sri Lanka",
    "MG": "Madagascar", "MU": "Maurice", "MV": "Maldives", "MZ": "Mozambique",
    "RE": "La Réunion", "SC": "Seychelles", "TZ": "Tanzanie", "ZA": "Afrique du Sud",
}

COLUMNS = [
    "id", "nom", "slug", "typologie", "typologie_brute", "type_communecter",
    "domaines", "specialites", "offre", "partenaires", "siren",
    "description_courte", "site_web", "email", "telephone",
    "adresse", "ville", "code_postal", "pays_code", "pays", "region",
    "latitude", "longitude", "tags",
    "logo_url", "logo_medium_url", "logo_thumb_url", "url_communecter",
    "date_creation", "date_maj",
]


def fetch():
    data = "&".join(
        [f"searchType[]=organizations", f"sourceKey[]={SOURCE_KEY}", "indexMin=0", "indexStep=2000"]
        + [f"fields[]={f}" for f in FIELDS]
    )
    out = subprocess.run(
        ["curl", "-sS", "-X", "POST", SEARCH, "-H", "X-Requested-With: XMLHttpRequest", "--data", data],
        capture_output=True, text=True, check=True,
    ).stdout
    return json.loads(out)["results"]


def clean(value):
    """Décode les entités HTML et aplatit les espaces."""
    if value is None:
        return ""
    text = html.unescape(str(value))
    return re.sub(r"\s+", " ", text).strip()


def as_list(value):
    if not value:
        return []
    if isinstance(value, str):
        value = [value]
    seen, out = set(), []
    for item in value:
        item = clean(item)
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def phone(doc):
    """`contact` est une chaîne libre, `telephone` un dict {fixe|mobile: [...]}."""
    numbers = as_list(doc.get("contact"))
    tel = doc.get("telephone") or {}
    if isinstance(tel, dict):
        for key in ("fixe", "mobile", "phone"):
            numbers += as_list(tel.get(key))
    else:
        numbers += as_list(tel)
    return " | ".join(dict.fromkeys(numbers))


def image(path):
    if not path:
        return ""
    path = str(path).split("?")[0]
    return path if path.startswith("http") else BASE + path


def row(oid, doc):
    addr = doc.get("address") or {}
    geo = doc.get("geo") or {}
    raw_typo = as_list(doc.get("typologie"))
    # Le champ typologie contient parfois des domaines/spécialités saisis par erreur :
    # on isole les 8 familles officielles et on conserve la valeur brute à côté.
    families = list(dict.fromkeys(FAMILIES[t] for t in raw_typo if t in FAMILIES))
    strays = [t for t in raw_typo if t not in FAMILIES]
    country = clean(addr.get("addressCountry"))
    return {
        "id": oid,
        "nom": clean(doc.get("name")),
        "slug": clean(doc.get("slug")),
        "typologie": " | ".join(families),
        "typologie_brute": " | ".join(raw_typo),
        "type_communecter": clean(doc.get("type")),
        "domaines": " | ".join(dict.fromkeys(as_list(doc.get("domains")) + strays)),
        "specialites": " | ".join(as_list(doc.get("specialties"))),
        "offre": clean(doc.get("offer")),
        "partenaires": clean(doc.get("partners")),
        "siren": clean(doc.get("siren")),
        "description_courte": clean(doc.get("shortDescription")),
        "site_web": clean(doc.get("url")),
        "email": clean(doc.get("email")),
        "telephone": phone(doc),
        "adresse": clean(addr.get("streetAddress")),
        "ville": clean(addr.get("addressLocality")),
        "code_postal": clean(addr.get("postalCode")),
        "pays_code": country,
        "pays": COUNTRIES.get(country, clean(addr.get("level1Name"))),
        "region": clean(addr.get("level1Name")),
        "latitude": clean(geo.get("latitude")),
        "longitude": clean(geo.get("longitude")),
        "tags": " | ".join(as_list(doc.get("tags"))),
        "logo_url": image(doc.get("profilImageUrl")),
        "logo_medium_url": image(doc.get("profilMediumImageUrl")),
        "logo_thumb_url": image(doc.get("profilThumbImageUrl")),
        "url_communecter": f"{BASE}/#@{doc['slug']}" if doc.get("slug") else "",
        "date_creation": clean(doc.get("created")),
        "date_maj": clean(doc.get("updated")),
    }


def main(dest):
    results = fetch()
    rows = [row(oid, doc) for oid, doc in results.items()]
    rows.sort(key=lambda r: (r["typologie"] or "zz", r["nom"].lower()))
    with open(dest, "w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=COLUMNS)
        writer.writeheader()
        writer.writerows(rows)
    print(f"{len(rows)} acteurs -> {dest}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "data/acteurs.csv")
