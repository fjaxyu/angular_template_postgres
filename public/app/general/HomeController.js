var HomePageController = angular.module("HomePageController", []);

HomePageController.controller("HomePageController", ["$scope", "$location", "$rootScope", "$sessionStorage", "User", function($scope, $location, $rootScope, $sessionStorage, User) {
    
    $rootScope.pageTitle = "Home";
    
     
    
}])