import argparse
import json
import html
import re
import os
import sys
import tempfile
from datetime import date
from urllib.parse import urlsplit, quote
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def validate(data):
    def obj(value, required, optional, where):
        if not isinstance(value, dict):
            raise ValueError(where + ": deve essere un oggetto")
        missing, extra = required - value.keys(), value.keys() - required - optional
        if missing or extra:
            raise ValueError(where + ": campi mancanti " + str(sorted(missing)) + "; campi sconosciuti " + str(sorted(extra)))
    obj(data, {"schema_version", "messe", "avvisi", "volantini", "contatti"}, set(), "radice")
    if type(data["schema_version"]) is not int or data["schema_version"] != 1:
        raise ValueError("schema_version deve essere 1")
    for section, fields, optional in (("messe", {"giorno", "ora", "luogo"}, set()), ("avvisi", {"titolo", "testo"}, {"data"}), ("volantini", {"titolo", "file"}, set())):
        if not isinstance(data[section], list):
            raise ValueError(section + ": deve essere una lista")
        for row in data[section]:
            obj(row, fields, optional, section)
            if any(not isinstance(v, str) for v in row.values()):
                raise ValueError(section + ": i campi devono essere stringhe")
            if section == "avvisi" and "data" in row:
                value = row["data"]
                if not re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", value):
                    raise ValueError("Data non valida: usare AAAA-MM-GG")
                date.fromisoformat(value)
    obj(data["contatti"], set(), {"email", "telefono", "instagram", "facebook", "whatsapp"}, "contatti")
    if any(not isinstance(v, str) for v in data["contatti"].values()):
        raise ValueError("I contatti devono essere stringhe")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--data", type=Path, default=ROOT / "contenuti.json")
    p.add_argument("--template", type=Path, default=ROOT / "templates/site-v2.html")
    p.add_argument("--output", type=Path, default=ROOT / "output/san-possidonio-v2.html")
    a = p.parse_args()
    with a.data.open("rb") as stream:
        raw = stream.read(1024 * 1024 + 1)
    if len(raw) > 1024 * 1024:
        raise ValueError("File dati oltre 1 MiB")
    data = json.loads(raw.decode("utf-8"))
    validate(data)
    text = a.template.read_text(encoding="utf-8")
    for marker in ("MESSE", "AVVISI", "VOLANTINI", "CONTATTI"):
        if text.count("{{" + marker + "}}") != 1:
            raise ValueError("Segnaposto mancante o duplicato: " + marker)
    if re.search(r"{{.*?}}", re.sub(r"{{(?:MESSE|AVVISI|VOLANTINI|CONTATTI)}}", "", text), re.S):
        raise ValueError("Segnaposto sconosciuto")
    for marker, value in {"MESSE": "<p class=\"empty-state\">Orari in attesa di conferma.</p>", "AVVISI": "<p class=\"empty-state\">Il prossimo avviso troverà posto qui.</p>", "VOLANTINI": "<p class=\"empty-state\">Nessun volantino disponibile.</p>", "CONTATTI": "<p>Recapiti in arrivo.</p>"}.items():
        text = text.replace("{{" + marker + "}}", value)
    if data["messe"]:
        rows = []
        for m in data["messe"]:
            rows.append('<div class="mass-row"><span class="mass-day">' + html.escape(m["giorno"]) + '</span><span class="mass-time">' + html.escape(m["ora"]) + '</span><span class="mass-place">' + html.escape(m["luogo"]) + '</span></div>')
        text = text.replace('<p class="empty-state">Orari in attesa di conferma.</p>', "".join(rows))
    if data["avvisi"]:
        rows = []
        for n in data["avvisi"]:
            rows.append('<article class="notice"><div class="notice-date">' + html.escape(n.get("data", "")) + '</div><h3>' + html.escape(n["titolo"]) + '</h3><div class="notice-text" style="white-space: pre-wrap">' + html.escape(n["testo"]) + '</div></article>')
        text = text.replace('<p class="empty-state">Il prossimo avviso troverà posto qui.</p>', "".join(rows))
    flyers = []
    for f in data["volantini"]:
        name = f["file"]
        parts = name.split("/")
        if not name or any(not part or part in (".", "..") or part.startswith(".") or "\\" in part or ":" in part or any(ord(c) < 32 or ord(c) == 127 for c in part) for part in parts) or Path(name).suffix.lower() not in (".pdf", ".png", ".jpg", ".jpeg", ".webp"):
            raise ValueError("Percorso volantino non valido")
        target = ROOT / "output"
        if target.is_symlink():
            raise ValueError("Directory output non valida")
        for part in parts:
            target = target / part
            if target.is_symlink():
                raise ValueError("Link simbolico non consentito")
        if not target.is_file():
            raise ValueError("Volantino inesistente")
        href = quote(os.path.relpath(target, a.output.parent), safe="/")
        flyers.append('<a class="document-link" href="' + html.escape(href, quote=True) + '">' + html.escape(f["titolo"]) + '</a>')
    if flyers:
        text = text.replace('<p class="empty-state">Nessun volantino disponibile.</p>', "".join(flyers))
    contacts = data["contatti"]
    entries = []
    for key, label in (("email", "Email"), ("telefono", "Telefono"), ("instagram", "Instagram"), ("facebook", "Facebook"), ("whatsapp", "WhatsApp")):
        value = contacts.get(key, "")
        if not value:
            entries.append('<span class="contact-placeholder">' + label + '</span>')
            continue
        if key == "email":
            if not re.fullmatch(r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+", value):
                raise ValueError("Email non valida")
            href = "mailto:" + quote(value, safe="@._+-")
        elif key == "telefono":
            if not re.fullmatch(r"\+?[0-9][0-9 ()-]*", value):
                raise ValueError("Telefono non valido")
            href = "tel:" + re.sub(r"[ ()-]", "", value)
        else:
            u = urlsplit(value)
            if u.scheme != "https" or u.netloc.lower() not in (key + ".com", "www." + key + ".com", key + ".com:443", "www." + key + ".com:443") or any(ord(c) < 33 or ord(c) == 127 for c in value):
                raise ValueError("Link " + key + " non valido")
            href = value
        display = value if key in ("email", "telefono") else 'Apri canale ↗'
        entries.append('<a class="contact-link" href="' + html.escape(href, quote=True) + '"><span>' + label + '</span><span class="contact-value">' + html.escape(display) + '</span></a>')
    if any(contacts.get(k, "") for k in ("email", "telefono", "instagram", "facebook", "whatsapp")):
        text = text.replace('<p>Recapiti in arrivo.</p>', " ".join(entries))
    else:
        text = text.replace('<p>Recapiti in arrivo.</p>', '<p class="empty-state">Recapiti in arrivo.</p>' + " ".join(entries))
    if a.output.is_symlink() or (a.output.exists() and not a.output.is_file()):
        raise ValueError("Output non è un file regolare o è un link simbolico")
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=a.output.parent, prefix=".build-", delete=False) as stream:
            temporary = stream.name
            stream.write(text)
        os.replace(temporary, a.output)
        temporary = None
    finally:
        if temporary is not None:
            os.unlink(temporary)

if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, UnicodeError) as exc:
        print("Errore: " + str(exc), file=sys.stderr)
        sys.exit(1)
