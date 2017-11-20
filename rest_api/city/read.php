<?php
// required header
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/city.php';
 
// instantiate database and city object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$city = new City($db);
 
// query cities
$stmt = $city->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // cities array
    $cities_arr=array();
    $cities_arr["records"]=array();
 
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        extract($row);
 
        $city_item=array(
            "id" => $id,
            "name" => $name
        );
 
        array_push($cities_arr["records"], $city_item);
    }
 
    echo json_encode($cities_arr);
}
 
else{
    echo json_encode(
        array("message" => "No cities found.")
    );
}
?>