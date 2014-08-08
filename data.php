<?php
chdir(__DIR__);
date_default_timezone_set("UTC");
$db = new PDO(
	"mysql:dbname=canvas;host=127.0.0.1;port=3306;charset=utf8",
	"canvas",
	"canvas_pass"
);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

if(empty($_POST)) {
	$when = null;

	if(isset($_GET["when"])
	&& $_GET["when"] > 0) {
		$when = $_GET["when"];
	}

	$time = 0;
	$timeInc = 1;
	$timeLimit = 600; // 10 minutes
	set_time_limit($timeLimit + 1);
	$pathArray = array();

	while(empty($pathArray) && $time < $timeLimit) {
		$sql = file_get_contents("db/getPath.sql");
		$stmt = $db->prepare($sql);
		$stmt->bindParam(":when", $when);
		$stmt->execute();
		$pathArray = $path = $stmt->fetchAll();

		if(empty($pathArray)) {
			$time += $timeInc;
			sleep($timeInc);
		}
	}

	$sql = file_get_contents("db/getPoint.sql");
	foreach ($pathArray as $i => $path) {
		$stmt = $db->prepare($sql);
		$stmt->bindParam(":ID_Path", $path->ID);
		$stmt->execute();

		$pathArray[$i]->points = $stmt->fetchAll();
	}

	die(json_encode($pathArray));
}
else {
	// Only trust the given timestamp if it is far different from server's.
	if(abs($_POST["timestamp"] - time()) > 10) {
		$_POST["timestamp"] = time();
	}
	$sql = file_get_contents("db/putPath.sql");
	$stmt = $db->prepare($sql);
	$stmt->bindParam(":col", $_POST["col"]);
	$stmt->bindParam(":size", $_POST["size"]);
	$stmt->bindParam(":who", $_SERVER["REMOTE_ADDR"]);
	$stmt->execute();

	$pathID = $db->lastInsertId();
	$sql = file_get_contents("db/putPoint.sql");
	foreach ($_POST["pos"] as $pos) {
		$xy = explode("-", $pos);
		$stmt = $db->prepare($sql);
		$stmt->bindParam(":x", $xy[0]);
		$stmt->bindParam(":y", $xy[1]);
		$stmt->bindParam(":ID_Path", $pathID);
		$stmt->execute();
	}
}

die("OK");