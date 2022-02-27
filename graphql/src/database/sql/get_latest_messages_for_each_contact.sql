select
    messages.*
from
    messages
    inner join
        (
            select
                max(id) as id,
                CONCAT(tx_user_id + rx_user_id) as combination
            from
                messages
            where
                (
                    tx_user_id = ?
                or  rx_user_id = ?
                )
            and status <> ?
            group by
                combination
        ) as latest
    on  messages.id = latest.id
    inner join
        users
    on  users.id = latest.combination - ?
where
    users.status = ?