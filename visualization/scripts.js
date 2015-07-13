var INTERVAL = 50;

var coords = null;
var transactions = null;
$(function () {
	$.get("coords.json", function (res) {
		coords = res;
	});

	$.get("transactions.json", function (res) {
		transactions = res;
	});
	
	$("#showpath").click(function() {
		var qrid = $("#qrid").val();
		showPath($("#qrid").val());
	});

	$("#clearpath").click(function () {
		clearPath();
	});

	$(".day").click(function () {
		$("#date").val($(this).data("date"));
		$("#speed").val(0);
		$("#speed").change();
	});

	$("#speed").change(function () {
		if ($(this).val() == 0)
			$(this).css({background : "#faa"});
		else
			$(this).css({background : "#fff"});
	});

	$("#date").focus(function() {
		$("#speed").val(0);
		$("#speed").change();
	});
});

function draw(id, qrid, outgoing) {
	var newdiv = $("<div>").appendTo($("#map")).addClass("transaction");
	newdiv.css({
		left: (coords[id].x - 10) + "px",
		top: (coords[id].y - 10) + "px",
		cursor: "pointer"
	});
	if (qrid != "")
	{
		newdiv.click(function() {
			showPath(qrid);
			$("#qrid").val(qrid);
		});
	}
	setTimeout(function() {newdiv.remove()}, 2000);
	if (outgoing)
		$(newdiv).addClass("outgoing");
	else
		$(newdiv).addClass("incoming");
}

setInterval(function () {
	if (!transactions || !coords) return;
	if ($("#speed").val() == 0) return;

	var oldTime = new Date($("#date").val());
	var oldTimestamp = oldTime.getTime();

	var newTimestamp = oldTimestamp + parseInt($("#speed").val()) * INTERVAL;
	var newTime = new Date();
	newTime.setTime(newTimestamp);
	$("#date").val(newTime.toISOString());

	transactions.forEach(function (tr) {
		// Timestamps are broken, convert to real UTC
		var trTimestamp = new Date(tr.time).getTime() + 1000 * 60 * 60 * 2;
		if (!(trTimestamp > oldTimestamp && trTimestamp <= newTimestamp)) return;

		if (coords[tr.sender] !== undefined && coords[tr.sender].x) {
			draw(tr.sender, tr.recipient, true);
		}

		if (coords[tr.recipient] !== undefined && coords[tr.recipient].x) {
			draw(tr.recipient, tr.recipient, false);
		}
	});
}, INTERVAL);

var pathinterval = null;
function showPath(qrid) {
	var canvas = $("#path")[0];
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	path = new Path2D();
	context.lineWidth = 3;

	context.fillStyle = "rgba(0, 0, 0, 0.5)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.stroke(); 

	var places = [];
	transactions.forEach(function (tr) {
		if (tr.sender == "Zentralbank" || tr.sender == "taxinc") return;

		var is_sender = false;
		if (tr.sender == qrid && coords[tr.recipient] && coords[tr.recipient].x) {
			is_sender = true;
		} else if (!(tr.recipient == qrid && coords[tr.sender] && coords[tr.sender].x)) {
			return;
		}

		places.push({
			time : tr.time,
			place : is_sender ? tr.recipient : tr.sender
		});
	});

	if (places.length <= 0) {
		alert("Kontonummer nicht gefunden!");
		return;
	}

	places.sort(function (t1, t2) {
		return t1 > t2 ? 1 : -1;
	});

	path.moveTo(coords[places[0].place].x, coords[places[0].place].y);

	var i = 0;
	context.strokeStyle = "#ff0099";
	pathinterval = setInterval(function () {
		i++;
		path.lineTo(coords[places[i].place].x, coords[places[i].place].y);
		context.stroke(path);
		if (!places[i+1]) clearInterval(pathinterval);
	}, 200);
}

function clearPath() {
	if (pathinterval) clearInterval(pathinterval);
	var canvas = $("#path")[0];
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	$("#qrid").val("");
}
