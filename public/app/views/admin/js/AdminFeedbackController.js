(function (angular) {
    angular
        .module('admin').controller('AdminFeedbackController', function ($scope, $location, $rootScope, AdminService, UserService) {

            $rootScope.pageTitle = 'Art Lineup - Feedback Single';
            console.log('Admin Dashboard Page Controller');

            AdminService.redirect();

            $scope.filter = {};
            $scope.filter.text = '';
            $scope.filter.fixed_date = 'without';
            $scope.filter.type = 'all';
            $scope.filter.date_read = 'all';
            $scope.filter.fixed = 'all';

            if (AdminService.isLoggedIn()) {
                $scope.admin = AdminService.getAdmin();
                AdminService.getFeedback('all').then(function (response) {
                    console.log(response);
                    $scope.feedback = response.data;
                    $scope.updateTable('message_date');
                    $scope.filterTable();
                    //                    $scope.feedback.forEach(function (v, i) {
                    //                        v.show = true;
                    //                    })
                });
            }

            $scope.adminLogout = function () {
                AdminService.logout();
            };


            $scope.edit = function (id) {
                $location.path('/admin/feedback/single/' + id);
            };

            $scope.updateTable = function (type) {
                if (type === $scope.predicate) {
                    if ($scope.reverse === 0) {
                        $scope.reverse = 1;
                    } else {
                        $scope.reverse = 0;
                    }
                } else {
                    $scope.predicate = type;
                }
            };



            $scope.filterTable = function () {
                $scope.count = 0;
                $scope.feedback.forEach(function (v, i) {

                    if ($scope.filter.text !== '') {
                        if (v.message !== null) {
                            if (v.message.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0) {
                                v.show = false;
                                return;
                            }
                        }
                        
                        if (v.admin_comment !== null) {
                            if (v.admin_comment.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0) {
                                v.show = false;
                                return;
                            }
                        }
                        
                        if (v.admin_comment === null && v.message === null) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.fixed_date !== 'all') {
                        if ($scope.filter.fixed_date === 'with') {
                            if (typeof v.fixed_date === 'undefined' || v.fixed_date === '' || v.fixed_date === null) {
                                v.show = false;
                                return;
                            }
                        } else {
                            if (typeof v.fixed_date !== 'undefined' && v.fixed_date !== '' && v.fixed_date !== null) {
                                v.show = false;
                                return;
                            }
                        }
                    }

                    if ($scope.filter.date_read !== 'all') {
                        if ($scope.filter.date_read === 'with') {
                            if (typeof v.date_read === 'undefined' || v.date_read === '' || v.date_read === null) {
                                v.show = false;
                                return;
                            }
                        } else {
                            if (typeof v.date_read !== 'undefined' && v.date_read !== '' && v.date_read !== null) {
                                v.show = false;
                                return;
                            }
                        }
                    }


                    if ($scope.filter.fixed !== 'all') {
                        if (v.priority !== $scope.filter.fixed) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.type !== 'all') {
                        if (v.type !== $scope.filter.type) {
                            v.show = false;
                            return;
                        }
                    }

                    v.show = true;

                    $scope.count = $scope.count + 1;
                });
            };
        });
})(angular);
