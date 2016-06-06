(function (angular) {
    angular
        .module('artlineup.admin').controller('AdminLoginController', function ($scope, $rootScope, AdminService) {

            $rootScope.pageTitle = 'Art Lineup - Admin Login';
            console.log('Admin Login Page Controller');

            $scope.adminLogin = function (user) {
                $scope.successMessage = undefined;
                $scope.errorMessage = undefined;
                $scope.proccessingMessage = undefined;
                if (typeof user === 'undefined') {
                    $scope.errorMessage = 'A username and password are required';
                    return;
                }
                $scope.disabled = true;
                $scope.errorMessage = undefined;
                if (typeof user.username === 'undefined' || user.username === '') {
                    $scope.errorMessage = 'A username is required';
                    $scope.disabled = false;
                } else if (typeof user.password === 'undefined' || user.password === '') {
                    $scope.errorMessage = 'A password is required';
                    $scope.disabled = false;
                } else {
                    user.username = user.username.toLowerCase();
                    AdminService.adminLogin(user, 'admin').then(function successCallback(data) {
                        if (data === 'combination does not exist') {
                            $scope.errorMessage = 'Wrong username/password combination (case-sensitive)';
                            $scope.disabled = false;
                        }
                    });
                }
            };

        });
})(angular);
