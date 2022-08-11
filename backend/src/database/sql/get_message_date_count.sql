select
    count(dates.date) as date_count
from
    (
        select distinct
            LEFT(created_at, 10) as date
        from
            messages
        where
            (
                (
                    tx_user_id = ?
                and rx_user_id = ?
                )
            or  (
                    tx_user_id = ?
                and rx_user_id = ?
                )
            )
        and status <> ?
    ) dates