module.exports = {
  // コードが実行される環境の設定
  env: {
    // DOM API (documentやonload等) が定義される
    browser: true,
    // ECMAScript 2021 で追加された構文や組込みオブジェクトが利用できるようになる
    es2021: true,
    // Node.js 固有の変数や構文 (requireや特殊なトップレベル スコープ等) が定義される
    node: true
  },
  // Shareable Config 既存の設定セットを適用する
  extends: [
    // prettierとの競合項目をオフにする
    'prettier',
    // ESLintの推奨設定設定セット
    'eslint:recommended',
    // TypeScriptの推奨設定セット
    'plugin:@typescript-eslint/recommended',
    // Promiseオブジェクトの推奨設定セット
    'plugin:promise/recommended',
    // import文の推奨設定セット
    'plugin:import/recommended',
    // TypeScript import文の推奨設定セット
    'plugin:import/typescript',
    // Reactの推奨設定セット
    'plugin:react/recommended',
    // React Hooks APIの推奨設定セット
    'plugin:react-hooks/recommended'
  ],
  // 実行時に追加するグローバル変数
  globals: {
    // Atomicsオブジェクト
    Atomics: 'readonly',
    // SharedArrayBufferオブジェクト
    SharedArrayBuffer: 'readonly'
  },
  // パーサー
  parser: '@typescript-eslint/parser',
  // パーサーオプション
  parserOptions: {
    // どの追加言語機能を使用したいか
    ecmaFeatures: {
      // JSXを有効
      jsx: true
    },
    // ECMAScript構文のバージョンを指定
    ecmaVersion: 12,
    // ECMAScriptモジュールの場合は "module "に設定
    sourceType: 'module'
  },
  // ルールセットの追加を行う
  plugins: [
    // React ルールセット
    'react',
    // TypeScript ルールセット
    '@typescript-eslint'
  ],
  // 個別に追加するルール
  rules: {
    // Reactコンポーネントにおけるprops検証の欠落防止
    'react/prop-types': 0
  },
  // 設定ファイル内全体共有設定 実行される全てのルールに適応される設定
  settings: {
    // インポート文解決方法
    'import/resolver': {
      // tsconfig.jsonで定義されたパスを使用
      typescript: { project: './' }
    },
    // React設定
    react: {
      // バージョン: 自動検出
      version: 'detect'
    }
  }
}
