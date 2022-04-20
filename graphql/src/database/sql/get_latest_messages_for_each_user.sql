select
    users.id as user_id,
    users.code as user_code,
    users.name as user_name,
    users.avatar as user_avatar,
    messages.id as message_id,
    messages.category as message_category,
    messages.message
from
    messages
    inner join
        (
            select
                max(id) as id,
                tx_user_id + rx_user_id as combination
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
    left join
        contacts
    on  contacts.user_id = ?
    and contact_user_id = users.id
where
    users.status = ?
and (
        contacts.blocked = ?
    or  contacts.id is null
    )
order by
    messages.id desc