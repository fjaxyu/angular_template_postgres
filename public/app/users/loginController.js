var loginController = angular.module("loginController", []);

loginController.controller("loginController", ["$scope", "$http", "$location", "$sessionStorage", "$route", "$routeParams", "$rootScope", "User", "$window", function($scope, $http, $location, $sessionStorage, $route, $routeParams, $rootScope, User, $window){
    
    
    $rootScope.pageTitle = "Login";
    
    
}])