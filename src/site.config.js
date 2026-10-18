// ===== サイト全体の設定（ここだけ直せば全ページに反映される） =====

// Googleスプレッドシートの ID（URLの /d/ と /edit の間の文字列）
// 空のままだと public/data/ のサンプルCSVを表示する
export const SHEET_ID = '';

// スプレッドシートのタブ名（シート名）
export const SHEETS = {
  news: 'お知らせ',
  events: 'イベント',
  library: '資料',
  cases: '好事例',
  members: '委員',
};

export const SITE_NAME = '全国ローターアクトラーニング委員会';
export const SITE_SHORT = '全国RAラーニング';
export const SITE_DESCRIPTION =
  'RI理事と連携して、ローターアクトの活性化につながる「学び（ラーニング）」を全国34地区へ届ける委員会の公式サイトです。';

// ヘッダーのメニュー。ページを増やしたらここに1行足す
export const NAV = [
  { href: '', label: 'ホーム' },
  { href: 'news/', label: 'お知らせ' },
  { href: 'events/', label: 'イベント' },
  { href: 'library/', label: '資料ライブラリ' },
  { href: 'cases/', label: '好事例' },
  { href: 'about/', label: '委員会紹介' },
];

// 外部リンク（空欄の項目はフッターに出ない）
export const LINKS = {
  litlink: 'https://lit.link/ralearning',
  instagram: '',
  email: '',
};
