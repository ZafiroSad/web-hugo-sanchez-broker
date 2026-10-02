"""Estadisticas del feed de Instagram de @hugosanchezmarzan.

Uso: python3 analizar_feed.py [ruta_json]
Por defecto lee instagram-feed-parcial.json en esta misma carpeta.

La fecha de cada publicacion sale del propio codigo (shortcode): los 41 bits
altos del ID de medio son milisegundos desde la epoca de Instagram
(1314220021721 ms). Asi no hace falta abrir cada publicacion.
"""
import collections
import datetime as dt
import json
import re
import statistics
import sys
from pathlib import Path

ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
EPOCA_IG_MS = 1314220021721
TELEFONO = "3008905794"


def fecha_de_codigo(codigo):
    n = 0
    for ch in codigo[:11]:
        n = n * 64 + ALFABETO.index(ch)
    return dt.datetime.fromtimestamp(((n >> 23) + EPOCA_IG_MS) / 1000, dt.timezone.utc)


def cuenta(textos, patron):
    return sum(1 for t in textos if re.search(patron, t, re.I))


def main():
    ruta = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name("instagram-feed-parcial.json")
    posts = json.loads(ruta.read_text(encoding="utf-8"))
    for p in posts:
        p["fecha"] = fecha_de_codigo(p["code"])
        p["texto"] = p.get("texto") or ""
    textos = [p["texto"] for p in posts]
    total = len(posts)

    print(f"Publicaciones: {total}")
    print(f"Rango: {min(p['fecha'] for p in posts):%Y-%m-%d} a {max(p['fecha'] for p in posts):%Y-%m-%d}")
    print("Formatos:", dict(collections.Counter(p["tipo"] for p in posts)))
    print("Por mes:", dict(sorted(collections.Counter(f"{p['fecha']:%Y-%m}" for p in posts).items())))

    print("\n## Evolucion por año")
    for anio in sorted({p["fecha"].year for p in posts}):
        ts = [p["texto"] for p in posts if p["fecha"].year == anio]
        print(f"{anio}: {len(ts)} pub. | con hashtags {cuenta(ts, '#')} | ficha (3+ checks) "
              f"{sum(t.count('✅') >= 3 for t in ts)} | 'coordina tu visita' {cuenta(ts, 'coordina tu visita')} | "
              f"'como siempre encontrando' {cuenta(ts, 'como siempre encontrando')}")

    print("\n## Frases y llamados")
    frases = {
        "telefono correcto": TELEFONO,
        "coordina tu visita": r"coordina tu visita",
        "agenda tu cita/visita": r"agenda tu (cita|visita)",
        "como siempre encontrando las mejores propiedades": r"encontrando las mejores propiedades",
        "puede ser tuya": r"puede ser tuy",
        "se viene / proximamente": r"se viene|pr[oó]ximamente|muy pronto",
        "(negociables)": r"negociable",
        "cierres (vendida / nuevos propietarios)": r"vendid|nuevos (propietarios|compradores)|nueva compradora|cierre de negocio",
        "agradecimiento a Dios / bendiciones": r"\bdios\b|virgen|bendici",
        "voz plural (nuestro / equipo)": r"\bnuestr|nosotros|equipo",
        "renta / arriendo / canon": r"canon|\brenta\b|arriendo",
        "proyectos / sobre planos / preventa": r"sobre planos|proyecto|preventa|lanzamiento",
        "inversion": r"inversi[oó]n",
        "el verdadero lujo": r"el verdadero lujo",
        "'Está' por 'Esta' al inicio de frase": r"(^|\n)Está (hermosa|propiedad|casa|espectacular|impactante|exclusiva|sensacional|extraordinaria|imponente|increíble|fantástica|lujosa|inigualable)",
    }
    for nombre, patron in frases.items():
        print(f"{nombre}: {cuenta(textos, patron)}")
    malos = collections.Counter(m for t in textos for m in re.findall(r"30\d{8}", t) if m != TELEFONO)
    print("Telefonos mal escritos:", dict(malos))

    print("\n## Adjetivos de apertura")
    adjetivos = ["espectacular", "impactante", "extraordinari", "imponente", "sensacional", "magnífic",
                 "impresionante", "hermos", "exclusiv", "increíble", "majestuos", "locura", "sueño"]
    print({a: cuenta(textos, a) for a in adjetivos})

    print("\n## Emojis mas usados")
    emojis = collections.Counter(ch for t in textos for ch in t if ord(ch) > 0x2600 and not ch.isalnum())
    print(emojis.most_common(15))

    print("\n## Hashtags")
    print(collections.Counter(h.lower() for t in textos for h in re.findall(r"#\w+", t)).most_common(15))

    print("\n## Zonas (publicaciones que las mencionan)")
    zonas = {
        "Ruitoque": r"ruitoque", "Lagos del Cacique y conjuntos del lago": r"cacique|del lago",
        "Cañaveral": r"ca[ñn]averal", "Cartagena": r"cartagena", "Barú": r"bar[uú]",
        "Floridablanca": r"floridablanca", "Cabecera": r"cabecera", "Menzuly / Mensulí": r"menzul|mensul",
        "Mesa de los Santos": r"mesa de los santos|mesa los santos", "Panamá": r"panam|🇵🇦",
        "Piedecuesta": r"piedecuesta",
    }
    print({z: cuenta(textos, pat) for z, pat in zonas.items()})

    print("\n## Fichas (3 o mas checks)")
    fichas = [t for t in textos if t.count("✅") >= 3]
    campos = {
        "Área": r"✅\s*área", "Habitaciones": r"✅\s*habitaci", "(incluye servicio)": r"incluye servicio",
        "Baños": r"✅\s*baño", "Parqueaderos": r"parqueadero", "Depósito": r"dep[oó]sito",
        "Valor admon": r"admon|administraci", "Valor de venta": r"valor de venta|valor \$|precio",
        "(negociables)": r"negociable", "concepto abierto": r"concepto abierto", "BBQ": r"bbq|\bbq\b",
        "piscina": r"piscina", "jacuzzi": r"jacuzzi", "vista": r"vista", "paneles solares": r"paneles solares",
    }
    print(f"Fichas: {len(fichas)}")
    print({c: cuenta(fichas, pat) for c, pat in campos.items()})

    print("\n## Precios de venta (COP)")
    precios = {}
    for p in posts:
        nombre = re.sub(r"[^\w ]", "", p["texto"].strip().split("\n")[0].lower()).strip()[:40]
        for m in re.finditer(r"(venta|valor|precio)[^\n$]*\$\s?([\d.,]+)", p["texto"], re.I):
            if re.search(r"admon|administr|canon", m.group(0), re.I):
                continue
            valor = int(re.sub(r"\D", "", m.group(2)) or 0)
            if valor > 50_000_000:
                precios.setdefault(nombre, valor)
    valores = sorted(precios.values())
    if valores:
        print(f"Inmuebles con precio (deduplicados por titulo): {len(valores)}")
        print(f"Minimo {valores[0]:,} | mediana {statistics.median(valores):,.0f} | maximo {valores[-1]:,}")
        tramos = collections.Counter(
            "<500M" if v < 5e8 else "500-999M" if v < 1e9 else "1.000-1.999M" if v < 2e9
            else "2.000-3.999M" if v < 4e9 else ">=4.000M" for v in valores)
        print("Tramos:", dict(tramos))


if __name__ == "__main__":
    main()
