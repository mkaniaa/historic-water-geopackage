<?php

require './GeoPackage.php';

// Connecting GeoPackage database
$gpkg = new GeoPackage();
if ($gpkg == null) echo '<br> Could not connect to the GeoPackage database! <br>';

// Setting attributes columns names
$attr_columns = "year";

// Running query
$polygons = $gpkg->getArrayOfGeoJSONs("water-layers", "fid", $attr_columns);

header('Content-type:application/json;charset=utf-8');
header("Access-Control-Allow-Origin: *");
echo(json_encode($polygons));

?>