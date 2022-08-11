-- Your SQL goes here
CREATE TABLE `password_reset_tokens` (
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `token` varchar(255) NOT NULL COMMENT 'トークン',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  PRIMARY KEY (`user_id`)
) COMMENT = 'パスワードリセットトークン';