(function (angular) {
    angular
        .module('users').controller('loginController', function ($scope, $q, $http, $location, $sessionStorage, $route, $routeParams, $rootScope, UserService, $window) {
            $rootScope.pageTitle = 'My App - Login';

            $scope.new = {};
            $scope.confirm = {};
            $scope.user = {};
            $scope.keepLoggedIn = false;

            $scope.signup = function (user) {
                $scope.dangerMessage = undefined;
                $scope.disabled = true;
                if (!$scope.validate()) {
                    console.log('invalid');
                    $scope.disabled = false;
                } else {
                    var newUser = {
                        password: user.password,
                        name: user.name,
                        email: user.email.toLowerCase()
                    };
                    
                    UserService.checkForUser(newUser.email).then(function successCallback(response) {
                        console.log(response);
                        if (response.data === 'okay') {
                            UserService.create(newUser).then(function (data) {
                                $location.path('/login');
                            });
                        } else if (response.data === 'email exists') {
                            $scope.dangerMessage = 'That email exists.';
                            $scope.disabled = false;
                        } else {
                            $scope.dangerMessage = 'There was an error';
                            $scope.disabled = false;
                        }
                    });

                }
            };

            $scope.validate = function () {
                var error = 0;
                $scope.nameError = undefined;
                $scope.emailError = undefined;
                $scope.confirmEmailError = undefined;
                $scope.passwordError = undefined;
                $scope.confirmPasswordError = undefined;

                if (typeof $scope.new.name === 'undefined' || $scope.new.name === '') {
                    $scope.nameError = 'Name field cannot be empty';
                    error = error + 1;
                }

                if (typeof $scope.new.email === 'undefined' || $scope.new.email === '') {
                    $scope.emailError = 'Email field cannot be empty';
                    error = error + 1;
                }

                if (typeof $scope.confirm.email === 'undefined') {
                    $scope.confirmEmailError = 'Confirm Email field cannot be empty';
                    error = error + 1;
                }

                if ($scope.new.email !== $scope.confirm.email) {
                    $scope.confirmEmailError = 'Emails do not match';
                    error = error + 1;
                }

                if (typeof $scope.new.password === 'undefined' || $scope.new.password === '') {
                    $scope.passwordError = 'Password field cannot be empty';
                    error = error + 1;
                }

                if (typeof $scope.confirm.password === 'undefined') {
                    $scope.confirmPasswordError = 'Confirm password field cannot be empty';
                    error = error + 1;
                }

                if ($scope.new.password !== $scope.confirm.password) {
                    $scope.confirmPasswordError = 'Passwords do not match';
                    error = error + 1;
                }

                if (error > 0) {
                    $scope.isInvalid = true;
                    return 0;
                } else {
                    $scope.isInvalid = false;
                    return 1;
                }
            };


            $scope.validateLogin = function () {
                $scope.emailError = undefined;
                $scope.passwordError = undefined;
                
                return $q(function (resolve, reject) {
                    var error = 0;
                    
                    if (typeof $scope.user.email === 'undefined' || $scope.user.email === '') {
                        error = error + 1;
                        $scope.emailError = 'Email field cannot be empty';
                    }
                    
                    if (typeof $scope.user.password === 'undefined' || $scope.user.password === '') {
                        error = error + 1;
                        $scope.passwordError = 'Password field cannot be empty';
                    }
                    
                    
                    if (error > 0) {
                        reject(error);
                    } else {
                        resolve(error);
                    }
                });
            };

            var attempts = 0;

            $scope.login = function (user, keepLoggedIn) {
                $scope.disabled = true;
                $scope.dangerMessage = undefined;
                $scope.validateLogin().then(function (resolve) {
                    $scope.user.email = $scope.user.email.toLowerCase();
                    console.log(resolve);
                    UserService.login($scope.user, keepLoggedIn).then(function successCallback(response) {
                        if (response != 'error') {
                            var redirectWindow = '/dashboard';
                            if ($rootScope.error && $rootScope.error.userMessage) {
                                redirectWindow = $rootScope.error.lastUrl;
                            }
                            $window.location.replace(redirectWindow);
                        } else {
                            $scope.disabled = false;
                            $scope.dangerMessage = 'Wrong email/password combination';
                            attempts = attempts + 1;
                            
                            if (attempts > 2) {
                                $scope.attemptsError = true;
                            }
                        }
                    });
                }, function (reject) {
                    console.log(reject);
                    $scope.disabled = false;
                });
            };
        });
})(angular);

