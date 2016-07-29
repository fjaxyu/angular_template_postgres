(function (angular) {
    angular
        .module('users').controller('DashboardController', function ($scope, $q, $location, $sessionStorage, $rootScope, Upload, UserService, UtilityService) {

            UtilityService.setPage('My Dashboard', true).then(function (response) {
//                UserService.getDashboard().then(function successCallback(response) {
//                    $scope.dashboard = response.data;
//                });
            });

        });
})(angular);
