(function (angular) {
    'use strict';
    var myApp = angular.module('myApp', [
    'users',
    'general',
    'admin',
    'utilities',
    'UtilityDirectives',
//    'angular-google-analytics',
    'ngAnimate',
    'ui.bootstrap',
    'ngRoute',
//    'allowPattern',
//    'dynamicImage'
]);

    //GOOGLE ANALYTICS
    //    myApp.config(
    //        function ($httpProvider, AnalyticsProvider) {
    //            AnalyticsProvider.setAccount({
    //                tracker: '', //your analytics tracking number
    //                trackEvent: true
    //            });
    //            AnalyticsProvider.setDomainName(''); //domain (eg. www.google.com);
    //            AnalyticsProvider.useDisplayFeatures(true);
    //            $httpProvider.interceptors.push(function ($location) {
    //                return {
    //                    response: function (response) {
    //                        return response;
    //                    },
    //                    responseError: function (response) {
    //                        if (response.status === 401) {
    //                            $location.url('/login');
    //                        }
    //                    }
    //                };
    //            });
    //        });


    myApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
            $routeProvider.

            //====================================================================================
            //GENERAL

            //      Home Page
            when('/', {
                templateUrl: '/app/views/general/components/general-home.html',
                controller: 'HomePageController'
            }).
            
            //      Settings
            when('/settings', {
                templateUrl: '/app/views/general/components/general-settings.html',
                controller: 'SettingsController'
            }).

            //====================================================================================
            //ADMIN
            //        Admin Login Controller
            when('/admin/login', {
                templateUrl: '/app/views/admin/components/admin-login.html',
                controller: 'AdminLoginController'
            }).

            //        Admin Dashboard Controller
            when('/admin/dashboard', {
                templateUrl: '/app/views/admin/components/admin-dashboard.html',
                controller: 'AdminDashboardController'
            }).

            when('/admin/feedback', {
                templateUrl: '/app/views/admin/components/admin-feedback-dashboard.html',
                controller: 'AdminFeedbackController'
            }).

            when('/admin/feedback/single/:id', {
                templateUrl: '/app/views/admin/components/admin-feedback-single.html',
                controller: 'AdminFeedbackSingleController'
            }).

            when('/admin/logs', {
                templateUrl: '/app/views/admin/components/admin-logs-dashboard.html',
                controller: 'AdminLogsController'
            }).

            when('/admin/edit/logs/:id', {
                templateUrl: '/app/views/admin/components/admin-logs-edit.html',
                controller: 'AdminEditLogsController'
            }).

            when('/admin/new/log', {
                templateUrl: '/app/views/admin/components/admin-logs-new.html',
                controller: 'AdminNewLogsController'
            }).

            //====================================================================================
            //USERS

            //      Signup Page
            when('/signup', {
                templateUrl: '/app/views/users/components/user-signup.html',
                controller: 'loginController'
            }).

            //      Login Page
            when('/login', {
                templateUrl: '/app/views/users/components/user-login.html',
                controller: 'loginController'
            }).

            //      Dashboard Page
            when('/dashboard', {
                templateUrl: '/app/views/users/components/user-dashboard.html',
                controller: 'DashboardController'
            }).

            //====================================================================================
            //OTHER

            //      Feedback Page
            when('/feedback', {
                templateUrl: '/app/views/general/components/general-feedback.html',
                controller: 'FeedbackController'
            }).

            //    Password recovery page
            when('/recovery/:recoverString/:user_id', {
                templateUrl: '/app/views/users/components/user-password-recover.html',
                controller: 'PasswordRecoveryController'
            }).

            when('/forgot', {
                templateUrl: '/app/views/users/components/user-password-recover.html',
                controller: 'PasswordRecoveryController'
            }).

            //====================================================================================
            //REDIRECT

            otherwise('/', {
                templateUrl: '/app/views/general/components/general-home.html',
                controller: 'HomePageController'
            });


            $locationProvider.html5Mode(true);
    }]);
})(angular);
