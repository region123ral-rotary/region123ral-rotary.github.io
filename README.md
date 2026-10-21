# 全国ローターアクトラーニング委員会 公式サイト

**更新担当の方は [更新マニュアル.md](更新マニュアル.md) を読んでください。**

GitHub Pages で公開している静的サイト（Astro製）。費用0円・サーバー無し。

## 更新のしかた

| やりたいこと | どこを触るか | 必要なもの |
|---|---|---|
| お知らせ・イベント・資料・好事例・委員を更新 | **Googleスプレッドシート**を直すだけ（即反映） | シートの編集権限 |
| 資料ファイルを追加 | Googleドライブに置いて、シート「資料」にリンクを貼る | ドライブの編集権限 |
| ページ追加・デザイン変更 | このリポジトリのコード | Claude Code + GitHub |

スプレッドシートの書き方はシート内の「記入ルール」タブを参照。

## 構成

```
src/site.config.js     サイト名・スプレッドシートID・メニュー・外部リンク（まずここ）
src/pages/             1ファイル＝1ページ（about/index.astro → /about/）
src/layouts/Layout.astro  全ページ共通のヘッダー・フッター
src/lib/sheet.js       スプレッドシート読み込み
src/lib/cards.js       各シートの1行 → HTML
src/styles/global.css  配色・共通デザイン
public/data/*.csv      スプレッドシート未接続時のサンプルデータ
.github/workflows/deploy.yml  main に push → 自動公開
```

## ページを足すとき

1. `src/pages/ページ名/index.astro` を作る（既存ページをコピーして直す）
2. `src/site.config.js` の `NAV` に1行足す
3. スプレッドシートのデータを使うなら、シートにタブを足して `SHEETS` に1行足す

## 手元で確認

```
npm install
npm run dev
```

## 独自ドメインに切り替えるとき

1. GitHub の Settings → Pages → Custom domain にドメインを入力
2. Settings → Secrets and variables → Actions → Variables に `CUSTOM_DOMAIN`（例: `example.jp`）を追加
3. Actions から再デプロイ
