<?php
 
class GeoPackage {

    private $gpkg;

    function __construct() {
        if ($this->gpkg == null) {
			try {
				$this->gpkg = new SQLite3('../db/historic-water-layers.gpkg');
				$this->gpkg->loadExtension('libgpkg.so');
			} catch (Exception $e) {
				echo 'There is an exception nr: '.$e->getCode().', its message is: '.$e->getMessage();
			}
        }
        return $this->gpkg;
    }
	
	public function resultSetToArray($queryResultSet){
		//Get array of all features from table
		$multiArray = array();
		$count = 0;
		while($row = $queryResultSet->fetchArray(SQLITE3_ASSOC)){
			foreach($row as $i=>$value) {
				$multiArray[$count][$i] = $value;
			}
			$count++;
		}
		return $multiArray;
	}
	
	public function getSRID($tablename) {
        // Get table srid
        return $srid = $this->gpkg->querySingle('SELECT srs_id FROM gpkg_contents WHERE table_name = "'.$tablename.'"');
    }
	
	public function getGeomColumn($tablename) {
		// Get table geometry column
		return $geom_column = $this->gpkg->querySingle('SELECT column_name FROM gpkg_geometry_columns WHERE table_name = "'.$tablename.'"');
	}
	
	public function getGeomType($tablename, $id_column, $geom_column, $fid) {
		// Get geometry type of object
		return $geom_type = $this->gpkg->querySingle('SELECT ST_GeometryType("'.$geom_column.'") FROM "'.$tablename.'" WHERE "'.$id_column.'" = '.$fid);
	}
	
	public function getGeomCordsFromWKT($geom_text, $geom_type) {
		// Trim and replace WKT string to get geometry cords
		$pack_cords = preg_replace('/([-]*[0-9]+[.]{1}[0-9]+)[\s]+([0-9]+[.]{1}[0-9]+)/','[$1,$2]', $geom_text);
		$change_open_brackets = preg_replace('/\(/','[',$pack_cords);
		$change_close_brackets = preg_replace('/\)/',']',$change_open_brackets);
		$out_letters = preg_replace('/[^0-9,.\[\]]/', '', $change_close_brackets);
		
		// Only Point geometry don't need additionaly brackets, so they have to be aggregated
		if ($geom_type == 'Point') {
			$out_letters = preg_replace('/[\[][\[]/','[',$out_letters);
			$out_letters = preg_replace('/[\]][\]]/',']',$out_letters);
		}

		$geomJSON = json_decode($out_letters);

		return $geomJSON;
	}

	public function getArrayOfGeoJSONs($tablename, $id_column, $attr_columns) {
		// Takes all features from table and pack each to separated GeoJSON - returns array of GeoJSONs

		// Get geometry column name
		$geom_column = $this->getGeomColumn($tablename);
        
		// Get table srid
		$srid = $this->getSRID($tablename);
		
		// Get table items
		$items_query = $this->gpkg->query('SELECT "'.$id_column.'" AS fid , ST_AsText("'.$geom_column.'") AS geom_text,'.$attr_columns.' FROM "'.$tablename.'"');
		$items = $this->resultSetToArray($items_query);

		//Init array of GeoJSONs
		$arrayLayers = (array) null;

		//Convert each item to GeoJSON
        foreach($items as $item) {
            $newLayer = $this->featureToGeoJSON($item, $tablename, $id_column, $srid, $geom_column);
            array_push($arrayLayers, $newLayer);
        }
        
        // Return array of GeoJSONs
        return $arrayLayers;
		
	}
	
	public function featureToGeoJSON($item, $tablename, $id_column, $srid, $geom_column) {
		// Convert given feature to GeoJSON - returns one GeoJSON
		
		// Init GeoJSON object
        $geojson = [
            'type' => 'Feature',
            'crs' => [
                'type' => 'name',
                'properties' => [
                    'name' => 'urn:ogc:def:crs:EPSG::' . $srid
                ]
			],
			'properties' => null,
            'geometry' => null
		];
		
		// Get table geom type of feature
		$geom_type = $this->getGeomType($tablename, $id_column, $geom_column, $item['fid']);
			
		// Set geometry type
		$geojson['geometry']['type'] = $geom_type;
		   
		// Set geometry cords
		$geojson['geometry']['coordinates'] = $this->getGeomCordsFromWKT($item['geom_text'], $geom_type);
		   
		// Cleaning item object and adding rest attributes as feature properties
		unset($item['geom_text']);
		$geojson['properties'] = $item;

		return $geojson;
	}

	public function featureCollectionToGeoJSON($tablename, $id_column, $attr_columns) {
		// Takes all features from table and pack it to one GeoJSON as FeatureCollection - returns one GeoJSON
		
		// Get geometry column name
		$geom_column = $this->getGeomColumn($tablename);
        
		// Get table srid
        $srid = $this->getSRID($tablename);
		
		// Get table items
		$items_query = $this->gpkg->query('SELECT "'.$id_column.'" AS fid , ST_AsText("'.$geom_column.'") AS geom_text,'.$attr_columns.' FROM "'.$tablename.'"');
		$items = $this->resultSetToArray($items_query);
		
		// Init GeoJSON object
        $geojson = [
            'type' => 'FeatureCollection',
            'crs' => [
                'type' => 'name',
                'properties' => [
                    'name' => 'urn:ogc:def:crs:EPSG::' . $srid
                ]
            ],
            'features' => []
        ];
		
        foreach($items as $item) {

			// Get table geom type of feature
			$geom_type = $this->getGeomType($tablename, $id_column, $geom_column, $item['fid']);
			
			// Init feature
			$feature = ['type' => 'Feature', 'geometry' => null, 'properties' => null];
			
			// Set geometry type
			$feature['geometry']['type'] = $geom_type;
		   
			// Set geometry cords
			$feature['geometry']['coordinates'] = $this->getGeomCordsFromWKT($item['geom_text'], $geom_type);
		   
			// Cleaning item object and adding rest attributes as feature properties
			unset($item['geom_text']);
			$feature['properties'] = $item;
		   
			// Add feature to GeoJson object
			$geojson['features'][] = $feature;
		}
		
		return $geojson;
	}
}

?>