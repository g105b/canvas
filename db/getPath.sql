select
	ID,
	dateTime,
	unix_timestamp(dateTime)as timestamp,
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