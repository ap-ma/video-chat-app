-- Your SQL goes here
CREATE TABLE contacts (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'レコードID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `contact_user_id` bigint(20) unsigned NOT NULL COMMENT '連絡先ユーザーID',
  `status` int(11) NOT NULL COMMENT 'ステータス',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新日時',
  `version` int(11) NOT NULL DEFAULT '1' COMMENT 'データバージョン',
  PRIMARY KEY (`id`),
  KEY `contacts_user_id_idx` (`user_id`)
) COMMENT = '連絡先';