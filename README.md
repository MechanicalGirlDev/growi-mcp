# GROWI MCP Server

GROWI WikiにAIモデルを接続するためのModel Context Protocol (MCP) HTTPサーバー。Bearer認証に対応。

## 機能

### ページ操作
- `getPage` - ページ内容の取得
- `getPageInfo` - ページ情報の取得
- `createPage` - ページの作成
- `updatePage` - ページの更新
- `deletePage` - ページの削除
- `duplicatePage` - ページの複製
- `renamePage` - ページの移動/リネーム
- `searchPages` - ページの検索
- `getRecentPages` - 最近更新されたページの取得
- `getPageListingRoot` - ルートページ一覧の取得
- `getPageListingChildren` - 子ページ一覧の取得
- `publishPage` / `unpublishPage` - ページの公開/非公開

### タグ操作
- `getTagList` - タグ一覧の取得
- `searchTags` - タグの検索
- `updateTag` - タグの更新
- `getPageTag` - ページのタグ取得

### リビジョン操作
- `listRevisions` - リビジョン一覧の取得
- `getRevision` - リビジョンの取得

### 共有リンク操作
- `getShareLinks` - 共有リンク一覧の取得
- `createShareLink` - 共有リンクの作成
- `deleteShareLink` - 共有リンクの削除

### コメント操作
- `getComments` - コメントの取得

### ユーザー操作
- `getUserRecentPages` - ユーザーの最近のページ取得

## セットアップ

### 環境変数

`.env.example`をコピーして`.env`を作成：

```bash
cp .env.example .env
```

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `MCP_HTTP_PORT` | サーバーポート | `3001` |
| `MCP_HTTP_HOST` | リッスンホスト | `0.0.0.0` |
| `MCP_AUTH_TOKENS` | Bearer認証トークン (32文字以上、カンマ区切りで複数可) | `your-secure-token...` |
| `GROWI_DEFAULT_APP_NAME` | デフォルトのGROWIアプリ名 | `app-1` |
| `GROWI_APP_NAME_N` | GROWIアプリ名 (N=1,2,3...) | `app-1` |
| `GROWI_API_TOKEN_N` | GROWI APIトークン | `8991502f6dfec...` |
| `GROWI_BASE_URL_N` | GROWI URL | `http://localhost:3000` |

## 起動方法

### Docker Compose (HTTPS + Let's Encrypt)

Let's EncryptでIPアドレス用SSL証明書を自動取得・更新します（6日間有効、自動更新）。

1. 初期設定（証明書取得）：
   ```bash
   ./init-letsencrypt.sh <IPアドレス> <メールアドレス>
   # 例: ./init-letsencrypt.sh 203.0.113.50 your@email.com
   ```

2. 起動：
   ```bash
   docker compose up -d
   ```

3. アクセス：
   - `https://<IPアドレス>:3001`

証明書は certbot コンテナが12時間ごとに自動更新を試みます。

### Docker Compose (HTTPS + 自己署名証明書)

開発環境や内部利用向け。

1. 証明書を生成：
   ```bash
   mkdir -p certbot/conf/live/cert
   openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
     -keyout certbot/conf/live/cert/privkey.pem \
     -out certbot/conf/live/cert/fullchain.pem \
     -subj "/CN=localhost"
   ```

2. 起動：
   ```bash
   docker compose up -d nginx growi-mcp
   ```

3. アクセス：
   - `https://localhost:3001`

### ローカル開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番起動
pnpm start
```

## API

### エンドポイント

- `GET /health` - ヘルスチェック
- `POST /mcp` - MCPリクエスト

### 認証

リクエストヘッダーにBearerトークンを含める：

```
Authorization: Bearer your-secure-token-at-least-32-characters-long
```

## ライセンス

MIT
