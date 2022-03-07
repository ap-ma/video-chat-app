-- Your SQL goes here
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'レコードID',
  `code` varchar(20) NOT NULL COMMENT 'コード',
  `name` varchar(255) DEFAULT NULL COMMENT '名前',
  `email` varchar(255) NOT NULL COMMENT 'メールアドレス',
  `password` varchar(255) NOT NULL COMMENT 'パスワード',
  `secret` varchar(50) NOT NULL COMMENT 'シークレット',
  `comment` varchar(255) NULL COMMENT 'コメント',
  `avatar` varchar(255) NULL COMMENT 'アバター',
  `role` int(11) NOT NULL COMMENT '権限',
  `status` int(11) NOT NULL COMMENT 'ステータス',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_code_unique` (`code`),
  KEY `users_email_idx` (`email`)
) COMMENT = 'ユーザー';