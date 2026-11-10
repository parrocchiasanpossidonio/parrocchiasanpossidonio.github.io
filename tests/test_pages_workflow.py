"""Structural contract for the least-privilege Pages workflow (stdlib only)."""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class PagesWorkflowTests(unittest.TestCase):
    def test_approved_changes_are_built_before_only_the_staged_site_is_uploaded(self):
        workflow = ROOT / '.github/workflows/pages.yml'
        self.assertTrue(workflow.is_file(), 'Automatic publication workflow is missing')
        text = workflow.read_text(encoding='utf-8')
        for command in (
            'python -m unittest discover -s tests -v',
            'node --test v3/tests/adapter.test.mjs',
            'npm ci --ignore-scripts --no-audit --no-fund',
            'python build_v3.py',
            'python scripts/package_pages.py',
        ):
            self.assertIn(command, text)
        self.assertIn('path: _site', text)
        self.assertNotRegex(text, r'path: [\'\"]?\.[\'\"]?\s*\n')
        self.assertIn('needs: build', text)
        self.assertIn('pages: write', text)
        self.assertIn('id-token: write', text)
        self.assertNotIn('contents: write', text)
        self.assertNotIn('pull_request_target', text)
        self.assertIn('github.ref == \'refs/heads/main\'', text)
        self.assertIn('github.event_name != \'pull_request\'', text)
        uses = re.findall(r'^\s*(?:- )?uses:\s*(\S+)', text, re.M)
        self.assertGreaterEqual(len(uses), 6)
        for action in uses:
            self.assertRegex(action, r'^actions/[a-z-]+@[0-9a-f]{40}$')


if __name__ == '__main__':
    unittest.main()
