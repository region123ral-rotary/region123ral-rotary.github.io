// スプレッドシートからデータを読み込む（ブラウザ側で実行。シートを直せば即反映）
import { SHEET_ID, SHEETS } from '../site.config.js';

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

// CSV文字列 → 2次元配列（ダブルクォート・改行入りセル対応）
function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// 1行目を見出しとしてオブジェクトの配列にする。空行と「非公開」列に何か入っている行は除く
function toObjects(rows) {
  const [head, ...body] = rows;
  if (!head) return [];
  const keys = head.map((h) => h.trim());
  return body
    .map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])))
    .filter((o) => Object.values(o).some((v) => v) && !o['非公開']);
}

// タブ名が違うとGoogleは先頭のタブを返してしまうので、必須の見出しで中身を確かめる
const REQUIRED = { news: 'タイトル', events: 'タイトル', library: 'URL', cases: 'タイトル', members: '氏名' };

export async function loadSheet(key) {
  const name = SHEETS[key];
  const url = SHEET_ID
    ? `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(name)}&_=${Date.now()}`
    : `${BASE}data/${key}.csv`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${name} の読み込みに失敗しました (${res.status})`);
  const rows = parseCSV(await res.text());
  const need = REQUIRED[key];
  if (need && !(rows[0] || []).some((h) => h.trim() === need)) {
    throw new Error(`タブ「${name}」が見つからないか、見出し「${need}」がありません`);
  }
  return toObjects(rows);
}

// ===== 表示用ヘルパー =====

export function esc(s = '') {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// 本文：エスケープ → URLをリンク化 → 改行を<br>
export function richText(s = '') {
  return esc(s)
    .replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`)
    .replace(/\n/g, '<br>');
}

// "2026/10/19" "2026-10-19" "2026年10月19日" などを Date に
export function parseDate(s = '') {
  const m = String(s).match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}

const WD = ['日', '月', '火', '水', '木', '金', '土'];
export function fmtDate(s) {
  const d = parseDate(s);
  if (!d) return esc(s);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}（${WD[d.getDay()]}）`;
}

export function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// GoogleドライブのファイルURLを、<img>で表示できるURLに変換
export function imageUrl(u = '') {
  const m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([\w-]+)/);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}=w1200` : u;
}

// 読み込み中・エラー表示を共通化
export async function render(el, key, fn) {
  try {
    const rows = await loadSheet(key);
    el.innerHTML = fn(rows) || '<p class="empty">まだ掲載がありません。</p>';
  } catch (e) {
    el.innerHTML = `<p class="empty">データを読み込めませんでした。時間をおいて再度お試しください。</p>`;
    console.error(e);
  }
  el.removeAttribute('aria-busy');
}
