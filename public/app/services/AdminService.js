(function (angular) {
    angular.module('admin').factory('AdminService', function ($http, $sessionStorage, $location, $window, UserService, Upload, $rootScope, $q) {
        var Admin = {};

        //Admin Login 
        //Params:
        //      admin - admin's password and username
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change: 
        Admin.adminLogin = function (admin) {
            return $http({
                url: '/admin/login',
                method: 'POST',
                data: admin
            }).then(function successCallback(response) {
                if (response.data === 'combination does not exist') {
                    return response.data;
                } else {
                    $sessionStorage.admin = response.data;
                    var redirectWindow = '/admin/dashboard';
                    $window.location.replace(redirectWindow);
                }
            });
        };

        
        //Admin Delete Log
        //Params:
        //      id - the id of the log to be deleted
        //Created By: Wesley Braithwaite - 05/30/2016
        //Last Changed by: Wesley Braithwaite - 05/30/2016
        //      explanation of change: 'Created function'
        Admin.deleteLog = function(id) {
            var user = Admin.getAdmin();
            return $http({
                headers: {
                    'x-access-token': user.token
                },
                url: '/api/v1/deleteLog/' + id,
                method: 'DELETE',
            }).then(function successCallback(response) {
                return response;
            });
        };
        
        
        //Admin Logout 
        //Params:
        //      *none*
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change: 
        Admin.logout = function () {
            $sessionStorage.admin = undefined;
            $window.location.replace('/admin/login');
        };

        
        //Checks if the admin is all logged in 
        //Params:
        //      *none*
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 07/15/2016
        //      explanation of change: added the hideNavbar
        Admin.isLoggedIn = function () {
            if (!$sessionStorage.admin) {
                $rootScope.hideNavbar = false;
                return false;
            } else {
                $rootScope.hideNavbar = true;
                return true;
            }
        };

        
        //Redirects the admin user if they are not logged in 
        //Params:
        //      *none*
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change: 
        Admin.redirect = function () {
            return $q(function (resolve, reject) {
                if (!Admin.isLoggedIn()) {
                    $location.url('/admin/login');
                } else {
                    resolve('complete');
                }
            });
        };

        
        //Get the dashboard details
        //Params:
        //      type - 'all' will return an object with each type of details for the dashboard
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change: 
        Admin.getDetails = function (type) {
            var user = Admin.getAdmin();
            return $http({
                headers: {
                    'x-access-token': user.token
                },
                url: '/api/v1/admin/getDetails/' + type,
                method: 'GET'
            }).then(function (response) {
                return response;
            });
        };

        
        //Get the feedback for all or one single row
        //Params:
        //      q - (quantity). an ID will return a single, and 'all' will return all
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change: 
        Admin.getFeedback = function (q) {
            var user = Admin.getAdmin();
            return $http({
                headers: {
                    'x-access-token': user.token
                },
                url: '/api/v1/admin/getFeedback/' + q,
                method: 'GET'
            }).then(function (response) {
                return response;
            });
        };

        
        //Update the read status of the feedback row
        //Params:
        //      feedback_id - id of the feedback row
        //      admin_id - id of the admin who is logged in
        //      date - current date
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change: 
        Admin.feedbackRead = function (feedback_id, admin_id, date) {
            var user = Admin.getAdmin();
            console.log(date, feedback_id, admin_id);
            return $http({
                headers: {
                    'x-access-token': user.token
                },
                url: '/api/v1/admin/feedbackRead',
                data: {
                    date: date,
                    admin: admin_id,
                    feedback: feedback_id
                },
                method: 'POST'
            }).then(function (response) {
                return response;
            });
        };

        
        //Update the single feedback id
        //Params:
        //      feedback - the feedback object
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change: 
        Admin.updateFeedback = function (feedback) {
            var user = Admin.getAdmin();
            return $http({
                headers: {
                    'x-access-token': user.token
                },
                url: '/api/v1/admin/updateFeedback',
                data: feedback,
                method: 'POST'
            }).then(function (response) {
                return response.data;
            });
        };

        
        //This returns the list of admin users
        //Params:
        //      *none*
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change: 
        Admin.getAdminList = function () {
            var user = Admin.getAdmin();
            return $http({
                headers: {
                    'x-access-token': user.token
                },
                url: '/api/v1/admin/getAdminList',
                method: 'GET'
            }).then(function (response) {
                return response;
            });
        };
        
        //This returns the current admin
        //Params:
        //      *none*
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change:
        Admin.getAdmin = function () {
            return $sessionStorage.admin;
        };

        
        //This updates or creates a new log
        //Params:
        //      log - the log object
        //      type - the creation method ['update', 'create'] - defaults to 'create'
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change:
        Admin.updateLog = function (log, type) {
            var user = Admin.getAdmin();
            if (type === 'update') {
                return $http({
                    headers: {
                        'x-access-token': user.token
                    },
                    url: '/api/v1/admin/update/log',
                    method: 'POST',
                    data: log
                }).then(function successCallback(response) {
                    return response;
                });
            } else {
                return $http({
                    headers: {
                        'x-access-token': user.token
                    },
                    url: '/api/v1/admin/new/log',
                    method: 'POST',
                    data: log
                }).then(function successCallback(response) {
                    return response;
                });
            }
        };
        
        
        Admin.getLogDates = function () {
            var user = Admin.getAdmin();
            return $http({
                headers: {
                    'x-access-token': user.token
                },
                url: '/api/v1/admin/getLogDates',
                method: 'GET'
            }).then(function (response) {
                return response;
            });
        };

        
        //Returns all or one log(s)
        //Params:
        //      id - If = 'all' it will return all logs, else it will return the single row.
        //Created By: Wesley Braithwaite - 05/01/2016
        //Last changed by: Wesley Braithwaite - 05/28/2016
        //      explanation of change:
        Admin.getAdminLogs = function (id) {
            var user = Admin.getAdmin();
            if (id === 'all') {
                return $http({
                    headers: {
                        'x-access-token': user.token
                    },
                    url: '/api/v1/admin/getLogs',
                    method: 'GET'
                }).then(function successCallback(response) {
                    return response;
                });
            } else {
                return $http({
                    headers: {
                        'x-access-token': user.token
                    },
                    url: '/api/v1/admin/getLog/' + id,
                    method: 'GET'
                }).then(function successCallback(response) {
                    return response;
                });
            }
        };

        return Admin;
    });
})(angular);
