/* ================= DATOS ================= */
const TYPES = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
const TYPE_COLOR = {
  normal:'#9fa19f',
  fire:'#e62829',
  water:'#2980ef',
  electric:'#fac000',
  grass:'#3fa129',
  ice:'#3dcef3',
  fighting:'#ff8000',
  poison:'#9141cb',
  ground:'#915121',
  flying:'#6890a0',
  psychic:'#fa1088',
  bug:'#91a119',
  rock:'#afa981',
  ghost:'#704170',
  dragon:'#5060e1',
  dark:'#50413f',
  steel:'#60a1b8',
  fairy:'#ef70ef'
};
const TYPE_EN = {
  normal:'Normal',
  fire:'Fuego',
  water:'Agua',
  electric:'Eléctrico',
  grass:'Planta',
  ice:'Hielo',
  fighting:'Lucha',
  poison:'Tóxico',
  ground:'Tierra',
  flying:'Volador',
  psychic:'Psíquico',
  bug:'Bicho',
  rock:'Roca',
  ghost:'Fantasma',
  dragon:'Dragón',
  dark:'Siniestro',
  steel:'Acero',
  fairy:'Hada'
};
const DEF = {
  normal:{rock:.5,ghost:0,steel:.5},
  fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},
  water:{fire:2,water:.5,grass:.5,ground:2,dragon:.5,rock:2},
  electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},
  grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},
  ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},
  fighting:{normal:2,ice:2,poison:.5,flying:.5,psychic:.5,bug:.5,rock:2,ghost:0,dark:2,steel:2,fairy:.5},
  poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},
  ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},
  flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5},
  psychic:{fighting:2,poison:2,psychic:.5,steel:.5,dark:0},
  bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},
  rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},
  ghost:{normal:0,psychic:2,ghost:2,dark:.5},
  dragon:{dragon:2,steel:.5,fairy:.5},
  dark:{psychic:2,ghost:2,fighting:.5,dark:.5,fairy:.5},
  steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,steel:.5,fairy:2},
  fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5}
};
const STATS = ['hp','atk','def','spa','spd','spe'];
const STAT_ES = { hp:'PS', atk:'Atq', def:'Def', spa:'At.E', spd:'Def.E', spe:'Vd' };
const NATURES = ['Adamant','Brave','Jolly','Timid','Modest','Careful','Impish','Bold','Calm','Sassy','Lax','Naive','Naughty','Rash','Lonely','Quiet','Hasty','Gentle','Mild','Hardy','Docile','Serious','Bashful','Quirky','Relaxed'];
const NAT_ES = {
  Adamant:'Firme',
  Brave:'Audaz',
  Jolly:'Alegre',
  Timid:'Miedosa',
  Modest:'Modesta',
  Careful:'Cauta',
  Impish:'Agitada',
  Bold:'Osada',
  Calm:'Serena',
  Sassy:'Maleducada',
  Lax:'Flácida',
  Naive:'Ingenua',
  Naughty:'Pícara',
  Rash:'Mansa',
  Lonely:'Sola',
  Quiet:'Quieta',
  Hasty:'Ligera',
  Gentle:'Amable',
  Mild:'Cobardona',
  Hardy:'Dura',
  Docile:'Dócil',
  Serious:'Seria',
  Bashful:'Tímida',
  Quirky:'Rara',
  Relaxed:'Plácida'
};
const NMOD = {
  Adamant:['atk','spa'],
  Brave:['atk','spe'],
  Jolly:['spe','spa'],
  Timid:['spe','atk'],
  Modest:['spa','atk'],
  Careful:['spd','spa'],
  Impish:['def','spa'],
  Bold:['def','atk'],
  Calm:['spd','atk'],
  Sassy:['spd','def'],
  Lax:['def','spd'],
  Naive:['spe','spd'],
  Naughty:['atk','spd'],
  Rash:['spa','spd'],
  Lonely:['atk','def'],
  Quiet:['spa','spe'],
  Hasty:['spe','def'],
  Gentle:['spd','def'],
  Mild:['spa','def'],
  Hardy:[],
  Docile:[],
  Serious:[],
  Bashful:[],
  Quirky:[],
  Relaxed:['def','spe']
};
const SD = 'https://play.pokemonshowdown.com/sprites';

function slug(s) {
  return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function pokeSlug(n, f) {
  const F = {
    'oricorio-baile':'oricorio',
    'oricorio-pom-pom':'oricorio-pom-p',
    'necrozma-dusk-mane':'necrozma-dusk',
    'necrozma-dawn-wings':'necrozma-dawn',
    'maushold-family-of-three':'maushold-family'
  };
  let b = slug(n);
  if (f && f !== '') {
    let fs = slug(f);
    if (fs === b) return b;
    if (fs.startsWith(b + '-')) return F[fs] || fs;
    return F[b + '-' + fs] || (b + '-' + fs);
  }
  return F[b] || b;
}

function typeColor(t) { return TYPE_COLOR[t] || '#61738f' }
function typeES(t) { return TYPE_EN[t] || t }

function eff(a, d) {
  let m = 1;
  for (const x of a) {
    if (!DEF[x]) continue;
    for (const y of d) m *= (DEF[x][y] ?? 1);
  }
  return m;
}

function statColor(v) {
  return v >= 75 ? '#73d240' : v >= 50 ? '#f4d23c' : v >= 25 ? '#f4a23c' : '#f4463f';
}

function finalStat(base, stat, iv, ev, nature, level) {
  level = level || 100;
  const mod = NMOD[nature] || [];
  let m = 1;
  if (mod[0] === stat) m = 1.1;
  if (mod[1] === stat) m = 0.9;
  if (stat === 'hp') return Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
  return Math.floor((Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5) * m);
}

/* ================= CACHE / AJUSTES ================= */
const DexCache = { pokemon:null, items:null, details:{} };
let dexIndexCache = {};
const Settings = Object.assign(
  { sprite:'showdown', shiny:false, size:6, name:'' },
  JSON.parse(localStorage.getItem('cpaste.settings') || '{}')
);

function saveSettings() {
localStorage.setItem('cpaste.settings', JSON.stringify(Settings));
}

/* ================= SPRITES / IMÁGENES ================= */
function spriteShowdown(n, f, st, sh) {
  st = st || Settings.sprite;
  const s = pokeSlug(n, f);
  const map = {
    showdown:'pokemon',
    pokemon:'pokemon',
    gen5:'gen5',
    ani:'gen5ani',
    gen5ani:'gen5ani',
    xy:'xy',
    orig:'orig',
    xyani:'xyani'
  };
  let dir = map[st] || 'pokemon';
  const gif = dir === 'gen5ani' || dir === 'xyani';
  let path = dir;

  if (sh) {
    if (dir === 'pokemon') path = 'pokemon-shiny';
    else if (dir === 'xy') path = 'xy-shiny';
    else if (dir === 'xyani') path = 'xyani-shiny';
    else if (dir === 'gen5ani') path = 'gen5ani/shiny';
    else path = dir + '/shiny';
  }

  return SD + '/' + path + '/' + s + (gif ? '.gif' : '.png');
}

function spritePokeAPI(n, sh) {
  const id = idByName(n);
  if (!id) return '';
  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (sh ? 'shiny/' : '') + id + '.png';
}

function itemShowdown(n) {
  return SD + '/itemicons/' + slug(n).replace(/-/g, '') + '.png';
}

function itemPokeAPI(n) {
  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/' + slug(n) + '.png';
}

function canonSpecies(t) {
  const sl = slug(t);
  if (!sl) return '';
  const p = (DexCache.pokemon || []).find(x => x.name === sl);
  if (p) return p.name;
  for (const k in dexIndexCache) {
    if (slug(k) === sl && dexIndexCache[k] && dexIndexCache[k].id) return k;
  }
  return '';
}

function idByName(name) {
  const raw = String(name || '').trim();
  if (!raw) return null;
  const sl = slug(raw);
  if (DexCache.details[raw] && DexCache.details[raw].id) return DexCache.details[raw].id;
  if (DexCache.details[sl] && DexCache.details[sl].id) return DexCache.details[sl].id;
  const exact = (DexCache.pokemon || []).find(p => p.name === sl);
  if (exact) return exact.id;
  if (raw.includes('-')) {
    const base = slug(raw.split('-')[0]);
    const b = (DexCache.pokemon || []).find(p => p.name === base);
    if (b) return b.id;
  }
  for (const k in dexIndexCache) {
    if (slug(k) === sl && dexIndexCache[k] && dexIndexCache[k].id) return dexIndexCache[k].id;
  }
  const num = Number(raw);
  if (num) return num;
  return null;
}

function spriteCandidates(n, f) {
  const out = [];
  const add = x => {
    x = String(x || '').trim();
    if (x && !out.includes(x)) out.push(x);
  };

  if (f) add(pokeSlug(n, f));
  add(n);

  const sl = slug(n);
  add(sl);

  const nos = sl.replace(/-/g, '');
  if (nos) add(nos);

  const parts = sl.split('-');
  if (parts.length > 1) {
    const base = parts[0];
    const suffix = parts.slice(1).join('-');
    add(base + '-' + suffix);
    if (base === 'ogerpon' && !suffix.includes('mask')) add(base + '-' + suffix + '-mask');
    add(base);
  }

  if (f) {
    const b = slug(n);
    const fs = slug(f);
    if (fs) add(b + '-' + fs);
  }

  const FORMS = {
    oricorio:['oricorio-pom-p','oricorio-pau','oricorio-sensu','oricorio'],
    maushold:['maushold-family','maushold'],
    basculegion:['basculegion-f','basculegion-m'],
    tatsugiri:['tatsugiri-droopy','tatsugiri-stretchy','tatsugiri'],
    squawkabilly:['squawkabilly-plum','squawkabilly-white','squawkabilly-blue','squawkabilly']
  };
  const base = sl.split('-')[0];
  if (FORMS[base]) {
    for (const fm of FORMS[base]) add(fm);
  }
  return out;
}

function spr(n, f, style, sh) {
  n = String(n || '').trim();
  if (!n) return '';
  const st = style || Settings.sprite;
  const shine = !!sh;
  const urls = [];

  for (const cand of spriteCandidates(n, f)) {
    urls.push(spriteShowdown(cand, '', st, shine));
    urls.push(spriteShowdown(cand, '', st, !shine));
  }

  urls.push(spritePokeAPI(n, shine));
  urls.push(spritePokeAPI(n, false));

  const base = n.split('-')[0];
  if (base !== n) {
    urls.push(spritePokeAPI(base, false));
    urls.push(spritePokeAPI(base, true));
  }

  const uniq = [...new Set(urls.filter(Boolean))];
  if (!uniq.length) return '';

  return '<img loading="lazy" src="' + uniq[0] + '" data-urls="' + esc(uniq.slice(1).join('|')) + '" onerror="imgNext(this)" alt="' + esc(n) + '">';
}

function itemImg(n) {
  if (!n) return '';
  const a = slug(n);
  const b = a.replace(/-/g, '');
  const urls = [
    SD + '/itemicons/' + b + '.png',
    SD + '/itemicons/' + a + '.png',
    itemPokeAPI(n)
  ];
  return '<img loading="lazy" src="' + urls[0] + '" data-urls="' + esc(urls.slice(1).join('|')) + '" onerror="imgNext(this)" alt="' + esc(n) + '">';
}

function imgNext(img) {
  const u = (img.dataset.urls || '').split('|').filter(Boolean);
  if (!u.length) {
    img.style.visibility = 'hidden';
    return;
  }
  img.src = u.shift();
  img.dataset.urls = u.join('|');
}

async function copy(t) {
  try {
    await navigator.clipboard.writeText(t);
    toast('Copiado', 'ok');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    toast('Copiado', 'ok');
  }
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/* ================= PARSE / EXPORT ================= */
function blank() {
  return {
    species:'',
    nickname:'',
    gender:'',
    item:'',
    ability:'',
    nature:'',
    tera:'',
    level:100,
    shiny:false,
    evs:{},
    ivs:{},
    moves:[],
    form:''
  };
}

function normKey(s) {
  s = String(s || '').toLowerCase().replace(/[^a-z]/g, '');
  if (s === 'hp') return 'hp';
  if (s === 'atk' || s === 'attack') return 'atk';
  if (s === 'def' || s === 'defense') return 'def';
  if (s === 'spa' || s === 'spatk' || s === 'specialattack') return 'spa';
  if (s === 'spd' || s === 'spdef' || s === 'specialdefense') return 'spd';
  if (s === 'spe' || s === 'speed') return 'spe';
  return null;
}

function parseStatLine(t) {
  const o = {};
  for (const p of t.split('/')) {
    const m = p.trim().match(/^(\d+)\s+(.+)$/);
    if (!m) continue;
    const k = normKey(m[2]);
    if (k) o[k] = +m[1];
  }
  return o;
}

function parseHeader(str, s) {
  if (/^Shiny\s+/i.test(str)) {
    s.shiny = true;
    str = str.replace(/^Shiny\s+/i, '');
  }

  const at = str.indexOf('@');
  if (at > -1) {
    s.item = str.slice(at + 1).replace(/\s+/g, ' ').trim();
    str = str.slice(0, at).trim();
  }

  const parens = [...str.matchAll(/\(([^)]*)\)/g)].map(m => m[1]);
  str = str.replace(/\([^)]*\)/g, '').trim();

  const names = DexCache.pokemon ? new Set(DexCache.pokemon.map(p => p.name)) : null;
  const isPoke = r => {
    if (!r) return false;
    const sl = slug(r);
    if (names && names.has(sl)) return true;
    const d = dexIndexCache[r] || dexIndexCache[sl];
    return !!(d && d.id);
  };

  const base = slug(str);
  const part = base.includes('-') ? base.split('-')[1] : '';

  if (!isPoke(str) && parens.length) {
    const pi = parens.findIndex(p => !/^[MFN]$/i.test(p) && isPoke(p));
    if (pi > -1) {
      if (str) s.nickname = str;
      s.species = parens[pi];
      for (const p of parens) if (/^[MFN]$/i.test(p)) s.gender = p.toUpperCase();
      return;
    }
  }

  for (const p of parens) {
    const pp = String(p).trim();
    if (/^[MFN]$/i.test(pp)) {
      s.gender = pp.toUpperCase();
      continue;
    }
    const ps = slug(pp);
    if (part && (ps.includes(part) || part.includes(ps))) continue;
    s.nickname = pp;
  }

  s.species = str;
}

function parseTeam(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n');
  const sets = [];
  let cur = null;

  const flush = () => {
    if (cur && cur.species) sets.push(cur);
    cur = null;
  };

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) continue;

    if (t.startsWith('- ')) {
      if (!cur) cur = blank();
      cur.moves.push(t.slice(2).trim());
      continue;
    }
    if (t === '-') continue;

    if (/^Ability\s*:/i.test(t)) {
      if (!cur) cur = blank();
      cur.ability = t.slice(t.indexOf(':') + 1).trim();
      continue;
    }
    if (/^Tera\s*Type\s*:/i.test(t)) {
      if (!cur) cur = blank();
      cur.tera = t.slice(t.indexOf(':') + 1).trim().toLowerCase();
      continue;
    }
    if (/^Level\s*:/i.test(t)) {
      if (!cur) cur = blank();
      cur.level = parseInt(t.replace(/\D+/g, ''), 10) || 100;
      continue;
    }
    if (/^Shiny\s*:/i.test(t)) {
      if (!cur) cur = blank();
      cur.shiny = /yes/i.test(t);
      continue;
    }
    if (/^EVs?\s*:/i.test(t)) {
      if (!cur) cur = blank();
      cur.evs = parseStatLine(t.replace(/^EVs?\s*:/i, ''));
      continue;
    }
    if (/^IVs?\s*:/i.test(t)) {
      if (!cur) cur = blank();
      cur.ivs = parseStatLine(t.replace(/^IVs?\s*:/i, ''));
      continue;
    }
    if (/Nature$/i.test(t)) {
      if (!cur) cur = blank();
      cur.nature = t.replace(/\s*Nature$/i, '').trim();
      continue;
    }

    flush();
    cur = blank();
    parseHeader(t, cur);
  }

  flush();
  return sets.filter(s => s.species);
}

function fmtStats(o) {
  const lbl = { hp:'HP', atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe' };
  return STATS.filter(k => o && o[k]).map(k => o[k] + ' ' + lbl[k]).join(' / ');
}

function exportTeam(sets) {
  return sets.map(s => {
    const L = [];
    let head = s.species;
    if (s.nickname) head += ' (' + s.nickname + ')';
    else if (s.gender) head += ' (' + s.gender + ')';
    if (s.item) head += ' @ ' + s.item;
    L.push(head);
    if (s.ability) L.push('Ability: ' + s.ability);
    if (s.shiny) L.push('Shiny: Yes');
    if (s.tera) L.push('Tera Type: ' + (s.tera[0] ? s.tera[0].toUpperCase() + s.tera.slice(1) : s.tera));
    if (s.level && s.level !== 100) L.push('Level: ' + s.level);
    const ev = fmtStats(s.evs);
    if (ev) L.push('EVs: ' + ev);
    const iv = fmtStats(s.ivs);
    if (iv) L.push('IVs: ' + iv);
    if (s.nature) L.push(s.nature + ' Nature');
    for (const mv of (s.moves || [])) if (mv) L.push('- ' + mv);
    return L.join('\n');
  }).join('\n\n') + '\n';
}

function evTotal(s) {
  return STATS.reduce((a, k) => a + ((s.evs && s.evs[k]) || 0), 0);
}

function setEV(s, key, val) {
  if (!s.evs) s.evs = {};
  val = Math.max(0, Math.min(252, val | 0));
  const others = STATS.reduce((a, k) => a + ((k === key) ? 0 : (s.evs[k] || 0)), 0);
  val = Math.min(val, Math.max(0, 508 - others));
  s.evs[key] = val;
  return val;
}

/* ================= ANÁLISIS ================= */
const moveTypeCache = {};

function guessMoveType(mv, types) {
  const l = mv.toLowerCase();
  for (const t of types) if (l.includes(t)) return t;
  return types[0] || 'normal';
}

function roleOf(s) {
  const mv = (s.moves || []).join(' ').toLowerCase();
  const sp = (s.evs && s.evs.spe) || 0;
  const bulk = s.stats ? ((s.stats.hp || 0) + (s.stats.def || 0) + (s.stats.spd || 0)) : 0;

  if (/stealth rock|spikes|toxicspikes|sticky web|tailwind|reflect|lightscreen|wish|memento/.test(mv)) return { role:'Soporte', icon:'🛡️' };
  if (/swords dance|dragon dance|calm mind|nasty plot|shell smash|quiver dance|curse/.test(mv)) return { role:'Setup Sweeper', icon:'⚔️' };
  if (/uturn|volt switch|flip turn|parting shot|baton pass/.test(mv)) return { role:'Pivot', icon:'🔄' };
  if (/recover|roost|slack off|rest|moonlight|synthesis|shore up|wish/.test(mv) && bulk > 240) return { role:'Wall', icon:'🧱' };
  if (sp >= 200) return { role:'Fast Sweeper', icon:'⚡' };
  if (/earthquake|close combat|flamethrower|hydropump|ice beam|thunderbolt|choice/.test(mv)) return { role:'Atacante', icon:'🎯' };
  return { role:'Equilibrado', icon:'🧩' };
}

function bestCounters(mine, enemy, dex) {
  return mine.map(m => {
    const mt = (dex[m.species] && dex[m.species].types) || [];
    let best = null;
    let bs = -1;

    for (const e of enemy) {
      const et = (dex[e.species] && dex[e.species].types) || [];
      if (!et.length) continue;
      const off = Math.max(1, ...(e.moves || []).map(mv => eff([moveTypeCache[mv] || guessMoveType(mv, et)], mt)));
      const def = eff(mt, et) || 1;
      const sc = off / def;
      if (sc > bs) {
        bs = sc;
        best = e;
      }
    }

    return { mon:m, counter:best };
  });
}

function teamSummary(sets, dex) {
  const types = {};
  let atk = 0, def = 0, spd = 0, spe = 0, hp = 0;

  sets.forEach(s => {
    const d = dex[s.species] || {};
    (d.types || []).forEach(t => types[t] = (types[t] || 0) + 1);
    const st = d.stats || {};
    atk += st.atk || 0;
    def += st.def || 0;
    spd += st.spd || 0;
    spe += st.spe || 0;
    hp += st.hp || 0;
  });

  const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]);
  return {
    main: sorted.slice(0, 3).map(e => e[0]),
    avg: {
      atk: Math.round(atk / Math.max(1, sets.length)),
      def: Math.round(def / Math.max(1, sets.length)),
      spd: Math.round(spd / Math.max(1, sets.length)),
      spe: Math.round(spe / Math.max(1, sets.length)),
      hp: Math.round(hp / Math.max(1, sets.length))
    }
  };
}

/* ================= STORE ================= */
const Store = (() => {
  const mode = 'relay';
  let relayUrl = localStorage.getItem('cpaste.relay') || 'https://ciega-relay.santimartinezcordoba.workers.dev';
  const L = new Set();
  const emit = () => L.forEach(f => f());
  const on = f => {
    L.add(f);
    return () => L.delete(f);
  };

  async function rel(p, b) {
    const r = await fetch(relayUrl.replace(/\/$/, '') + p, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(b)
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = new Error(j.error || ('HTTP ' + r.status));
      err.status = r.status;
      throw err;
    }
    return j;
  }

  return {
    mode,
    get relayUrl() { return relayUrl },
    set relayUrl(v) {
      relayUrl = v;
      localStorage.setItem('cpaste.relay', v);
    },
    on,
    emit,
    create:(t, n) => rel('/api/create', { name:n, team:t ? (typeof t === 'string' ? t : exportTeam(t)) : null }).then(j => ({ id:j.id, secret:j.secret, role:j.role || 'host' })),
    join:(id) => rel('/api/join', { id }).then(j => ({ id, secret:j.secret, role:j.role || 'guest' })),
    submit:(id, sk, t, n) => rel('/api/submit', { id, secret:sk, team:t, name:n }),
    peek:(id, sk) => rel('/api/peek', { id, secret:sk }),
    pasteSave:(t, n) => rel('/api/paste.save', { team:t, name:n }),
    pasteGet:(pid) => rel('/api/paste.get', { pid }),
    myRooms: () => [],
    forget() {}
  };
})();

/* ================= UI ================= */
function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  const k = [...t.content.children];
  if (k.length === 1) return k[0];
  const d = document.createElement('div');
  k.forEach(x => d.appendChild(x));
  return d;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
}

function toast(msg, type) {
  const el = h('<div class="toast ' + (type || '') + '">' + esc(msg) + '</div>');
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => {
    el.style.transition = '.3s';
    el.style.opacity = 0;
    el.style.transform = 'translateX(40px)';
    setTimeout(() => el.remove(), 320);
  }, 2600);
}

function modal(title, body, onOpen) {
  const back = h('<div class="modal-back"><div class="modal"><h3>' + esc(title) + '</h3><div class="m-body"></div></div></div>');
  back.querySelector('.m-body').appendChild(typeof body === 'string' ? h('<div>' + body + '</div>') : body);
  document.getElementById('modal-root').appendChild(back);
  back.addEventListener('click', e => {
    if (e.target === back) back.remove();
  });
  onOpen && onOpen(back);
  return back;
}

function ensureNameGate() {
  if (Settings.name) return;

  const back = document.createElement('div');
  back.className = 'modal-back';
  back.innerHTML = '<div class="modal" style="max-width:440px"><h3>Regístrate para entrar</h3><p style="color:var(--muted);margin:6px 0 14px">Elige tu nombre de entrenador. Es el que verá tu rival en la sala y en el intercambio.</p><div class="field"><label>Nombre de entrenador</label><input id="gate-name" maxlength="16" placeholder="p. ej. Ash" style="font-family:var(--mono);letter-spacing:.05em"></div><button class="btn btn-primary btn-lg" id="gate-go" style="width:100%">Entrar con este nombre</button></div>';
  document.getElementById('modal-root').appendChild(back);

  const inp = back.querySelector('#gate-name');
  const go = back.querySelector('#gate-go');

  const submit = () => {
    const v = inp.value.trim().replace(/\s+/g, ' ').slice(0, 16);
    if (!v) {
      inp.focus();
      inp.style.borderColor = 'var(--bad)';
      return;
    }
    Settings.name = v;
    saveSettings();
    back.remove();
    toast('Bienvenido, ' + v, 'ok');
    if (room) refreshRoom();
  };

  go.onclick = submit;
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') submit();
  });
  setTimeout(() => inp.focus(), 50);
}

function typeChip(t) {
  return '<span class="chip" style="background:' + typeColor(t) + '">' + esc(typeES(t)) + '</span>';
}

function miniType(t) {
  return '<span class="mini-type" style="background:' + typeColor(t) + '">' + esc(t) + '</span>';
}

/* ================= DEX ================= */
async function loadPokemonIndex() {
  if (DexCache.pokemon) return DexCache.pokemon;

  const c = localStorage.getItem('cpaste.dex.p');
  if (c) {
    try {
      DexCache.pokemon = JSON.parse(c);
      return DexCache.pokemon;
    } catch (e) {}
  }

  const all = [];
  for (let off = 0; off < 1400; off += 200) {
    const r = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200&offset=' + off).then(x => x.json()).catch(() => ({ results:[] }));
    all.push(...(r.results || []));
    if (!r.results || r.results.length < 200) break;
  }

  DexCache.pokemon = all.map((p, i) => ({ name:p.name, id:i + 1 }));
  try { localStorage.setItem('cpaste.dex.p', JSON.stringify(DexCache.pokemon)) } catch (e) {}
  return DexCache.pokemon;
}

async function loadItemIndex() {
  if (DexCache.items) return DexCache.items;

  const c = localStorage.getItem('cpaste.dex.i');
  if (c) {
    try {
      DexCache.items = JSON.parse(c);
      return DexCache.items;
    } catch (e) {}
  }

  const r = await fetch('https://pokeapi.co/api/v2/item?limit=1400').then(x => x.json()).catch(() => ({ results:[] }));
  DexCache.items = (r.results || []).map(x => x.name);
  try { localStorage.setItem('cpaste.dex.i', JSON.stringify(DexCache.items)) } catch (e) {}
  return DexCache.items;
}

async function loadAbilityIndex() {
  if (DexCache.abilities) return DexCache.abilities;

  const c = localStorage.getItem('cpaste.dex.a');
  if (c) {
    try {
      DexCache.abilities = JSON.parse(c);
      return DexCache.abilities;
    } catch (e) {}
  }

  const r = await fetch('https://pokeapi.co/api/v2/ability?limit=1000').then(x => x.json()).catch(() => ({ results:[] }));
  DexCache.abilities = (r.results || []).map(x => x.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  try { localStorage.setItem('cpaste.dex.a', JSON.stringify(DexCache.abilities)) } catch (e) {}
  return DexCache.abilities;
}

async function loadMoveIndex() {
  if (DexCache.moves) return DexCache.moves;

  const ZM = new Set([
    'breakneckblitz','alloutpummeling','supersonicskystrike','aciddownpour','tectonicrage','continentalcrush','savagespinarrow','neverendingnightmare','corkscrewcrash','infernooverdrive','hydrovortex','bloomdoom','gigavolthavoc','shatteredpsyche','subzeroslammer','devastatingdrake','blackholeeclipse','twinkletackle','pulverizingpancake','extremeevoboost','genessupernova','10000000voltthunderbolt','letssnuggleforever','splinteredstormshards','clangoroussoulblaze','maliciousmoonsault','soulheartstealing7starmirage'
  ]);
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let arr = null;
  const c = localStorage.getItem('cpaste.dex.m');
  if (c) {
    try { arr = JSON.parse(c) } catch (e) {}
  }

  if (!arr || !arr.length) {
    arr = [];
    for (let off = 0; off < 1200; off += 500) {
      const r = await fetch('https://pokeapi.co/api/v2/move?limit=500&offset=' + off).then(x => x.json()).catch(() => ({ results:[] }));
      arr.push(...(r.results || []).map(m => m.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')));
      if (!r.results || r.results.length < 500) break;
    }
  }

  arr = arr.filter(n => !ZM.has(norm(n)));
  DexCache.moves = arr;
  try { localStorage.setItem('cpaste.dex.m', JSON.stringify(arr)) } catch (e) {}
  return DexCache.moves;
}

function detailCandidates(name) {
  const out = [];
  const add = x => {
    x = String(x || '').trim();
    if (x && !out.includes(x)) out.push(x);
  };

  add(name);
  const sl = slug(name);
  add(sl);

  const nos = sl.replace(/-/g, '');
  if (nos) add(nos);

  const parts = sl.split('-');
  if (parts.length > 1) {
    const base = parts[0];
    const suffix = parts.slice(1).join('-');
    add(base + '-' + suffix);
    if (base === 'ogerpon' && !suffix.includes('mask')) add(base + '-' + suffix + '-mask');
    add(base);
  }

  return out;
}

async function getPokemonDetail(name) {
  if (DexCache.details[name]) return DexCache.details[name];

  const cands = detailCandidates(name);
  let data = null;

  for (const c of cands) {
    const r = await fetch('https://pokeapi.co/api/v2/pokemon/' + encodeURIComponent(slug(c))).then(x => x.ok ? x.json() : null).catch(() => null);
    if (r && Array.isArray(r.stats) && r.stats.length) {
      data = r;
      break;
    }
  }

  if (!data) return null;

  const stats = {};
  for (const s of data.stats) stats[normKey(s.stat.name) || s.stat.name] = s.base_stat;

  const types = (data.types || []).sort((a, b) => a.slot - b.slot).map(t => t.type.name);
  const forms = (data.forms || []).map(f => f.name);
  const abilities = (data.abilities || []).sort((a, b) => a.slot - b.slot).map(a => a.ability.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  const d = { name:data.name, id:data.id, stats, types, forms, abilities };

  DexCache.details[name] = d;
  if (data.name && data.name !== name) DexCache.details[data.name] = d;
  return d;
}

function combo(ph, items, onPick, render, after) {
  const wrap = h('<div class="combo"><div class="combo-face"><input type="text" placeholder="' + esc(ph) + '" autocomplete="off"></div><div class="combo-pop"></div></div>');
  const inp = wrap.querySelector('input');
  const pop = wrap.querySelector('.combo-pop');
  let list = [];
  let idx = -1;

  const draw = () => {
    pop.innerHTML = list.map((it, i) => '<div class="combo-op' + (i === idx ? ' sel' : '') + '" data-i="' + i + '">' + render(it) + '</div>').join('');
    if (after) after(pop, list);
  };

  const fill = q => {
    const qq = slug(q);
    list = items().filter(n => qq.includes(slug(n)) || slug(n).includes(qq)).slice(0, 40);
    idx = -1;
    draw();
    pop.classList.toggle('on', list.length > 0);
  };

  inp.addEventListener('focus', () => fill(inp.value));
  inp.addEventListener('input', () => fill(inp.value));
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      idx = Math.min(idx + 1, list.length - 1);
      draw();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      idx = Math.max(idx - 1, 0);
      draw();
      e.preventDefault();
    } else if (e.key === 'Enter' && idx >= 0) {
      onPick(list[idx]);
      pop.classList.remove('on');
      e.preventDefault();
    } else if (e.key === 'Escape') {
      pop.classList.remove('on');
    }
  });

  pop.addEventListener('mousedown', e => {
    const op = e.target.closest('.combo-op');
    if (op) {
      onPick(list[+op.dataset.i]);
      pop.classList.remove('on');
    }
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) pop.classList.remove('on');
  });

  return {
    el:wrap,
    input:inp,
    redraw: () => {
      if (pop.classList.contains('on')) draw();
    },
    reload: () => {
      if (document.activeElement === inp) fill(inp.value);
    }
  };
}

function comboSpeciesAfter(pop, list) {
  const ops = pop.querySelectorAll('.combo-op');
  ops.forEach((op, i) => {
    if (i >= 12) return;

    const img = op.querySelector('img');
    const ty = op.querySelector('.ty[data-name]');
    if (!img || !ty) return;

    const name = ty.dataset.name;
    const show = types => {
      ty.innerHTML = (types || []).map(miniType).join('');
      op.classList.add('spr-ok');
    };

    if (dexIndexCache[name]) {
      show(dexIndexCache[name].types);
      return;
    }

    const go = () => {
      if (op.dataset.ld) return;
      op.dataset.ld = '1';
      getPokemonDetail(name).then(d => {
        if (d) {
          dexIndexCache[name] = d;
          show(d.types);
        }
      });
    };

    if (img.complete && img.naturalWidth > 0) go();
    else img.addEventListener('load', go, { once:true });
  });
}

/* ================= APP ================= */
let sets = [];
let room = null;
let pollTimer = null;
let lastRenderedStatus = null;
let openSlotOnRender = null;

const routes = {
  inicio:viewHome,
  constructor:viewBuilder,
  equipos:cpRenderTeams,
  calculadora:viewCalculadora,
  unirse:viewJoin,
  dex:viewDex,
  ajustes:viewSettings,
  sala:renderRoomView,
  editar:cpEditView,
  paste:pasteView
};

function nav() {
  const hash = (location.hash || '#/inicio').replace('#/', '');
  const [name, ...rest] = hash.split('/');
  document.querySelectorAll('.mainnav a').forEach(a => a.classList.toggle('on', a.dataset.nav === name));
  document.getElementById('app').innerHTML = '';
  const fn = routes[name] || viewHome;
  fn(rest);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => {
  stopPoll();
  nav();
});

Store.on(() => {
  if (room) refreshRoom();
});

window.addEventListener('DOMContentLoaded', () => {
  nav();
  startBg();
  ensureNameGate();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && room) refreshRoom();
  });

  document.getElementById('quickjoin').addEventListener('submit', e => {
    e.preventDefault();
    const v = document.getElementById('quickjoin-input').value.trim();
    if (v) joinRoom(v);
  });
});

function joinRoom(code) {
  (async () => {
    try {
      const r = await Store.join(code);
      room = { id:r.id, secret:r.secret, role:r.role, status:'pending', you:[], mineSent:false };
      location.hash = '#/sala/' + code;
    } catch (e) {
      toast(e.message, 'bad');
    }
  })();
}

function viewHome() {
  const app = document.getElementById('app');
  app.appendChild(h('<section class="hero"><div class="hero-side you"><span class="hero-tag">◉ Tú · siempre visible</span><h2 class="hero-h">Sube tu equipo<br>al ring.</h2><p class="hero-p">Construye tu equipo con sprites reales, estilo pokepaste. Nadie lo verá… hasta que el rival suba el suyo.</p><div class="hero-actions"><button class="btn btn-primary btn-lg" data-act="create">➕ Crear sala y publicar</button><a class="btn btn-lg" href="#/dex">📖 Pokédex</a></div><div class="term"><div class="term-bar"><i></i><i></i><i></i></div><div class="raw-paste">Garchomp @ Choice Scarf\nAbility: Rough Skin\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Earthquake\n- Dragon Claw\n- Stone Edge\n- Swords Dance<span class="caret"></span></div></div></div><div class="hero-side them hero-join"><span class="hero-tag">◈ ¿Ya tienes código?</span><a class="btn btn-gold btn-join" href="#/unirse"><span class="join-ico">🔗</span><span>Unirme con código</span></a><p style="color:var(--muted);font-size:13px;max-width:32ch;margin:0">Pega el código de sala de tu rival. No verás su equipo hasta que subas el tuyo.</p></div></section>'));
  app.querySelector('[data-act=create]').onclick = () => {
    location.hash = '#/constructor';
    setTimeout(() => doCreate(true), 80);
  };
}

function viewBuilder() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const tb = h('<div class="builder-top">' + (room ? '<span class="room-pill">🔑 <b>' + room.id + '</b></span><span class="badge badge-' + room.role + '">' + (room.role === 'host' ? 'Anfitrión' : 'Rival') + '</span>' : '<span class="badge badge-host">Borrador</span>') + '<div class="seg" id="segsize">' + [1,2,3,4,5,6].map(n => '<button data-n="' + n + '" class="' + (Settings.size === n ? 'on' : '') + '">' + n + '</button>').join('') + '</div><button class="btn btn-sm" id="btn-save">💾 Guardar</button><button class="btn btn-sm" id="btn-import">📥 Pegar paste</button><button class="btn btn-sm" id="btn-export">📋 Copiar</button><button class="btn btn-sm btn-ghost" id="btn-clear">🗑 Limpiar</button>' + (room ? '<button class="btn btn-sm btn-gold" id="btn-share">🔗 Compartir</button>' : '') + '<span class="evbudget" id="evb"></span><button class="btn btn-primary" id="btn-paste">🔗 Subir paste</button><button class="btn btn-primary" id="btn-publish">' + (room ? (room.mineSent ? '⏳ Esperando al rival…' : (room.role === 'host' ? '↻ Actualizar' : '🔓 Enviar y desbloquear')) : '➕ Crear sala y publicar') + '</button></div>');
  app.appendChild(tb);

  if (room) {
    app.appendChild(h('<div class="card" style="margin:14px 0;text-align:center"><div style="font-size:11px;letter-spacing:.2em;color:var(--muted);text-transform:uppercase">Código de sala · pásalo al rival</div><div class="code-box" style="margin:10px 0">' + room.id + '</div><button class="btn btn-sm" id="cpc">📋 Copiar código</button></div>'));
  }

  const wb = h('<div class="workbench"><div class="slots" id="slots"></div><aside class="preview" id="preview"></aside></div>');
  app.appendChild(wb);

  tb.querySelector('#segsize').onclick = e => {
    const b = e.target.closest('button');
    if (!b) return;
    Settings.size = +b.dataset.n;
    saveSettings();
    tb.querySelectorAll('#segsize button').forEach(x => x.classList.toggle('on', +x.dataset.n === Settings.size));
    renderSlots();
  };

  tb.querySelector('#btn-import').onclick = openImport;
  tb.querySelector('#btn-save').onclick = saveCurrentTeam;
  tb.querySelector('#btn-export').onclick = () => copy(exportTeam(sets.filter(s => s.species)));
  tb.querySelector('#btn-paste').onclick = () => cpPasteUpload(sets.filter(s => s.species));
  tb.querySelector('#btn-clear').onclick = () => {
    sets = sets.map(() => ({}));
    renderSlots();
    renderPreview();
  };
  tb.querySelector('#btn-publish').onclick = onPublish;

  const sh = tb.querySelector('#btn-share');
  if (sh) sh.onclick = shareCode;

  const cpc = document.getElementById('cpc');
  if (cpc) cpc.onclick = () => copy(room.id);

  renderSlots();
  renderPreview();
  if (room) startPoll();
}

function syncStatFinal(el, s, k) {
  const d = dexIndexCache[s.species];
  if (!d) return;
  const sf = el.querySelector('[data-sf="' + k + '"]');
  if (sf) {
    const iv = (s.ivs && s.ivs[k] != null) ? s.ivs[k] : 31;
    const ev = (s.evs && s.evs[k]) || 0;
    sf.textContent = finalStat(d.stats[k] || 0, k, iv, ev, s.nature, s.level || 100);
  }
}

function syncEvUI(el, s, k) {
  const v = s.evs[k] || 0;
  const inp = el.querySelector('[data-ev="' + k + '"]');
  if (inp) inp.value = v;

  const bar = el.querySelector('[data-evbar="' + k + '"]');
  if (bar) {
    bar.querySelector('i').style.width = Math.min(100, v / 252 * 100) + '%';
    bar.classList.toggle('max', v >= 252);
  }

  syncStatFinal(el, s, k);

  const left = el.querySelector('[data-evleft]');
  if (left) {
    const r = Math.floor((508 - evTotal(s)) / 4) * 4;
    left.textContent = 'Restante: ' + r;
    left.style.color = r <= 0 ? 'var(--warn)' : 'var(--ok)';
  }
}

function updateEvTotal() {
  const el = document.getElementById('evb');
  if (!el) return;
  const tot = sets.reduce((a, s) => a + evTotal(s), 0);
  const cap = 508 * Settings.size;
  el.innerHTML = 'EVs equipo: <b>' + tot + '</b>/' + cap;
  el.classList.toggle('over', tot > cap);
}

function dragEv(e, bar, set, el) {
  const k = bar.dataset.evbar;

  const move = ev => {
    const r = bar.getBoundingClientRect();
    setEV(set, k, Math.round((ev.clientX - r.left) / r.width * 252));
    syncEvUI(el, set, k);
    updateEvTotal();
  };

  const up = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
  };

  move(e);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
}

function natHint(n) {
  const EN = { atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe' };
  const m = NMOD[n] || [];
  if (!m[0]) return '(neutral)';
  return '(+' + (EN[m[0]] || m[0]) + '/-' + (EN[m[1]] || m[1]) + ')';
}

function statsPanelHTML(s) {
  const d = dexIndexCache[s.species];
  if (!d) return '<div class="field"><label>Estadísticas</label><div class="stats-load">cargando datos…</div></div>';

  const rows = STATS.map(k => {
    const base = d.stats[k] || 0;
    return '<div class="statrow"><span class="sl">' + STAT_ES[k] + '</span><span class="sb">' + base + '</span><span class="sbar"><i style="width:' + Math.min(100, base / 255 * 100) + '%;background:' + statColor(base) + '"></i></span></div>';
  }).join('');

  return '<div class="field"><label>Estadísticas base</label><div class="statgrid">' + rows + '</div></div>';
}

function slotHTML(s, i) {
  if (!s.species) {
    return '<div class="slot empty-slot" data-slot="' + i + '"><div class="empty-add">Slot vacío<div data-combo="species"></div></div></div>';
  }

  const d = dexIndexCache[s.species] || {};
  const types = d.types || [];
  const tc = typeColor(types[0] || 'normal');
  const lvl = s.level || 100;

  const rows = STATS.map(k => {
    const base = (d.stats && d.stats[k]) || 0;
    const iv = (s.ivs && s.ivs[k] != null) ? s.ivs[k] : 31;
    const ev = (s.evs && s.evs[k]) || 0;
    const fin = d.stats ? finalStat(base, k, iv, ev, s.nature, lvl) : '—';
    const pct = Math.min(100, ev / 252 * 100);
    return '<div class="sdtrow"><span class="sn">' + STAT_ES[k] + '</span><input class="sdtin" data-ev="' + k + '" value="' + ev + '"><div class="evbar ' + (ev >= 252 ? 'max' : '') + '" data-evbar="' + k + '"><i style="width:' + pct + '%"></i></div><input class="sdtin" data-iv="' + k + '" value="' + iv + '"><span class="sdtfin" data-sf="' + k + '">' + fin + '</span></div>';
  }).join('');

  const table = '<div class="field"><label>EVs / IVs <span style="color:var(--dim)">· máx 508, 252 c/u</span><span class="evleft" data-evleft>Restante: ' + Math.floor((508 - evTotal(s)) / 4) * 4 + '</span></label><div class="sdthead"><span>Stat</span><span>EV</span><span></span><span>IV</span><span>final</span></div><div class="sdt">' + rows + '</div><div class="qbtns"><button class="qbtn" data-q="252">252/4/252</button><button class="qbtn" data-q="0">Reset</button></div></div>';

  return '<div class="slot filled" data-slot="' + i + '" style="--tc:' + tc + '"><div class="slot-head"><div class="slot-spr">' + spr(s.species, s.form, null, s.shiny) + '</div><div style="min-width:0"><div class="slot-id">#' + (d.id || '—') + ' · Nv ' + (s.level || 100) + ' · ' + (i + 1) + '/' + Settings.size + '</div><div class="slot-name">' + (s.nickname ? esc(s.nickname) + ' <span style="color:var(--dim)">(' + esc(s.species) + ')</span>' : esc(s.species)) + '</div><div class="slot-item">' + itemImg(s.item) + esc(s.item || 'Sin objeto') + '</div></div><div class="slot-ctl"><button class="icon-btn" data-shiny title="Shiny" style="' + (s.shiny ? 'color:var(--gold);border-color:var(--gold)' : '') + '">✦</button><button class="icon-btn" data-dup title="Duplicar">⧉</button><button class="icon-btn" data-del title="Vaciar">✕</button></div></div><div class="slot-body"><div class="row2"><div class="field"><label>Pokémon</label><div data-combo="species"></div></div><div class="field"><label>Objeto</label><div data-combo="item"></div></div></div><div class="field"><label>Apodo</label><input type="text" data-nick value="' + esc(s.nickname || '') + '" placeholder="sin apodo" style="max-width:260px"></div><div class="row3"><div class="field"><label>Nivel</label><input type="number" min="1" max="100" data-lvl value="' + (s.level || 100) + '"></div><div class="field"><label>Naturaleza</label><select data-nat style="font-size:11px"><option value="">—</option>' + NATURES.map(n => '<option value="' + n + '" ' + (s.nature === n ? 'selected' : '') + ' style="font-size:13px">' + n + ' ' + natHint(n) + '</option>').join('') + '</select></div><div class="field"><label>Habilidad</label><div data-combo="ability"></div></div></div>' + statsPanelHTML(s) + table + '<div class="field"><label>Movimientos</label><div class="moves">' + [0,1,2,3].map(n => '<div data-combo="move" data-mvi="' + n + '"></div>').join('') + '</div></div></div></div>';
}

function renderSlots() {
  const box = document.getElementById('slots');
  if (!box) return;

  while (sets.length < Settings.size) sets.push({});
  sets.length = Settings.size;

  const _nm = DexCache.pokemon ? new Set(DexCache.pokemon.map(p => p.name)) : null;
  const _isPoke = r => {
    const sl = slug(r);
    return (_nm && _nm.has(sl)) || (dexIndexCache[r] && dexIndexCache[r].id) || (dexIndexCache[sl] && dexIndexCache[sl].id);
  };

  for (let i = 0; i < sets.length; i++) {
    const s = sets[i];
    if (!s || !s.evs || !s.ivs || !Array.isArray(s.moves)) sets[i] = Object.assign(blank(), s || {});

    const t = sets[i];
    const mm = /^(.*?)\s*\((.*?)\)\s*$/.exec(t.species || '');
    if (mm) {
      const a = mm[1].trim();
      const b = mm[2].trim();
      if (_isPoke(b) && !_isPoke(a)) {
        t.nickname = a;
        t.species = b;
      } else if (_isPoke(a) && !_isPoke(b)) {
        t.nickname = b;
        t.species = a;
      }
    }
  }

  const wasOpen = new Set([...box.querySelectorAll('.slot.open')].map(x => +x.dataset.slot));
  box.innerHTML = sets.map((s, i) => slotHTML(s, i)).join('');

  wasOpen.forEach(i => {
    const o = box.querySelector('[data-slot="' + i + '"]');
    if (o) o.classList.add('open');
  });

  if (openSlotOnRender != null) {
    const o = box.querySelector('[data-slot="' + openSlotOnRender + '"]');
    if (o) o.classList.add('open');
    openSlotOnRender = null;
  }

  box.querySelectorAll('[data-slot]').forEach(el => {
    const i = +el.dataset.slot;
    const s = sets[i];
    const head = el.querySelector('.slot-head');
    if (head) head.onclick = () => el.classList.toggle('open');
    if (!s.species) return;

    const del = el.querySelector('[data-del]');
    if (del) del.onclick = () => {
      sets[i] = {};
      renderSlots();
      renderPreview();
    };

    const dup = el.querySelector('[data-dup]');
    if (dup) dup.onclick = () => {
      sets[i] = JSON.parse(JSON.stringify(s));
      renderSlots();
      renderPreview();
    };

    const shb = el.querySelector('[data-shiny]');
    if (shb) shb.onclick = () => {
      s.shiny = !s.shiny;
      renderSlots();
      renderPreview();
    };

    const ns = el.querySelector('[data-nat]');
    if (ns) ns.onchange = () => {
      s.nature = ns.value;
      renderSlots();
      renderPreview();
    };

    const nk = el.querySelector('[data-nick]');
    if (nk) nk.oninput = () => {
      s.nickname = nk.value;
      const sn = el.querySelector('.slot-name');
      if (sn) sn.innerHTML = esc(s.species) + (s.nickname ? ' <span style="color:var(--dim)">(' + esc(s.nickname) + ')</span>' : '');
      renderPreview();
    };

    const lv = el.querySelector('[data-lvl]');
    if (lv) lv.onchange = () => {
      s.level = clamp(+lv.value || 100, 1, 100);
      const sid = el.querySelector('.slot-id');
      if (sid) sid.textContent = '#' + ((dexIndexCache[s.species] && dexIndexCache[s.species].id) || '—') + ' · Nv ' + (s.level || 100) + ' · ' + (i + 1) + '/' + Settings.size;
      STATS.forEach(k => syncStatFinal(el, s, k));
      const pre = document.querySelector('.preview .raw-paste');
      if (pre) pre.textContent = exportTeam(sets.filter(x => x.species));
    };

    el.querySelectorAll('[data-ev]').forEach(inp => {
      const k = inp.dataset.ev;
      inp.oninput = () => {
        setEV(s, k, +inp.value);
        syncEvUI(el, s, k);
        updateEvTotal();
      };
      inp.onblur = () => renderSlots();
    });

    el.querySelectorAll('[data-evbar]').forEach(bar => bar.onmousedown = e => dragEv(e, bar, s, el));

    el.querySelectorAll('[data-iv]').forEach(inp => inp.oninput = () => {
      s.ivs[inp.dataset.iv] = clamp(+inp.value || 0, 0, 31);
      syncStatFinal(el, s, inp.dataset.iv);
    });

    el.querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
      Object.keys(s.evs).forEach(k => delete s.evs[k]);
      if (b.dataset.q === '252') {
        s.evs.atk = 252;
        s.evs.spe = 252;
        s.evs.def = 4;
      }
      renderSlots();
      renderPreview();
    });
  });

  box.querySelectorAll('[data-combo=species]').forEach(el => {
    const i = +el.closest('.slot').dataset.slot;
    el.innerHTML = '';

    const pick = async name => {
      const cur = sets[i] || {};
      const shiny = cur.shiny == null ? Settings.shiny : cur.shiny;
      sets[i] = Object.assign(blank(), cur, { species:name, form:'', shiny });
      const d = await getPokemonDetail(name);
      if (d) dexIndexCache[name] = d;
      renderSlots();
      renderPreview();
    };

    const cb = combo(
      'Buscar Pokémon…',
      () => DexCache.names || (DexCache.pokemon ? DexCache.names = DexCache.pokemon.map(p => p.name) : []),
      pick,
      name => spr(name, '') + '<span class="nm">' + esc(name) + '</span><span class="ty" data-name="' + esc(name) + '"></span>',
      comboSpeciesAfter
    );

    el.appendChild(cb.el);
    cb.input.value = (sets[i] && sets[i].species) || '';
    cb.input.addEventListener('blur', () => {
      const raw = cb.input.value.trim();
      if (!raw) return;
      const cur = sets[i] && sets[i].species;
      if (cur && slug(cur) === slug(raw)) return;
      const canon = canonSpecies(raw);
      if (canon && canon !== cur) pick(canon);
    });

    loadPokemonIndex().then(() => {
      DexCache.names = null;
      cb.reload();
    });
  });

  box.querySelectorAll('[data-combo=item]').forEach(el => {
    const slotEl = el.closest('.slot');
    const i = +slotEl.dataset.slot;
    el.innerHTML = '';

    const cb = combo(
      'Buscar objeto…',
      () => DexCache.items || [],
      name => {
        sets[i].item = name;
        renderSlots();
        renderPreview();
      },
      name => itemImg(name) + '<span>' + esc(name) + '</span>'
    );

    el.appendChild(cb.el);
    cb.input.value = (sets[i] && sets[i].item) || '';
    cb.input.addEventListener('input', () => {
      const v = cb.input.value.trim();
      sets[i].item = v;
      const it = slotEl.querySelector('.slot-item');
      if (it) it.innerHTML = itemImg(v) + esc(v || 'Sin objeto');
      renderPreview();
    });

    loadItemIndex();
  });

  box.querySelectorAll('[data-combo=ability]').forEach(el => {
    const i = +el.closest('.slot').dataset.slot;
    el.innerHTML = '';

    const cb = combo(
      'Buscar habilidad…',
      () => {
        const cur = (sets[i] || {}).species;
        const own = (dexIndexCache[cur] && dexIndexCache[cur].abilities) || [];
        const all = DexCache.abilities || [];
        const seen = new Set(own);
        return own.concat(all.filter(a => !seen.has(a)));
      },
      name => {
        sets[i].ability = name;
        renderSlots();
        renderPreview();
      },
      name => '<span>' + esc(name) + '</span>'
    );

    el.appendChild(cb.el);
    cb.input.value = (sets[i] && sets[i].ability) || '';
    loadAbilityIndex();
  });

  box.querySelectorAll('[data-combo=move]').forEach(el => {
    const i = +el.closest('.slot').dataset.slot;
    const mv = +el.dataset.mvi;
    el.innerHTML = '';

    const cb = combo(
      'Buscar movimiento…',
      () => DexCache.moves || [],
      name => {
        sets[i].moves[mv] = name;
        renderSlots();
        renderPreview();
      },
      name => '<span>' + esc(name) + '</span>'
    );

    el.appendChild(cb.el);
    cb.input.value = (sets[i] && sets[i].moves[mv]) || '';
    loadMoveIndex();
  });

  updateEvTotal();

  sets.forEach((s, i) => {
    if (s.species && !dexIndexCache[s.species]) {
      getPokemonDetail(s.species).then(d => {
        if (d) {
          dexIndexCache[s.species] = d;
          const el = document.querySelector('[data-slot="' + i + '"]');
          if (el && !el.contains(document.activeElement)) renderSlots();
        }
      });
    }
  });
}

function pasteRender(real) {
  return '<div class="pp">' + real.map(s => {
    const d = dexIndexCache[s.species] || {};
    const types = d.types || [];
    const tc = typeColor(types[0] || 'normal');
    return '<div class="pp-set" style="--tc:' + tc + '"><div class="pp-spr">' + spr(s.species, s.form, null, s.shiny) + '</div><div class="pp-lines"><div class="ln-name">' + (s.shiny ? '<span style="color:var(--gold)">✦ </span>' : '') + esc(s.species) + (s.nickname ? ' <span class="par">(' + esc(s.nickname) + ')</span>' : s.gender ? ' <span class="par">(' + s.gender + ')</span>' : '') + (s.item ? ' <span class="ln-item">@ ' + itemImg(s.item) + esc(s.item) + '</span>' : '') + '</div>' + (s.ability ? '<div class="ln-ab">Ability: <b>' + esc(s.ability) + '</b></div>' : '') + (s.tera ? '<div class="ln-meta">Tera Type: ' + esc(s.tera) + '</div>' : '') + (s.level && s.level !== 100 ? '<div class="ln-meta">Level: ' + s.level + '</div>' : '') + (fmtStats(s.evs) ? '<div class="ln-ev">EVs: <b>' + esc(fmtStats(s.evs)) + '</b></div>' : '') + (fmtStats(s.ivs) ? '<div class="ln-iv">IVs: ' + esc(fmtStats(s.ivs)) + '</div>' : '') + (s.nature ? '<div class="ln-nat">' + esc(s.nature) + ' Nature</div>' : '') + (s.moves || []).filter(Boolean).map(m => '<div class="ln-mv">' + esc(m) + '<span class="dot" style="background:' + typeColor(guessMoveType(m, types)) + '"></span></div>').join('') + '</div></div>';
  }).join('') + '</div>';
}

function renderPreview() {
  const box = document.getElementById('preview');
  if (!box) return;
  box.innerHTML = '';

  const real = sets.filter(s => s.species);
  const head = h('<div class="preview-h"><b>Vista previa · pokepaste</b><span style="flex:1"></span><button class="btn btn-sm" id="pv-copy">Copiar</button><button class="btn btn-sm btn-ghost" id="pv-dl">.txt</button></div><div class="preview-b"><div id="pv-body"></div></div>');
  box.appendChild(head);

  const body = box.querySelector('#pv-body');
  if (!real.length) {
    body.innerHTML = '<p style="color:var(--dim)">Añade un Pokémon para ver la vista previa tipo pokepaste.</p>';
  } else {
    body.innerHTML = pasteRender(real);

    const sum = teamSummary(real, dexIndexCache);
    const r0 = roleOf(real[0]);

    body.appendChild(h('<div style="margin-top:14px;display:flex;gap:6px;flex-wrap:wrap">' + sum.main.map(typeChip).join('') + '<span class="chip" style="background:#1e2c48;color:#cfe">' + r0.icon + ' ' + r0.role + '</span></div>'));
    body.appendChild(h('<div style="margin-top:12px;font-family:var(--mono);font-size:11.5px;color:var(--muted)">Media: ' + STATS.map(k => STAT_ES[k] + ' ' + sum.avg[k]).join(' · ') + '</div>'));
    body.appendChild(h('<pre class="raw-paste" style="margin-top:14px;border-top:1px dashed var(--line);padding-top:12px">' + esc(exportTeam(real)) + '</pre>'));
  }

  head.querySelector('#pv-copy').onclick = () => copy(exportTeam(real));
  head.querySelector('#pv-dl').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([exportTeam(real)], { type:'text/plain' }));
    a.download = 'equipo.txt';
    a.click();
  };
}

function openImport() {
  const ta = h('<textarea placeholder="Pega aquí tu equipo (export de Showdown / pokepaste)…"></textarea>');
  modal('Importar paste', ta, back => {
    back.querySelector('.modal').insertAdjacentHTML('beforeend', '<div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" data-x>Cancelar</button><button class="btn btn-primary" data-ok>Importar</button></div>');
    back.querySelector('[data-x]').onclick = () => back.remove();
    back.querySelector('[data-ok]').onclick = async () => {
      await loadPokemonIndex();
      const parsed = parseTeam(ta.value);

      parsed.forEach(s => {
        if (s.item) s.item = s.item.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();
      });

      if (!parsed.length) {
        toast('No he entendido el paste', 'bad');
        return;
      }

      sets = parsed.slice(0, Settings.size).map(s => ({ ...s, evs:s.evs || {}, ivs:s.ivs || {}, moves:s.moves || [] }));
      while (sets.length < Settings.size) sets.push({});

      for (const s of sets) {
        if (s.species) {
          const d = await getPokemonDetail(s.species);
          if (d) dexIndexCache[s.species] = d;
        }
      }

      back.remove();
      renderSlots();
      renderPreview();

      const cpc = document.getElementById('cpc');
      if (cpc) cpc.onclick = () => copy(room.id);

      toast(parsed.length + ' Pokémon importados', 'ok');
    };
  });
}

async function onPublish() {
  const real = sets.filter(s => s.species);
  if (!real.length) {
    toast('Añade al menos un Pokémon', 'warn');
    return;
  }

  try {
    if (!room) {
      await doCreate(false, real);
      return;
    }
    if (room.mineSent) {
      await refreshRoom();
      return;
    }

    await Store.submit(room.id, room.secret, exportTeam(real), Settings.name);
    room.mineSent = true;
    toast('Equipo enviado', 'ok');
    await refreshRoom();
  } catch (e) {
    if (e.status === 409) {
      room.mineSent = true;
      toast('Ya lo enviaste. Esperando al rival…', 'warn');
      await refreshRoom();
    } else {
      toast(e.message || 'Error', 'bad');
    }
  }
}

async function doCreate(silent, team) {
  const real = (team || sets).filter(s => s.species);
  if (!real.length) {
    toast('Añade un Pokémon antes de crear la sala', 'warn');
    return;
  }

  if (!Settings.name) {
    Settings.name = 'Entrenador';
    saveSettings();
  }

  try {
    const r = await Store.create(real, Settings.name);
    room = { id:r.id, secret:r.secret, role:r.role, status:'waiting', you:real, mineSent:false };
    await Store.submit(room.id, room.secret, exportTeam(real), Settings.name);
    room.mineSent = true;
    viewBuilder();
    shareCode();
    toast('Sala creada y enviada. Pasa el código al rival', 'ok');
  } catch (e) {
    toast(e.message || 'Error', 'bad');
  }
}

function pasteView(pid) {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="waiting"><span class="pulse"></span> Cargando paste…</div>';

  Store.pasteGet(pid).then(d => {
    app.innerHTML = '';
    const real = parseTeam(d.team || '');
    const card = h('<div class="card" style="max-width:760px;margin:0 auto"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><h3 style="margin:0">📋 Paste de ' + esc(d.name || 'Entrenador') + '</h3><div style="color:var(--dim);font-size:12px;font-family:var(--mono);margin-top:4px">' + esc(pid) + '</div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm" id="pv-copy">📋 Copiar paste</button><button class="btn btn-sm btn-primary" id="pv-load">📥 Cargar en el editor</button></div></div><div style="margin-top:14px">' + pasteRender(real) + '</div></div>');
    app.appendChild(card);
    card.querySelector('#pv-copy').onclick = () => copy(d.team || '');
    card.querySelector('#pv-load').onclick = () => {
      sets = real.map(s => s);
      while (sets.length < Settings.size) sets.push(blank());
      openSlotOnRender = null;
      location.hash = '#/constructor';
      toast('Equipo cargado en el editor', 'ok');
    };
  }).catch(e => {
    app.innerHTML = '';
    app.appendChild(h('<div class="card"><h3>Paste no encontrado</h3><p style="color:var(--muted)">' + esc(e.message || 'El enlace es inválido o el paste caducó.') + '</p><a class="btn btn-primary" href="#/constructor">Ir al constructor</a></div>'));
  });
}

function cpPasteUpload(realSets) {
  const real = (realSets || []).filter(s => s.species);
  if (!real.length) {
    toast('No hay equipo que subir', 'warn');
    return;
  }

  const txt = exportTeam(real);

  Store.pasteSave(txt, Settings.name || 'Entrenador').then(d => {
    const url = location.origin + location.pathname + '#/paste/' + d.pid;

    modal(
      '🔗 Paste subido',
      '<p style="color:var(--muted)">Cualquiera con este enlace verá el equipo <b>' + real.length + '</b> Pokémon, igual que en pokepaste.</p><input type="text" readonly value="' + esc(url) + '" style="font-family:var(--mono);font-size:12px" id="cpPasteUrl"><div style="margin-top:12px;display:flex;gap:8px"><button class="btn btn-primary" data-c>🔗 Copiar enlace</button><button class="btn" data-o>Ver paste</button></div>',
      back => {
        back.querySelector('[data-c]').onclick = () => copy(url);
        back.querySelector('[data-o]').onclick = () => {
          back.remove();
          location.hash = '#/paste/' + d.pid;
        };
      }
    );
  }).catch(e => {
    toast(e.message || 'No se pudo subir el paste', 'bad');
  });
}

function shareCode() {
  const url = location.origin + location.pathname + '#/unirse/' + room.id;
  modal(
    'Comparte el acceso',
    '<p style="color:var(--muted)">Dale este <b>código</b> o el <b>enlace</b>. No podrá ver tu equipo hasta que suba el suyo.</p><div class="code-box" style="margin:12px 0">' + room.id + '</div><input type="text" readonly value="' + esc(url) + '" style="font-family:var(--mono);font-size:12px"><div style="margin-top:12px;display:flex;gap:8px"><button class="btn btn-primary" data-c>📋 Copiar código</button><button class="btn" data-cu>🔗 Copiar enlace</button></div>',
    back => {
      back.querySelector('[data-c]').onclick = () => copy(room.id);
      back.querySelector('[data-cu]').onclick = () => copy(url);
    }
  );
}

async function ensureRevealData() {
  if (!room) return;

  const me = room.secret === 'p2' ? 'p2' : 'p1';
  const foe = room.secret === 'p2' ? 'p1' : 'p2';
  const fix = a => (a || []).map(s => {
    if (s.item) s.item = s.item.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();
    return s;
  });

  if (room[me] && room[me].team) room.you = fix(parseTeam(room[me].team));
  if (room[foe] && room[foe].team) room.them = fix(parseTeam(room[foe].team));

  const all = [...(room.you || []), ...(room.them || [])];
  await Promise.all(all.filter(s => s.species && !dexIndexCache[s.species]).map(async s => {
    const d = await getPokemonDetail(s.species);
    if (d) dexIndexCache[s.species] = d;
  }));
}

async function refreshRoom() {
  if (!room) return;

  let p;
  try {
    p = await Store.peek(room.id, room.secret);
  } catch (e) {
    return;
  }

  room = { ...room, ...p };
  const both = p && p.p1 && p.p2 && p.p1.team && p.p2.team;

  if (p.ready === true || p.status === 'ready' || p.status === 'revealed' || p.status === 'complete' || both) {
    room.status = 'revealed';
    await ensureRevealData();
    if (location.hash !== '#/sala/' + room.id) location.hash = '#/sala/' + room.id;
    else renderRoomView();
    stopPoll();
  } else if (location.hash.startsWith('#/sala/') && room.status !== lastRenderedStatus) {
    renderRoomView();
  }
}

function startPoll() {
  stopPoll();
  if (Store.mode === 'relay') {
    pollTimer = setInterval(() => {
      if (room) refreshRoom();
    }, 400);
  }
}

function stopPoll() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function myName() {
  if (room) {
    const me = room.secret === 'p2' ? 'p2' : 'p1';
    const m = room[me];
    if (m && m.name) return m.name;
  }
  return Settings.name || 'Tú';
}

function foeName() {
  if (room) {
    const foe = room.secret === 'p2' ? 'p1' : 'p2';
    const f = room[foe];
    if (f && f.name) return f.name;
  }
  return 'Rival';
}

function renderRoomView() {
  const app = document.getElementById('app');
  if (!location.hash.startsWith('#/sala/')) return;
  app.innerHTML = '';

  if (!room) {
    app.appendChild(h('<div class="card"><h3>Esta sala no está cargada</h3><p style="color:var(--muted)">Entra desde <a href="#/unirse">Unirse</a> con el código.</p></div>'));
    return;
  }

  lastRenderedStatus = room.status;
  const editing = room.status !== 'revealed';

  const top = h('<div class="builder-top"><span class="room-pill">🔑 <b>' + room.id + '</b></span><span class="badge badge-' + room.role + '">' + (room.role === 'host' ? 'Anfitrión' : 'Rival') + '</span><span class="badge badge-' + Store.mode + '">' + Store.mode + '</span>' + (editing ? '<button class="btn btn-sm" id="ri">📥 Pegar paste</button><button class="btn btn-sm" id="re">📋 Copiar</button><button class="btn btn-sm btn-ghost" id="rc">🗑 Limpiar</button>' : '') + '<span style="flex:1"></span><button class="btn btn-sm" id="back">← Editor</button></div>');
  app.appendChild(top);

  top.querySelector('#back').onclick = () => {
    location.hash = '#/constructor';
  };

  if (editing) {
    top.querySelector('#ri').onclick = openImport;
    top.querySelector('#re').onclick = () => copy(exportTeam(sets.filter(s => s.species)));
    top.querySelector('#rc').onclick = () => {
      sets = sets.map(() => ({}));
      renderSlots();
      renderPreview();
    };
  }

  const sb = h('<div style="margin:18px 0"></div>');
  app.appendChild(sb);

  if (room.status === 'waiting') {
    sb.appendChild(h('<div class="waiting"><span class="pulse"></span> Tu equipo está sellado, <b>' + esc(myName()) + '</b>. Esperando a que el rival suba el suyo…</div>'));
  } else if (room.status === 'pending') {
    sb.appendChild(h('<div class="waiting"><span class="pulse"></span> <b>' + esc(foeName()) + '</b> ya está dentro. <b>Sube tu equipo</b> para desbloquear.</div>'));
  } else if (room.status === 'revealed') {
    sb.appendChild(h('<div class="waiting" style="border-color:rgba(63,214,160,.5);background:rgba(63,214,160,.08);color:#bff3df"><span class="pulse" style="background:var(--ok)"></span> ✅ ¡Intercambio completado! <b>' + esc(myName()) + '</b> vs <b>' + esc(foeName()) + '</b></div>'));
    app.appendChild(h('<div style="margin-bottom:14px"><a class="btn btn-primary" href="#/calculadora">⚔ Analizar duelos en la calculadora</a></div>'));
    app.appendChild(buildReveal());
    stopPoll();
    return;
  }

  const wb = h('<div class="workbench"><div class="slots" id="slots"></div><aside class="preview" id="preview"></aside></div>');
  app.appendChild(wb);
  renderSlots();
  renderPreview();

  const pub = h('<div style="margin-top:14px"><button class="btn ' + (room.role === 'guest' ? 'btn-gold' : '') + '" id="pb" ' + (room.mineSent ? 'disabled' : '') + '>' + (room.mineSent ? '⏳ Enviado, esperando al rival…' : (room.role === 'host' ? '↻ Actualizar mi equipo' : '🔓 Enviar mi equipo')) + '</button></div>');
  app.appendChild(pub);
  pub.querySelector('#pb').onclick = onPublish;
  startPoll();
}

function buildReveal() {
  const mine = room.you || [];
  const them = room.them || [];
  const wrap = h('<div class="vs-seam">VS · análisis cruzado</div><div class="reveal"></div>');
  const rev = wrap.querySelector('.reveal');
  rev.appendChild(revealCol('🔵 Tu equipo · ' + esc(myName()), mine, them, true));
  rev.appendChild(revealCol('🟡 Equipo rival · ' + esc(foeName()), them, mine, false));
  return wrap;
}

function revealCol(title, team, enemy, editable) {
  const col = h('<div class="reveal-col"><h3>' + title + '</h3><div class="rv-grid"></div></div>');
  const grid = col.querySelector('.rv-grid');

  team.forEach((s, i) => {
    const d = dexIndexCache[s.species] || {};
    const types = d.types || [];
    const card = h('<div class="rv-card" style="animation-delay:' + (i * 0.07) + 's;cursor:pointer"><div class="spr">' + spr(s.species, s.form, null, s.shiny) + '</div><div class="nm">' + (s.shiny ? '<span style="color:var(--gold)">✦ </span>' : '') + (s.nickname ? esc(s.nickname) + ' <span style="color:var(--dim)">(' + esc(s.species) + ')</span>' : esc(s.species)) + '</div><div class="it">' + itemImg(s.item) + esc(s.item || '—') + '</div><div class="types">' + types.map(typeChip).join('') + '</div><div class="mvs">' + (s.moves || []).filter(Boolean).map(esc).join(' · ') + '</div></div>');
    card.onclick = () => {
      if (editable) {
        openSlotOnRender = i;
        location.hash = '#/constructor';
      } else {
        modal(esc(s.species), pasteRender([s]));
      }
    };
    grid.appendChild(card);
  });

  if (enemy && enemy.length) {
    const cs = bestCounters(team, enemy, dexIndexCache);
    const box = h('<div class="counters"></div>');
    cs.forEach(c => {
      if (c.counter && c.mon.species) {
        box.appendChild(h('<div><b>' + esc(c.mon.species) + '</b> → mejor respuesta rival: <b>' + esc(c.counter.species) + '</b></div>'));
      }
    });
    if (box.children.length) col.appendChild(box);
  }

  return col;
}

function teamsKey() {
  return 'cpaste.teams.' + (Settings.name || '_anon');
}

function loadMyTeams() {
  try {
    return JSON.parse(localStorage.getItem(teamsKey()) || '[]');
  } catch (e) {
    return [];
  }
}

function saveMyTeams(a) {
  try {
    localStorage.setItem(teamsKey(), JSON.stringify(a));
  } catch (e) {
    toast('Sin sitio para guardar', 'bad');
  }
}

function saveCurrentTeam() {
  const real = sets.filter(s => s.species);
  if (!real.length) {
    toast('No hay equipo que guardar', 'warn');
    return;
  }

  const ta = document.createElement('textarea');
  ta.placeholder = 'Nombre del equipo (p. ej. Ranked SV)';
  ta.style.minHeight = 'auto';

  modal('Guardar en Mis equipos · ' + esc(Settings.name || 'sin nombre'), ta, back => {
    back.querySelector('.modal').insertAdjacentHTML('beforeend', '<div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" data-x>Cancelar</button><button class="btn btn-primary" data-ok>Guardar</button></div>');
    back.querySelector('[data-x]').onclick = () => back.remove();
    back.querySelector('[data-ok]').onclick = () => {
      const name = ta.value.trim() || ('Equipo ' + new Date().toLocaleDateString());
      const a = loadMyTeams();
      a.unshift({ id:Date.now(), name, team:real, created:Date.now() });
      saveMyTeams(a);
      back.remove();
      toast('Guardado como “' + name + '”', 'ok');
    };
  });
}

function viewJoin(rest) {
  const app = document.getElementById('app');
  const pre = rest && rest[0] ? rest[0] : '';

  app.appendChild(h('<div class="room-wrap"><div class="card"><h3>🔗 Unirse a una sala</h3><p style="color:var(--muted)">Pega el código del anfitrión. Al entrar <b>no verás su equipo</b> hasta que subas el tuyo.</p><div class="field"><label>Código / enlace</label><input id="join-code" placeholder="XXXX-XXXX" value="' + esc(pre) + '" style="font-family:var(--mono);letter-spacing:.2em;text-transform:uppercase"></div><div class="field"><label>Tu nombre</label><input id="join-name" placeholder="Rival"></div><button class="btn btn-primary" id="dojoin">Entrar y subir mi equipo</button></div><div class="card"><h3>¿Cómo funciona?</h3><p style="color:var(--muted)">1) Entrar reserva tu plaza.<br>2) Construyes tu equipo.<br>3) Al pulsar <b>Enviar</b>, el servidor libera ambos equipos a la vez.</p><p style="color:var(--dim);font-size:12.5px">Modo: <b>' + Store.mode + '</b>' + (Store.mode === 'local' ? ' (mismo navegador, 2 pestañas)' : ' (relay)') + '</p></div></div>'));

  app.querySelector('#dojoin').onclick = async () => {
    const code = document.getElementById('join-code').value.trim().replace(/^.*\/unirse\//, '').replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
    Settings.name = document.getElementById('join-name').value.trim();
    if (!Settings.name) Settings.name = 'Entrenador';
    saveSettings();

    if (!code) {
      toast('Introduce un código', 'warn');
      return;
    }

    try {
      const r = await Store.join(code);
      room = { id:r.id, secret:r.secret, role:r.role, status:'pending', you:[], mineSent:false };
      location.hash = '#/sala/' + code;
    } catch (e) {
      toast(e.message || 'No se pudo entrar', 'bad');
    }
  };
}

/* ================= CALCULADORA DE DAÑO (calc.pokemonshowdown.com) ================= */
function viewCalculadora() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const C = window.PokemonCalc;
  if (!C) {
    app.appendChild(h('<div class="calc-wrap"><div class="card"><h3>⚙️ Cargando motor de cálculo…</h3><p style="color:var(--muted)">El bundle <code>js/pokemon-calc.bundle.js</code> (librería oficial <b>@smogon/calc</b>) no se ha podido cargar.</p></div></div>'));
    return;
  }

  const { Generations, Pokemon, Move, Field, calculate, NATURES, STATS, calcStat } = C;

  const GENS = [
    { num: 1, label: 'RBY' },
    { num: 2, label: 'GSC' },
    { num: 3, label: 'ADV' },
    { num: 4, label: 'DPP' },
    { num: 5, label: 'BW' },
    { num: 6, label: 'XY' },
    { num: 7, label: 'SM' },
    { num: 8, label: 'SS' },
    { num: 9, label: 'SV' }
  ];
  const GEN_NAMES = ['', 'RBY', 'GSC', 'ADV', 'DPP', 'BW', 'XY', 'SM', 'SS', 'SV'];

  let gen = 9;
  let notation = '100';
  const ST = () => STATS[gen] || STATS[9];
  const isRBY = () => gen === 1 || gen === 2;
  const statKey = k => (isRBY() && k === 'spa' ? 'spc' : k);

  const state = {
    p1: {},
    p2: {},
    moves1: [],
    moves2: [],
    sel1: 0,
    sel2: 0,
    field: {}
  };

  const blank = () => ({
    name: '', level: 100, nature: 'Serious', ability: '', item: '', gender: '',
    status: '', toxicCounter: 0, curHP: 0, dynamax: false, teraType: '',
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
  });
  state.p1 = blank();
  state.p2 = blank();

  const nameToID = n => {
    const l = ('' + n).toLowerCase();
    return l === 'flabébé' ? 'flabebe' : l.replace(/[^a-z0-9]+/g, '');
  };
  const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
  const pretty = id => id.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const capWords = s => String(s).split('-').map(cap).join(' ');
  const titleCase = s => String(s).split(/[-\s]+/).map(cap).join(' ');

  const listSpecies = () => { const a = []; for (const s of Generations.get(gen).species) a.push(s.name); return a; };
  const listMoves = () => { const a = []; for (const m of Generations.get(gen).moves) a.push(m.name); return a; };
  const listItems = () => { const a = []; for (const i of Generations.get(gen).items) a.push(i.name); return a; };
  const listAbilities = () => { const a = []; for (const ab of Generations.get(gen).abilities) a.push(ab.name); return a; };
  const listTypes = () => { const a = []; for (const t of Generations.get(gen).types) if (t.name !== '???') a.push(t.name); return a; };

  const effVs = (types, t) => types.reduce((m, d) => Math.min(m, t.effectiveness[d] == null ? 1 : t.effectiveness[d]), 99);
  const typeChartTable = () => {
    const chart = C.TYPE_CHART[gen] || C.TYPE_CHART[9];
    const ts = listTypes();
    const cell = v => v === 0 ? '<span class="cm-x">0×</span>' : v === 0.5 ? '<span class="cm-h">½×</span>' : v === 2 ? '<span class="cm-s">2×</span>' : v === 4 ? '<span class="cm-s">4×</span>' : '<span class="cm-n">1×</span>';
    return '<table class="chart"><thead><tr><th>Atq ↓ / Def →</th>' + ts.map(d => '<th class="tt-' + d.toLowerCase() + '">' + typeES(d) + '</th>').join('') + '</tr></thead><tbody>' +
      ts.map(atk => {
        const tdef = chart[atk];
        return '<tr><td class="chart-atk tt-' + atk.toLowerCase() + '">' + typeES(atk) + '</td>' + ts.map(d => {
          const v = tdef ? effVs([d], tdef) : 1;
          return '<td class="chart-cell">' + cell(v) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  };

  const effBadge = (pkmn, moveType) => {
    if (!pkmn || !moveType || !pkmn.types) return '';
    const chart = C.TYPE_CHART[gen] || C.TYPE_CHART[9];
    const at = chart[moveType];
    if (!at) return '';
    const m = effVs(pkmn.types, at);
    const txt = m === 0 ? 'inmune' : m === 0.25 ? '¼×' : m === 0.5 ? '½×' : m === 1 ? '1×' : m === 2 ? '2×' : m === 4 ? '4×' : String(m);
    const cls = m === 0 ? 'immune' : m < 1 ? 'res' : m > 1 ? 'super' : 'nor';
    return '<span class="calc-eff-badge ' + cls + '">' + txt + '</span>';
  };

  const makePokemon = (slot, usedItem) => {
    const s = state[slot];
    const opts = { level: s.level, nature: s.nature, ability: s.ability || undefined, moves: state[slot === 'p1' ? 'moves1' : 'moves2'].filter(Boolean) };
    if (s.gender) opts.gender = s.gender;
    if (s.status) opts.status = s.status;
    if (s.status === 'Toxic') opts.toxicCounter = s.toxicCounter;
    if (s.teraType) opts.teraType = s.teraType;
    if (s.dynamax) opts.dynamax = true;
    const ivs = {};
    const evs = {};
    for (const k of ST()) {
      if (s.ivs[k] != null) ivs[k] = s.ivs[k];
      if (s.evs[k] != null) evs[k] = s.evs[k];
    }
    if (gen <= 2) opts.dvs = ivs; else opts.ivs = ivs;
    opts.evs = evs;
    let item = s.item || undefined;
    if (usedItem && item) item = Pokemon.getForme(gen, s.name, item, usedItem) === s.name ? item : undefined;
    if (item) opts.item = item;
    if (s.curHP > 0 && s.curHP < 99999) opts.curHP = s.curHP;
    return new Pokemon(Generations.get(gen), s.name, opts);
  };

  const evTotal = s => ST().reduce((t, k) => t + (s.evs[k] || 0), 0);

  const comboEl = (ph, items, onPick, value) => {
    const wrap = h('<div class="combo combo-calc"><div class="combo-face"><input type="text" placeholder="' + esc(ph) + '" autocomplete="off"></div><div class="combo-pop"></div></div>');
    const inp = wrap.querySelector('input');
    const pop = wrap.querySelector('.combo-pop');
    let list = [];
    let idx = -1;
    const draw = () => { pop.innerHTML = list.map((it, i) => '<div class="combo-op' + (i === idx ? ' sel' : '') + '" data-i="' + i + '">' + esc(it) + '</div>').join(''); };
    const fill = q => {
      const qq = nameToID(q || '');
      list = items().filter(n => {
        const id = nameToID(n);
        return qq && (id.includes(qq) || qq.includes(id));
      }).slice(0, 30);
      idx = -1;
      draw();
      pop.classList.toggle('on', list.length > 0);
    };
    const close = () => pop.classList.remove('on');
    inp.addEventListener('focus', () => fill(inp.value));
    inp.addEventListener('input', () => { fill(inp.value); onPick(inp.value); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, list.length - 1); draw(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); draw(); e.preventDefault(); }
      else if (e.key === 'Enter') { if (idx >= 0 && list[idx]) { inp.value = list[idx]; onPick(list[idx]); } close(); }
      else if (e.key === 'Escape') close();
    });
    inp.addEventListener('blur', () => setTimeout(close, 120));
    pop.addEventListener('mousedown', e => {
      const o = e.target.closest('.combo-op');
      if (o) { inp.value = list[+o.dataset.i]; onPick(inp.value); close(); e.preventDefault(); }
    });
    if (value != null) inp.value = value;
    return wrap;
  };

  const numField = (label, val, min, max, step, onch, cls) => {
    const el = h('<div class="field calc-n' + (cls ? ' ' + cls : '') + '"><label>' + esc(label) + '</label><input type="number" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>');
    el.querySelector('input').addEventListener('input', e => onch(parseFloat(e.target.value) || 0));
    return el;
  };
  const checkField = (label, val, onch) => {
    const el = h('<label class="calc-chk"><input type="checkbox"' + (val ? ' checked' : '') + '><span>' + esc(label) + '</span></label>');
    el.querySelector('input').addEventListener('change', e => onch(e.target.checked));
    return el;
  };
  const selectField = (label, options, val, onch) => {
    const el = h('<div class="field"><label>' + esc(label) + '</label><select>' + options.map(o => '<option value="' + esc(String(o.v != null ? o.v : o)) + '"' + (String(o.v != null ? o.v : o) === String(val) ? ' selected' : '') + '>' + esc(String(o.t != null ? o.t : o)) + '</option>').join('') + '</select></div>');
    el.querySelector('select').addEventListener('change', e => onch(e.target.value));
    return el;
  };

  const swap = () => {
    [state.p1, state.p2] = [state.p2, state.p1];
    [state.moves1, state.moves2] = [state.moves2, state.moves1];
    const f = state.field;
    [f.isSR1, f.isSR2] = [f.isSR2, f.isSR1];
    [f.spikes1, f.spikes2] = [f.spikes2, f.spikes1];
    [f.steelsurge1, f.steelsurge2] = [f.steelsurge2, f.steelsurge1];
    [f.reflect1, f.reflect2] = [f.reflect2, f.reflect1];
    [f.screen1, f.screen2] = [f.screen2, f.screen1];
    [f.protect1, f.protect2] = [f.protect2, f.protect1];
    [f.seed1, f.seed2] = [f.seed2, f.seed1];
    [f.salt1, f.salt2] = [f.salt2, f.salt1];
    [f.foresight1, f.foresight2] = [f.foresight2, f.foresight1];
    [f.tailwind1, f.tailwind2] = [f.tailwind2, f.tailwind1];
    [f.help1, f.help2] = [f.help2, f.help1];
    [f.aurora1, f.aurora2] = [f.aurora2, f.aurora1];
    [f.powertrick1, f.powertrick2] = [f.powertrick2, f.powertrick1];
    [f.steely1, f.steely2] = [f.steely2, f.steely1];
    [f.battery1, f.battery2] = [f.battery2, f.battery1];
    [f.powerspot1, f.powerspot2] = [f.powerspot2, f.powerspot1];
    [f.charge1, f.charge2] = [f.charge2, f.charge1];
    [f.flowergift1, f.flowergift2] = [f.flowergift2, f.flowergift1];
    [f.switching1, f.switching2] = [f.switching2, f.switching1];
  };

  function renderMonPanel(idx) {
    const slot = idx === 1 ? 'p1' : 'p2';
    const s = state[slot];
    const card = h('<div class="calc-mon"><div class="calc-head"><span class="spr-slot"></span><div><div class="calc-title">Pokémon ' + idx + '</div><div class="calc-sub" data-role="sub"></div></div><button class="icon-btn calc-x" title="Vaciar" style="margin-left:auto">✕</button></div></div>');
    card.querySelector('.calc-x').onclick = () => {
      state[slot] = blank();
      state[idx === 1 ? 'moves1' : 'moves2'] = [ '', '', '', '' ];
      render();
    };

    const grid = h('<div class="calc-form"></div>');
    const nameWrap = comboEl('especie…', listSpecies, v => { s.name = v; recompute() }, s.name);
    const fldName = h('<div class="field"><label>Pokémon</label></div>');
    fldName.appendChild(nameWrap);
    grid.appendChild(fldName);

    grid.appendChild(selectField('Nivel', [{ v: 100, t: '100' }, { v: 50, t: '50' }, { v: 5, t: '5 (Modo Aleatorio)' }], s.level, v => { s.level = parseInt(v, 10) || 100; recompute() }));

    const naturOpts = Object.keys(NATURES).sort();
    grid.appendChild(selectField('Naturaleza', naturOpts, s.nature, v => { s.nature = v; recompute() }));

    grid.appendChild(selectField('Género', ['', 'M', 'F'], s.gender, v => { s.gender = v; recompute() }));

    const abWrap = comboEl('habilidad…', listAbilities, v => { s.ability = v; recompute() }, s.ability);
    const fldAb = h('<div class="field"><label>Habilidad</label></div>');
    fldAb.appendChild(abWrap);
    grid.appendChild(fldAb);

    const itWrap = comboEl('objeto…', listItems, v => { s.item = v; recompute() }, s.item);
    const fldIt = h('<div class="field"><label>Objeto</label></div>');
    fldIt.appendChild(itWrap);
    grid.appendChild(fldIt);

    card.appendChild(grid);

    const statsTbl = h('<table class="calc-stats"><thead><tr><th>Estadística</th><th>Base</th><th>' + (gen <= 2 ? 'DVs' : 'IVs') + '</th><th>EVs</th><th>Final</th></tr></thead><tbody></tbody></table>');
    const tbody = statsTbl.querySelector('tbody');
    let pkmn = null;
    try { if (s.name) pkmn = makePokemon(slot); } catch (e) { pkmn = null; }

    if (!pkmn) {
      tbody.innerHTML = '<tr><td colspan="5" class="calc-empty">' + (s.name ? 'Especie no encontrada en este generación' : 'Busca un Pokémon para empezar') + '</td></tr>';
    } else {
      for (const k of ST()) {
        const base = pkmn.species.baseStats[statKey(k)];
        const row = h('<tr><td class="st-lbl">' + STAT_ES[k] + '</td><td class="st-base">' + base + '</td><td><input type="number" min="0" max="' + (gen <= 2 ? 15 : 31) + '" value="' + s.ivs[k] + '"></td><td><input type="number" min="0" max="252" step="4" value="' + s.evs[k] + '"></td><td class="st-final"><b>' + pkmn.stats[k] + '</b></td></tr>');
        const ins = row.querySelectorAll('input');
        ins[0].addEventListener('input', e => { s.ivs[k] = Math.max(0, Math.min(gen <= 2 ? 15 : 31, parseInt(e.target.value, 10) || 0)); recompute() });
        ins[1].addEventListener('input', e => { s.evs[k] = Math.max(0, Math.min(252, parseInt(e.target.value, 10) || 0)); recompute() });
        tbody.appendChild(row);
      }
      const tot = evTotal(s);
      const fRow = h('<tr class="calc-evrow"><td><b>Total EV</b></td><td></td><td></td><td class="ev-tot' + (tot > 510 ? ' over' : '') + '"><b>' + tot + '</b></td><td></td></tr>');
      tbody.appendChild(fRow);

      const hpPct = h('<div class="calc-hp"></div>');
      const lvl = s.level;
      const hpIn = numField('HP actual / ' + pkmn.stats.hp, s.curHP, 0, pkmn.stats.hp, 1, v => { s.curHP = Math.max(0, Math.min(pkmn.stats.hp, v)); recompute() });
      hpIn.querySelector('input').value = s.curHP || '';
      hpIn.querySelector('input').placeholder = pkmn.stats.hp + ' (máx)';
      hpPct.appendChild(hpIn);
      card.appendChild(hpPct);

      const sprEl = card.querySelector('.spr-slot');
      sprEl.innerHTML = spr(s.name, '', null, false);
      card.querySelector('[data-role=sub]').textContent = '#' + (pkmn.species.num || '—') + ' · ' + pkmn.types.map(typeES).join(' / ');
      card.querySelectorAll('.types-row');
      const tyRow = h('<div class="calc-types">' + pkmn.types.map(t => typeChip(t)).join('') + (s.teraType ? typeChip(s.teraType) : '') + '</div>');
      card.querySelector('.calc-head > div').appendChild(tyRow);
    }
    card.appendChild(statsTbl);

    const stWrap = h('<div class="calc-status"></div>');
    stWrap.appendChild(selectField('Estado', ['', 'Par', 'Psh', 'Tox', 'Brn', 'Frz', 'Slp'].map(v => ({ v, t: { '': 'Sano', 'Par': 'Paralítico', 'Psh': 'Envenenado', 'Tox': 'Tóxico', 'Brn': 'Quemado', 'Frz': 'Congelado', 'Slp': 'Dormido' }[v] })), s.status, v => { s.status = v; recompute() }));
    if (s.status === 'Toxic') stWrap.appendChild(numField('Turnos de tóxico', s.toxicCounter, 1, 6, 1, v => { s.toxicCounter = Math.max(1, Math.min(6, v)); recompute() }));
    stWrap.appendChild(selectField('Tera tipo (SV)', [''].concat(listTypes()), s.teraType, v => { s.teraType = v; recompute() }));
    stWrap.appendChild(checkField('Dynamax (SS/SV)', s.dynamax, v => { s.dynamax = v; recompute() }));
    card.appendChild(stWrap);

    const mvWrap = h('<div class="calc-moves"><div class="calc-moves-title">Movimientos <span>(4 slots)</span></div></div>');
    const mvKey = idx === 1 ? 'moves1' : 'moves2';
    const exKey = idx === 1 ? 'ex1_' : 'ex2_';
    const crKey = idx === 1 ? 'crit1_' : 'crit2_';
    for (let mi = 0; mi < 4; mi++) {
      const box = h('<div class="calc-mvrow"></div>');
      const mc = comboEl('movimiento…', listMoves, v => { state[mvKey][mi] = v; recompute() }, state[mvKey][mi]);
      box.appendChild(mc);
      box.appendChild(checkField('Crít', !!state[crKey + mi], v => { state[crKey + mi] = v; recompute(); }));
      box.appendChild(selectField('Extra', [{ v: '', t: '—' }, { v: 'z', t: 'Z' }, { v: 'max', t: 'Max' }, { v: 'crit', t: 'Crít' }, { v: 'stellar', t: 'Stellar' }], state[exKey + mi] || '', v => { state[exKey + mi] = v; recompute(); }));
      mvWrap.appendChild(box);
    }
    card.appendChild(mvWrap);

    return card;
  }

  function fieldHTML() {
    return '<div class="calc-field"><h3>⚡ Campo de batalla</h3><div class="calc-field-cols"><div class="fcol">' +
      '<div class="fgrp"><h4>Global</h4>' +
      '<label class="lbl">Clima</label><select id="f-weather"><option value="">Ninguno</option><option value="Sun">Sol</option><option value="Rain">Lluvia</option><option value="Sand">Tormenta de arena</option><option value="Hail">Granizo</option><option value="Snow">Nieve</option><option value="Harsh Sunshine">Sol abrasador</option><option value="Heavy Rain">Lluvia intensa</option><option value="Strong Winds">Vientos fuertes</option></select>' +
      '<label class="lbl">Terreno</label><select id="f-terrain"><option value="">Ninguno</option><option value="Electric">Eléctrico</option><option value="Grassy">Hierba</option><option value="Misty">Niebla</option><option value="Psychic">Psíquico</option></select>' +
      '<label class="lbl">Formato</label><select id="f-gametype"><option value="Singles">Singles</option><option value="Doubles">Doubles</option></select>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-magicroom"><span>Magic Room</span></label><label class="calc-chk"><input type="checkbox" id="f-wonderroom"><span>Wonder Room</span></label><label class="calc-chk"><input type="checkbox" id="f-gravity"><span>Gravity</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-beads"><span>Beads of Ruin</span></label><label class="calc-chk"><input type="checkbox" id="f-sword"><span>Sword of Ruin</span></label><label class="calc-chk"><input type="checkbox" id="f-tablets"><span>Tablets of Ruin</span></label><label class="calc-chk"><input type="checkbox" id="f-vessel"><span>Vessel of Ruin</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-aurabreak"><span>Aura Break</span></label><label class="calc-chk"><input type="checkbox" id="f-fairyaura"><span>Fairy Aura</span></label><label class="calc-chk"><input type="checkbox" id="f-darkaura"><span>Dark Aura</span></label></div>' +
      '</div></div><div class="fcol"><div class="fgrp"><h4>Lado de Pokémon 1</h4>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-sr1"><span>Stealth Rock</span></label><label class="calc-chk"><input type="checkbox" id="f-steel1"><span>Steelsurge</span></label></div>' +
      '<label class="lbl">Spikes</label><select id="f-spikes1"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-reflect1"><span>Reflect</span></label><label class="calc-chk"><input type="checkbox" id="f-screen1"><span>Light Screen</span></label><label class="calc-chk"><input type="checkbox" id="f-aurora1"><span>Aurora Veil</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-protect1"><span>Protect</span></label><label class="calc-chk"><input type="checkbox" id="f-seed1"><span>Leech Seed</span></label><label class="calc-chk"><input type="checkbox" id="f-salt1"><span>Salt Cure</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-foresight1"><span>Foresight</span></label><label class="calc-chk"><input type="checkbox" id="f-tailwind1"><span>Tailwind</span></label><label class="calc-chk"><input type="checkbox" id="f-help1"><span>Helping Hand</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-charge1"><span>Charge</span></label><label class="calc-chk"><input type="checkbox" id="f-flower1"><span>Flower Gift</span></label><label class="calc-chk"><input type="checkbox" id="f-powertrick1"><span>Power Trick</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-steely1"><span>Steely Spirit</span></label><label class="calc-chk"><input type="checkbox" id="f-battery1"><span>Battery</span></label><label class="calc-chk"><input type="checkbox" id="f-powerspot1"><span>Power Spot</span></label><label class="calc-chk"><input type="checkbox" id="f-switch1"><span>Cambiar de Pokémon</span></label></div>' +
      '</div></div><div class="fcol"><div class="fgrp"><h4>Lado de Pokémon 2</h4>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-sr2"><span>Stealth Rock</span></label><label class="calc-chk"><input type="checkbox" id="f-steel2"><span>Steelsurge</span></label></div>' +
      '<label class="lbl">Spikes</label><select id="f-spikes2"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-reflect2"><span>Reflect</span></label><label class="calc-chk"><input type="checkbox" id="f-screen2"><span>Light Screen</span></label><label class="calc-chk"><input type="checkbox" id="f-aurora2"><span>Aurora Veil</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-protect2"><span>Protect</span></label><label class="calc-chk"><input type="checkbox" id="f-seed2"><span>Leech Seed</span></label><label class="calc-chk"><input type="checkbox" id="f-salt2"><span>Salt Cure</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-foresight2"><span>Foresight</span></label><label class="calc-chk"><input type="checkbox" id="f-tailwind2"><span>Tailwind</span></label><label class="calc-chk"><input type="checkbox" id="f-help2"><span>Helping Hand</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-charge2"><span>Charge</span></label><label class="calc-chk"><input type="checkbox" id="f-flower2"><span>Flower Gift</span></label><label class="calc-chk"><input type="checkbox" id="f-powertrick2"><span>Power Trick</span></label></div>' +
      '<div class="calc-chkrow"><label class="calc-chk"><input type="checkbox" id="f-steely2"><span>Steely Spirit</span></label><label class="calc-chk"><input type="checkbox" id="f-battery2"><span>Battery</span></label><label class="calc-chk"><input type="checkbox" id="f-powerspot2"><span>Power Spot</span></label><label class="calc-chk"><input type="checkbox" id="f-switch2"><span>Cambiar de Pokémon</span></label></div>' +
      '</div></div></div></div>';
  }

  function buildField() {
    const f = state.field;
    const side = n => ({
      spikes: f['spikes' + n] | 0,
      isSR: !!f['sr' + n],
      steelsurge: !!f['steel' + n],
      isReflect: !!f['reflect' + n],
      isLightScreen: !!f['screen' + n],
      isAuroraVeil: !!f['aurora' + n],
      isProtected: !!f['protect' + n],
      isSeeded: !!f['seed' + n],
      isSaltCured: !!f['salt' + n],
      isForesight: !!f['foresight' + n],
      isTailwind: !!f['tailwind' + n],
      isHelpingHand: !!f['help' + n],
      isCharge: !!f['charge' + n],
      isFlowerGift: !!f['flower' + n],
      isPowerTrick: !!f['powertrick' + n],
      isSteelySpirit: !!f['steely' + n],
      isBattery: !!f['battery' + n],
      isPowerSpot: !!f['powerspot' + n],
      isSwitching: !!f['switch' + n]
    });
    return new Field({
      gameType: f.gameType || 'Singles',
      weather: f.weather || undefined,
      terrain: f.terrain || undefined,
      isMagicRoom: !!f.magicRoom,
      isWonderRoom: !!f.wonderRoom,
      isGravity: !!f.gravity,
      isBeadsOfRuin: !!f.beads,
      isSwordOfRuin: !!f.sword,
      isTabletsOfRuin: !!f.tablets,
      isVesselOfRuin: !!f.vessel,
      isAuraBreak: !!f.aurabreak,
      isFairyAura: !!f.fairyaura,
      isDarkAura: !!f.darkaura,
      attackerSide: side(1),
      defenderSide: side(2)
    });
  }

  function moveOptions(att, slot, mi) {
    const mv = state[slot][mi];
    if (!mv) return null;
    const opts = { ability: att.ability, item: att.item };
    if (state[(att === state.p1 ? 'ex1_' : 'ex2_') + mi] === 'z') opts.useZ = true;
    if (state[(att === state.p1 ? 'ex1_' : 'ex2_') + mi] === 'max') opts.useMax = true;
    if (state[(att === state.p1 ? 'ex1_' : 'ex2_') + mi] === 'stellar') opts.isStellarFirstUse = true;
    const isCrit = !!state[(att === state.p1 ? 'crit1_' : 'crit2_') + mi] || state[(att === state.p1 ? 'ex1_' : 'ex2_') + mi] === 'crit';
    if (isCrit) opts.isCrit = true;
    return new Move(Generations.get(gen), mv, opts);
  }

  function resultLine(res, att, def, mv, attIdx, moveIdx) {
    const [min, max] = res.range();
    const hp = res.defender.stats.hp;
    const desc = res.fullDesc(notation === '48' ? '48' : '%');
    let ko;
    try { ko = res.kochance().text; } catch (e) { ko = ''; }
    const badge = effBadge(def, mv.type);
    return '<div class="calc-rline" data-att="' + attIdx + '" data-mv="' + moveIdx + '"><div class="calc-rmain"><b>' + min + '-' + max + '</b> <span class="calc-pct">' + (Math.round(min / hp * 1000) / 10) + '%–' + (Math.round(max / hp * 1000) / 10) + '%</span> ' + badge + '</div><div class="calc-rdesc">' + esc(desc) + '</div>' + (ko ? '<div class="calc-rko">KO: ' + esc(ko) + '</div>' : '') + '</div>';
  }

  function renderResults() {
    const box = root.querySelector('#calc-results');
    if (!box) return;
    if (!state.p1.name || !state.p2.name) {
      box.innerHTML = '<div class="calc-res-empty">Elige los dos Pokémon para ver el daño.</div>';
      return;
    }
    const m1 = state.moves1[state.sel1];
    const m2 = state.moves2[state.sel2];
    let html = '';
    try {
      const a = makePokemon('p1', m1 || undefined);
      const b = makePokemon('p2', m2 || undefined);
      const field = buildField();
      const mkMove = (name, slot, mi) => {
        const atk = slot === 'p1' ? a : b;
        const opts = { ability: atk.ability, item: atk.item };
        const ex = state[(slot === 'p1' ? 'ex1_' : 'ex2_') + mi];
        if (ex === 'z') opts.useZ = true;
        if (ex === 'max') opts.useMax = true;
        if (ex === 'stellar') opts.isStellarFirstUse = true;
        const crit = state[(slot === 'p1' ? 'crit1_' : 'crit2_') + mi];
        if (crit || ex === 'crit') opts.isCrit = true;
        return new Move(Generations.get(gen), name, opts);
      };
      if (m1) {
        const mv = mkMove(m1, 'p1', state.sel1);
        const res = calculate(gen, a, b, mv, field);
        html += '<div class="calc-res-group"><div class="calc-res-title">' + esc(a.name || '') + ' <span class="calc-ar">→</span> ' + esc(b.name || '') + ' · ' + esc(mv.name) + '</div>';
        html += resultLine(res, a, b, mv, 1, state.sel1);
        html += '</div>';
      } else if (state.moves1.filter(Boolean).length) {
        html += '<div class="calc-res-group"><div class="calc-res-title">' + esc(a.name || '') + ' <span class="calc-ar">→</span> ' + esc(b.name || '') + '</div><div class="calc-res-empty">Selecciona un movimiento arriba.</div></div>';
      }
      if (m2) {
        const mv2 = mkMove(m2, 'p2', state.sel2);
        const res2 = calculate(gen, b, a, mv2, field);
        html += '<div class="calc-res-group"><div class="calc-res-title">' + esc(b.name || '') + ' <span class="calc-ar">→</span> ' + esc(a.name || '') + ' · ' + esc(mv2.name) + '</div>';
        html += resultLine(res2, b, a, mv2, 2, state.sel2);
        html += '</div>';
      }
    } catch (e) {
      html = '<div class="calc-res-empty">⚠️ ' + esc(String(e && e.message || e)) + '</div>';
    }
    box.innerHTML = html || '<div class="calc-res-empty">Elige un movimiento en cada panel para ver el resultado.</div>';

    box.querySelectorAll('.calc-rline').forEach(r => {
      r.onclick = () => {
        const t = r.textContent;
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('Copiado', 'ok'));
      };
    });

    const all = root.querySelector('#calc-all');
    if (all && all.checked) renderAllMoves(box);
  }

  function renderAllMoves(box) {
    try {
      const a = makePokemon('p1');
      const b = makePokemon('p2');
      const field = buildField();
      const renderSide = (att, def, attMoves, attKey) => {
        let html = '';
        let i = 0;
        for (const raw of state[attKey]) {
          if (!raw) { i++; continue; }
          try {
            const mv = new Move(Generations.get(gen), raw, { ability: att.ability, item: att.item, isCrit: !!state[(attKey === 'moves1' ? 'crit1_' : 'crit2_') + i] });
            const res = calculate(gen, att, def, mv, field);
            html += '<button class="calc-mvchip" data-side="' + attKey + '" data-mv="' + i + '">' + esc(mv.name) + ' <b>' + (Math.round(res.range()[0] / def.stats.hp * 1000) / 10) + '%' + (res.range()[0] !== res.range()[1] ? '–' + (Math.round(res.range()[1] / def.stats.hp * 1000) / 10) + '%' : '') + '</b></button>';
          } catch (e) {}
          i++;
        }
        return html;
      };
      box.insertAdjacentHTML('beforeend', '<div class="calc-allbox"><div class="calc-all-title">' + esc(a.name || '') + ' vs ' + esc(b.name || '') + '</div>' + renderSide(a, b, state.moves1, 'moves1') + '</div><div class="calc-allbox"><div class="calc-all-title">' + esc(b.name || '') + ' vs ' + esc(a.name || '') + '</div>' + renderSide(b, a, state.moves2, 'moves2') + '</div>');
      box.querySelectorAll('.calc-mvchip').forEach(ch => {
        ch.onclick = () => {
          const mvIdx = +ch.dataset.mv;
          if (ch.dataset.side === 'moves1') state.sel1 = mvIdx; else state.sel2 = mvIdx;
          render();
        };
      });
    } catch (e) {}
  }

  let root;
  function render() {
    root.innerHTML = '';

    const top = h('<div class="calc-top"><div class="calc-title-block"><h2 class="section-title">Calculadora de daño</h2><p>Mismo motor que <b>calc.pokemonshowdown.com</b> (@smogon/calc): generaciones 1–9, EVs/IVs, climas, terrenos, campos laterales y tabla de tipos.</p></div>' +
      '<div class="calc-controls"><div class="seg" id="calc-gen">' + GENS.map(g => '<button data-g="' + g.num + '" class="' + (gen === g.num ? 'on' : '') + '" title="' + g.label + '">' + g.label + '</button>').join('') + '</div>' +
      '<div class="seg" id="calc-not">' + [{ v: '100', t: '%' }, { v: '48', t: '48/48' }].map(o => '<button data-n="' + o.v + '" class="' + (notation === o.v ? 'on' : '') + '">' + o.t + '</button>').join('') + '</div>' +
      '<button class="btn btn-sm" id="calc-swap">⇄ Intercambiar</button></div></div>');

    top.querySelector('#calc-gen').addEventListener('click', e => {
      const b = e.target.closest('button[data-g]');
      if (!b) return;
      gen = +b.dataset.g;
      const st = ST();
      [state.p1, state.p2].forEach(s => {
        const oIV = Object.assign({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }, s.ivs);
        s.ivs = {};
        for (const k of st) s.ivs[k] = oIV[k] == null ? 31 : oIV[k];
      });
      render();
    });
    top.querySelector('#calc-not').addEventListener('click', e => {
      const b = e.target.closest('button[data-n]');
      if (!b) return;
      notation = b.dataset.n;
      render();
    });
    top.querySelector('#calc-swap').onclick = () => { swap(); render(); };

    root.appendChild(top);

    const mons = h('<div class="calc-mons"></div>');
    mons.appendChild(renderMonPanel(1));
    const mid = h('<div class="calc-mid"><button class="btn btn-gold" id="swap2">⇄</button><div class="calc-vs">VS</div><div class="calc-mid-ctl"><div class="field"><label style="color:var(--muted);font-size:12px">Movimiento P1</label><select id="sel-m1"></select></div><div class="field"><label style="color:var(--muted);font-size:12px">Movimiento P2</label><select id="sel-m2"></select></div></div></div>');
    mons.appendChild(mid);
    mons.appendChild(renderMonPanel(2));
    root.appendChild(mons);

    const s1 = mons.querySelector('#sel-m1');
    const s2 = mons.querySelector('#sel-m2');
    s1.innerHTML = state.moves1.map((m, i) => m ? '<option value="' + i + '"' + (i === state.sel1 ? ' selected' : '') + '>' + esc(m) + '</option>' : '').join('');
    s2.innerHTML = state.moves2.map((m, i) => m ? '<option value="' + i + '"' + (i === state.sel2 ? ' selected' : '') + '>' + esc(m) + '</option>' : '').join('');
    s1.onchange = () => { state.sel1 = +s1.value; recompute(); };
    s2.onchange = () => { state.sel2 = +s2.value; recompute(); };
    if (!state.moves1.filter(Boolean)[state.sel1]) state.sel1 = state.moves1.findIndex(Boolean) >= 0 ? state.moves1.findIndex(Boolean) : 0;

    root.appendChild(h(fieldHTML()));
    const fw = root.querySelector('#f-weather');
    const ft = root.querySelector('#f-terrain');
    const fg = root.querySelector('#f-gametype');
    const bindChk = (id, key) => {
      const el = root.querySelector('#' + id);
      if (!el) return;
      const f = state.field;
      if (f[key] != null) el.checked = !!f[key];
      el.onchange = () => { f[key] = el.checked; recompute(); };
    };
    const bindNum = (id, key) => {
      const el = root.querySelector('#' + id);
      if (!el) return;
      const f = state.field;
      if (f[key] != null) el.value = String(f[key]);
      el.onchange = () => { f[key] = +el.value; recompute(); };
    };
    if (state.field.weather) fw.value = state.field.weather;
    if (state.field.terrain) ft.value = state.field.terrain;
    if (state.field.gameType) fg.value = state.field.gameType;
    fw.onchange = () => { state.field.weather = fw.value; recompute(); };
    ft.onchange = () => { state.field.terrain = ft.value; recompute(); };
    fg.onchange = () => { state.field.gameType = fg.value; recompute(); };
    ['magicroom', 'wonderroom', 'gravity', 'beads', 'sword', 'tablets', 'vessel', 'aurabreak', 'fairyaura', 'darkaura'].forEach(k => bindChk('f-' + k, k));
    for (let n = 1; n <= 2; n++) {
      ['sr', 'steel', 'reflect', 'screen', 'aurora', 'protect', 'seed', 'salt', 'foresight', 'tailwind', 'help', 'charge', 'flower', 'powertrick', 'steely', 'battery', 'powerspot', 'switch'].forEach(k => bindChk('f-' + k + n, k + n));
      bindNum('f-spikes' + n, 'spikes' + n);
    }

    const res = h('<div class="calc-results" id="calc-results"><div class="calc-res-empty">Elige los dos Pokémon para ver el daño.</div></div>');
    const resTop = h('<div class="calc-res-top"><h3>📊 Resultados</h3><label class="calc-chk"><input type="checkbox" id="calc-all"><span>Ver todas las combos (matriz)</span></label><button class="btn btn-sm" id="res-copy">📋 Copiar resultado</button></div>');
    root.appendChild(resTop);
    root.appendChild(res);
    resTop.querySelector('#calc-all').onchange = e => { if (e.target.checked) { renderResults(); } else render(); };
    resTop.querySelector('#res-copy').onclick = () => {
      const t = res.innerText.replace(/\n{2,}/g, '\n').trim();
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('Resultado copiado', 'ok'));
    };

    root.appendChild(h('<div class="calc-chart-wrap"><h3>🧪 Tabla de tipos · ' + GEN_NAMES[gen] + '</h3><div class="chart-scroll"></div></div>'));
    root.querySelector('.chart-scroll').innerHTML = typeChartTable();

    renderResults();
  }

  function recompute() {
    renderResults();
    const box = root.querySelector('#calc-results');
    if (box && root.querySelector('#calc-all') && root.querySelector('#calc-all').checked) renderAllMoves(box);
  }

  root = h('<div class="calc-wrap"></div>');
  app.appendChild(root);
  render();
}


async function viewDex() {
  const app = document.getElementById('app');
  app.appendChild(h('<h2 class="section-title">Pokédex · todos los sprites</h2><div class="dexbar"><input id="dexq" placeholder="Buscar por nombre, tipo o nº…" style="max-width:360px"><select id="dextype"><option value="">Todos los tipos</option>' + TYPES.map(t => '<option value="' + t + '">' + typeES(t) + '</option>').join('') + '</select><span style="color:var(--dim);font-size:13px" id="dexcount">cargando…</span></div><div class="dex-grid" id="dexgrid"></div>'));

  const grid = app.querySelector('#dexgrid');
  const count = app.querySelector('#dexcount');
  const idx = await loadPokemonIndex();

  const render = list => {
    grid.innerHTML = list.slice(0, 240).map(p => '<div class="dex-card" data-name="' + p.name + '" style="--tc:' + (dexIndexCache[p.name] ? typeColor(dexIndexCache[p.name].types[0]) : '') + '"><span class="no">#' + String(p.id).padStart(4, '0') + '</span>' + spr(p.name, '') + '<div class="nm">' + esc(p.name) + '</div><div class="ty">' + (dexIndexCache[p.name] ? dexIndexCache[p.name].types.map(miniType).join('') : '') + '</div></div>').join('');

    grid.querySelectorAll('.dex-card').forEach(c => {
      c.onclick = () => openMon(c.dataset.name);
      if (!dexIndexCache[c.dataset.name]) {
        getPokemonDetail(c.dataset.name).then(d => {
          if (d) {
            dexIndexCache[c.dataset.name] = d;
            const ty = c.querySelector('.ty');
            if (ty) ty.innerHTML = d.types.map(miniType).join('');
            c.style.setProperty('--tc', typeColor(d.types[0]));
          }
        });
      }
    });
  };

  const apply = () => {
    const q = slug(document.getElementById('dexq').value);
    const ty = document.getElementById('dextype').value;
    const f = idx.filter(p => (!q || slug(p.name).includes(q)) && (!ty || ((dexIndexCache[p.name] || {}).types || []).includes(ty)));
    count.textContent = f.length + ' resultados';
    render(f);
  };

  document.getElementById('dexq').oninput = apply;
  document.getElementById('dextype').onchange = apply;
  count.textContent = idx.length + ' Pokémon';
  render(idx);

  let n = 0;
  const tick = setInterval(async () => {
    for (let i = 0; i < 12 && n < idx.length; i++, n++) {
      const d = await getPokemonDetail(idx[n].name);
      if (d) dexIndexCache[idx[n].name] = d;
    }
    if (n >= idx.length) clearInterval(tick);
  }, 250);
}

function openMon(name) {
  const d = dexIndexCache[name] || {};
  modal(
    name,
    '<div style="display:flex;gap:14px;align-items:center">' + spr(name, '', 'ani') + '<div><div style="display:flex;gap:6px">' + (d.types || []).map(typeChip).join('') + '</div><div style="margin-top:8px;font-family:var(--mono);font-size:12px;color:var(--muted)">' + STATS.map(k => STAT_ES[k] + ': ' + (d.stats ? d.stats[k] : '—')).join(' · ') + '</div></div></div><div style="margin-top:14px"><button class="btn btn-primary" data-add>Añadir al equipo</button></div>',
    back => {
      back.querySelector('[data-add]').onclick = async () => {
        let s = sets.find(x => !x.species);
        if (!s) {
          if (sets.length < Settings.size) {
            sets.push(blank());
            s = sets[sets.length - 1];
          } else {
            toast('Equipo lleno', 'warn');
            return;
          }
        }

        s.species = name;
        s.form = '';
        s.shiny = Settings.shiny;

        const dd = await getPokemonDetail(name);
        if (dd) dexIndexCache[name] = dd;

        back.remove();
        location.hash = '#/constructor';
        toast(name + ' añadido', 'ok');
      };
    }
  );
}

function viewSettings() {
  const app = document.getElementById('app');
  app.appendChild(h('<h2 class="section-title">Ajustes</h2><div class="card"><div class="opt"><div><h4>Modo de salas</h4><p>Relay · backend compartido. Cualquier persona con el código puede unirse desde su dispositivo.</p></div><span class="badge badge-relay">RELAY</span></div><div class="opt"><div><h4>URL del backend Relay</h4><p>Solo cámbiala si despliegas otro worker.</p></div><input id="relayurl" value="' + esc(Store.relayUrl) + '" style="max-width:320px"></div><div class="opt"><div><h4>Estilo de sprite</h4><p>Misma fuente que pokepaste (Showdown).</p></div><select id="sstyle" style="max-width:200px">' + [['showdown','Showdown'],['ani','Gen V animado'],['gen5','Gen V estático'],['xy','XY'],['orig','Original']].map(o => '<option value="' + o[0] + '" ' + (Settings.sprite === o[0] ? 'selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div><div class="opt"><div><h4>Shiny por defecto</h4></div><input type="checkbox" id="sshiny" ' + (Settings.shiny ? 'checked' : '') + '></div><div class="opt"><div><h4>Tamaño del equipo</h4></div><select id="ssize" style="max-width:120px">' + [1,2,3,4,5,6].map(n => '<option ' + (Settings.size === n ? 'selected' : '') + '>' + n + '</option>').join('') + '</select></div><div class="opt"><div><h4>Tu nombre de entrenador</h4><p>Es el que se ve en la sala y en el intercambio.</p></div><div style="display:flex;gap:8px"><input id="sname" value="' + esc(Settings.name) + '" style="max-width:160px"><button class="btn btn-sm" id="changename">Cambiar</button></div></div><div class="opt"><div><h4>Caché Pokédex</h4></div><button class="btn btn-sm btn-danger" id="clearcache">Vaciar</button></div></div>'));

  app.querySelector('#relayurl').onchange = e => {
    Store.relayUrl = e.target.value.trim();
  };
  app.querySelector('#sstyle').onchange = e => {
    Settings.sprite = e.target.value;
    saveSettings();
  };
  app.querySelector('#sshiny').onchange = e => {
    Settings.shiny = e.target.checked;
    saveSettings();
  };
  app.querySelector('#ssize').onchange = e => {
    Settings.size = +e.target.value;
    saveSettings();
  };
  app.querySelector('#sname').onchange = e => {
    Settings.name = e.target.value;
    saveSettings();
  };
  app.querySelector('#clearcache').onclick = () => {
    ['cpaste.dex.p', 'cpaste.dex.i'].forEach(k => localStorage.removeItem(k));
    DexCache.pokemon = DexCache.items = null;
    toast('Caché vaciada', 'ok');
  };
  app.querySelector('#changename').onclick = () => {
    Settings.name = '';
    saveSettings();
    ensureNameGate();
  };
}

function startBg() {
  const cv = document.getElementById('spritefield');
  if (!cv) return;

  const ctx = cv.getContext('2d');
  const cols = Object.values(TYPE_COLOR);
  let P = [];

  const resize = () => {
    cv.width = innerWidth;
    cv.height = innerHeight;
    P = [];
    const n = Math.min(70, Math.floor(innerWidth / 26));
    for (let i = 0; i < n; i++) {
      P.push({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        r: 1 + Math.random() * 2.4,
        vx: (Math.random() - .5) * .25,
        vy: (Math.random() - .5) * .25,
        c: cols[Math.floor(Math.random() * cols.length)],
        a: .2 + Math.random() * .5
      });
    }
  };

  resize();
  addEventListener('resize', resize);

  (function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of P) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = cv.width;
      if (p.x > cv.width) p.x = 0;
      if (p.y < 0) p.y = cv.height;
      if (p.y > cv.height) p.y = 0;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  })();
}

/* ================= CUENTAS / NUBE ================= */
const CP_DEFAULT_RELAY = "https://ciega-relay.santimartinezcordoba.workers.dev";

let cpAccount = null;
try {
  cpAccount = JSON.parse(localStorage.getItem("cpaste.account") || "null");
} catch (e) {
  cpAccount = null;
}

function cpBase() {
  return (localStorage.getItem("cpaste.relay") || CP_DEFAULT_RELAY).replace(/\/+$/, "");
}

function cpEsc(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[c]));
}

async function cpApi(path, body = {}, method = "POST") {
  const headers = {};
  if (cpAccount && cpAccount.token) headers["x-cpaste-token"] = cpAccount.token;

  let url = cpBase() + path;
  const opts = { method, headers };

  if (method === "GET") {
    const qs = new URLSearchParams(body || {}).toString();
    if (qs) url += "?" + qs;
  } else {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body || {});
  }

  const res = await fetch(url, opts);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { ok:false, error:"Respuesta no JSON (" + res.status + ")" };
  }

  if (res.status === 401 && cpAccount) cpLogout(false);
  if (!res.ok || !data.ok) throw new Error(data.error || ("HTTP " + res.status));
  return data;
}

function cpTeamsKey() {
  const accName = cpAccount && cpAccount.name ? cpAccount.name : "";
  const displayName = typeof myName === "function" ? myName() : "";
  return "cpaste.teams." + (accName || displayName || "Anon");
}

function cpSetAccount(a) {
  cpAccount = a || null;
  if (cpAccount) localStorage.setItem("cpaste.account", JSON.stringify(cpAccount));
  else localStorage.removeItem("cpaste.account");
}

async function cpPullTeams(showAlert = false) {
  if (!cpAccount || !cpAccount.token) return null;
  const d = await cpApi("/api/teams.get", {}, "GET");
  localStorage.setItem(cpTeamsKey(), JSON.stringify(d.teams || []));
  if (showAlert) alert("Equipos descargados: " + (d.teams || []).length);
  return d.teams || [];
}

async function cpPushTeams(showAlert = true) {
  if (!cpAccount || !cpAccount.token) {
    alert("Primero inicia sesión.");
    return;
  }
  const teams = typeof loadMyTeams === "function" ? loadMyTeams() : JSON.parse(localStorage.getItem(cpTeamsKey()) || "[]");
  const d = await cpApi("/api/teams.save", { teams: teams || [] });
  localStorage.setItem(cpTeamsKey(), JSON.stringify(d.teams || []));
  if (showAlert) alert("Equipos subidos: " + (d.teams || []).length);
  return d.teams || [];
}

async function cpImportLocalTeams() {
  if (!cpAccount || !cpAccount.token) {
    alert("Primero inicia sesión.");
    return;
  }
  const oldKey = "cpaste.teams." + (typeof myName === "function" ? myName() : "");
  const old = JSON.parse(localStorage.getItem(oldKey) || "[]");
  if (!old.length) {
    alert("No hay equipos locales para importar.");
    return;
  }
  const d = await cpApi("/api/teams.save", { teams: old });
  localStorage.setItem(cpTeamsKey(), JSON.stringify(d.teams || []));
  alert("Importados: " + (d.teams || []).length);
}

async function cpRegister() {
  const name = (document.getElementById("cpName")?.value || "").trim();
  const pass = document.getElementById("cpPass")?.value || "";
  if (!name || !pass) {
    alert("Usuario y contraseña obligatorios");
    return;
  }

  try {
    const d = await cpApi("/api/register", { name, pass });
    cpSetAccount({ token:d.token, name:d.name });
    await cpPullTeams(false);
    cpRenderChip();
    cpCloseAccountModal();
    alert("Cuenta creada: " + d.name);
  } catch (e) {
    alert("No se pudo crear: " + e.message);
  }
}

async function cpLogin() {
  const name = (document.getElementById("cpName")?.value || "").trim();
  const pass = document.getElementById("cpPass")?.value || "";
  if (!name || !pass) {
    alert("Usuario y contraseña obligatorios");
    return;
  }

  try {
    const d = await cpApi("/api/login", { name, pass });
    cpSetAccount({ token:d.token, name:d.name });
    await cpPullTeams(false);
    cpRenderChip();
    cpCloseAccountModal();
    alert("Conectado como " + d.name);
  } catch (e) {
    alert("No se pudo entrar: " + e.message);
  }
}

function cpLogout(callApi = true) {
  if (cpAccount && cpAccount.token && callApi) {
    cpApi("/api/logout", { token: cpAccount.token }).catch(() => {});
  }
  cpSetAccount(null);
  cpRenderChip();
}

function cpModalHTML() {
  if (cpAccount) {
    return `
      <div class="cp-modal-box">
        <button class="cp-modal-x" onclick="cpCloseAccountModal()" title="Cerrar">✕</button>
        <h3 style="margin-top:0;">Cuenta</h3>
        <p style="margin:6px 0 14px;">Conectado como <b>${cpEsc(cpAccount.name)}</b></p>
        <div class="cp-modal-row">
          <button onclick="cpPullTeams(true)">Descargar equipos</button>
          <button onclick="cpPushTeams(true)">Subir equipos</button>
        </div>
        <div class="cp-modal-row">
          <button onclick="cpImportLocalTeams()">Importar locales</button>
          <button class="cp-modal-danger" onclick="cpLogout(true); cpRenderChip(); cpCloseAccountModal();">Cerrar sesión</button>
        </div>
        <p class="cp-modal-note">Mismo usuario + misma contraseña en dos dispositivos = mismos equipos en la nube.</p>
      </div>`;
  }

  return `
    <div class="cp-modal-box">
      <button class="cp-modal-x" onclick="cpCloseAccountModal()" title="Cerrar">✕</button>
      <h3 style="margin-top:0;">Cuenta</h3>
      <input id="cpName" placeholder="Usuario" maxlength="32" autocomplete="username">
      <input id="cpPass" type="password" placeholder="Contraseña" maxlength="64" autocomplete="current-password">
      <div class="cp-modal-row">
        <button class="cp-modal-primary" onclick="cpRegister()">Crear cuenta</button>
        <button onclick="cpLogin()">Entrar</button>
      </div>
      <p class="cp-modal-note">Puedes cerrar esto con la ✕ y seguir usando la página. Para volver a abrirlo, pulsa el botón «Cuenta» abajo a la derecha.</p>
    </div>`;
}

function cpOpenAccountModal() {
  let host = document.getElementById("cpModalHost");
  if (!host) {
    host = document.createElement("div");
    host.id = "cpModalHost";
    document.body.appendChild(host);
  }

  host.innerHTML = `<div class="cp-modal-bg" onclick="if(event.target===this)cpCloseAccountModal(true)">${cpModalHTML()}</div>`;

  const inp = host.querySelector("#cpName");
  if (inp) setTimeout(() => inp.focus(), 30);

  document.addEventListener("keydown", cpModalEsc);
}

function cpCloseAccountModal(dismiss = false) {
  const host = document.getElementById("cpModalHost");
  if (host) host.innerHTML = "";
  document.removeEventListener("keydown", cpModalEsc);
  if (dismiss && !cpAccount) sessionStorage.setItem("cpaste.loginDismissed", "1");
}

function cpModalEsc(e) {
  if (e.key === "Escape") cpCloseAccountModal(true);
}

function cpRenderChip() {
  let chip = document.getElementById("cpChip");
  if (!chip) {
    chip = document.createElement("button");
    chip.id = "cpChip";
    chip.className = "cp-chip";
    chip.onclick = () => {
      sessionStorage.removeItem("cpaste.loginDismissed");
      cpOpenAccountModal();
    };
    document.body.appendChild(chip);
  }

  chip.textContent = cpAccount ? ("👤 " + cpAccount.name) : "🔒 Cuenta";
}

function cpMaybeOpenOnLoad() {
  if (cpAccount) return;
  if (sessionStorage.getItem("cpaste.loginDismissed")) return;
  cpOpenAccountModal();
}

function cpInitAccount() {
  if (!document.getElementById("cpModalStyle")) {
    const st = document.createElement("style");
    st.id = "cpModalStyle";
    st.textContent = `
      .cp-modal-bg {
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.6);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:1200;
        padding:16px;
      }
      .cp-modal-box {
        background:#141a26;
        border:1px solid #3a4a66;
        border-radius:12px;
        color:#e8eefc;
        max-width:360px;
        width:100%;
        padding:18px 18px 14px;
        position:relative;
        box-shadow:0 10px 40px rgba(0,0,0,.5);
      }
      .cp-modal-box h3 { color:#ffd24a }
      .cp-modal-x {
        position:absolute;
        top:8px;
        right:8px;
        background:none;
        border:none;
        color:#9fb0cc;
        font-size:18px;
        cursor:pointer;
        line-height:1;
      }
      .cp-modal-x:hover { color:#fff }
      .cp-modal-box input {
        width:100%;
        box-sizing:border-box;
        margin:6px 0;
        padding:8px;
        border:1px solid #3a4a66;
        border-radius:6px;
        background:#0d121c;
        color:#e8eefc;
      }
      .cp-modal-row {
        display:flex;
        gap:8px;
        margin-top:10px;
        flex-wrap:wrap;
      }
      .cp-modal-row button {
        flex:1;
        min-width:120px;
        padding:8px;
        border:1px solid #3a4a66;
        border-radius:6px;
        background:#1f2a40;
        color:#e8eefc;
        cursor:pointer;
      }
      .cp-modal-row button:hover { background:#2a3856 }
      .cp-modal-primary {
        background:#2f6df0 !important;
        border-color:#2f6df0 !important;
      }
      .cp-modal-danger {
        background:#5a2430 !important;
        border-color:#8a3a4a !important;
      }
      .cp-modal-note {
        font-size:12px;
        opacity:.7;
        margin:12px 0 0;
      }
      .cp-chip {
        position:fixed;
        right:14px;
        bottom:14px;
        z-index:1100;
        background:#1f2a40;
        border:1px solid #3a4a66;
        color:#e8eefc;
        padding:8px 12px;
        border-radius:20px;
        cursor:pointer;
        font-size:13px;
        box-shadow:0 4px 14px rgba(0,0,0,.4);
      }
      .cp-chip:hover { background:#2a3856 }
    `;
    document.head.appendChild(st);
  }

  cpRenderChip();
  cpMaybeOpenOnLoad();

  window.addEventListener("hashchange", () => {
    if (cpAccount && cpAccount.token && location.hash.startsWith("#/equipos")) {
      cpPullTeams(false).catch(e => console.warn("cpull", e));
    }
  });

  if (cpAccount && cpAccount.token) {
    cpPullTeams(false).catch(e => console.warn("cpull init", e));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", cpInitAccount);
} else {
  cpInitAccount();
}

if (typeof window.saveCurrentTeam === "function") {
  const _cpOldSaveCurrentTeam = window.saveCurrentTeam;
  window.saveCurrentTeam = async function () {
    const res = await _cpOldSaveCurrentTeam.apply(this, arguments);
    if (cpAccount && cpAccount.token) {
      try {
        await cpPushTeams(false);
      } catch (e) {
        console.warn("cpush", e);
        alert("Guardado local, pero fallo al subir a la nube: " + e.message);
      }
    }
    return res;
  };
}

window.teamsKey = cpTeamsKey;

/* ================= EQUIPOS ================= */
function cpSetToText(s) {
  if (!s) return '';
  if (typeof s === 'string') return s;

  const sp = s.species || s.name || s.pokemon || s.nat || '';
  const nick = s.nick || s.nickname || '';
  const item = s.item || '';
  const head = (nick && sp && nick.toLowerCase() !== sp.toLowerCase()) ? `${nick} (${sp})` : (sp || nick);
  const out = [head + (item ? ` @ ${item}` : '')];

  if (s.level && Number(s.level) !== 100) out.push(`Level: ${s.level}`);
  if (s.nature) out.push(`${s.nature} Nature`);
  if (s.ability) out.push(`Ability: ${s.ability}`);

  const ev = s.evs || s.EVs || {};
  const K = [['hp','hp'],['atk','atk'],['def','def'],['spa','spa'],['spd','spd'],['spe','spe']];
  const evP = K.map(([k, l]) => {
    const v = Number(ev[k]);
    return v ? `${v} ${l}` : '';
  }).filter(Boolean);
  if (evP.length) out.push(`EVs: ${evP.join(' / ')}`);

  const iv = s.ivs || s.IVs || {};
  const ivP = K.map(([k, l]) => {
    const v = Number(iv[k]);
    return (v && v !== 31) ? `${v} ${l}` : '';
  }).filter(Boolean);
  if (ivP.length) out.push(`IVs: ${ivP.join(' / ')}`);

  if (s.shiny) out.push('Shiny: Yes');
  (s.moves || []).filter(Boolean).forEach(m => out.push(`- ${m}`));

  return out.filter(Boolean).join('\n');
}

function cpTeamText(team) {
  if (typeof team === 'string') return team;
  if (Array.isArray(team)) return team.map(cpSetToText).join('\n\n').trim();
  return '';
}

function cpReadTeams() {
  let a = [];
  try {
    a = JSON.parse(localStorage.getItem(cpTeamsKey()) || '[]');
  } catch (e) {
    a = [];
  }

  if (!Array.isArray(a)) a = [];

  if (!a.length) {
    const old = localStorage.getItem('cpaste.teams.' + (typeof myName === "function" ? myName() : ''));
    if (old) {
      try { a = JSON.parse(old) } catch (e) {}
      if (a.length) localStorage.setItem(cpTeamsKey(), JSON.stringify(a));
    }
  }

  a.forEach(t => {
    if (t && t.team && typeof t.team !== 'string') t.team = cpTeamText(t.team);
  });

  return a;
}

function cpWriteTeams(a) {
  localStorage.setItem(cpTeamsKey(), JSON.stringify(a));
  if (cpAccount && cpAccount.token) cpPushTeams(false).catch(() => {});
}

function cpFindTeam(id) {
  return cpReadTeams().find(t => String(t.id) === String(id));
}

function cpExportTeam(id) {
  const t = cpFindTeam(id);
  if (!t) {
    alert('No encontrado');
    return;
  }

  const done = () => alert('Equipo copiado. Pégalo donde quieras.');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t.team).then(done).catch(() => cpCopyFallback(t.team, done));
  } else {
    cpCopyFallback(t.team, done);
  }
}

function cpCopyFallback(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    done();
  } catch (e) {}
  document.body.removeChild(ta);
}

function cpDeleteTeam(id) {
  if (!confirm('¿Borrar este equipo?')) return;
  cpWriteTeams(cpReadTeams().filter(t => String(t.id) !== String(id)));
  cpRenderTeams();
}

function cpNewTeam() {
  location.hash = '#/editar/new';
}

/* ================= EDICIÓN DE EQUIPOS ================= */
var cpPrevSets = null;
var cpPendingTxt = '';
let cpEditTeamId = null;

function cpEditView(id) {
  if (typeof viewBuilder !== "function") {
    const a = document.getElementById('app');
    if (a) a.innerHTML = '<p>No encuentro el constructor.</p>';
    return;
  }

  cpPrevSets = (typeof sets !== "undefined" && Array.isArray(sets)) ? sets : [];
  sets = (id && id !== 'new' && cpFindTeam(id)) ? (parseTeam(cpFindTeam(id).team) || []) : [];
  cpEditTeamId = id || 'new';

  viewBuilder();

  const inp = document.getElementById('cpEditName');
  if (inp) {
    const cur = (id && id !== 'new') ? cpFindTeam(id) : null;
    inp.value = cur ? cur.name : '';
  }
}

function cpPatchBuilderBar() {
  const app = document.getElementById('app');
  if (!app) return;

  app.querySelectorAll('button').forEach(b => {
    if (b.closest && b.closest('#cpEditBar')) return;
    const t = (b.textContent || '').toLowerCase();
    if (
      t.indexOf('sala') >= 0 ||
      t.indexOf('enviar') >= 0 ||
      t.indexOf('envia') >= 0 ||
      t.indexOf('unirse') >= 0 ||
      t.indexOf('guardar') >= 0 ||
      t.indexOf('💾') >= 0
    ) {
      b.style.display = 'none';
    }
  });

  app.querySelectorAll('input').forEach(i => {
    if (i.id === 'cpEditName') return;
    const p = (i.placeholder || '').toLowerCase();
    if (p.indexOf('código') >= 0 || p.indexOf('codigo') >= 0 || p.indexOf('sala') >= 0) {
      i.style.display = 'none';
    }
  });

  let bar = document.getElementById('cpEditBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'cpEditBar';
    bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0 14px;';

    const cur = (cpEditTeamId && cpEditTeamId !== 'new') ? cpFindTeam(cpEditTeamId) : null;
    const nm = cur ? cpEsc(cur.name) : '';

    bar.innerHTML =
      '<button onclick="cpBackToTeams()" style="background:#1f2a40;border:1px solid #3a4a66;color:#e8eefc;padding:8px 14px;border-radius:8px;cursor:pointer;">← Volver a Mis equipos</button>' +
      '<input id="cpEditName" placeholder="Nombre del equipo" maxlength="60" value="' + nm + '" style="flex:1;min-width:160px;padding:8px;border:1px solid #3a4a66;border-radius:8px;background:#0d121c;color:#e8eefc;">' +
      '<button onclick="cpSaveFromBuilder()" style="background:#2f6df0;border:none;color:#fff;padding:8px 14px;border-radius:8px;cursor:pointer;">💾 Guardar en Mis equipos</button>';

    app.insertBefore(bar, app.firstChild);
  }
}

function cpSaveFromBuilder() {
  const arr = (typeof sets !== "undefined" && Array.isArray(sets)) ? sets : [];
  const txt = cpTeamText(arr);
  if (!txt || !txt.trim()) {
    alert('El equipo está vacío');
    return;
  }

  const inp = document.getElementById('cpEditName');
  let name = (inp && inp.value || '').trim();
  const cur = (cpEditTeamId && cpEditTeamId !== 'new') ? cpFindTeam(cpEditTeamId) : null;

  if (!name) {
    if (cur && cur.name) {
      name = cur.name;
    } else {
      cpAskName(txt);
      return;
    }
  }

  cpCommitSave(name, txt, cur);
}

function cpCommitSave(name, txt, cur) {
  const a = cpReadTeams();

  if (cur) {
    const i = a.findIndex(t => String(t.id) === String(cur.id));
    if (i >= 0) a[i] = { id:cur.id, name, team:txt, created:cur.created || Date.now() };
    else a.push({ id:cur.id, name, team:txt, created:Date.now() });
  } else {
    const nid = (cpEditTeamId && cpEditTeamId !== 'new') ? cpEditTeamId : ('t' + Date.now());
    a.push({ id:nid, name, team:txt, created:Date.now() });
  }

  cpWriteTeams(a);
  sets = cpPrevSets || [];
  cpPrevSets = null;
  cpEditTeamId = null;

  if (location.hash.indexOf('#/equipos') !== 0) location.hash = '#/equipos';
  else cpRenderTeams();
}

function cpBackToTeams() {
  sets = cpPrevSets || [];
  cpPrevSets = null;
  cpEditTeamId = null;

  if (location.hash.indexOf('#/equipos') !== 0) location.hash = '#/equipos';
  else cpRenderTeams();
}

function cpAskName(txt) {
  cpPendingTxt = txt;

  let host = document.getElementById('cpModalHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'cpModalHost';
    document.body.appendChild(host);
  }

  host.innerHTML =
    '<div class="cp-modal-bg" onclick="if(event.target===this)cpCloseName()">' +
      '<div class="cp-modal-box">' +
        '<button class="cp-modal-x" onclick="cpCloseName()">✕</button>' +
        '<h3 style="margin-top:0;">Nombre del equipo</h3>' +
        '<p class="cp-modal-note">Ponle un nombre para guardarlo en Mis equipos.</p>' +
        '<input id="cpAskNameIn" placeholder="Ej. Mi equipo OU" maxlength="60" style="width:100%;box-sizing:border-box;padding:8px;border:1px solid #3a4a66;border-radius:6px;background:#0d121c;color:#e8eefc;">' +
        '<div class="cp-modal-row"><button class="cp-modal-primary" onclick="cpConfirmName()">Guardar</button><button onclick="cpCloseName()">Cancelar</button></div>' +
      '</div>' +
    '</div>';

  setTimeout(() => {
    const i = document.getElementById('cpAskNameIn');
    if (i) {
      i.focus();
      i.select();
    }
  }, 30);
}

function cpConfirmName() {
  const i = document.getElementById('cpAskNameIn');
  const v = (i && i.value || '').trim();
  if (!v) {
    if (i) i.style.borderColor = '#ff5566';
    return;
  }
  cpCloseName();
  cpCommitSave(v, cpPendingTxt, null);
}

function cpCloseName() {
  const h = document.getElementById('cpModalHost');
  if (h) h.innerHTML = '';
}

if (typeof window.viewBuilder === "function") {
  const _cpOldBuilder = window.viewBuilder;
  window.viewBuilder = function () {
    const wasEdit = cpEditTeamId;
    const inEdit = wasEdit && location.hash.indexOf('#/editar') === 0;

    if (wasEdit && !inEdit) {
      try {
        sets = cpPrevSets || [];
      } catch (e) {}
      cpPrevSets = null;
      cpEditTeamId = null;
    }

    _cpOldBuilder.apply(this, arguments);

    if (inEdit) {
      cpPatchBuilderBar();
      setTimeout(cpPatchBuilderBar, 250);
    }
  };
  routes.constructor = window.viewBuilder;
}

/* ================= IMPORTADOR DE EQUIPOS ================= */
var cpImpPending = '';

function cpImportOpen(prefill) {
  let host = document.getElementById('cpModalHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'cpModalHost';
    document.body.appendChild(host);
  }

  const v = (prefill != null) ? prefill : '';

  host.innerHTML =
    '<div class="cp-modal-bg" onclick="if(event.target===this)cpImportClose()">' +
      '<div class="cp-modal-box">' +
        '<button class="cp-modal-x" onclick="cpImportClose()">✕</button>' +
        '<h3 style="margin:0 0 6px;padding-right:28px;">Importar equipo</h3>' +
        '<p class="cp-modal-note" style="margin-top:0;">Pega un equipo en formato Showdown (una línea por dato).</p>' +
        '<textarea id="cpImp" style="width:100%;height:220px;box-sizing:border-box;margin:6px 0;padding:10px;border:1px solid #3a4a66;border-radius:8px;background:#0d121c;color:#e8eefc;font-family:monospace;font-size:13px;resize:vertical;" placeholder="Corviknight @ Rocky Helmet&#10;Ability: Mirror Armor&#10;EVs: 252 Atk / 4 SpA / 252 Spe&#10;- Brave Bird">' + cpEsc(v) + '</textarea>' +
        '<div class="cp-modal-row"><button class="cp-modal-primary" onclick="cpImportSave()">Guardar en Mis equipos</button></div>' +
      '</div>' +
    '</div>';

  setTimeout(() => {
    const t = document.getElementById('cpImp');
    if (t) {
      t.focus();
      t.setSelectionRange(t.value.length, t.value.length);
    }
  }, 30);
}

function cpImportClose() {
  const h = document.getElementById('cpModalHost');
  if (h) h.innerHTML = '';
}

function cpImportSave() {
  const ta = document.getElementById('cpImp');
  const txt = (ta && ta.value || '').trim();
  if (!txt) {
    alert('Pega un equipo');
    return;
  }

  if (typeof parseTeam === "function") {
    let n = 0;
    try {
      n = (parseTeam(txt) || []).length;
    } catch (e) {}
    if (!n) {
      alert('No he reconocido ningún Pokémon. Revisa el formato.');
      return;
    }
  }

  cpImpPending = txt;
  cpAskImportName();
}

function cpAskImportName() {
  let host = document.getElementById('cpModalHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'cpModalHost';
    document.body.appendChild(host);
  }

  host.innerHTML =
    '<div class="cp-modal-bg">' +
      '<div class="cp-modal-box">' +
        '<button class="cp-modal-x" onclick="cpImportClose()">✕</button>' +
        '<h3 style="margin:0 0 6px;padding-right:28px;">Nombre del equipo</h3>' +
        '<p class="cp-modal-note" style="margin-top:0;">Ponle un nombre para guardarlo en Mis equipos.</p>' +
        '<input id="cpImpName" placeholder="Ej. Mi Corviknight OU" maxlength="60" style="width:100%;box-sizing:border-box;margin:6px 0;padding:10px;border:1px solid #3a4a66;border-radius:8px;background:#0d121c;color:#e8eefc;">' +
        '<div class="cp-modal-row"><button class="cp-modal-primary" onclick="cpConfirmImport()">Guardar</button><button onclick="cpImportOpen(cpImpPending)">Atrás</button></div>' +
      '</div>' +
    '</div>';

  setTimeout(() => {
    const i = document.getElementById('cpImpName');
    if (i) {
      i.focus();
      i.addEventListener('keydown', e => {
        if (e.key === 'Enter') cpConfirmImport();
      });
    }
  }, 30);
}

function cpConfirmImport() {
  const i = document.getElementById('cpImpName');
  const name = (i && i.value || '').trim();
  if (!name) {
    if (i) i.style.borderColor = '#ff5566';
    return;
  }

  const a = cpReadTeams();
  a.push({ id:'t' + Date.now(), name, team:cpImpPending, created:Date.now() });
  cpWriteTeams(a);
  cpImportClose();
  cpRenderTeams();
}

/* ================= RENDER MIS EQUIPOS ================= */
function cpRenderTeams() {
  const app = document.getElementById('app');
  if (!app) return;

  function slugLocal(s) {
    return String(s || '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function spriteURL(sp, shiny) {
    const sl = slugLocal(sp);
    const base = 'https://play.pokemonshowdown.com/sprites/front/';
    const show = shiny ? base + '-/' + sl + '.png' : base + sl + '.png';

    let id = null;
    try {
      if (typeof idByName === "function") id = idByName(typeof canonSpecies === "function" ? canonSpecies(sp) : sp);
    } catch (e) {}

    const poke = id ? ('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (shiny ? 'shiny/' : '') + id + '.png') : '';
    return { show, poke };
  }

  try {
    const who = (typeof myName === "function" ? myName() : '') || (cpAccount ? cpAccount.name : '');
    const teams = cpReadTeams();

    const bar = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 14px;"><button onclick="cpNewTeam()" style="background:#2f6df0;border:none;color:#fff;padding:8px 14px;border-radius:8px;cursor:pointer;">➕ Crear equipo</button><button onclick="cpImportOpen()" style="background:#1f2a40;border:1px solid #3a4a66;color:#e8eefc;padding:8px 14px;border-radius:8px;cursor:pointer;">📥 Importar de texto</button></div>`;

    let cards = '';
    if (!teams.length) {
      cards = `<div style="border:1px solid #3a4a66;border-radius:12px;padding:18px;background:#141a26;color:#e8eefc;"><h3 style="margin-top:0;">Aún no tienes equipos</h3><p style="opacity:.8;">Pulsa Crear equipo (abre el editor de 6, sin sala) o Importar de texto.</p></div>`;
    } else {
      cards = teams.map(t => {
        let sprites = '';
        try {
          const arr = (typeof parseTeam === "function") ? (parseTeam(t.team) || []) : [];
          sprites = arr.map(s => {
            const sp = s.species || s.name || s.pokemon || '';
            const nick = s.nick || s.nickname || '';
            const shiny = !!s.shiny;
            const u = spriteURL(sp, shiny);
            const err = u.poke ? `this.onerror=null;this.src='${u.poke}'` : `this.style.visibility='hidden'`;
            const label = (nick && nick.toLowerCase() !== String(sp).toLowerCase()) ? nick + ' (' + sp + ')' : (sp || nick || '?');
            const star = shiny ? '<span style="color:#ffd24a;">✦ </span>' : '';
            const border = shiny ? '#ffd24a' : '#2a3856';

            return `<div style="text-align:center;width:64px;flex:0 0 auto;">
              <img src="${u.show}" onerror="${err}" alt="${cpEsc(label)}" style="width:52px;height:52px;image-rendering:pixelated;background:#0d121c;border:1px solid ${border};border-radius:8px;">
              <div style="font-size:10px;opacity:.85;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${star}${cpEsc(label)}</div>
            </div>`;
          }).join('');
        } catch (e) {
          sprites = '';
        }

        return `<div class="cp-card" onclick="location.hash='#/editar/${t.id}'" title="Clic para editar" style="border:1px solid #3a4a66;border-radius:12px;padding:14px;margin:10px 0;background:#141a26;color:#e8eefc;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
            <b style="color:#ffd24a;">${cpEsc(t.name)} <span style="font-size:11px;opacity:.55;font-weight:normal;">· clic para editar</span></b>
            <span style="display:flex;gap:8px;flex-wrap:wrap;" onclick="event.stopPropagation();">
              <button onclick="event.stopPropagation();cpExportTeam('${t.id}')" style="background:#1f2a40;border:1px solid #3a4a66;color:#e8eefc;padding:6px 10px;border-radius:6px;cursor:pointer;">📋 Exportar</button>
              <button onclick="event.stopPropagation();cpDeleteTeam('${t.id}')" style="background:#5a2430;border:1px solid #8a3a4a;color:#ffd6d6;padding:6px 10px;border-radius:6px;cursor:pointer;">🗑️</button>
            </span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin:12px 0 4px;">${sprites}</div>
        </div>`;
      }).join('');
    }

    app.innerHTML = `<h2 style="color:#ffd24a;">Mis equipos${who ? ' · ' + cpEsc(who) : ''}</h2>${bar}${cards}`;
  } catch (err) {
    app.innerHTML = `<h2 style="color:#ff5566;">Error en Mis equipos</h2><pre style="white-space:pre-wrap;color:#ff8899;font-size:13px;">${err && err.stack ? err.stack : String(err)}</pre>`;
  }
}

window.viewMyTeams = cpRenderTeams;

/* ================= SPRITES DE OBJETO EN INPUTS ================= */
(function () {
  function toID(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  function url(item) {
    const id = toID(item);
    return id ? ('https://play.pokemonshowdown.com/sprites/itemicons/' + id + '.png') : '';
  }

  function isObjInput(el) {
    if (!el || el.tagName !== 'INPUT') return false;
    return /objeto/i.test(el.placeholder || '') || /objeto/i.test(el.name || '') || !!el.closest('[data-combo=item]');
  }

  function paintInput(inp) {
    const v = (inp.value || '').trim();
    if (v) {
      inp.style.backgroundImage = 'url("' + url(v) + '")';
      inp.style.backgroundRepeat = 'no-repeat';
      inp.style.backgroundPosition = 'right 8px center';
      inp.style.backgroundSize = '18px 18px';
      inp.style.paddingRight = '34px';
    } else {
      inp.style.backgroundImage = 'none';
      inp.style.paddingRight = '';
    }
  }

  function inPopupOrCombo(el) {
    let n = el;
    for (let k = 0; k < 8 && n; k++) {
      if (n.matches && n.matches('[data-combo=item]')) return true;
      const pos = getComputedStyle(n).position;
      if (pos === 'absolute' || pos === 'fixed') {
        const r = n.getBoundingClientRect();
        if (r.width > 40 && r.height > 20) return true;
      }
      n = n.parentElement;
    }
    return false;
  }

  function itemSet() {
    if (typeof DexCache !== 'undefined' && DexCache.items && DexCache.items.length) {
      const s = new Set();
      DexCache.items.forEach(x => s.add(x));
      return s;
    }
    return null;
  }

  function paintOptions() {
    const set = itemSet();
    if (!set) return;

    document.querySelectorAll('div,li,span').forEach(el => {
      if (el.children.length) return;
      const txt = (el.textContent || '').trim();
      if (!set.has(txt)) return;
      if (el.dataset.cpItem) return;
      if (!inPopupOrCombo(el)) return;

      el.dataset.cpItem = '1';
      el.style.backgroundImage = 'url("' + url(txt) + '")';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'left 6px center';
      el.style.backgroundSize = '18px 18px';
      el.style.paddingLeft = '28px';
    });
  }

  function scan() {
    document.querySelectorAll('input').forEach(inp => {
      if (isObjInput(inp)) paintInput(inp);
    });
  }

  let raf = 0;
  function queue() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      scan();
    });
  }

  new MutationObserver(queue).observe(document.body, { childList:true, subtree:true });
  document.addEventListener('input', e => {
    if (isObjInput(e.target)) paintInput(e.target);
  }, true);
  document.addEventListener('change', e => {
    if (isObjInput(e.target)) paintInput(e.target);
  }, true);
  window.addEventListener('hashchange', queue);
  queue();
})();