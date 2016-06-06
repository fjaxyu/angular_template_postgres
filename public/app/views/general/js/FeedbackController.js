(function (angular) {
    angular
        .module('artlineup.general').controller('FeedbackController', function ($scope, UtilityService, $q, $timeout, $location, $sessionStorage, $rootScope, UserService, GalleryService, ProductService) {


            $scope.state = 'update';
            $scope.message = {
                title: 'Loading Feedback',
                message: '',
                subMessage: ''
            };

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
            
            UtilityService.setPage('Art Lineup - Feedback', true).then(function (response) {
                $scope.user = {
                    user_name: UserService.get().name,
                    user_email: UserService.get().email
                };
                $scope.user.user_wants_response = false;
                finishLoading('dashboard');
            });


            //NEED TO DO FORM CONTROL AND ADD A LINK TO THE BOTTOM OF THE PAGE
            var authenticated = function () {
                return $q(function (resolve, reject) {
                    $scope.nameError = undefined;
                    $scope.emailError = undefined;
                    $scope.typeError = undefined;
                    $scope.messageError = undefined;

                    //        CHECK FOR EMPTY INPUTS
                    var error = 0;
                    if (typeof $scope.user.user_name === 'undefined' || $scope.user.user_name === '') {
                        $scope.nameError = 'Name field cannot be empty';
                        $scope.disabled = false;
                        error = error + 1;
                    }
                    if (typeof $scope.user.user_email === 'undefined' || $scope.user.user_email === '') {
                        $scope.emailError = 'Email field cannot be empty';
                        error = error + 1;
                    }
                    if (typeof $scope.user.type === 'undefined' || $scope.user.type === '') {
                        $scope.typeError = 'You must select a type';
                        error = error + 1;
                    }
                    if (typeof $scope.user.message === 'undefined' || $scope.user.message === '') {
                        $scope.messageError = 'Message field cannot be empty';
                        error = error + 1;
                    }

                    if (error > 0) {
                        reject(error);
                    } else {
                        resolve(error);
                    }
                });
            };


            $scope.newFeedback = function (user) {
                authenticated().then(function (response) {
                        user.message_date = $scope.date;
                        user.user_id = UserService.get().user_id;
                        user.message_date = UtilityService.getToday();
                        UserService.submitFeedback(user).then(function successCallback(response) {
                            console.log(response);
                            $scope.user = {};
                            $scope.user.user_wants_response = false;
                            $scope.state = 'completed';
                        });
                    }, function (error) {
                    
                    });
                if (authenticated() !== 'true') {
                    console.log('false');
                    $scope.disabled = false;
                }
            };


        });
})(angular);
