<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate student object
include_once '../objects/student.php';
 
$database = new Database();
$db = $database->getConnection();
 
$student = new Student($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));
 
// set student property values
$student->id = $data->id;
$student->first_name = $data->first_name;
$student->last_name = $data->last_name;
$student->city_id = $data->city_id;
$student->address = $data->address;
$student->deleted = $data->deleted;
$student->created = date('Y-m-d H:i:s');
 
// create the student
if($student->create()){
    echo '{';
        echo '"message": "הסטודנט נוצר בהצלחה"';
    echo '}';
}
 
// if unable to create the student, inform the user
else{
    echo '{';
        echo '"message": "הסטודנט קיים במערכת/לא ניתן ליצור את הסטודנט"';
    echo '}';
}
?>