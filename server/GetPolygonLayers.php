<?php

namespace App;

require('./PolygonLayersToGeoPackage.php');

$db = new GeoPackage('historic-water-layers.gpkg');
$layers = $db->allToGeoJSON('water-layers', 'year', 'fid');
header('Content-type:application/json;charset=utf-8');
header("Access-Control-Allow-Origin: *");
echo(json_encode($layers));

?>