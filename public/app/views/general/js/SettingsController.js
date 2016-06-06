(function (angular) {
    angular
        .module('artlineup.general').controller('SettingsController', function ($scope, UtilityService, UserService) {

            UtilityService.setPage('Art Lineup - Settings', true).then(function (response) {
                $scope.user = UserService.get();

            });

        });
})(angular);
