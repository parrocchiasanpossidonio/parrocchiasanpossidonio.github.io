"""Template contract for the second local preview; no network needed."""
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / 'templates' / 'site-v2.html'


class Structure(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
        self.resources = []
        self.h1s = 0
        self.lang = None
        self.elements = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append(tag)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'html':
            self.lang = attrs.get('lang')
        if tag == 'h1':
            self.h1s += 1
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
        for name in ('src', 'srcset', 'poster'):
            if name in attrs:
                self.resources.append(attrs[name])
        if tag == 'link':
            self.resources.append(attrs.get('href', ''))


class V2TemplateContract(unittest.TestCase):
    def test_portable_semantic_template_exposes_four_content_slots(self):
        self.assertTrue(TEMPLATE.is_file(), 'V2 template has not been built')
        text = TEMPLATE.read_text(encoding='utf-8')
        self.assertEqual(sorted(re.findall(r'\{\{[A-Z]+\}\}', text)),
                         ['{{AVVISI}}', '{{CONTATTI}}', '{{MESSE}}', '{{VOLANTINI}}'])
        doc = Structure()
        doc.feed(text)
        self.assertEqual(doc.lang, 'it')
        self.assertEqual(doc.h1s, 1)
        self.assertEqual(len(doc.ids), len(set(doc.ids)))
        for section in ('inizio', 'contenuto', 'messe', 'avvisi', 'volantini', 'contatti', 'privacy'):
            self.assertIn(section, doc.ids)
        for href in doc.links:
            self.assertTrue(href.startswith('#') and len(href) > 1, href)
            self.assertIn(href[1:], doc.ids)
        self.assertEqual(doc.resources, [])
        for forbidden in ('script', 'iframe', 'form', 'img'):
            self.assertNotIn(forbidden, doc.elements)
        for forbidden in ('https://', 'http://', '@import', 'url(', 'localStorage',
                          'sessionStorage', 'document.cookie', '.private/'):
            self.assertNotIn(forbidden, text)
        self.assertIn('Anteprima locale', text)
        self.assertIn('Informativa da completare', text)
        self.assertIn('prefers-reduced-motion', text)
        self.assertTrue(text.rstrip().endswith('</html>'))


if __name__ == '__main__':
    unittest.main(verbosity=2)
