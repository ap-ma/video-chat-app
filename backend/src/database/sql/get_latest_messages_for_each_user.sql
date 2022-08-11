select
    users.id as user_id,
    users.code as user_code,
    users.name as user_name,
    users.avatar as user_avatar,
    messages.id as message_id,
    messages.tx_user_id as tx_user_id,
    messages.category as message_category,
    messages.message as message,
    messages.status as message_status,
    messages.created_at as created_at,
    calls.id as call_id,
    calls.status as call_status,
    calls.started_at as call_started_at,
    calls.ended_at as call_ended_at
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
    and contacts.contact_user_id = users.id
    left join
        calls
    on  calls.message_id = messages.id
where
    users.status = ?
and (
        contacts.blocked = ?
    or  contacts.id is null
    )
order by
    messages.id desc