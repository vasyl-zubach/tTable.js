<?php

$limit = $_GET['limit'];
//if (!isset($limit)) {
//	$limit = "0,2";
//}

$sort_by = $_GET['sort_by'];
$sort_type = $_GET['sort_type'];
if (!isset($sort_type)) {
	$sort_type = "asc";
}

sleep(1);

$data_array = array(
	array("1" => "DevMate", "2" => "<a href='http://devmate.com'>DevMate</a>", "3" => "work"),
	array("1" => "MacPaw", "2" => "<a href='http://macpaw.com'>MacPaw</a>", "3" => "work"),
	array("1" => "Ensoul.Me", "2" => "<a href='http://ensoul.me'>Ensoul.me</a>", "3" => "work"),
	array("1" => "TjRus.com", "2" => "<a href='http://tjrus.com'>TjRus.com</a>", "3" => "personal"),
	array("1" => "Imageless iPhone", "2" => "<a href='http://tjrus.com/iphone'>Imageless iPhone</a>", "3" => "personal"),
	array("1" => "Imageless Lumia", "2" => "<a href='http://tjrus.com/lumia'>Imageless Lumia</a>", "3" => "personal"),
	array("1" => "_v_.js", "2" => "<a href='http://github.com/TjRus/_v_.js'>_v_.js</a>", "3" => "git"),
	array("1" => "tFormer.js", "2" => "<a href='http://github.com/TjRus/tFormer.js'>tFormer.js</a>", "3" => "git"),
	array("1" => "tTable.js", "2" => "<a href='http://github.com/TjRus/tTable.js'>tTable.js</a>", "3" => "git"),
	array("1" => "aer.js", "2" => "<a href='http://github.com/TjRus/aer.js'>aer.js</a>", "3" => "git"),
	array("1" => "Imageless iPhone", "2" => "<a href='http://github.com/TjRus/iPhone.js'>iPhone.js</a>", "3" => "git"),
	array("1" => "Imageless Lumia", "2" => "<a href='http://github.com/TjRus/Lumia.js'>Lumia.js</a>", "3" => "git"),
	array("1" => "_v_.js", "2" => "<a href='http://tjrus.github.io/_v_.js'>_v_.js</a>", "3" => "opensource"),
	array("1" => "tFormer.js", "2" => "<a href='http://tformerjs.com/'>tFormer.js</a>", "3" => "opensource")
);

$data = array(
	"1" => array(),
	"2" => array(),
	"3" => array()
);
foreach ($data_array as $key => $row) {
	$data["1"][$key] = $row['1'];
	$data["2"][$key] = $row['2'];
	$data["3"][$key] = $row['3'];
}

if ($sort_by) {
	array_multisort($data[$sort_by], $sort_type == "asc" ? SORT_ASC : SORT_DESC, SORT_STRING, $data_array);
}

if (isset($limit)) {
	$limit = explode(",", $limit);
	$result = array_slice($data_array, $limit[0], $limit[1]);
} else {
	$result = $data_array;
}
header('Content-type: text/json');
header('Content-type: application/json');

echo json_encode(array(
	"data" => $result,
	"count" => count($data_array)
));

?>