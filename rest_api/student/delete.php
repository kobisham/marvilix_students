<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
 
// include database and object file
include_once '../config/database.php';
include_once '../objects/student.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare student object
$student = new Student($db);
 
// get student id
$data = json_decode(file_get_contents("php://input"));
 
// set student id to be deleted
$student->id = $data->id;
 
// delete the student
if($student->delete()) {
    echo '{';
        echo '"message": "הסטודנט נמחק מהמערכת"';
    echo '}';
}
 
// if unable to delete the student
else {
    echo '{';
        echo '"message": "לא ניתן למחוק את הסטודנט"';
    echo '}';
}
?>