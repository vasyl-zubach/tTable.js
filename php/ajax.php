<?php
// set json headers
header('Content-type: text/json');
header('Content-type: application/json');

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


// our output params
$limit = $_GET['limit'];
$sort_by = $_GET['sort_by'];
$sort_type = $_GET['sort_type'];
if (!isset($sort_type)) {
	$sort_type = "asc";
}
$search = $_GET['search'];
$sensitive = $_GET['sensitive'];


sleep(1); // response delay

// data sorting
$data = array();
foreach ($data_array as $k => $v) {
	$data['name'][$k] = $v['name'];
	$data['link'][$k] = $v['link'];
	$data['type'][$k] = $v['type'];
}

if ($sort_by) {
	array_multisort($data[$sort_by], $sort_type == "asc" ? SORT_ASC : SORT_DESC, $data_array);
}

// here goes searching in array
if (isset($search) && !empty($search)) {
	$new_data_array = array();
	foreach ($data_array as $row) {
		$search_result = 0;
		foreach ($row as $col) {
			if ($sensitive == 'false') {
				$col = strtolower($col);
				$search = strtolower($search);
			}

			if (strpos($col, $search) !== false) {
				$search_result++;
			}
		}
		if ($search_result > 0) {
			$new_data_array[] = $row;
		}
	}
	$data_array = $new_data_array;
}

// cut the data in the limit
if (isset($limit)) {
	$limit = explode(",", $limit);
	$result = array_slice($data_array, $limit[0], $limit[1]);
} else {
	$result = $data_array;
}

// return our json
echo json_encode(array(
	"data" => $result,
//	"data" => [],
	"count" => count($data_array)
));

?>