(function(angular) {

    angular.module('general').controller('HomePageController', function ($scope, $location, $rootScope, $sessionStorage, UserService, UtilityService) {
        
        $rootScope.homePage = true;
        
        UserService.redirectUser('home');
        
        UtilityService.setPage('My App', false).then(function(response){
            
        });
        
        $scope.myInterval = 5000;

        $scope.$on('$locationChangeStart', function (event) {
            $rootScope.homePage = false;
        });

        $scope.disabled = false;
        
        $scope.location = function(v){
            console.log(v);
            UtilityService.location(v, true);
        };
        
        $scope.signUp = function(){
            $sessionStorage.new = {};
            $scope.disabled = true;
            $sessionStorage.new.email = $scope.email;
            UtilityService.location('/signup', true);
        };
        
    });
})(angular);