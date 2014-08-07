;(function() {

var
	form = document.forms[0],
	canvas = document.querySelector("canvas"),
	ctx = canvas.getContext("2d"),
	clicked = false,
	size = document.querySelector("#size input"),
	toggle = document.querySelector("#toggle"),
	history = [],
	path = {},
$;

function get(when) {
	var
		when = when || +new Date,
	$;

	x("get", {when:when}, function() {

	});
}

function put(what) {

}

function draw(line) {

}

function x(method, data, cb) {
	var
		xhr = new XMLHttpRequest(),
		url = "data.php",
	$;

	xhr.open(method, url);
	xhr.addEventListener("load", cb);
	xhr.send(data);
}

function start(e) {
	clicked = true;
	ctx.moveTo(e.offsetX, e.offsetY);
	if(path) {
		history.push(path);
	}
	path = {
		start: {
			x: e.offsetX,
			y: e.offsetY,
		},
		size: size.value,
		col: ctx.strokeStyle,
		points: [],
	};

	ctx.beginPath();
	toggle.checked = false;
}

function move(e) {
	if(clicked) {
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
		path.points.push({
			x: e.offsetX,
			y: e.offsetY,
		});

		if(e.which === 0) {
			stop();
		}
	}
	else if(e.which !== 0) {
		start(e);
	}
}

function stop(e) {
	clicked = false;

	history.push(path);
	path = null;
}

function change(e) {
	var
		col = this["col"].value,
	$;

	changeStyle(size.value, col);
}

function changeStyle(s, c) {
	ctx.lineWidth = s;
	ctx.strokeStyle = c;
}

ctx.lineWidth = 5;
ctx.strokeStyle = "#00F";
ctx.lineCap = ctx.lineJoin = "round";

canvas.addEventListener("mousemove", move);
form.addEventListener("change", change);

get();

})();//#