<?php

namespace App;

require('./FloodMarksToGeoPackage.php');

$db = new GeoPackage('historic-water-layers.gpkg');
$layers = $db->toGeoJSON('flood-marks', 'flood_date', 'height_water', 'inscription', 'id');
header('Content-type:application/json;charset=utf-8');
header("Access-Control-Allow-Origin: *");
echo(json_encode($layers));

?>