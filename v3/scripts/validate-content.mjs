import {readFileSync} from 'node:fs';
import {adapt} from '../src/data/adapter.mjs';

try {
  const data = JSON.parse(readFileSync(new URL('../../contenuti.json', import.meta.url), 'utf8'));
  adapt(data);
  console.log('Contenuti frontend verificati.');
} catch (error) {
  console.error('Contenuti frontend non validi: ' + error.message);
  process.exitCode = 1;
}
