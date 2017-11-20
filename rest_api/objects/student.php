<?php
class Student
{
 
    // database connection and table name
    private $conn;
    private $table_name = "student";
 
    // object properties
    public $id;
    public $first_name;
    public $last_name;
    public $city_id;
    public $city_name;
    public $address;
    public $deleted;
    public $created;

    
 
    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // read students
    function read()
    {
    
       // select all query
        $query = "SELECT 
                    S.id,
                    S.first_name,
                    S.last_name,
                    S.city_id,
                    C.name as city_name,
                    S.address,
                    S.deleted,
                    S.created
               FROM
                   " . $this->table_name . " S
                   LEFT JOIN city C 
                   ON S.city_id = C.id 
                   WHERE deleted=0
                   ORDER BY created desc";
    
       // prepare query statement
        $stmt = $this->conn->prepare($query);
    
       // execute query
        $stmt->execute();

        return $stmt;
    }

    // create student
    function create()
    {
    
       // query to insert record
        $query = "INSERT INTO
                   " . $this->table_name . "
               SET
                   id=:id, first_name=:first_name,last_name=:last_name,city_id=:city_id,address=:address,deleted=:deleted,created=:created";
    
       // prepare query
        $stmt = $this->conn->prepare($query);
    
       // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->city_id = htmlspecialchars(strip_tags($this->city_id));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->deleted = htmlspecialchars(strip_tags($this->deleted));
        $this->created = htmlspecialchars(strip_tags($this->created));
       
       // bind values
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":city_id", $this->city_id);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":deleted", $this->deleted);
        $stmt->bindParam(":created", $this->created);
       
    
       // execute query
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    // used when filling up the update student form
    function readOne()
    {
    
       // query to read single record
        $query = "SELECT 
                    S.id,
                    S.first_name,
                    S.last_name,
                    S.city_id,
                    C.name as city_name,
                    S.address,
                    S.deleted,
                    S.created
               FROM
                   " . $this->table_name . " S
                   LEFT JOIN city C 
                   ON S.city_id = C.id 
                    WHERE
                        S.id = ?
                    LIMIT
                        0,1";
    
       // prepare query statement
        $stmt = $this->conn->prepare($query);
    
       // bind id of student to be updated
        $stmt->bindParam(1, $this->id);
    
       // execute query
        $stmt->execute();
    
       // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
       // set values to object properties
        $this->first_name = htmlspecialchars_decode($row['first_name']);
        $this->last_name = htmlspecialchars_decode($row['last_name']);
        $this->city_id = $row['city_id'];
        $this->city_name = htmlspecialchars_decode($row['city_name']);
        $this->address = htmlspecialchars_decode($row['address']);
        $this->deleted = $row['deleted'];
        $this->created = $row['created'];

    }

    // update the student
    function update()
    {
    
       // update query
        $query = "UPDATE
                   " . $this->table_name . "
               SET
                   first_name = :first_name,
                   last_name = :last_name,
                   city_id = :city_id,
                   address = :address
                 
               WHERE
                   id = :id";
    
       // prepare query statement
        $stmt = $this->conn->prepare($query);
    
       // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->city_id = htmlspecialchars(strip_tags($this->city_id));
        $this->address = htmlspecialchars(strip_tags($this->address));

      
       // bind new values
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":city_id", $this->city_id);
        $stmt->bindParam(":address", $this->address);

      
       // execute the query
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    // delete the student
    function delete()
    {
    
       // delete query
        $query = "UPDATE
                " . $this->table_name . "
                SET
                    deleted = 1
                WHERE
                    id = :id";
       // prepare query
        $stmt = $this->conn->prepare($query);
    
       // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
    
       // bind id of record to delete
        $stmt->bindParam(":id", $this->id);
    
       // execute the query
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }

    }

   // search student by first name
    function search($keywords)
    {
    
       // select all query
        $query = "SELECT 
       S.id,
       S.first_name,
       S.last_name,
       S.city_id,
       C.name as city_name,
       S.address,
       S.deleted,
       S.created
    FROM
      " . $this->table_name . " S
      LEFT JOIN city C 
      ON S.city_id = C.id 
      WHERE S.first_name like ?
      AND deleted=0
      ORDER BY created desc";

       // prepare query statement
        $stmt = $this->conn->prepare($query);
    
       // sanitize
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
    
       // bind
        $stmt->bindParam(1, $keywords);
    
       // execute query
        $stmt->execute();

        return $stmt;
    }

}