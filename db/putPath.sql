insert into Path (
	dateTime,
	col,
	size,
	who

) values (
	now(),
	:col,
	:size,
	:who
)