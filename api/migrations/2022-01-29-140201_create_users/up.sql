-- Your SQL goes here
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'レコードID',
  `code` varchar(20) NOT NULL COMMENT 'コード',
  `name` varchar(255) DEFAULT NULL COMMENT '名前',
  `name_alphabet` varchar(255) DEFAULT NULL COMMENT '名前_英字',
  `email` varchar(255) NOT NULL COMMENT 'メールアドレス',
  `password` varchar(255) NOT NULL COMMENT 'パスワード',
  `avatar` mediumtext NULL COMMENT 'アバター',
  `status` int(11) NOT NULL COMMENT 'ステータス',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日時',
  `version` int(11) NOT NULL DEFAULT '1' COMMENT 'データバージョン',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_code_unique` (`code`),
  KEY `users_email_idx` (`email`)
) COMMENT = 'ユーザー';