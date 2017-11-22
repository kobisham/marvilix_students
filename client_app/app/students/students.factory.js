app.factory("studentsFactory", function ($http) {

    var factory = {};

    // read all students
    factory.readStudents = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost/marvilix_api/student/read.php'
        });
    };

    // read all cities
    factory.readCities = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost/marvilix_api/city/read.php'
        });
    };

    // create student
    factory.createStudent = function ($scope) {

        return $http({
            method: 'POST',
            data: {
                'id': $scope.id,
                'first_name': $scope.first_name,
                'last_name': $scope.last_name,
                'address': $scope.address,
                'deleted': 0,
                'city_id': $scope.city
            },
            url: 'http://localhost/marvilix_api/student/create.php'
        });
    };

    // delete student
    factory.deleteStudent = function (id) {
        return $http({
            method: 'POST',
            data: {
                'id': id
            },
            url: 'http://localhost/marvilix_api/student/delete.php'
        });
    };

    // read one student
    factory.readOneStudent = function (id) {
        return $http({
            method: 'GET',
            url: 'http://localhost/marvilix_api/student/read_one.php?id=' + id
        });
    };

    // update student
    factory.updateStudent = function ($scope) {

        return $http({
            method: 'POST',
            data: {
                'id': $scope.id,
                'first_name': $scope.first_name,
                'last_name': $scope.last_name,
                'city_id': $scope.city,
                'address': $scope.address

            },
            url: 'http://localhost/marvilix_api/student/update.php'
        });
    };

    return factory;
});