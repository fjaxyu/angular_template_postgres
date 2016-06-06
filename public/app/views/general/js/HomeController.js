(function(angular) {

    angular.module('artlineup.general').controller('HomePageController', function ($scope, $location, $rootScope, $sessionStorage, UserService) {
        $rootScope.pageTitle = 'Art Lineup - Home';
        console.log('Home Page Controller');

        //TODO I LIKE THIS REDIRECT I WANT YOUR OPINION WESSY WOO
        if(UserService.isLoggedIn()){
            $location.path('/dashboard');
        }
        $scope.myInterval = 5000;

        $rootScope.homePage = true;

        $scope.$on('$locationChangeStart', function (event) {
            $rootScope.homePage = false;
        });

    });
})(angular);