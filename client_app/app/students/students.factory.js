app.factory("studentsFactory", function ($http) {

    var factory = {};

    // read all students
    factory.readStudents = function () {
        return $http({
            method: 'GET',
            url: 'http://89.139.216.166/marvilix_api/student/read.php'
        });
    };

    // read all cities
    factory.readCities = function () {
        return $http({
            method: 'GET',
            url: 'http://89.139.216.166/marvilix_api/city/read.php'
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
                'city_id': 1
            },
            url: 'http://89.139.216.166/marvilix_api/student/create.php'
        });
    };

    return factory;
});