app.controller('studentsController', function ($scope, $mdDialog, $mdToast, studentsFactory) {

    // define variables for data table
    $scope.selected = [];

    $scope.query = {
        order: 'first_name',
        limit: 100
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
            $scope.getStudents();

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

    // cofirm student deletion
    $scope.confirmDeleteStudent = function (event, id, first_name, last_name) {

        // set id of record to delete
        $scope.id = id;

        // dialog settings
        var confirm = $mdDialog.confirm()
            .title('האם אתה בטוח שברצונך למחוק את ' + first_name + ' ' + last_name + "?")
            .textContent('שים לב. לא ניתן לשחזר את הסטודנט לאחר המחיקה')
            .targetEvent(event)
            .ok('כן')
            .cancel('לא');

        // show dialog
        $mdDialog.show(confirm).then(
            // 'Yes' button
            function () {
                // if user clicked 'Yes', delete student record
                $scope.deleteStudent();
            },

            // 'No' button
            function () {
                $scope.showToast("פעולת המחיקה בוטלה");
            }
        );
    }

    // delete student
    $scope.deleteStudent = function () {
        console.log('delete student called');
        studentsFactory.deleteStudent($scope.id).then(function successCallback(response) {

            // tell the user student was deleted
            $scope.showToast(response.data.message);

            // refresh the list
            $scope.getStudents();

        }, function errorCallback(response) {
            $scope.showToast("לא ניתן למחוק את הסטודנט");
        });

    }

    // retrieve record to fill out the form
    $scope.showUpdateStudentForm = function (id) {

        // get student to be edited
        studentsFactory.readOneStudent(id).then(function successCallback(response) {

            // put the values in form
            $scope.id = id;
            $scope.first_name = response.data.first_name;
            $scope.last_name = response.data.last_name;
            $scope.address = response.data.address;
            $scope.city = response.data.city_id;


            $mdDialog.show({
                controller: DialogController,
                templateUrl: './app/students/update_student.template.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: false,
                scope: $scope,
                preserveScope: true,
                fullscreen: true
            }).then(
                function () {},

                // user clicked 'Cancel'
                function () {
                    // clear modal content
                    $scope.clearStudentForm();
                }
            );

        }, function errorCallback(response) {
            $scope.showToast("לא ניתן להציג את הרשומה");
        });

    }

    // update student record / save changes
    $scope.updateStudent = function () {
     
        studentsFactory.updateStudent($scope).then(function successCallback(response) {

                // tell the user student record was updated
                $scope.showToast(response.data.message);

                // refresh the student list
                $scope.getStudents();

                // close dialog
                $scope.cancel();

                // clear modal content
                $scope.clearStudentForm();

            },
            function errorCallback(response) {
                $scope.showToast("לא ניתן לעדכן את הרשומה");
            });

    }

});