(function (angular) {

    angular.module('general').controller('NavBarController', function ($scope, $location, UserService, UtilityService) {


        $scope.loginLogout = UserService.loginLogout();

        $scope.logout = function () {
            UserService.logoutFunction();
        };

        if (UserService.isLoggedIn()) {
            $scope.user = UserService.get();
            $scope.hideNav = false;
        } else {
            $scope.hideNav = true;
        }

        $scope.hideNavbar = false;

        $scope.$on('$routeChangeStart', function (event) {
            if ($location.$$url.indexOf('/admin/') > -1) {
                $scope.hideNavbar = true;
            } else {
                $scope.hideNavbar = false;
            }
        });

        $scope.dashboard = function () {
            if (UserService.isLoggedIn()) {
                UtilityService.location('/dashboard');
            } else {
                UtilityService.location('/', true);
            }
        };
    });


})(angular);
