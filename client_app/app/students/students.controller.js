app.controller('studentsController', function ($scope, $mdDialog, $mdToast, studentsFactory) {

    // define variables for data table
    $scope.selected = [];

    $scope.query = {
        order: 'first_name',
        limit: 100,
        page: 1
    };

    // get students
    $scope.getStudents = function () {
        // use students factory
        $scope.promise = studentsFactory.readStudents().then(function successCallback(response) {
            $scope.students = response.data.records;
        }, function errorCallback(response) {
            $scope.showToast("לא ניתן להציג רשומות");
        }).$promise;
    };

    // read students
    $scope.readStudents = function () {


        studentsFactory.readStudents().then(function successCallback(response) {
            $scope.students = response.data.records;
        }, function errorCallback(response) {
            $scope.showToast("לא ניתן להציג רשומות");
        });

    }

    // load cities
    $scope.cities = [];

    studentsFactory.readCities().then(function successCallback(response) {
        $scope.cities = response.data.records;
    }, function errorCallback(response) {
        $scope.showToast("לא ניתן להציג את רשימת הערים");
    });



    // show 'create student form' in dialog box
    $scope.showCreateStudentForm = function (event) {

        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/students/create_student.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            scope: $scope,
            preserveScope: true,
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
    }



    // create new student
    $scope.createStudent = function () {

        studentsFactory.createStudent($scope).then(function successCallback(response) {

            // tell the user new student was created
            $scope.showToast(response.data.message);

            // refresh the list
            $scope.readStudents();

            // close dialog
            $scope.cancel();

            // remove form values
            $scope.clearStudentForm();

        }, function errorCallback(response) {
            $scope.showToast("לא ניתן ליצור את הרשומה");
        });
    }

    // methods for dialog box
    function DialogController($scope, $mdDialog) {
        $scope.cancel = function () {
            $mdDialog.cancel();
        };

    }

    // clear variable / form values
    $scope.clearStudentForm = function () {
        $scope.id = "";
        $scope.first_name = "";
        $scope.last_name = "";
        $scope.city = "";
        $scope.address = "";
    }

    // show toast message
    $scope.showToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(message)
            .hideDelay(5000)
            .position("top left")
        );
    }

    // Validate and submit form
    $scope.createFormSubmit = function () {

        if ($scope.isValidId()) {
            $scope.createStudent();
        } else {
            $scope.showToast('מספר תעודת הזהות אינו תקין');
            return;
        }

    };

    $scope.isValidId = function () {

        // convert to string
        var IDnum = String($scope.id);

        // Validate correct input
        if ((IDnum.length > 9) || (IDnum.length < 5))
            return false;
        if (isNaN(IDnum))
            return false;

        // The number is too short - add leading 0000
        if (IDnum.length < 9) {
            while (IDnum.length < 9) {
                IDnum = '0' + IDnum;
            }
        }

        // CHECK THE ID NUMBER
        var mone = 0;
        var incNum;
        for (var i = 0; i < 9; i++) {
            incNum = Number(IDnum.charAt(i));
            incNum *= (i % 2) + 1;
            if (incNum > 9)
                incNum -= 9;
            mone += incNum;
        }
        if (mone % 10 == 0)
            return true;
        else
            return false;
    };

});