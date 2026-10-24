// 各シートの1行をHTMLにする部品（トップページと一覧ページで共用）
import { esc, richText, fmtDate, parseDate, today, imageUrl } from './sheet.js';

const byDateDesc = (k) => (a, b) => (parseDate(b[k]) ?? 0) - (parseDate(a[k]) ?? 0);
const byDateAsc = (k) => (a, b) => (parseDate(a[k]) ?? 0) - (parseDate(b[k]) ?? 0);

// ---- お知らせ ----
export function sortNews(rows) {
  return [...rows].sort(byDateDesc('日付'));
}
export function newsItem(r) {
  const link = r['リンク']
    ? `<a class="btn-text" href="${esc(r['リンク'])}" target="_blank" rel="noopener">${esc(r['リンク名'] || '詳しく見る')} →</a>`
    : '';
  return `<article class="news-item">
    <time>${fmtDate(r['日付'])}</time>
    <details${r['本文'] ? '' : ' class="nobody"'}>
      <summary>${esc(r['タイトル'])}</summary>
      ${r['本文'] ? `<div class="body">${richText(r['本文'])}</div>` : ''}
    </details>
    ${link}
  </article>`;
}

// ---- イベント ----
export function splitEvents(rows) {
  const t = today();
  const up = rows.filter((r) => (parseDate(r['日付']) ?? t) >= t).sort(byDateAsc('日付'));
  const past = rows.filter((r) => (parseDate(r['日付']) ?? t) < t).sort(byDateDesc('日付'));
  return { up, past };
}
export function eventItem(r, past = false) {
  const d = parseDate(r['日付']);
  const md = d ? `<span class="m">${d.getMonth() + 1}月</span><span class="d">${d.getDate()}</span>` : esc(r['日付']);
  const apply = !past && r['申込URL']
    ? `<a class="btn" href="${esc(r['申込URL'])}" target="_blank" rel="noopener">申し込む</a>`
    : '';
  return `<article class="event-item${past ? ' past' : ''}">
    <div class="cal">${md}</div>
    <div class="info">
      <div class="meta">${fmtDate(r['日付'])}${r['時間'] ? ' ' + esc(r['時間']) : ''}${r['形式'] ? `<span class="tag">${esc(r['形式'])}</span>` : ''}</div>
      <h3>${esc(r['タイトル'])}</h3>
      ${r['会場'] ? `<p class="place">会場：${esc(r['会場'])}</p>` : ''}
      ${r['概要'] ? `<p>${richText(r['概要'])}</p>` : ''}
      ${apply}
    </div>
  </article>`;
}

// ---- 資料ライブラリ ----
export function libraryItem(r) {
  return `<a class="doc-item" href="${esc(r['URL'])}" target="_blank" rel="noopener" data-cat="${esc(r['カテゴリ'])}">
    <span class="tag">${esc(r['カテゴリ'] || 'その他')}</span>
    <strong>${esc(r['タイトル'])}</strong>
    ${r['説明'] ? `<span class="desc">${esc(r['説明'])}</span>` : ''}
    <span class="date">${r['公開日'] ? fmtDate(r['公開日']) : ''}</span>
  </a>`;
}

// ---- 好事例 ----
export function caseItem(r) {
  const img = r['画像URL']
    ? `<img src="${esc(imageUrl(r['画像URL']))}" alt="" loading="lazy">`
    : `<div class="noimg">CASE</div>`;
  const more = r['記事URL']
    ? `<a class="btn-text" href="${esc(r['記事URL'])}" target="_blank" rel="noopener">記事を読む →</a>`
    : '';
  return `<article class="case-item">
    ${img}
    <div class="pad">
      <p class="meta">${esc([r['地区'], r['クラブ']].filter(Boolean).join('　'))}</p>
      <h3>${esc(r['タイトル'])}</h3>
      ${r['概要'] ? `<p>${richText(r['概要'])}</p>` : ''}
      ${more}
    </div>
  </article>`;
}

// ---- 委員 ----
export function memberItem(r) {
  const photo = r['写真URL']
    ? `<img class="photo" src="${esc(imageUrl(r['写真URL']).replace('=w1200', '=w400'))}" alt="" loading="lazy">`
    : `<span class="photo noimg">${esc((r['氏名'] || '').trim().charAt(0))}</span>`;
  const sub = [[r['地域'], r['地区']].filter(Boolean).join('　'), r['クラブ']].filter(Boolean).map(esc).join('<br>');
  const lines = (s = '') => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  const roles = lines(r['現在の役職']);
  const hist = lines(r['経歴']);
  const now = roles.length ? `<ul class="now">${roles.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const note = hist.length
    ? `<details class="hist"><summary>経歴</summary><ul>${hist.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>`
    : r['担当'] ? `<span class="desc">${esc(r['担当'])}</span>` : '';
  return `<li>
    ${photo}
    <div class="txt">
      <span class="role">${esc(r['役職'])}</span>
      <strong>${esc(r['氏名'])}</strong>
      ${r['ふりがな'] ? `<span class="kana">${esc(r['ふりがな'])}</span>` : ''}
      ${now}
      ${sub ? `<span class="dist">${sub}</span>` : ''}
      ${note}
    </div>
  </li>`;
}

// ---- Instagram ----
// 投稿URL（/p/〜 /reel/〜）を公式の埋め込み用タグにする。URLが違えば空
export function instaItem(r) {
  const m = (r['投稿URL'] || '').match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/);
  if (!m) return '';
  const url = `https://www.instagram.com/${m[1]}/${m[2]}/`;
  return `<blockquote class="instagram-media" data-instgrm-permalink="${url}?utm_source=ig_embed" data-instgrm-version="14"><a href="${url}" target="_blank" rel="noopener">Instagramで見る</a></blockquote>`;
}
