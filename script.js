;(function() {

var
	form = document.forms[0],
	canvas = document.querySelector("canvas#input"),
	ctx = canvas.getContext("2d"),
	output = document.querySelector("canvas#output"),
	ctxOut = output.getContext("2d"),
	clicked = false,
	size = document.querySelector("#size input"),
	toggle = document.querySelector("#toggle"),
	path = {},
	latestDt = -1,
$;

function get(when, cb) {
	x("get", {when: latestDt}, cb);
}

function post(what, cb) {
	x("post", {path: what}, cb);
}

function draw(pathList) {
	var
		i_path,
		len_path,
		i_point,
		len_point,

		path,
	$;

	for(i_path = 0, len_path = pathList.length; i_path < len_path; i_path++) {
		path = pathList[i_path];
		latestDt = path.timestamp;

		ctxOut.lineWidth = path.size;
		ctxOut.strokeStyle = path.col;

		if(path.points[0]) {
			ctxOut.moveTo(path.points[0].x, path.points[0].y);
			ctxOut.beginPath();
		}

		for(i = 1, len = path.points.length; i < len; i++) {
			ctxOut.lineTo(path.points[i].x, path.points[i].y);
			ctxOut.stroke();
		}
	}
}

function x(method, data, cb) {
	var
		method = method.toUpperCase(),
		xhr = new XMLHttpRequest(),
		url = "data.php",
		fd = null,
		prop,
		i,
		len,
	$;

	if(method === "GET"
	|| method === "DELETE") {
		url += "?";
	}
	else {
		fd = new FormData();
	}

	for(prop in data) {
		if(!data.hasOwnProperty(prop)) {
			continue;
		}

		if(method === "GET"
		|| method === "DELETE") {
			url += prop;
			url += "=";
			url += data[prop];
			url += "&";
		}
		else {
			if(!data[prop].points) {
				continue;
			}

			fd.append("col", data[prop].col);
			fd.append("size", data[prop].size);

			for(i = 0, len = data[prop].points.length; i < len; i++) {
				fd.append("pos[]",
					data[prop].points[i].x
					+ "-"
					+ data[prop].points[i].y);
			}
		}
	}

	xhr.open(method, url);
	if(cb) {
		xhr.addEventListener("load", cb);
	}
	xhr.send(fd);
}

function start(e) {
	clicked = true;
	ctx.beginPath();
	ctx.moveTo(e.offsetX, e.offsetY);
	path = {
		start: {
			x: e.offsetX,
			y: e.offsetY,
		},
		size: size.value,
		col: ctx.strokeStyle,
		points: [],
	};

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
	post(path);
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

function update() {
	draw(JSON.parse(this.responseText));
	get({when: latestDt}, update);
};

ctx.lineWidth = 5;
ctx.strokeStyle = "#00F";
ctx.lineCap = ctx.lineJoin = "round";

canvas.addEventListener("mousemove", move);
form.addEventListener("change", change);

get(null, update);

})();//#