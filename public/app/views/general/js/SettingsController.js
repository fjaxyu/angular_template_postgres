(function (angular) {
    angular
        .module('general').controller('SettingsController', function ($scope, $location, $sessionStorage, UtilityService, $rootScope, UserService, ProductService, $uibModal, Upload) {

            UtilityService.state('update', 'Loading Settings');

            UtilityService.setPage('Settings', true).then(function (response) {
                $scope.user = UserService.get();
                UtilityService.finishLoading('dashboard');
            });

            $scope.sendEmail = function () {
                UserService.sendEmail().then(function (response) {
                    console.log(response);
                });
            };

        });
})(angular);