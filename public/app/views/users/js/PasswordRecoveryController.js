(function (angular) {
    angular
        .module('artlineup.users').controller('PasswordRecoveryController', function ($scope, $timeout, UtilityService, $q, $location, $sessionStorage, $rootScope, Upload, UserService, ProductService, $routeParams) {

            $scope.state = 'update';

            $scope.message = {
                title: 'Loading Password Recovery',
                message: '',
                subMessage: ''
            };

            $scope.user = {};

            //min loading time
            var min_time = false;

            $timeout(function () {
                min_time = true;
            }, 500);

            var finishLoading = function (state) {
                if (min_time === false) {
                    $timeout(function () {
                        $scope.state = state;
                    }, 500);
                } else {
                    $scope.state = state;
                }
            };

            var recoverString = $routeParams.recoverString;
            var user_id = $routeParams.user_id;

            UtilityService.setPage('Recover Password', false).then(function (response) {
                if (recoverString) {
                    UserService.validateRecoveryString(recoverString, user_id).then(function (data) {
                        var action = data.message ? showChangePage : redirect('Invalid URL', 'logout');
                        //                        $scope.redirectMessage = 'Invalid URL, redirecting to login screen';
                        action();
                    });
                } else {
                    $scope.state = 'password';
                }
            });

            function showChangePage() {
                $scope.state = 'valid';
            }

            function redirect(message, subMessage) {
                $scope.state = 'update';
                $scope.message = {
                    title: message,
                    message: 'You will be re-directed automatically'
                };

                if (subMessage != null) {
                    $scope.message.subMessage = subMessage;
                }
                if ($scope.message.subMessage == null) {
                    setTimeout(function () {
                        UserService.logoutFunction();
                    }, 1500);
                } else {
                    setTimeout(function () {
                        UserService.logoutFunction();
                    }, 3000);
                }
            }

            var validateEmail = function (email) {
                return $q(function (resolve, reject) {
                    $scope.emailError = undefined;

                    var error = 0;

                    console.log(email);

                    if (email == null || email === '') {
                        error = error + 1;
                        $scope.emailError = 'Email field cannot be empty';
                    } else if (email.indexOf('@') < 0 || email.indexOf('.') < 0) {
                        error = error + 1;
                        $scope.emailError = 'Invalid email';
                    }

                    console.log(error);

                    if (error > 0) {
                        reject(error);
                    } else {
                        resolve(error);
                    }
                });
            };

            $scope.sendEmail = function (email) {
                console.log('farts');
                console.log($scope.user);
                validateEmail(email).then(function (response) {
                    $scope.state = 'update';
                    $scope.message = {
                        title: 'Finding User'
                    };
                    UserService.recoverPassword(email).then(function () {
                        redirect('We\'ve sent an email to: ' + email, 'please check your email.');
                    });
                }, function (reject) {

                });
            };

            var validate = function () {
                return $q(function (resolve, reject) {
                    $scope.passwordError = undefined;
                    $scope.confirmPasswordError = undefined;

                    var error = 0;

                    if ($scope.user.password == null || $scope.user.password === '') {
                        error = error + 1;
                        $scope.passwordError = 'Password field cannot be empty';
                    }

                    if ($scope.user.confirmPassword == null || $scope.user.confirmPassword === '') {
                        error = error + 1;
                        $scope.confirmPasswordError = 'Confirm password field cannot be empty';
                    } else {
                        if ($scope.user.password !== $scope.user.confirmPassword) {
                            error = error + 1;
                            $scope.confirmPasswordError = 'The two passwords do not match';
                        }
                    }

                    if (error > 0) {
                        reject(error);
                    } else {
                        resolve(error);
                    }
                });
            };


            $scope.resetPassword = function () {
                validate().then(function (response) {
                    $scope.state = 'update';
                    $scope.message = {
                        title: 'Updating password'
                    };

                    var user = {
                        user_id: user_id,
                        password: $scope.user.password,
                        recoverystring: null
                    };

                    UserService.updatePassword(user).then(function (data) {
                        redirect('Successfully updated password! Redirecting to login');
                    });
                }, function (error) {

                });
            };

        });
})(angular);
