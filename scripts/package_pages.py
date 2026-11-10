#!/usr/bin/env python3
import argparse
import json
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(REPO))
from build import validate


def reject_symlinks(path):
    path = path.absolute()
    for component in (path, *path.parents):
        if component.is_symlink():
            raise ValueError('Link simbolico non consentito: ' + str(component))


def package(root, destination):
    reject_symlinks(root / 'contenuti.json')
    reject_symlinks(root / 'output' / 'san-possidonio-v3.html')
    reject_symlinks(destination)
    root = root.resolve()
    destination = destination.resolve()
    if destination == root or (root in destination.parents and destination.parent != root):
        raise ValueError('Destinazione nella directory sorgente')
    if destination.exists():
        raise ValueError('Destinazione già esistente')
    if not destination.parent.is_dir():
        raise ValueError('Directory padre inesistente')
    data = json.loads((root / 'contenuti.json').read_text(encoding='utf-8'))
    validate(data)
    output = root / 'output'
    html = (output / 'san-possidonio-v3.html').read_text(encoding='utf-8').lower()
    if not all(tag in html for tag in ('<!doctype html', '<html', '</html>', '<head', '</head>', '<body', '</body>')):
        raise ValueError('HTML incompleto')
    sources = []
    names = set()
    for flyer in data['volantini']:
        name = flyer['file']
        if name in names:
            raise ValueError('Volantino duplicato: ' + name)
        names.add(name)
        parts = name.split('/')
        if (parts[0].lower() in ('index.html', '.nojekyll', 'build-info.json')
                or any(not p or p.startswith('.') or any(c in p for c in ('\\', ':', '%')) or any(ord(c) < 32 or ord(c) == 127 for c in p) for p in parts)
                or Path(name).suffix.lower() not in ('.pdf', '.png', '.jpg', '.jpeg', '.webp')):
            raise ValueError('Percorso volantino non valido')
        source = output
        for part in parts:
            source = source / part
            if source.is_symlink():
                raise ValueError('Link simbolico non consentito')
        if not source.is_file():
            raise ValueError('Volantino inesistente')
        sources.append((name, source))
    destination.mkdir()
    shutil.copyfile(output / 'san-possidonio-v3.html', destination / 'index.html')
    (destination / '.nojekyll').touch()
    for name, source in sources:
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=REPO)
    parser.add_argument('--destination', type=Path)
    args = parser.parse_args()
    package(args.root, args.destination or args.root / '_site')


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, UnicodeError) as exc:
        print('Errore: ' + str(exc), file=sys.stderr)
        sys.exit(1)
