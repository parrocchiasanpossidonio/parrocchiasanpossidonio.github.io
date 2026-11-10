import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "build.py"
MARKERS = " ".join("{{" + x + "}}" for x in ("MESSE", "AVVISI", "VOLANTINI", "CONTATTI"))
EMPTY = {"schema_version": 1, "messe": [], "avvisi": [], "volantini": [], "contatti": {}}

class BuildTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        shutil.copy(SCRIPT, self.root / "build.py")
        (self.root / "output").mkdir()
        self.data = self.root / "data.json"
        self.template = self.root / "template.html"
        self.output = self.root / "output/out.html"
        self.template.write_text(MARKERS, encoding="utf-8")

    def run_build(self, data):
        self.data.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        return subprocess.run([sys.executable, str(self.root / "build.py"), "--data", str(self.data), "--template", str(self.template), "--output", str(self.output)], capture_output=True, text=True)

    def test_populated_escaped(self):
        data = dict(EMPTY, messe=[{"giorno": "<Domenica>", "ora": "10:00", "luogo": "Chiesa & casa"}], avvisi=[{"titolo": "<Festa>", "testo": "prima\nseconda & amici", "data": "2026-11-10"}])
        result = self.run_build(data)
        self.assertEqual(result.returncode, 0, result.stderr)
        html = self.output.read_text(encoding="utf-8")
        for value in ("&lt;Domenica&gt;", "Chiesa &amp; casa", "&lt;Festa&gt;", "seconda &amp; amici", "2026-11-10", "mass-row", "notice-text"):
            self.assertIn(value, html)
        self.assertNotIn("<Festa>", html)

    def test_contacts_validation(self):
        data = dict(EMPTY, contatti={"email": "parrocchia@example.org", "telefono": "+39 123-456", "instagram": "https://www.instagram.com/example", "facebook": "", "whatsapp": ""})
        result = self.run_build(data)
        self.assertEqual(result.returncode, 0, result.stderr)
        html = self.output.read_text(encoding="utf-8")
        self.assertIn("mailto:parrocchia@example.org", html)
        self.assertIn("tel:+39123456", html)
        self.assertIn("https://www.instagram.com/example", html)
        for key, value in [("email", "a@b.org\nBcc:x"), ("telefono", "123;bad"), ("instagram", "https://instagram.com.evil.test/x"), ("facebook", "https://user@facebook.com/x"), ("whatsapp", "http://whatsapp.com/x")]:
            with self.subTest(key=key, value=value):
                result = self.run_build(dict(EMPTY, contatti={key: value}))
                self.assertNotEqual(result.returncode, 0)

    def test_flyers_paths(self):
        (self.root / "output" / "evento speciale.pdf").write_bytes(b"fixture")
        result = self.run_build(dict(EMPTY, volantini=[{"titolo": "Festa & amici", "file": "evento speciale.pdf"}]))
        self.assertEqual(result.returncode, 0, result.stderr)
        html = self.output.read_text(encoding="utf-8")
        self.assertIn("evento%20speciale.pdf", html)
        self.assertIn("Festa &amp; amici", html)
        for path in ("../x.pdf", "/x.pdf", "https://example.org/x.pdf", ".private/x.pdf", "missing.pdf", "x.html"):
            with self.subTest(path=path):
                self.assertNotEqual(self.run_build(dict(EMPTY, volantini=[{"titolo": "x", "file": path}])).returncode, 0)
        (self.root / "output/link.pdf").symlink_to(self.root / "output/evento speciale.pdf")
        self.assertNotEqual(self.run_build(dict(EMPTY, volantini=[{"titolo": "x", "file": "link.pdf"}])).returncode, 0)

    def test_invalid_data_preserves_output(self):
        cases = [dict(EMPTY, extra=1), dict(EMPTY, schema_version=True), dict(EMPTY, messe=[{"giorno": "x", "ora": "y", "luogo": "z", "oops": 1}]), dict(EMPTY, avvisi=[{"titolo": "x", "testo": "y", "data": "2026-02-30"}]), dict(EMPTY, contatti={"email": 0}), dict(EMPTY, volantini="x")]
        for data in cases:
            with self.subTest(data=data):
                self.output.write_text("previous", encoding="utf-8")
                result = self.run_build(data)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(self.output.read_text(), "previous")
                self.assertTrue(result.stderr.strip())

    def test_marker_validation_preserves_output(self):
        for template in (MARKERS.replace("{{MESSE}}", ""), MARKERS + " {{MESSE}}", MARKERS + " {{UNKNOWN}}"):
            with self.subTest(template=template):
                self.template.write_text(template)
                self.output.write_text("previous")
                self.assertNotEqual(self.run_build(EMPTY).returncode, 0)
                self.assertEqual(self.output.read_text(), "previous")

    def test_refuses_symlink_output(self):
        target = self.root / "untouched"
        target.write_text("previous")
        self.output.symlink_to(target)
        self.assertNotEqual(self.run_build(EMPTY).returncode, 0)
        self.assertEqual(target.read_text(), "previous")

    def test_user_content_cannot_change_other_sections(self):
        data = dict(EMPTY, messe=[{"giorno": "{{AVVISI}}", "ora": "10", "luogo": "<p class=\"empty-state\">Nessun volantino disponibile.</p>"}], avvisi=[{"titolo": "Avviso", "testo": "testo"}], volantini=[])
        result = self.run_build(data)
        self.assertEqual(result.returncode, 0, result.stderr)
        html = self.output.read_text()
        self.assertIn("{{AVVISI}}", html)
        self.assertEqual(html.count('class="notice"'), 1)

    def test_empty_contact_labels_are_legible_and_recipients_visible(self):
        result = self.run_build(EMPTY)
        self.assertEqual(result.returncode, 0, result.stderr)
        text = self.output.read_text()
        self.assertIn('<p class="empty-state">Recapiti in arrivo.</p>', text)
        self.assertEqual(text.count('class="contact-placeholder"'), 5)
        result = self.run_build(dict(EMPTY, contatti={"email": "redazione@example.invalid", "telefono": "+39 000 000"}))
        self.assertEqual(result.returncode, 0, result.stderr)
        text = self.output.read_text()
        self.assertIn('<span class="contact-value">redazione@example.invalid</span>', text)
        self.assertIn('<span class="contact-value">+39 000 000</span>', text)

    def test_default_cli_generates_offline_from_empty_canonical_data(self):
        source = ROOT / 'contenuti.json'
        self.assertTrue(source.is_file(), 'Canonical editable contents file is missing')
        defaults = json.loads(source.read_text())
        self.assertEqual(defaults['messe'], [])
        self.assertEqual(defaults['avvisi'], [])
        self.assertEqual(defaults['volantini'], [])
        self.assertTrue(all(value == '' for value in defaults['contatti'].values()))
        shutil.copy(source, self.root / 'contenuti.json')
        (self.root / 'templates').mkdir()
        shutil.copy(ROOT / 'templates/site-v2.html', self.root / 'templates/site-v2.html')
        result = subprocess.run([sys.executable, str(self.root / 'build.py')], cwd=self.tmp.name, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        output = (self.root / 'output/san-possidonio-v2.html').read_text()
        self.assertIn('Ci ritroviamo', output)
        self.assertNotIn('{{MESSE}}', output)
        self.assertNotIn('href="https://', output)

    def test_empty(self):
        result = self.run_build(EMPTY)
        self.assertEqual(result.returncode, 0, result.stderr)
        html = self.output.read_text(encoding="utf-8")
        self.assertIn("Orari in attesa di conferma.", html)
        self.assertIn("Il prossimo avviso troverà posto qui.", html)
        self.assertIn("Nessun volantino disponibile.", html)
        self.assertEqual(html.count("Recapiti in arrivo."), 1)
        self.assertNotIn("href=", html)

if __name__ == "__main__":
    unittest.main()
