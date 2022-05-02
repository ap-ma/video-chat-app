# video-chat-app

WebRTCを用いたビデオチャットアプリです。  
フロントにReact/Next.js、APIサーバーにRust/Actic Webを使用し、  
APIランタイムにGraphQLを用いています。

### 動作確認
`backend`ディレクトリ内の`.env.dev`ファイルに、メール送信時に使用するSMTPサーバーの以下情報を設定します。
  * MAIL_HOST … SMTPホスト名
  * MAIL_USERNAME … SMTPユーザー名
  * MAIL_PASSWORD … SMTPパスワード

以下ファイルを実行して、開発環境を起動します。
```
setup.sh or .bat
```

起動後しばらく時間を置き、  
ブラウザから [`http://localhost:3000`](http://localhost:3000) にアクセスして動作確認してください。

#### 使用ポート
  * Actix Web: 8080
  * Redis: 6379
  * MySQL: 3306
  * Next.js: 3000
  * Storybook: 6006

## 参考

  * GraphQL: https://graphql.org/
  * Rust: https://www.rust-lang.org/
  * Actix Web: https://actix.rs/
  * Async Graphql: https://async-graphql.github.io/async-graphql/en/index.html
  * Redis: https://redis.io/
  * MySQL: https://www.mysql.com/
  * React: https://reactjs.org/
  * Next.js: https://nextjs.org/
  * Apollo Client (React): https://www.apollographql.com/docs/react/
  * Storybook: https://storybook.js.org/
