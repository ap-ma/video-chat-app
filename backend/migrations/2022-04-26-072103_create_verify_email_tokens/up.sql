-- Your SQL goes here
CREATE TABLE `verify_email_tokens` (
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `category` int(11) NOT NULL COMMENT '分類',
  `email` varchar(255) NOT NULL COMMENT 'メールアドレス',
  `token` varchar(255) NOT NULL COMMENT 'トークン',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  PRIMARY KEY (`user_id`)
) COMMENT = 'メール検証トークン';