<?php

namespace App;

require_once('vendor/autoload.php');

// TODO: Parse WKB
use CrEOF\Geo\WKB\Parser as WKBParser;

/**
 * GeoPackage wapper
 * 
 * Current Features:
 * 1. Validates GeoPackage file
 * 2. Reads table features
 * 3. Parse geometry header
 * 4. Export a table to GeoJSON
 * 5. TODO: create a GeoPackage file 
 * 6. TODO: parse WKB geometry
 *
 * @author mafonso
 */
class GeoPackage
{

    /**
     * Holds the sqlite pdo connection
     * 
     * @var \PDO
     */
    private $pdo;
    
    /**
     * Holds the filename path
     * 
     * @var string
     */
    private $filename;
    
    /**
     * Holds the working directory
     * 
     * @var type 
     */
    private $base_dir;
    
    /**
     * Cache validated tables
     * 
     * @var array
     */
    private $valid_tables = [];
    
    /**
     * Creates a new GeoPackage
     * 
     * @param string $filename
     */
    public function __construct($filename)
    {
        $this->filename = $filename;
        $this->base_dir = dirname($filename);
    }
    
    /**
     * Creates the GeoPackage file
     * 
     * TODO
     */
    public function create()
    {
        
    }

    /**
     * Validates existing GeoPackage file
     * 
     * @throws \Exception
     */
    public function validate()
    {
        /**
         * Validate file exists
         */
        if (!file_exists($this->filename)) {
            throw new \Exception ('Could not execute query');
        }
        
        /**
         * Validate connection
         */
        $dsn = "sqlite:" . $this->filename;
        $this->pdo = new \PDO($dsn);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        
        /**
         * Validate gpkg_contents table
         */
        $stm = $this->pdo->query("SELECT sql FROM sqlite_master WHERE tbl_name = 'gpkg_contents'");
        if (!$stm) throw new \Exception ('Could not execute query');
        $stm->execute();
        $result = $stm->fetchAll();
        if (count($result) === 0) {
            throw new \Exception ('Table gpkg_contents does not exists');
        }
    }
    
    /**
     * Validates features table
     * 
     * @param sting $tablename
     * @throws \Exception
     * @return boolean
     */
    
    /**
     * 
     * @param type $tablename
     * @return type
     */
    public function getSRID($tablename)
    {
        
        // Get table srid
        $stm = $this->pdo->query("SELECT srs_id FROM gpkg_contents WHERE table_name = ?");
        $stm->execute([$tablename]);
        return $stm->fetchColumn(0);
    }

    

    /**
     * Export all layers to function toGeoJSON
     * 
     * @param string $tablename
     * @param int $options
     * @param int $depth
     * @return string
     * @throws \Exception
     */
    public function allToGeoJSON($tablename, $columns, $column_id = 'fid')
    {
        // Validate first
        $this->validate();
        
        // Get table geometry column
        $stm = $this->pdo->query("SELECT column_name FROM gpkg_geometry_columns WHERE table_name = ?");
        $stm->execute([$tablename]);
        $geom_column = $stm->fetchColumn(0);
        
        // Get table srid
        $srid = $this->getSRID($tablename);
        
        // Get table items
        $sql = 'SELECT "'.$column_id.'","'. $geom_column.'", '.$columns
        . ' FROM "' . $tablename . '"'
        . ' WHERE "' . $geom_column . '" IS NOT NULL';
        $stm = $this->pdo->query($sql);
        $stm->execute();
        $items = $stm->fetchAll(\PDO::FETCH_OBJ);

        $arrayLayers = (array) null; 
        $id = 1;
        foreach($items as $item) {
            $newLayer = $this -> toGeoJSON($item, $id, $geom_column, $srid);
            array_push($arrayLayers, $newLayer);
            $id++;
        }
        
        // Return array of GeoJSONs
        return $arrayLayers;
    }

    public function toGeoJSON($item, $id, $geom_column, $srid)
    {
        
        // Get WKB parser (TODO)
        $wkbNames = ['POINT', 'LINESTRING', 'POLYGON']; 
        $geojsonNames = ['Point', 'LineString', 'Polygon'];
        $parser = new WKBParser();

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

        // Create buffer to parse geometry
        $buffer = fopen('php://memory', 'r+');
        fwrite($buffer, $item->{$geom_column});
        list($header, $wkb) = $this->parseGeometry($buffer);
        fclose($buffer);

        //Set properties
        $geojson['properties'] = $item;

        // Add geometry
        $geometry = $parser->parse($wkb); // TODO: use PHP parser
        $geometry['type'] = str_replace($wkbNames, $geojsonNames, $geometry['type']);
        $geometry['type'] = str_replace('MULTI', 'Multi', $geometry['type']); //for cases with MultiPoligon
        $geometry['coordinates'] = $geometry['value'];
        unset($geometry['srid']);
        unset($geometry['value']);
        //$geometry = bin2hex($wkb); // Use hexadecimal for interopability
        unset($item->{$geom_column}); // Remove geometry column from feature attributes
        $geojson['geometry'] = $geometry;

        return $geojson;
    }

    
    /**
     * Parse GeoPackageBinaryHeader
     * 
     * References
     * 
     * http://www.geopackage.org/spec/#gpb_spec
     * https://en.wikipedia.org/wiki/Well-known_text
     * http://php.net/manual/en/function.unpack.php
     * http://ngageoint.github.io/geopackage-js/ (NodeJS + SQL.js Demo)
     * 
     * @return array
     */
    protected function parseGeometry($buffer)
    {
        // Default values
        $header = [
            'magic'     => '',
            'version'   => 0,
            'flags'     => 0,
            'srs_id'    => 0,
            'envelope'  => []
        ];
        $wkb = '';
        
        // Open binary
        if (fseek($buffer, 0) === -1) {
            throw new \Exception('GeoPackage error: could start reading geometry buffer');
        }
            
        // Get stream stats
        $fstat = fstat($buffer);
        $total = $fstat['size'];
        $read = 0;

        // Parse header
        $bytes = unpack('A2magic/c1version/c1flags', fread($buffer, 4));
        $read += 4;
        $header['magic'] = $bytes['magic'];
        $header['version'] = $bytes['version'];
        $header['flags'] = $bytes['flags'];
        $header['envelop_flag'] = ($header['flags'] >> 1) & 7;
        $header['byte_order'] = $header['flags'] & 1;

        // Parse SRID
        $unpack_op = $header['byte_order'] ? 'V' : 'N';
        $bytes = array_values(unpack($unpack_op, fread($buffer, 4)));
        $read += 4;
        $header['srs_id'] = $bytes[0];

        // Parse envelop
        switch ($header['envelop_flag']) {
        case 1: // 32 bytes envelop
            $data = fread($buffer, 32);
            $data = $header['byte_order'] ? strrev($data) : $data;
            $unpack_op = $header['byte_order'] ? 'd*' : 'd*';
            $bytes = array_values(unpack($unpack_op, $data));
            $header['envelope'] = [
                'minx' => $bytes[0],
                'miny' => $bytes[1],
                'maxx' => $bytes[2],
                'maxy' => $bytes[3],
                'minz' => false,
                'maxz' => false,
                'minm' => false,
                'maxm' => false
            ];
            $read += 32;
            break;
        case 2: // 48 bytes envelop
            $data = fread($buffer, 48);
            $data = $header['byte_order'] ? strrev($data) : $data;
            $unpack_op = $header['byte_order'] ? 'd*' : 'd*';
            $bytes = array_values(unpack($unpack_op, $data));
            $header['envelope'] = [
                'minx' => $bytes[0],
                'miny' => $bytes[1],
                'maxx' => $bytes[2],
                'maxy' => $bytes[3],
                'minz' => $bytes[4],
                'maxz' => $bytes[5],
                'minm' => false,
                'maxm' => false
            ];
            $read += 48;
            break;
        case 3: // 48 bytes envelop
            $data = fread($buffer, 48);
            $data = $header['byte_order'] ? strrev($data) : $data;
            $unpack_op = $header['byte_order'] ? 'd*' : 'd*';
            $bytes = array_values(unpack($unpack_op, $data));
            $header['envelope'] = [
                'minx' => $bytes[0],
                'miny' => $bytes[1],
                'maxx' => $bytes[2],
                'maxy' => $bytes[3],
                'minz' => false,
                'maxz' => false,
                'minm' => $bytes[4],
                'maxm' => $bytes[5]
            ];
            $read += 48;
            break;
        default: ;// 0 envelop
        }

        // Get WKB from bytes left
        $wkb = fread($buffer, $total - $read);
        
        return [$header, $wkb];
    }
    
    /**
     * Get GeoPackage info
     * 
     * @return array
     */
    public function getInfo()
    {
        // Get tables
        $stm = $this->pdo->query("SELECT * FROM gpkg_contents WHERE data_type = 'features'");
        $stm->execute();
        $tables = $stm->fetchAll(\PDO::FETCH_OBJ);
        
        // Get table feature id column
        foreach($tables as &$item) {
            $stm = $this->pdo->query("SELECT * FROM gpkg_data_columns WHERE table_name = '{$item->table_name}'");
            $stm->execute();
            $item->columns = $stm->fetchAll(\PDO::FETCH_OBJ);
        }
        
        // Return info
        return ['tables' => $tables];
    }
}
