(function (angular) {
    angular
        .module('artlineup.admin').controller('AdminLogsController', function ($scope, $location, $rootScope, AdminService) {

            $rootScope.pageTitle = 'Art Lineup - Admin Dashboard';
            console.log('Admin Dashboard Page Controller');

            $scope.predicate = ['date_due', 'group', 'subgroup'];
            $scope.reverse = false;
            $scope.filter = {};
            $scope.filter.fixed = false;
            $scope.filter.date_due = 'all';
            $scope.filter.device = 'all';
            $scope.filter.priority = 'all';
            $scope.filter.public = 'all';
            $scope.filter.type = 'all';
            $scope.filter.assigned = 'all';
            $scope.filter.text = '';
            $scope.filter.userText = '';
        

            AdminService.redirect();

            if (AdminService.isLoggedIn()) {
                $scope.admin = AdminService.getAdmin();
                console.log($scope.admin);
                AdminService.getAdminLogs('all').then(function successCallback(response) {
                    console.log(response);
                    $scope.logs = response.data;
                    $scope.filterTable();
                });
            }

            $scope.adminLogout = function () {
                AdminService.logout();
            };

            $scope.edit = function (id) {
                $location.path('/admin/edit/logs/' + id);
            };

            $scope.updateTable = function (item) {
                var type;
                if (typeof item === 'object') {
                    type = item[0];
                } else {
                    type = item;
                }
                
                var predicateType;
                if (typeof $scope.predicate === 'object') {
                    predicateType = $scope.predicate[0];
                } else {
                    predicateType = $scope.predicate;
                }
                
                if (type === predicateType) {
                    if ($scope.reverse === false) {
                        $scope.reverse = true;
                    } else {
                        $scope.reverse = false;
                    }
                } else {
                    $scope.predicate = item;
                }
            };

            $scope.filterTable = function (type, value) {
                $scope.count = 0;
                // $scope.filter[type] = value;
                $scope.logs.forEach(function (v, i) {

                    if ($scope.filter.text !== '') {
                        if (v.public_title.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0 && (v.log_message == null || v.log_message.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0) && v.subgroup.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0 && v.group.toLowerCase().indexOf($scope.filter.text.toLowerCase()) < 0) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.userText !== '') {
                        if (v.assigned_to == null || v.assigned_to.toLowerCase().indexOf($scope.filter.userText.toLowerCase()) < 0) {
                            v.show = false;
                            return;
                        }
                    }
                    
                    if ($scope.filter.assigned !== 'all') {
                        if ($scope.filter.assigned === false) {
                            if (v.assigned_to != null) {
                                v.show = false;
                                return;
                            }
                        } else {
                            if (v.assigned_to == null) {
                                v.show = false;
                                return;
                            }
                        }
                    }
                    
                    if ($scope.filter.fixed !== 'all') {
                        if ($scope.filter.fixed === false) {
                            if (v.fixed === true) {
                                v.show = false;
                                return;
                            }
                        } else {
                            if (v.fixed === false || v.fixed == null) {
                                v.show = false;
                                return;
                            }
                        }
                    }

                    if ($scope.filter.date_due !== 'all') {
                        if ($scope.filter.date_due === 'with') {
                            if (typeof v.date_due === 'undefined' || v.date_due === '' || v.date_due === null) {
                                v.show = false;
                                return;
                            }
                        } else {
                            if (typeof v.date_due !== 'undefined' && v.date_due !== '' && v.date_due !== null) {
                                v.show = false;
                                return;
                            }
                        }
                    }

                    if ($scope.filter.device !== 'all') {
                        if (v.device !== $scope.filter.device) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.priority !== 'all') {
                        if (v.priority !== $scope.filter.priority) {
                            v.show = false;
                            return;
                        }
                    }

                    if ($scope.filter.public !== 'all') {
                        if (v.public !== $scope.filter.public) {
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
