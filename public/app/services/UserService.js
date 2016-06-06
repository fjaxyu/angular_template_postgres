(function (angular) {
    angular
        .module('artlineup.users').factory('UserService', function ($http, $q, $timeout, $sessionStorage, $localStorage, $location, $window, $rootScope) {
            var User = {};
            $rootScope.publicProfile = {};
            var user = $localStorage.user;


            //Logs the user in and sets the user-data to $localStorage and then sets the expiration date
            //Params:
            //      user - the user's login information
            //      persist - if true, this will keep the user logged in for 14 days, else they are logged in for 12 hours
                //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.login = function (user, persist) {
                return $http.post('/user/login', user).then(function successCallback(response) {
                    if (typeof response === 'undefined') {
                        return 'error';
                    } else {
                        var currentDate = Date.now();
                        $localStorage.user = response.data;

                        //                        Set the expiration for the user
                        if (persist === true) {
                            currentDate += 1000 * 60 * 60 * 24 * 14;
                            $localStorage.sessionExpiration = currentDate;
                        } else {
                            currentDate += 1000 * 60 * 60 * 12;
                            $localStorage.sessionExpiration = currentDate;
                        }

                        return response;
                    }
                });
            };


            //submits feedback from the user
            //Params:
            //      feedback - feedback object
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.submitFeedback = function (feedback) {
                return $http({
                    headers: {
                        'x-access-token': user.token
                    },
                    method: 'POST',
                    url: '/api/v1/submitFeedback',
                    data: feedback
                }).then(function successCallback(response) {
                    return response;
                });
            };


            //Checks whether the user is logged in or not
            //Params:
            //      *none*
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.isLoggedIn = function () {
                if (!$localStorage.user) {
                    return false;
                } else {
                    return true;
                }
            };


            //This checks if the input email has already been used in the database
            //Params:
            //      email - the email of the user
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.checkForUser = function (email) {
                return $http({
                    url: '/checkForUsers/' + email,
                    method: 'GET'
                }).success(function successCallback(response) {
                    return response;
                });
            };


            //If the user is not logged in, this will re-direct them.
            //Params:
            //      *none*
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.redirectUser = function () {
                return $q(function (resolve, reject) {
                    if (User.isLoggedIn()) {
                        resolve('okay');
                    } else {
                        $rootScope.error = [];
                        $rootScope.error.userMessage = 'Please log in!';
                        $rootScope.error.lastUrl = $location.path();
                        $location.url('/login');
                        reject('login');
                    }
                });
            };


            //This creates a user
            //Params:
            //      user: the object of the new user
            //Created By: Zach Wilson - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.create = function (user) {
                return $http({
                    url: '/api/user/create',
                    data: user,
                    method: 'POST'
                }).then(function (res) {
                        $localStorage.user = res.data;
                        return res.data;
                    },
                    function (err, data) {
                        return data;
                    });
            };


            //If the expiration date is not-less than the current date, it will return a user. otherwise, it will log them out and prompt them to the login screen.
            //Params:
            //      *none*
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.get = function () {
                if (Date.now() > $localStorage.sessionExpiration) {
                    User.logoutFunction();
                } else {
                    return $localStorage.user;
                }
            };

            //This updates the value of the 'login/logout' link located on the nav-bar. to be updated, a full-refresh must be made.
            //Params:
            //      *none*
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.loginLogout = function () {
                var loginLogoutLink;
                if (!User.isLoggedIn()) {
                    loginLogoutLink = 'Login';
                } else {
                    loginLogoutLink = 'Logout';
                }
                return loginLogoutLink;
            };


            //This logs the user out by removing all information in the $sessionStorage and $localStorage user files and re-directs the user to the home page.
            //Params:
            //      *none*
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.logoutFunction = function () {
                var loginLink;
                if (!User.isLoggedIn()) {
                    loginLink = '/login';
                    $location.path(loginLink);
                } else {
                    $sessionStorage.user = undefined;
                    $localStorage.user = undefined;
                    $rootScope = undefined;
                    loginLink = '/';
                }
                $window.location.replace(loginLink);
            };

        
            //This returns the stats for the dashboard
            //Params:
            //      *none*
            //Created By: Wesley Braithwaite - 05/01/2016
            //Last changed by: Wesley Braithwaite - 05/28/2016
            //      explanation of change: 
            User.getDashboard = function () {
                var user = User.get();
                return $http({
                    headers: {
                        'x-access-token': user.token
                    },
                    url: '/api/v1/getDashboard/' + user.user_id,
                    method: 'GET'
                }).then(function successCallback(response) {
                    return response;
                }, function successCallback(response) {
                    return response;
                });
            };


            //This validates that the two parameters in the recover string are valid.
            //Params:
            //      recoverString - the string with the corresponding name in the database
            //      user_id - the id of the user with the recoverString
            //Created By: Zach Wilson - 05/27/2016
            //Last changed by: Zach Wilson - 05/27/2016
            //      explanation of change: 
            User.validateRecoveryString = function (recoverString, user_id) {
                return $http({
                    url: '/password/' + recoverString + '/' + user_id,
                    method: 'GET'
                }).then(function successCallback(response) {
                    console.log(response);
                    return response.data;
                }, function errCallback(response) {
                    return response;
                });
            };

        
            //This sends an email to the user (if the user exists)
            //Params:
            //      email - valid or invalid email, it doesn't matter.
            //Created By: Zach Wilson - 05/27/2016
            //Last changed by: Zach Wilson - 05/27/2016
            //      explanation of change: 
            User.recoverPassword = function (email) {
                return $http({
                    url: '/password/' + email,
                    method: 'POST'
                }).then(function successCallback(response) {
                    return response.data;
                }, function errCallback(response) {
                    return response;
                });
            };

            //This changes the password for the user
            //Params:
            //      user - an object with the info..
            //Created By: Zach Wilson - 05/27/2016
            //Last changed by: Zach Wilson - 05/27/2016
            //      explanation of change: 
            User.updatePassword = function (user) {
                return $http({
                    url: '/passwordReset',
                    method: 'POST',
                    data: user
                }).then(function successCallback(response) {
                    return response.data;
                }, function errCallback(response) {
                    return response;
                });
            };

            return User;

        });


})(angular);
