<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With');

require './GeoPackage.php';

// Connecting GeoPackage database
$gpkg = new GeoPackage();
if ($gpkg == null) echo '<br> Could not connect to the GeoPackage database! <br>';

// Setting attributes columns names
$attr_columns = "year";

// Running query
$polygons = $gpkg->getArrayOfGeoJSONs("water-layers", "fid", $attr_columns);

echo(json_encode($polygons));

?>