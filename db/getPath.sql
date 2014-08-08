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
	dateTime > :when
)

order by
	dateTime