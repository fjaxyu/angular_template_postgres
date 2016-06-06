(function (angular) {

    angular.module('artlineup.general').controller('NavBarController', function ($scope, $location, $sessionStorage, $rootScope, UserService) {

        $scope.loginLogout = UserService.loginLogout();

//        this sets the login/logout button to the correct text (if the user is logged in, this says "log out")
        $scope.logout = function () {
            UserService.logoutFunction();
        };

        //    If the user is logged in, then unhide the navbar items
        if (UserService.isLoggedIn()) {
            $scope.user = UserService.get();
            $scope.hideNav = false;
        } else {
            $scope.hideNav = true;
        }

        // Uncomment this to hide the navbar on the home page
//        if ($location.$$url === '/') {
//            $scope.hideNavbar = true;
//        } else {
            $scope.hideNavbar = false;
//        }

//        $scope.$on('$routeChangeStart', function (event) {
//            if ($location.$$url === '/') {
//                $scope.hideNavbar = true;
//            } else {
//                $scope.hideNavbar = false;
//            }
//        });

        //This redirects the user to the dashboard if they are logged in and click on the home-button the navbar
        $scope.dashboard = function () {
            if (UserService.isLoggedIn()) {
                $location.path('/dashboard');
            } else {
                $location.path('/');
            }
        };
    });


})(angular);
