"""Preflight and atomic publication contract for the reference-based local build."""
import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'build_v3.py'


def module():
    spec = importlib.util.spec_from_file_location('parish_build_v3', SCRIPT)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


class BuildV3Contract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        shutil.copy2(ROOT / 'build.py', self.root / 'build.py')
        (self.root / 'templates').mkdir()
        (self.root / 'templates/site-v2.html').write_text('{{MESSE}} {{AVVISI}} {{VOLANTINI}} {{CONTATTI}}')
        (self.root / 'output').mkdir()
        self.data = {'schema_version': 1, 'messe': [], 'avvisi': [], 'volantini': [], 'contatti': {}}

    def test_atomic_publication_preserves_bytes_and_refuses_symlink(self):
        source = self.root / 'built.html'
        source.write_bytes(b'<!doctype html><html lang="it"><body>fixture</body></html>')
        target = self.root / 'output/san-possidonio-v3.html'
        target.write_text('previous')
        module().publish_built_html(source, target)
        self.assertEqual(source.read_bytes(), target.read_bytes())
        self.assertFalse(list(target.parent.glob('.v3-build-*')))
        target.unlink()
        untouched = self.root / 'untouched.html'
        untouched.write_text('must remain')
        target.symlink_to(untouched)
        with self.assertRaises(ValueError):
            module().publish_built_html(source, target)
        self.assertEqual(untouched.read_text(), 'must remain')

    def test_full_build_stops_on_invalid_data_before_any_toolchain_is_required(self):
        self.data['contatti'] = {'email': 'not an email'}
        (self.root / 'contenuti.json').write_text(json.dumps(self.data))
        target = self.root / 'output/san-possidonio-v3.html'
        target.write_text('previous build')
        with self.assertRaises(ValueError) as caught:
            module().build_project(self.root)
        self.assertIn('Email non valida', str(caught.exception))
        self.assertEqual(target.read_text(), 'previous build')
        self.assertFalse((self.root / 'v3/dist').exists())

    def test_frontend_preflight_catches_stricter_schema_before_bundling(self):
        api = module()
        self.assertTrue(hasattr(api, 'validate_frontend_content'), 'Frontend preflight is missing')
        self.data['contatti'] = {'email': '', 'telefono': '1', 'instagram': '', 'facebook': '', 'whatsapp': ''}
        (self.root / 'contenuti.json').write_text(json.dumps(self.data))
        for rel in ['v3/scripts/validate-content.mjs', 'v3/src/data/adapter.mjs']:
            target = self.root / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / rel, target)
        api.validate_content(self.root)
        with self.assertRaises(ValueError) as caught:
            api.validate_frontend_content(self.root)
        self.assertIn('Telefono non valido', str(caught.exception))
        self.assertFalse((self.root / 'v3/dist').exists())

    def test_canonical_preflight_rejects_invalid_data_without_changing_existing_html(self):
        self.assertTrue(SCRIPT.is_file(), 'V3 build pipeline has not been written')
        self.data['unexpected'] = 'not allowed'
        (self.root / 'contenuti.json').write_text(json.dumps(self.data))
        target = self.root / 'output/san-possidonio-v3.html'
        target.write_text('previous build')
        before = sorted(str(p.relative_to(self.root)) for p in self.root.rglob('*'))
        with self.assertRaises(ValueError) as caught:
            module().validate_content(self.root)
        self.assertIn('sconosciuti', str(caught.exception))
        self.assertEqual(target.read_text(), 'previous build')
        self.assertEqual(sorted(str(p.relative_to(self.root)) for p in self.root.rglob('*')), before)


if __name__ == '__main__':
    unittest.main(verbosity=2)
