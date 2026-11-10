import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/package_pages.py'
HTML = b'<!doctype html><html><head></head><body>Test</body></html>'
EMPTY = {'schema_version': 1, 'messe': [], 'avvisi': [], 'volantini': [], 'contatti': {}}


class PackagePagesTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name) / 'root'
        self.root.mkdir()
        self.output = self.root / 'output'
        self.output.mkdir()
        (self.output / 'san-possidonio-v3.html').write_bytes(HTML)
        self.data = dict(EMPTY)
        self.destination = self.root / '_site'

    def run_package(self):
        (self.root / 'contenuti.json').write_text(json.dumps(self.data), encoding='utf-8')
        return subprocess.run([sys.executable, str(SCRIPT), '--root', str(self.root), '--destination', str(self.destination)], capture_output=True, text=True)

    def test_exports_only_referenced_files_with_exact_bytes(self):
        (self.output / 'docs').mkdir()
        (self.output / 'docs/festa.pdf').write_bytes(b'%PDF-fake')
        (self.output / 'secret.txt').write_bytes(b'secret')
        self.data['volantini'] = [{'titolo': 'Festa', 'file': 'docs/festa.pdf'}]
        result = self.run_package()
        self.assertEqual(result.returncode, 0, result.stderr)
        files = {str(p.relative_to(self.destination)): p.read_bytes() for p in self.destination.rglob('*') if p.is_file()}
        self.assertEqual(files, {'index.html': HTML, '.nojekyll': b'', 'docs/festa.pdf': b'%PDF-fake'})

    def test_rejects_duplicate_flyer_before_creation(self):
        flyer = self.output / 'festa.pdf'
        flyer.write_bytes(b'%PDF-fake')
        self.data['volantini'] = [{'titolo': 'Uno', 'file': 'festa.pdf'},
                                  {'titolo': 'Due', 'file': 'festa.pdf'}]
        result = self.run_package()
        self.assertNotEqual(result.returncode, 0, result.stderr)
        self.assertIn('duplicato', result.stderr.lower())
        self.assertFalse(self.destination.exists())
        self.assertEqual(flyer.read_bytes(), b'%PDF-fake')
        self.assertEqual((self.output / 'san-possidonio-v3.html').read_bytes(), HTML)

    def test_rejects_unsafe_or_missing_flyers_before_creation(self):
        for name in ('../outside.pdf', '/absolute.pdf', '.private/x.pdf', 'a//b.pdf', 'a/./b.pdf', 'x\\y.pdf', 'x:evil.pdf', 'x\n.pdf', 'x.html', 'missing.pdf', 'a/%2e%2e/b.pdf'):
            with self.subTest(name=name):
                self.data['volantini'] = [{'titolo': 'x', 'file': name}]
                result = self.run_package()
                self.assertNotEqual(result.returncode, 0)
                self.assertFalse(self.destination.exists())

    def test_rejects_bad_html_without_creating_destination(self):
        html = self.output / 'san-possidonio-v3.html'
        for value in (b'', b'not html', b'<html><body>incomplete'):
            with self.subTest(value=value):
                html.write_bytes(value)
                self.assertNotEqual(self.run_package().returncode, 0)
                self.assertFalse(self.destination.exists())

    def test_existing_destination_is_preserved(self):
        self.destination.mkdir()
        sentinel = self.destination / 'sentinel'
        sentinel.write_bytes(b'keep')
        self.assertNotEqual(self.run_package().returncode, 0)
        self.assertEqual({p.name: p.read_bytes() for p in self.destination.iterdir()}, {'sentinel': b'keep'})

    def test_dangling_destination_link_is_preserved(self):
        target = self.root / 'absent'
        self.destination.symlink_to(target)
        self.assertNotEqual(self.run_package().returncode, 0)
        self.assertTrue(self.destination.is_symlink())
        self.assertFalse(target.exists())

    def test_invalid_schema_and_missing_html_leave_no_destination(self):
        self.data['schema_version'] = True
        self.assertNotEqual(self.run_package().returncode, 0)
        self.assertFalse(self.destination.exists())
        self.data['schema_version'] = 1
        (self.output / 'san-possidonio-v3.html').unlink()
        self.assertNotEqual(self.run_package().returncode, 0)
        self.assertFalse(self.destination.exists())

    def test_flyer_symlink_is_rejected(self):
        (self.output / 'real.pdf').write_bytes(b'pdf')
        (self.output / 'link.pdf').symlink_to(self.output / 'real.pdf')
        self.data['volantini'] = [{'titolo': 'x', 'file': 'link.pdf'}]
        self.assertNotEqual(self.run_package().returncode, 0)
        self.assertFalse(self.destination.exists())

    def test_rejects_reserved_root_name_as_flyer_directory(self):
        (self.output / 'index.html').mkdir()
        (self.output / 'index.html/x.pdf').write_bytes(b'pdf')
        self.data['volantini'] = [{'titolo': 'x', 'file': 'index.html/x.pdf'}]
        self.assertNotEqual(self.run_package().returncode, 0)
        self.assertFalse(self.destination.exists())

    def test_rejects_build_info_root_namespace_before_creation(self):
        directory = self.output / 'build-info.json'
        directory.mkdir()
        flyer = directory / 'a.pdf'
        flyer.write_bytes(b'%PDF-fake')
        self.data['volantini'] = [{'titolo': 'x', 'file': 'build-info.json/a.pdf'}]
        result = self.run_package()
        self.assertNotEqual(result.returncode, 0, result.stderr)
        self.assertFalse(self.destination.exists())
        self.assertEqual(flyer.read_bytes(), b'%PDF-fake')
        self.assertEqual((self.output / 'san-possidonio-v3.html').read_bytes(), HTML)

    def test_rejects_destination_inside_source_tree(self):
        self.destination = self.output / 'deploy'
        result = self.run_package()
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.destination.exists())

    def test_rejects_symlinked_source_components(self):
        original = self.output / 'san-possidonio-v3.html'
        real = self.output / 'real.html'
        original.rename(real)
        original.symlink_to(real)
        self.assertNotEqual(self.run_package().returncode, 0)
        self.assertFalse(self.destination.exists())
