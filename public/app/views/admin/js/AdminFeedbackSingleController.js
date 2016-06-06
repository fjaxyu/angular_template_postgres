(function (angular) {
    angular
        .module('artlineup.admin').controller('AdminFeedbackSingleController', function ($scope, UtilityService, $routeParams, $location, $rootScope, AdminService, $q) {

            $rootScope.pageTitle = 'Art Lineup - Feedback Single';
            console.log('Admin Dashboard Page Controller');
            var id = $routeParams.id;

            AdminService.redirect();
            $scope.feedback = {};

            if (AdminService.isLoggedIn()) {
                $scope.admin = AdminService.getAdmin();
                AdminService.getFeedback(id).then(function (response) {
                    $scope.feedback = response.data;
                    AdminService.getAdminList().then(function(response2){
                        $scope.admins = response2.data;
                    });
                    console.log(response.data);
                    if ($scope.feedback.fixed === null) {
                        $scope.fixedFeedback();
                    }
                    
                    if ($scope.feedback.read_by === null) {
                        AdminService.feedbackRead(Number(id), Number($scope.admin.admin_id), UtilityService.getToday('text')).then(function(response){
                            console.log(response);
                            $scope.feedback.date_read = UtilityService.getToday();
                            $scope.feedback.read_by = $scope.admin.admin_id;
                        });
                    }
                });
            }

            $scope.fixedFeedback = function () {
                $scope.fixedDisabled = !$scope.feedback.fixed;
            };
            
            $scope.adminChange = function(admin){
                console.log(admin);
                $scope.feedback.fixed_by = admin.admin_id;
            };
            
            var validate = function(){
                $scope.fixedDateError = undefined;
                $scope.fixedByError = undefined;
                
                return $q(function(resolve, reject){
                    var error = 0;
                    
                    if ($scope.feedback.fixed === null || $scope.feedback.fixed === false) {
                        $scope.feedback.fixed_by = null;
                        $scope.feedback.fixed_date = null;
                    } else {
                        if (typeof $scope.feedback.fixed_by === 'undefined' || $scope.feedback.fixed_by === null) {
                            error = error + 1;
                            $scope.fixedByError = 'Fixed By field cannot be empty';
                        }
                        
                        if (typeof $scope.feedback.fixed_date === 'undefined' || $scope.feedback.fixed_date === null || $scope.feedback.fixed_date === '') {
                            error = error + 1;
                            $scope.fixedDateError = 'Fixed Date field cannot be empty';
                        } else {
                            $scope.feedback.fixed_date = new Date($scope.feedback.fixed_date);   
                        }
                    }
                    
                    if (error > 0) {
                        reject(error);
                    } else {
                        resolve(error);
                    }
                });
            };

        $scope.saveChanges = function() {
                validate().then(function(response) {
                    AdminService.updateFeedback($scope.feedback).then(function(response){
                        UtilityService.location('admin/feedback');
                    });
                }, function(reject){
                    
                });
            };

        });
})(angular);
