"""Build the reference-based local preview; never deploys or installs packages."""
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def validate_content(root):
    """Reuse the canonical compiler's schema, URL and document checks."""
    root = Path(root)
    with tempfile.TemporaryDirectory(prefix='parish-content-preflight-') as directory:
        result = subprocess.run(
            [sys.executable, str(root / 'build.py'),
             '--data', str(root / 'contenuti.json'),
             '--template', str(root / 'templates/site-v2.html'),
             '--output', str(Path(directory) / 'validated.html')],
            capture_output=True, text=True,
        )
        if result.returncode:
            raise ValueError(result.stderr.strip() or 'Contenuti non validi')


def publish_built_html(source, target):
    """Replace just the local HTML after the entire frontend build succeeds."""
    import os
    source, target = Path(source), Path(target)
    if target.is_symlink() or (target.exists() and not target.is_file()):
        raise ValueError('La destinazione non è un file regolare')
    contents = source.read_bytes()
    if b'<html' not in contents or not contents.rstrip().endswith(b'</html>'):
        raise ValueError('La build non contiene un HTML completo')
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=target.parent, prefix='.v3-build-', delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(contents)
        os.replace(temporary, target)
        temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def validate_frontend_content(root):
    """Execute the same adapter that the browser will use before bundling."""
    result = subprocess.run(
        ['node', str(Path(root) / 'v3/scripts/validate-content.mjs')],
        capture_output=True, text=True,
    )
    if result.returncode:
        raise ValueError(result.stderr.strip() or 'Contenuti frontend non validi')


def build_project(root=ROOT):
    """Validate canonical data, typecheck, bundle, then publish only locally."""
    root = Path(root)
    validate_content(root)
    validate_frontend_content(root)
    frontend = root / 'v3'
    modules = frontend / 'node_modules'
    typecheck = modules / 'typescript/bin/tsc'
    vite = modules / 'vite/bin/vite.js'
    if not typecheck.is_file() or not vite.is_file():
        raise ValueError('Dipendenze mancanti: dalla cartella v3 eseguire npm ci --ignore-scripts --no-audit --no-fund')
    subprocess.run(['node', str(typecheck), '--noEmit', '-p', str(frontend / 'tsconfig.json')], cwd=frontend, check=True)
    subprocess.run(['node', str(vite), 'build', '--base=./'], cwd=frontend, check=True)
    output = root / 'output/san-possidonio-v3.html'
    publish_built_html(frontend / 'dist/index.html', output)
    return output


if __name__ == '__main__':
    try:
        artifact = build_project()
        print('Creato localmente: ' + str(artifact))
        print('Nessuna pubblicazione effettuata.')
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print('Errore: ' + str(error), file=sys.stderr)
        sys.exit(1)
