# video-chat-app

WebRTCを用いたビデオチャットアプリです。  
フロントにReact/Next.js、APIサーバーにRust/Actic Webを使用し、  
APIランタイムにGraphQLを用いています。

Zennでの紹介記事  
https://zenn.dev/inf_e/articles/63e51cd42ca5eb

### 動作確認
本アプリは画像ファイルのストレージとしてGoogle Cloud Storage(GCS)を使用しています。  
`backend`ディレクトリ内`.env.dev`ファイルの「**BUCKET_NAME**」にGCSバケット名を指定します。  
また、「*Service Account Token Creator*」と「*Storage Object Admin*」のロールを持つサービスアカウントを用意し、  
サービスアカウントのJSON形式の鍵ファイルを`backend`ディレクトリに配置します。  
配置したJSONファイル名を`.env.dev`ファイルの「**SERVICE_ACCOUNT**」に指定します。  
  * BUCKET_NAME … 画像ストレージとして使用するGCSバケット名
  * SERVICE_ACCOUNT … サービスアカウントの鍵ファイル名
___

加えて、同`.env.dev`ファイルに、メール送信時に使用するSMTPサーバーの以下情報を設定します。
  * MAIL_HOST … SMTPホスト名
  * MAIL_USERNAME … SMTPユーザー名
  * MAIL_PASSWORD … SMTPパスワード
___

以上でアプリの設定が完了となります。  
プロジェクトのルートディレクトリ内の以下ファイルを実行して、開発環境を起動します。
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
  * WebRTC API: https://developer.mozilla.org/ja/docs/Web/API/WebRTC_API
  * React: https://reactjs.org/
  * Next.js: https://nextjs.org/
  * Apollo Client (React): https://www.apollographql.com/docs/react/
  * Storybook: https://storybook.js.org/
