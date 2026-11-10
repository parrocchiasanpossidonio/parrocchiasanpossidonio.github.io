const object = (v, required, optional = []) => {
  if (!v || typeof v !== 'object' || Array.isArray(v) || required.some(k => !(k in v)) || Object.keys(v).some(k => ![...required, ...optional].includes(k))) throw Error('Schema non valido');
};
const text = v => { if (typeof v !== 'string' || !v.trim()) throw Error('Testo non valido'); };
export function adapt(d) {
  object(d, ['schema_version','messe','avvisi','volantini','contatti']);
  if (d.schema_version !== 1 || !['messe','avvisi','volantini'].every(k => Array.isArray(d[k]))) throw Error('Schema non valido');
  for (const x of d.messe) { object(x,['giorno','ora','luogo']); Object.values(x).forEach(text); }
  for (const x of d.avvisi) { object(x,['titolo','testo'],['data']); Object.values(x).forEach(text); if (x.data && (!/^\d{4}-\d{2}-\d{2}$/.test(x.data) || Number.isNaN(Date.parse(x.data)) || new Date(x.data).toISOString().slice(0,10) !== x.data)) throw Error('Data non valida'); }
  for (const x of d.volantini) {
    object(x, ['titolo', 'file']);
    text(x.titolo); text(x.file);
    const unsafe = /^[/.]|[\\?#:%\x00-\x1f\x7f]/.test(x.file)
      || x.file.split('/').some(part => !part || part.startsWith('.'))
      || !/\.(pdf|png|jpe?g|webp)$/i.test(x.file);
    if (unsafe) throw Error('Percorso non valido');
  }
  object(d.contatti, ['email','telefono','instagram','facebook','whatsapp']);
  for (const [k,v] of Object.entries(d.contatti)) {
    if (typeof v !== 'string') throw Error('Contatto non valido');
    if (!v) continue;
    if (k === 'email') { if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)) throw Error('Email non valida'); }
    else if (k === 'telefono') { if (!/^\+?[0-9][0-9 ()-]{4,24}$/.test(v)) throw Error('Telefono non valido'); }
    else {
      if (/[\x00-\x20\x7f]/.test(v)) throw Error('URL non valido');
      let u; try { u = new URL(v); } catch { throw Error('URL non valido'); }
      const domains = {instagram:['instagram.com','www.instagram.com'],facebook:['facebook.com','www.facebook.com'],whatsapp:['whatsapp.com','www.whatsapp.com']};
      if (u.protocol !== 'https:' || u.username || u.password || u.port || !domains[k].includes(u.hostname)) throw Error('URL non valido');
    }
  }
  return d;
}
