(function (angular) {
    angular
        .module('admin').controller('AdminNewLogsController', function ($scope, $routeParams, UtilityService, $q, $location, $rootScope, AdminService, UserService) {

            $rootScope.pageTitle = 'Admin Logs New';
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
                AdminService.getAdminList().then(function (response2) {
                    console.log(response2);
                    $scope.admins = jQuery.extend(true, [], response2);
                    var temp = jQuery.extend(true, [], response2);
                    $scope.assignments = [{username: 'none'}];
                    $scope.assignments = $scope.assignments.concat(temp);
                    $scope.log.device = 'general';
                });
            }

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
            
            $scope.assignedChange = function(user) {
                if (user.username === 'none') {
                    delete $scope.log.assigned_to;
                } else {
                    $scope.log.assigned_to = user.username;   
                }
            };

            $scope.log = {};
            $scope.checkPublic();
            $scope.checkFixed();
            $scope.log.last_updated = UtilityService.getToday('text');
            $scope.log.updated_by = $scope.admin.username;
            $scope.log.date_found = UtilityService.getToday('text');
            $scope.log.created_by = $scope.admin.username;
            $scope.log.public = false;
            $scope.log.fixed = false;

            $scope.cancelLog = function () {
                $location.path('/admin/log');
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
                    if (typeof $scope.log.public_title === 'undefined' || $scope.log.public_title === '') {
                        $scope.public_titleError = 'Title field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if (typeof $scope.log.group === 'undefined' || $scope.log.public_title === '') {
                        $scope.groupError = 'Group field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if (typeof $scope.log.subgroup === 'undefined' || $scope.log.public_title === '') {
                        $scope.subGroupError = 'Sub Group field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if (typeof $scope.log.date_found === 'undefined' || $scope.log.date_found === '') {
                        $scope.date_foundError = 'Date Found field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }

                    if (typeof $scope.log.date_found === 'undefined' || $scope.log.date_found === '') {
                        $scope.date_foundError = 'Date Found field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }

                    if (typeof $scope.log.type === 'undefined' || $scope.log.type === '') {
                        $scope.typeError = 'Type field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if (typeof $scope.log.device === 'undefined' || $scope.log.device === '') {
                        $scope.deviceError = 'Device field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if (typeof $scope.log.priority === 'undefined' || $scope.log.priority === '') {
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
                        delete $scope.log.public_message;
                    }

                    if ($scope.log.fixed === false) {
                        delete $scope.log.fixed_by;
                        delete $scope.log.minutes;
                        delete $scope.log.date_fixed;
                    }
                    
                    $scope.log.group = UtilityService.capitalizeEach($scope.log.group);
                    $scope.log.subgroup = UtilityService.capitalizeEach($scope.log.subgroup);
                    $scope.log.public_title = UtilityService.capitalizeEach($scope.log.public_title);
                    
                    resolve('complete');
                });
            };

            $scope.updateLog = function (log) {
                $scope.errorMessage = undefined;
                $scope.successMessage = undefined;
                $scope.disabled = true;
                
                isValid().then(function (response) {
                    
                    setUndefinedValues().then(function (response2) {
                        
                        AdminService.updateLog($scope.log, 'new').then(function successCallback(response){
                            $location.path('/admin/logs');
                            $scope.disabled = false;
                        });
                        
                    });
                    
                    $scope.disabled = false;
                    
                }, function (error) {
                    $scope.disabled = false;
                    $scope.errorMessage = 'Please address the authentication problems';
                });
            };


        });
})(angular);
