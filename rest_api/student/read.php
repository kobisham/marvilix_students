<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/student.php';
 
// instantiate database and student object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$student = new Student($db);
 
// query students
$stmt = $student->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // students array
    $students_arr=array();
    $students_arr["records"]=array();
 
    // retrieve table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        extract($row);
 
        $student_item=array(
            "id" => $id,
            "first_name" => html_entity_decode($first_name),
            "last_name" => html_entity_decode($last_name),
            "city_id" => $city_id,
            "city_name" => html_entity_decode($city_name),
            "address" => html_entity_decode($address),
            "deleted" => $deleted,
            "created" => $created
        );
 
        array_push($students_arr["records"], $student_item);
    }
 
    echo json_encode($students_arr);
}
 
else{
    echo json_encode(
        array("message" => "לא נמצאו סטודנטים במערכת")
    );
}
?>