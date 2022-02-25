module.exports = {
  // 折り返す行の長さ
  printWidth: 100,
  // インデントレベルごとのスペースの数
  tabWidth: 2,
  // タブで行をインデント
  useTabs: false,
  // ステートメントの最後にセミコロンを挿入
  semi: false,
  // ダブルクォートの代わりにシングルクォートを使用
  singleQuote: true,
  // オブジェクトのプロパティの囲み文字 consistent: オブジェクト内の少なくとも1つのプロパティに引用符が必要な場合は、すべてのプロパティを引用符で囲む
  quoteProps: 'consistent',
  // JSXにおいてダブルクォートの代わりにシングルクォートを使用
  jsxSingleQuote: true,
  // 複数行のコンマ区切りの構文構造において、末尾のコンマを挿入
  trailingComma: 'none',
  // オブジェクトリテラルの波かっこの間のスペースを挿入 false: {foo: bar}, true: { foo: bar }
  bracketSpacing: true,
  // 複数行のJSX要素の閉じ（>）を、改行を挟んだ単独行でなく最後の行の末尾に置く
  jsxBracketSameLine: false,
  // アロー関数のパラメータを括弧で囲む
  arrowParens: 'always',
  // ファイルの先頭にプラグマと呼ばれる特別なコメントが含まれているファイルのみをフォーマットするように制限
  requirePragma: false,
  // ファイルの先頭に特別な@formatマーカーを挿入し、ファイルがPrettierでフォーマットされていることを指定
  insertPragma: false,
  // マークダウンの折り返しの指定
  proseWrap: 'preserve',
  // HTML 空白文字の感度 inline要素の開始タグの閉じ（>）を要素と同一行に出力することでHTMLのレンダー結果をフォーマット前と同じにする
  htmlWhitespaceSensitivity: 'css',
  // ファイルに埋め込まれた引用コードをフォーマットする
  embeddedLanguageFormatting: 'auto',
  // 改行コード
  endOfLine: 'lf'
}
