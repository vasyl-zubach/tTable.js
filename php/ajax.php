<?php

$limit = $_GET['limit'];

$sort_by = $_GET['sort_by'];
$sort_type = $_GET['sort_type'];
if (!isset($sort_type)) {
	$sort_type = "asc";
}

sleep(1);

$data_array = array(
	array("name" => "DevMate", "link" => "<a href='http://devmate.com'>DevMate</a>", "type" => "work"),
	array("name" => "MacPaw", "link" => "<a href='http://macpaw.com'>MacPaw</a>", "type" => "work"),
	array("name" => "Ensoul.Me", "link" => "<a href='http://ensoul.me'>Ensoul.me</a>", "type" => "work"),
	array("name" => "TjRus.com", "link" => "<a href='http://tjrus.com'>TjRus.com</a>", "type" => "personal"),
	array("name" => "Imageless iPhone", "link" => "<a href='http://tjrus.com/iphone'>Imageless iPhone</a>", "type" => "personal"),
	array("name" => "Imageless Lumia", "link" => "<a href='http://tjrus.com/lumia'>Imageless Lumia</a>", "type" => "personal"),
	array("name" => "_v_.js", "link" => "<a href='http://github.com/TjRus/_v_.js'>_v_.js</a>", "type" => "git"),
	array("name" => "tFormer.js", "link" => "<a href='http://github.com/TjRus/tFormer.js'>tFormer.js</a>", "type" => "git"),
	array("name" => "tTable.js", "link" => "<a href='http://github.com/TjRus/tTable.js'>tTable.js</a>", "type" => "git"),
	array("name" => "aer.js", "link" => "<a href='http://github.com/TjRus/aer.js'>aer.js</a>", "type" => "git"),
	array("name" => "Imageless iPhone", "link" => "<a href='http://github.com/TjRus/iPhone.js'>iPhone.js</a>", "type" => "git"),
	array("name" => "Imageless Lumia", "link" => "<a href='http://github.com/TjRus/Lumia.js'>Lumia.js</a>", "type" => "git"),
	array("name" => "_v_.js", "link" => "<a href='http://tjrus.github.io/_v_.js'>_v_.js</a>", "type" => "opensource"),
	array("name" => "tFormer.js", "link" => "<a href='http://tformerjs.com/'>tFormer.js</a>", "type" => "opensource")
);

$data = array();
foreach ($data_array as $k => $v) {
	$data['name'][$k] = $v['name'];
	$data['link'][$k] = $v['link'];
	$data['type'][$k] = $v['type'];
}

if ($sort_by) {
	array_multisort($data[$sort_by], $sort_type == "asc" ? SORT_ASC : SORT_DESC, $data_array);
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
//	"data" => [],
	"count" => count($data_array)
));

?>