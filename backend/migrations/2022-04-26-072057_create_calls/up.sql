-- Your SQL goes here
CREATE TABLE `calls` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'レコードID',
  `message_id` bigint(20) unsigned NOT NULL COMMENT 'メッセージID',
  `status` int(11) NOT NULL COMMENT 'ステータス',
  `started_at` datetime NULL COMMENT '開始日時',
  `ended_at` datetime NULL COMMENT '終了日時',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (`id`),
  KEY `calls_message_id_idx` (`message_id`)
) COMMENT = '通話';