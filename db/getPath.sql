select
	ID,
	dateTime,
	col,
	size

from
	Path

where
(
	:when is null
	or
	unix_timestamp(dateTime) > :when
)

order by
	dateTime