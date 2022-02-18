-- Your SQL goes here
CREATE TABLE messages (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'レコードID',
  `tx_user_id` bigint(20) unsigned NOT NULL COMMENT '送信ユーザーID',
  `rx_user_id` bigint(20) unsigned NOT NULL COMMENT '受信ユーザーID',
  `category` int(11) NOT NULL COMMENT '分類',
  `message` text NULL COMMENT 'メッセージ',
  `status` int(11) NOT NULL COMMENT 'ステータス',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `version` int(11) NOT NULL DEFAULT '1' COMMENT 'データバージョン',
  PRIMARY KEY (`id`),
  KEY `messages_tx_user_id_idx` (`tx_user_id`),
  KEY `messages_rx_user_id_idx` (`rx_user_id`)
) COMMENT = 'メッセージ';