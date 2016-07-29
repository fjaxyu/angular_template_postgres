(function (angular) {
    angular
        .module('admin').controller('AdminEditLogsController', function ($scope, $q, UtilityService, $routeParams, $location, $rootScope, AdminService, UserService) {

            $rootScope.pageTitle = 'Art Lineup - Admin Dashboard';
            console.log('Admin Dashboard Page Controller');

            var id = $routeParams.id;

            AdminService.redirect();

            var changeDate = function (today) {
                today = new Date(today);

                var dd = today.getUTCDate();
                var mm = today.getUTCMonth() + 1; //January is 0!
                var yyyy = today.getUTCFullYear();

                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }

                var time = mm + '/' + dd + '/' + yyyy;
                //        console.log(time);
                return time;
            };

            if (AdminService.isLoggedIn()) {
                $scope.admin = AdminService.getAdmin();
                AdminService.getAdminLogs(id).then(function successCallback(response) {
                    console.log(response.data[0]);
                    $scope.log = response.data[0];
                    $scope.checkPublic();
                    $scope.checkFixed();

                    $scope.log.date_found = changeDate($scope.log.date_found);
                    $scope.log.last_updated = changeDate($scope.log.last_updated);

                    if ($scope.log.date_fixed != null) {
                        $scope.log.date_fixed = changeDate($scope.log.date_fixed);
                    }

                    if ($scope.log.date_due != null) {
                        $scope.log.date_due = changeDate($scope.log.date_due);
                    }
                });

                AdminService.getAdminList().then(function (response2) {
                    console.log(response2);
                    $scope.admins = jQuery.extend(true, [], response2);
                    var temp = jQuery.extend(true, [], response2);
                    $scope.assignments = [{username: 'none'}];
                    $scope.assignments = $scope.assignments.concat(temp);

                    $scope.setUsers();
                });
            }

            $scope.setUsers = function () {
                if ($scope.log.fixed_by != null) {
                    $scope.admins.forEach(function (v, i) {
                        if ($scope.log.fixed_by === v.username) {
                            $scope.fixed = $scope.admins[i];
                        }
                    });
                }

                if ($scope.log.assigned_to != null) {
                    $scope.assignments.forEach(function (v, i) {
                        if ($scope.log.assigned_to === v.username) {
                            $scope.assigned_to = $scope.assignments[i];
                        }
                    });
                }
            };

            $scope.checkPublic = function () {
                if ($scope.log.public === true) {
                    $scope.not_public = false;
                } else {
                    $scope.not_public = true;
                }
            };

            $scope.checkFixed = function () {
                if ($scope.log.fixed === true) {
                    $scope.fixedDisabled = false;
                } else {
                    $scope.fixedDisabled = true;
                }
            };

            $scope.fixedChange = function (fixed) {
                $scope.log.fixed_by = fixed.username;
            };

            $scope.assignedChange = function (user) {
                if (user.username === 'none') {
                    delete $scope.log.assigned_to;
                } else {
                    $scope.log.assigned_to = user.username;
                }
            };

            $scope.cancelLog = function () {
                $location.path('/admin/logs');
            };

            var isValid = function () {
                return $q(function (resolve, reject) {
                    $scope.nameError = undefined;
                    $scope.emailError = undefined;
                    $scope.public_titleError = undefined;
                    $scope.typeError = undefined;
                    $scope.deviceError = undefined;
                    $scope.priorityError = undefined;
                    $scope.messageError = undefined;
                    $scope.groupError = undefined;
                    $scope.subGroupError = undefined;
                    $scope.disabled = true;

                    $scope.dateFixedError = undefined;
                    $scope.minutesError = undefined;
                    $scope.fixedByError = undefined;

                    //        CHECK FOR EMPTY INPUTS
                    var error = 0;
                    if ($scope.log.public_title == null || $scope.log.public_title === '') {
                        $scope.public_titleError = 'Title field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if ($scope.log.group == null || $scope.log.public_title === '') {
                        $scope.groupError = 'Group field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if ($scope.log.subgroup == null || $scope.log.public_title === '') {
                        $scope.subGroupError = 'Sub Group field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if ($scope.log.date_found == null || $scope.log.date_found === '') {
                        $scope.date_foundError = 'Date Found field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }

                    if ($scope.log.type == null || $scope.log.type === '') {
                        $scope.typeError = 'Type field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if ($scope.log.device == null || $scope.log.device === '') {
                        $scope.deviceError = 'Device field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if ($scope.log.priority == null || $scope.log.priority === '') {
                        $scope.priorityError = 'Priority field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }

                    if ($scope.log.public === true) {
                        if (typeof $scope.log.public_message === 'undefined' || $scope.log.public_message === '') {
                            $scope.public_messageError = 'Public Message field cannot be empty if the log is set to \'Public\'';
                            $scope.disabled = false;
                            error = error + 1;
                        }
                    }

                    if ($scope.log.fixed === true) {
                        if ($scope.log.date_fixed == null) {
                            error = error + 1;
                            $scope.dateFixedError = 'Date Fixed field cannot be empty';
                        }

                        if ($scope.log.minutes == null) {
                            error = error + 1;
                            $scope.minutesError = 'Minutes field cannot be empty';
                        }

                        if ($scope.log.fixed_by == null) {
                            error = error + 1;
                            $scope.fixedByError = 'Fixed By field cannot be empty';
                        }
                    }


                    if (error > 0) {
                        reject(error);
                    } else {
                        resolve(error);
                    }
                });
            };

            var setUndefinedValues = function () {
                return $q(function (resolve, reject) {
                    if ($scope.log.public === false) {
                        $scope.log.public_message = null;
                    }

                    if ($scope.log.fixed === false) {
                        $scope.log.fixed_by = null;
                        $scope.log.minutes = null;
                        $scope.log.date_fixed = null;
                    }

                    $scope.log.group = UtilityService.capitalizeEach($scope.log.group);
                    $scope.log.subgroup = UtilityService.capitalizeEach($scope.log.subgroup);
                    $scope.log.public_title = UtilityService.capitalizeEach($scope.log.public_title);

                    resolve('complete');
                });
            };


            $scope.deleteLog = function () {
                var answer = confirm('Are you sure you want to delete this log?');
                if (answer) {
                    AdminService.deleteLog($scope.log.log_id).then(function (response) {
                        UtilityService.location('/admin/logs');
                    });
                }
            };

            $scope.updateLog = function (log) {
                $scope.errorMessage = undefined;
                $scope.successMessage = undefined;
                $scope.disabled = true;
                isValid().then(function (response) {
                    setUndefinedValues().then(function (response2) {
                        $scope.log.last_updated = AdminService.getDay();
                        $scope.log.updated_by = $scope.admin.username;
                        console.log($scope.log);
                        AdminService.updateLog($scope.log, 'update').then(function successCallback(response) {
                            $location.path('/admin/logs');
                            $scope.disabled = false;
                        });
                    });
                }, function (error) {
                    $scope.disabled = false;
                    $scope.errorMessage = 'Please address the authentication problems';
                });
            };

        });
})(angular);
